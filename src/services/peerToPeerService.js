import OT from '@opentok/client'
import xhrService from '@/services/xhrService'
import eventBus from '@/services/eventBus'
import messagingService from '@/services/messagingService'

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
  unpublish: function (username, recordId) {
    // peerToPeerService.session.unpublish(peerToPeerService.publisher)
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
      height: '100%'
    }, peerToPeerService.handleError)
  },
  streamDestroyed: function (event) {
    // called when another client starts publishing a stream
    console.log('Stream ' + event.stream.name + ' ended. ' + event.reason)
  },
  sessionDisconnected: function (event) {
    // called when another client starts publishing a stream
    console.log('sessionDisconnected ', event)
    peerToPeerService.session.off('signal:message')
    peerToPeerService.session.off('signal:bid')
    peerToPeerService.session.off('streamCreated')
    peerToPeerService.session.off('streamDestroyed') // .connect(tokbox.token)
  },
  sendBidSignal: function (signal) {
    peerToPeerService.session.signal({
      type: 'bid',
      data: signal
    }, peerToPeerService.handleError)
  },
  signalBidIn: function (event) {
    console.log(event)
    eventBus.$emit('signal-in-bid', event.data)
  },
  start: function () {
    peerToPeerService.session = OT.initSession(apiKey, peerToPeerService.tokbox.sessionId)

    // create publisher
    // peerToPeerService.publisher = OT.initPublisher('publisher', {
    //  insertMode: 'append',
    //  width: '100%',
    //  height: '200px',
    //  name: tokbox.username
    // })
    console.log(peerToPeerService.publisher)
    peerToPeerService.session.connect(peerToPeerService.tokbox.token, function (err) {
      if (err) {
        console.log(err)
      }
      eventBus.$emit('auction-connected', 'connected')
      messagingService.sendSessionJoinedSignal(peerToPeerService.tokbox)
      // let other clients subscribe to your stream
      // peerToPeerService.session.publish(peerToPeerService.publisher)
    })

    // Publisher events...
    // peerToPeerService.publisher.on('streamDestroyed', function (event) {
    //  event.preventDefault()
    //  console.log('Publisher stopped streaming.')
    // })

    // Session events...

    peerToPeerService.session.on('sessionDisconnected', peerToPeerService.sessionDisconnected)
    peerToPeerService.session.on('streamCreated', peerToPeerService.streamCreated)
    peerToPeerService.session.on('streamDestroyed', peerToPeerService.streamDestroyed) // .connect(tokbox.token)
    peerToPeerService.session.on('signal:message', messagingService.receiveMessageSignal)
    peerToPeerService.session.on('signal:session-joined', messagingService.receiveSessionJoinedSignal)
    peerToPeerService.session.on('signal:bid', peerToPeerService.signalBidIn)
  },
  startSession: function (username, recordId) {
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
