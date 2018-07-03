import axios from 'axios'

const GRPC_SERVER_HOST = 'localhost'
const GRPC_SERVER_PORT = '8080'
const GRPC_SERVER_PROT = 'http'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const lightningPeersService = {
  makeCall: function (node, command, args) {
    let callInfo = {
      method: 'get',
      url: GRPC_SERVER_PROT + '://' + GRPC_SERVER_HOST + ':' + GRPC_SERVER_PORT + '/lnd/' + node + '/' + command,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    for (var key in args) {
      callInfo.url += '/' + args[key]
    }
    return new Promise(resolve => {
      axios.get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          resolve(response.data)
        })
        .catch(e => {
          console.log('Unable to fulfil request' + command, e)
          resolve('Unable to fulfil request' + command)
        })
    })
  },
  node: function (nodeName) {
    var node = {name: nodeName}
    return new Promise(function (resolve) {
      lightningPeersService.makeCall(nodeName, 'getInfo')
        .then(function (info) {
          if (nodeName === 'alice') {
            node.peerAddress = 'localhost:10011'
            node.rpcAddress = 'localhost:10001'
          } else if (nodeName === 'bob') {
            node.peerAddress = 'localhost:10012'
            node.rpcAddress = 'localhost:10002'
          }
          node.pubkey = info.identityPubkey_
          node.numPendingChannels = info.numPendingChannels_
          node.numActiveChannels = info.numActiveChannels_
          node.numPeers = info.numPeers_
          lightningPeersService.makeCall(node.name, 'walletbalance')
            .then(function (balance) {
              node.balance = balance.confirmedBalance_
              node.balanceTotal = balance.totalBalance_
              lightningPeersService.makeCall(node.name, 'getNodeInfo', [node.pubkey])
                .then(function (nodeInfo) {
                  node.alias = nodeInfo.node_.alias_
                  node.addresses = nodeInfo.node_.addresses_
                  if (node.numPeers > 0) {
                    lightningPeersService.makeCall(node.name, 'listPeers')
                      .then(function (peerInfo) {
                        node.peers = peerInfo.peers_
                        resolve(node)
                      })
                  } else {
                    resolve(node)
                  }
                })
            })
        }).catch(function (e) {
          console.log('error get info for node: ' + node, e)
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  getInfo: function () {
    return lightningPeersService.makeCall('getInfo')
  },
  listPeers: function () {
    return lightningPeersService.makeCall('listPeers')
  },
  describeGraph: function (nodeName) {
    return lightningPeersService.makeCall(nodeName, 'describeGraph')
  },
  getNodeInfo: function (pubkey) {
    return lightningPeersService.makeCall('getNodeInfo', [pubkey])
  },
  openChannel: function (name, pubkey, amt) {
    return lightningPeersService.makeCall(name, 'openChannelSync', [pubkey, amt])
  },
  pendingChannels: function (name, pubkey, amt) {
    return lightningPeersService.makeCall(name, 'pendingChannels')
  },
  listChannels: function (name, pubkey, amt) {
    return lightningPeersService.makeCall(name, 'listChannels')
  },
  closedChannels: function (name, pubkey, amt) {
    return lightningPeersService.makeCall(name, 'closedChannels')
  },
  /**
   * addr Lightning address of the peer, in the format host:port
   * pubkey pub_key of the node to connect to.
  **/
  connectPeer: function (name, addr, pubkey) {
    return lightningPeersService.makeCall(name, 'connect', [addr, pubkey])
  },
  /**
   *  pubkey pub_key of the node to connect to.
  **/
  disconnectPeer: function (name, pubKey) {
    return lightningPeersService.makeCall(name, 'disconnect', [pubKey])
  },
}
export default lightningPeersService
