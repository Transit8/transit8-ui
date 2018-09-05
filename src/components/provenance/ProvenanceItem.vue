<template>
<section>
  <p class="subtitle is-4">{{ provenanceRecord.indexData.title }}</p>
  <article class="media">
    <figure class="media-left">
      <p class="image is-128x128" v-if="provenanceRecord.provData && provenanceRecord.provData.artwork && provenanceRecord.provData.artwork.length > 0">
        <img :src="provenanceRecord.provData.artwork[0].dataUrl" alt="Artwork image"/>
      </p>
      <p class="image is-128x128" v-else>
        <img src="/static/tree.jpg" alt="Missing image"/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>{{ provenanceRecord.indexData.description }}</p>
        <p>Uploaded by: <b>{{ provenanceRecord.indexData.uploader }}</b> on {{ niceTime(provenanceRecord.indexData.id) }} {{ parseAppUrl(provenanceRecord.indexData.appUrl) }}</p>
      </div>
    </div>
  </article>
  <div class="columns">
    <div class="column">
      <div class="media-right" v-if="provenanceRecord.indexData.saleData">
        <provenance-sellers-info v-if="owner" v-bind:saleData="provenanceRecord.indexData.saleData" v-bind:recordId="provenanceRecord.indexData.id"/>
        <provenance-buyers-info v-else v-bind:saleData="provenanceRecord.indexData.saleData" v-bind:recordId="provenanceRecord.indexData.id"/>
      </div>
    </div>
    <div class="column">
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
      <div class="columns">
        <div id="publisher" class="column"></div>
        <div id="subscriber" class="column"></div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import webrtcService from '@/services/webrtc/WebrtcService'
import provenanceService from '@/services/provenance/ProvenanceService'
import ProvenanceBuyersInfo from '@/components/provenance/sales/ProvenanceBuyersInfo'
import ProvenanceSellersInfo from '@/components/provenance/sales/ProvenanceSellersInfo'
import moment from 'moment'
import cacheService from '@/services/cacheService'
import messagingService from '@/services/webrtc/messagingService'
import eventBus from '@/services/eventBus'

export default {
  data () {
    return {
      tokbox: {},
      userMessages: messagingService.messages,
      messageSignal: {time: 'then', message: 'happy?'},
      username: 'anon',
      loggedIn: false,
      webrtcState: 0,
      owner: false,
      provenanceRecord: {
        indexData: {},
        provData: {}
      },
      provenanceId: (this.$route && this.$route.params.provenanceId) ? parseInt(this.$route.params.provenanceId) : undefined,
    }
  },
  created () {
    window.addEventListener('beforeunload', this.stopPublishing)
  },
  beforeDestroy () {
    webrtcService.unpublish()
    eventBus.$off('signal-in-message')
  },
  mounted () {
    let userData = provenanceService.getUserData()
    if (userData && userData.username) {
      this.loggedIn = true
      this.username = userData.username
    }
    // let useCache = false
    // if (useCahce) {
    this.provenanceRecord = cacheService.getFromCache(this.provenanceId)
    // }
    // if usecache false or the item missing from cache
    if (!this.provenanceRecord || !this.provenanceRecord.indexData.id) {
      this.provenanceRecord = provenanceService.getProvenanceRecord(this.provenanceId)
    }
    this.owner = this.provenanceRecord.indexData.uploader === this.username
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
    webrtcService.startSession(this.username, this.provenanceId)
  },
  methods: {
    placeBid: function () {
      webrtcService.sendBidSignal(this.recordId, this.saleData.amount + this.saleData.increment)
    },
    sendMessageSignal (event) {
      event.preventDefault()
      var now = moment({}).valueOf()
      this.messageSignal.when = now
      this.messageSignal.who = this.username
      this.messageSignal.recordId = this.provenanceId
      messagingService.sendMessageSignal(this.messageSignal)
    },
    parseAppUrl (appUrl) {
      return provenanceService.parseAppUrl(appUrl)
    },
    openSaleDataModal () {
      this.$emit('open-sale-data-modal', this.provenanceRecord.indexData.id)
      // this.mySaleDataModalActive = !mySaleDataModalActive
    },
    closeSaleDataModal: function (argument) {
      this.saleDataModalActive = false
    },
    niceTime: function (updated) {
      // this.$notify({
      //  group: 'foo',
      //  title: 'Important message',
      //  text: 'Hello user! This is a notification!'
      // })
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
  },
  components: {
    ProvenanceBuyersInfo,
    ProvenanceSellersInfo,
  }
}
</script>

<style>
article {
  background: #ccc;
  border: 1pt solid black;
  border-radius: 15px;
  margin: 15px;
  padding: 10px;
}
</style>
