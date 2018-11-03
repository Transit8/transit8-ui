import OT from '@opentok/client'
import xhrService from '@/services/xhrService'
import utils from '@/services/utils'
import store from '@/storage/store'

const apiKey = process.env.TOK_BOX_API_KEY

/**
 *  The service is a client to the brightblock sever.
**/
const peerToPeerService = {
  getSessionToken: function (username, recordId) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/token/' + username + '/' + recordId)
        .then(function (tokbox) {
          resolve(tokbox)
        })
    })
  },
  disconnect: function (username, recordId) {
    peerToPeerService.sendPeerSignal({
      type: 'session:farewell',
      data: peerToPeerService.tokbox
    })
    peerToPeerService.stopPublishing()
    if (peerToPeerService.session) {
      peerToPeerService.session.disconnect()
    }
  },
  streamCreated: function (event) {
    // called when another client starts publishing a stream
    console.log('Remote stream created:' + event.stream.id)
    peerToPeerService.session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '250px'
    }, function (e) {
      console.log(e)
    })
  },
  streamDestroyed: function (event) {
    // called when another client starts publishing a stream
    console.log('Stream ' + event.stream.name + ' ended. ' + event.reason)
  },
  sessionDisconnected: function (event) {
    // called when another client starts publishing a stream
    peerToPeerService.session.off('signal:message')
    peerToPeerService.session.off('signal:bid')
    peerToPeerService.session.off('streamCreated')
    peerToPeerService.session.off('streamDestroyed') // .connect(tokbox.token)
  },
  sendPeerSignal: function (signal) {
    if (!signal.data || !signal.data.username || signal.data.username === 'anon') {
      return
    }
    if (signal.type.indexOf('-adm-') > 1) {
      let peer = store.getters['onlineAuctionsStore/getAdministratorPeer'](signal.data.auctionId)
      if (!peer || !peer.connection) {
        throw new Error('No administrator present - please wait for the administrator to join the session.')
      }
      signal.to = peer.connection
    }
    signal.data = JSON.stringify(signal.data)
    // Note: not setting this causes the annoying 'Websocket closed or closing message'
    signal.retryAfterReconnect = true
    if (peerToPeerService.session) {
      console.log('Sending signal: ' + signal.type)
      peerToPeerService.session.signal(signal, function (error) {
        if (error) {
          console.log('signal error (' + error.name + '): ' + error.message, signal)
        } else {
          console.log('signal sent: ' + signal.type, signal.data)
        }
      })
    } else {
      console.log('Unable to send signal - no session. Signal data: ', signal.data)
    }
  },
  peerSignal: function (event) {
    let data = JSON.parse(event.data)
    console.log('Signal in: ' + event.type, data)
    if (!data.username || data.username === 'anon') {
      return
    }
    if (event.type === 'signal:wa-adm-message-send') {
      store.commit('myAuctionsStore/messageEvent', data)
    } else if (event.type === 'signal:wa-messages-update') {
      store.commit('onlineAuctionsStore/messageEvent', data)
    } else if (event.type === 'signal:wa-adm-bid-send') {
      store.commit('myAuctionsStore/sendBidEvent', data)
    } else if (event.type === 'signal:wa-auction-update') {
      store.commit('onlineAuctionsStore/onlineAuction', data.auction)
    } else if (event.type === 'signal:wa-item-update') {
      store.commit('onlineAuctionsStore/itemUpdateEvent', data)
    }
  },
  startPublishing: function () {
    if (!peerToPeerService.publisher) {
      peerToPeerService.publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '200px',
        name: peerToPeerService.tokbox.username
      })
      peerToPeerService.session.publish(peerToPeerService.publisher)
    }
  },
  stopPublishing: function () {
    if (peerToPeerService.publisher) {
      peerToPeerService.session.unpublish(peerToPeerService.publisher)
    }
    peerToPeerService.publisher = null
  },
  start: function () {
    peerToPeerService.session = OT.initSession(apiKey, peerToPeerService.tokbox.sessionId)
    let connectionCount = 0
    peerToPeerService.session.on({
      connectionCreated: function (event) {
        console.log('Event connection data: ' + event.connection.data)
        connectionCount++
        store.commit('onlineAuctionsStore/newPeer', utils.buildWebrtcSessionData(event.connection, event.connection.data))
        if (event.connection.connectionId !== peerToPeerService.session.connection.connectionId) {
          console.log('Another client connected. ' + connectionCount + ' total.')
        }
      },
      connectionDestroyed: function connectionDestroyedHandler (event) {
        connectionCount--
        store.commit('onlineAuctionsStore/farewellPeer', utils.buildWebrtcSessionData(event.connection.connectionId, event.connection.data))
        console.log('A client disconnected. ' + connectionCount + ' total.')
      }
    })
    peerToPeerService.session.connect(peerToPeerService.tokbox.token, function (err) {
      if (err) {
        console.log(err)
      }
    })

    // Session events...

    peerToPeerService.session.on('sessionDisconnected', peerToPeerService.sessionDisconnected)
    peerToPeerService.session.on('streamCreated', peerToPeerService.streamCreated)
    peerToPeerService.session.on('streamDestroyed', peerToPeerService.streamDestroyed) // .connect(tokbox.token)
    peerToPeerService.session.on('signal:wa-adm-bid-send', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:wa-adm-message-send', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:wa-item-update', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:wa-auction-update', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:wa-messages-update', peerToPeerService.peerSignal)
  },
  startSession: function (username, recordId) {
    if (!username || username === 'anon') {
      return
    }
    if (peerToPeerService.session && peerToPeerService.session.isConnected()) {
      console.log('Connected to session: ' + peerToPeerService.session.connection.connectionId)
      return
    }
    if (!username || !recordId) {
      throw new Error('Username and auction id are both required to start a session.')
    }
    peerToPeerService.getSessionToken(username, recordId).then((tokbox) => {
      peerToPeerService.tokbox = tokbox
      peerToPeerService.tokbox.username = username
      peerToPeerService.tokbox.recordId = recordId
      peerToPeerService.start()
    })
  },
}
export default peerToPeerService
