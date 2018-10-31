import OT from '@opentok/client'
import xhrService from '@/services/xhrService'
import utils from '@/services/utils'
import store from '@/storage/store'

const apiKey = process.env.TOK_BOX_API_KEY

/**
 *  The service is a client to the brightblock sever.
**/
const peerToPeerService = {
  handleError: function (e) {
    console.log(e)
  },
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
      type: 'session-farewell',
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
    }, peerToPeerService.handleError)
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
    signal.data = JSON.stringify(signal.data)
    if (peerToPeerService.session) {
      peerToPeerService.session.signal(signal, peerToPeerService.handleError)
    } else {
      console.log('Unable to send webrtc signal to peers: ', signal.data)
    }
  },
  peerSignal: function (event) {
    let data = JSON.parse(event.data)
    if (!data.username || data.username === 'anon') {
      return
    }
    if (event.type === 'signal:message') {
      store.commit('onlineAuctionsStore/messageEvent', data)
    } else if (event.type === 'signal:bid') {
      store.commit('onlineAuctionsStore/bidEvent', data)
    } else if (event.type === 'signal:auction') {
      store.commit('onlineAuctionsStore/onlineAuction', data.auction)
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
        store.commit('onlineAuctionsStore/newPeer', utils.buildWebrtcSessionData(event.connection.data))
        if (event.connection.connectionId !== peerToPeerService.session.connection.connectionId) {
          console.log('Another client connected. ' + connectionCount + ' total.')
        }
      },
      connectionDestroyed: function connectionDestroyedHandler (event) {
        connectionCount--
        store.commit('onlineAuctionsStore/farewellPeer', utils.buildWebrtcSessionData(event.connection.data))
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
    peerToPeerService.session.on('signal:bid', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:item', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:auction', peerToPeerService.peerSignal)
    peerToPeerService.session.on('signal:message', peerToPeerService.peerSignal)
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
