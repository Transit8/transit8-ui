<template>
  <section id="pdp-action" class="pdp-action black pb-0">
    <div class="container-fluid p-0">
      <div class="row  m-0">
        <div class="col-md-9 col-xs-12">
          <div id="messages" v-for="userMessage in userMessages" :key="userMessage.username">
            <p>{{ userMessage.who }} : {{ niceTime(userMessage.when) }}</p>
            <p>{{ userMessage.message }}</p>
          </div>
          <div class="field" v-if="webrtcState === 1">
            <label class="label">Comment:</label>
            <div class="control">
              <textarea class="textarea" placeholder="send a message" v-model="messageSignal.message"></textarea>
            </div>
          </div>
          <div class="field is-grouped" v-if="webrtcState === 1">
            <div class="control">
              <button class="button is-link" v-on:click="sendMessageSignal">Send</button>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-xs-12 p-0">
          <button class="btn btn-block black action-button text-uppercase" v-bind:class="{ 'yellow-bg': artwork.canBuy, 'grey-bg': !artwork.canBuy }"  @click="buyArtwork()">buy</button>
        </div>
      </div>
      <div class="row  m-0">
        <div id="publisher" class="column"></div>
        <div id="subscriber" class="column"></div>
      </div>
    </div>
  </section>
</template>

<script>
import peerToPeerService from '@/services/webrtc/peerToPeerService'
import messagingService from '@/services/webrtc/messagingService'
import eventBus from '@/services/eventBus'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BuyArtworkForm',
  props: {
    canBuy: false,
    artwork: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      userMessages: messagingService.messages,
      messageSignal: {time: 'then', message: 'happy?'},
    }
  },
  beforeDestroy () {
    peerToPeerService.unpublish()
    eventBus.$off('signal-in-message')
  },
  created () {
    window.addEventListener('beforeunload', this.stopPublishing)
    let userData = provenanceService.getUserData()
    if (userData && userData.username) {
      this.loggedIn = true
      this.username = userData.username
    }
    let $elfie = this
    // eventBus.$on('signal-in-message', function (payLoad) {
    //  $elfie.userMessages.push(payLoad)
    // })
    eventBus.$on('signal-in-bid', function (payLoad) {
      $elfie.userMessages.push(payLoad)
    })
    eventBus.$on('auction-connected', function (payLoad) {
      $elfie.webrtcState = 1
    })
    eventBus.$on('item-edit', function (payLoad) {
      window.location.reload()
    })
    peerToPeerService.startSession(this.username, this.provenanceId)
  },
  methods: {
    sendMessageSignal (event) {
      event.preventDefault()
      var now = moment({}).valueOf()
      this.messageSignal.when = now
      this.messageSignal.who = this.username
      this.messageSignal.recordId = this.provenanceId
      messagingService.sendMessageSignal(this.messageSignal)
    },
  }
}
</script>
