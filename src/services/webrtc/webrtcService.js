import OT from '@opentok/client'
import xhrService from '@/services/xhrService'
import eventBus from '@/services/eventBus'
import messagingService from '@/services/webrtc/messagingService'

const apiKey = process.env.TOK_BOX_API_KEY

/**
 *  The service is a client to the brightblock sever.
**/
const webrtcService = {
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
    // webrtcService.session.unpublish(webrtcService.publisher)
    webrtcService.session.disconnect()
  },
  streamCreated: function (event) {
    // called when another client starts publishing a stream
    console.log('Remote stream created:' + event.stream.id)
    webrtcService.session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, webrtcService.handleError)
  },
  streamDestroyed: function (event) {
    // called when another client starts publishing a stream
    console.log('Stream ' + event.stream.name + ' ended. ' + event.reason)
  },
  sessionDisconnected: function (event) {
    // called when another client starts publishing a stream
    console.log('sessionDisconnected ')
    webrtcService.session.off('signal:message')
    webrtcService.session.off('signal:bid')
    webrtcService.session.off('streamCreated')
    webrtcService.session.off('streamDestroyed') // .connect(tokbox.token)
  },
  sendBidSignal: function (signal) {
    webrtcService.session.signal({
      type: 'bid',
      data: signal
    }, webrtcService.handleError)
  },
  signalBidIn: function (event) {
    console.log(event)
    eventBus.$emit('signal-in-bid', event.data)
  },
  start: function () {
    webrtcService.session = OT.initSession(apiKey, webrtcService.tokbox.sessionId)

    // create publisher
    // webrtcService.publisher = OT.initPublisher('publisher', {
    //  insertMode: 'append',
    //  width: '100%',
    //  height: '200px',
    //  name: tokbox.username
    // })
    console.log(webrtcService.publisher)
    webrtcService.session.connect(webrtcService.tokbox.token, function (err) {
      if (err) {
        console.log(err)
      }
      eventBus.$emit('auction-connected', 'connected')
      messagingService.sendSessionJoinedSignal(webrtcService.tokbox)
      // let other clients subscribe to your stream
      // webrtcService.session.publish(webrtcService.publisher)
    })

    // Publisher events...
    // webrtcService.publisher.on('streamDestroyed', function (event) {
    //  event.preventDefault()
    //  console.log('Publisher stopped streaming.')
    // })

    // Session events...

    webrtcService.session.on('sessionDisconnected', webrtcService.sessionDisconnected)
    webrtcService.session.on('streamCreated', webrtcService.streamCreated)
    webrtcService.session.on('streamDestroyed', webrtcService.streamDestroyed) // .connect(tokbox.token)
    webrtcService.session.on('signal:message', messagingService.receiveMessageSignal)
    webrtcService.session.on('signal:session-joined', messagingService.receiveSessionJoinedSignal)
    webrtcService.session.on('signal:bid', webrtcService.signalBidIn)
  },
  startSession: function (username, recordId) {
    if (webrtcService.session && webrtcService.session.isConnected()) {
      console.log('Connected to session: ' + webrtcService.session.connection.connectionId)
      return
    }
    webrtcService.getSessionToken(username, recordId)
      .then((tokbox) => {
        webrtcService.tokbox = tokbox
        webrtcService.tokbox.username = username
        webrtcService.tokbox.recordId = recordId
        webrtcService.start()
      })
  },
}
export default webrtcService
