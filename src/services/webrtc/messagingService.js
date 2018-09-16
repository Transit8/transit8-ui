// import eventBus from '@/services/eventBus'
import webrtcService from '@/services/webrtc/webrtcService'
import _ from 'lodash'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const messagingService = {
  messages: [],
  peers: [],
  sendMessageSignal: function (signal) {
    webrtcService.session.signal({
      type: 'message',
      data: signal
    }, webrtcService.handleError)
  },
  sendSessionJoinedSignal: function (tokbox) {
    webrtcService.session.signal({
      type: 'session-joined',
      data: JSON.stringify(webrtcService.tokbox)
    }, webrtcService.handleError)
  },
  receiveMessageSignal: function (event) {
    console.log(event)
    messagingService.messages.push(event.data)
    // eventBus.$emit('signal-in-message', event.data)
  },
  receiveSessionJoinedSignal: function (event) {
    console.log(event)
    let data = JSON.parse(event.data)
    let index = _.findIndex(messagingService.peers, {username: data.username})
    if (index === -1) {
      messagingService.peers.push(JSON.parse(event.data))
    }
  },
}
export default messagingService
