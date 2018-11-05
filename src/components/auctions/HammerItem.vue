<template>
<div class="col-md-12">
  <h4>In Play: {{artwork.title}}</h4>
  <p>Current Bid: {{currentBidder}} {{currencySymbol}} {{currentBid}} {{item.fiatCurrency}}</p>
  <div class="media">
    <div class="media-left">
      <img :src="artwork.image" :alt="artwork.title" class="media-object" style="max-width: 450px"/>
    </div>
    <div class="row" v-if="inplay">
      <div class="col-md-12">
        <button class="btn btn-block black action-button text-uppercase" :class="bidStatusClass" :disabled="paused || item.paused || item.sellingStatus === 'selling'" style="max-width: 450px" @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</button>
      </div>
    </div>
    <div class="row" style="max-width: 450px" v-if="selling && !admin">
      <div class="col-md-12 center-block text-center" v-html="sellingMessage"></div>
    </div>
    <div v-if="admin" class="row">
      <div class="col-md-12" style="margin-top: 20px;" v-if="item.paused && item.sellingStatus !== 'selling'">
        <button class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 450px" v-on:click="openSetFinalBidPriceDialog">Sell ({{currentBid}})</button>
        <set-final-bid-price v-if="setFinalBidPriceActive" :item="item" :amount="currentBid" :auctionId="auctionId" :isModalActive="true" @closeDialog="closeDialog"/>
      </div>
      <div class="col-md-12" style="margin-top: 20px;" v-if="item.sellingStatus === 'selling'">
        <p>confirming...{{artwork.bcitem.itemIndex}}, {{artwork.bcitem.status}}, {{artwork.bcitem.price}}</p>
        <button class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 450px" v-on:click="openSetFinalBidPriceDialog">Confirm Price</button>
      </div>
      <div class="col-md-12" style="margin-top: 20px;">
        <button class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 450px" v-on:click="pauseBidding"><span v-if="item.paused">Unpause</span><span v-else>Pause</span> Bidding</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SetFinalBidPrice from './SetFinalBidPrice'
import peerToPeerService from '@/services/peerToPeerService'
import moneyUtils from '@/services/moneyUtils'
import biddingUtils from '@/services/biddingUtils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'HammerItem',
  components: { SetFinalBidPrice },
  props: {
    auctionId: null,
    admin: false,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      setFinalBidPriceActive: false,
      paused: false
    }
  },
  methods: {
    openSetFinalBidPriceDialog (value) {
      this.setFinalBidPriceActive = true
    },
    pauseBidding () {
      let data = {
        username: this.$store.getters['myAccountStore/getMyProfile'].username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      }
      this.$store.commit('myAuctionsStore/pauseItemEvent', data)
    },
    closeDialog (value) {
      this.setFinalBidPriceActive = false
    },
    bid (amount) {
      let $self = this
      setTimeout(function () {
        $self.paused = false
        // $self.$forceUpdate()
      }, 2000)
      this.paused = true
      let bidSignal = biddingUtils.bidSignal(amount, this.item.itemId, this.auctionId)
      if (this.admin) {
        this.$store.commit('myAuctionsStore/sendBidEvent', bidSignal)
      } else {
        peerToPeerService.sendPeerSignal({
          type: 'wa-bid-send-adm',
          data: bidSignal
        })
      }
    },
  },
  computed: {
    artwork () {
      if (!this.item.itemId) {
        return {
          title: 'no artwork under the hammer right now',
          image: '/static/images/artwork1.jpg'
        }
      }
      return this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
    },
    bidStatusClass () {
      return biddingUtils.bidStatusClass(this.item)
    },
    selling () {
      return (this.item.sellingStatus === 'selling')
    },
    sellingMessage () {
      return biddingUtils.sellingMessage(this.item)
    },
    inplay () {
      return (this.item.itemId)
    },
    currencySymbol () {
      return moneyUtils.currencySymbol(this.item.fiatCurrency)
    },
    nextBid () {
      return biddingUtils.nextBid(this.item)
    },
    currentBid () {
      return biddingUtils.currentBid(this.item)
    },
    currentBidder () {
      return biddingUtils.currentBidder(this.item)
    },
  }
}
</script>
