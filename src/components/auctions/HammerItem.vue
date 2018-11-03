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
        <button class="btn btn-block black action-button text-uppercase" :class="itemStatusClass" :disabled="paused" style="max-width: 450px" @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</button>
      </div>
    </div>
    <div v-if="admin" class="row">
      <div class="col-md-12" style="margin-top: 20px;">
        <button class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 450px" v-on:click="openSetFinalBidPriceDialog">Sell ({{currentBid}})</button>
        <set-final-bid-price v-if="setFinalBidPriceActive" :item="item" :amount="currentBid" :isModalActive="true" @closeDialog="closeDialog"/>
      </div>
      <div class="col-md-12" style="margin-top: 20px;">
        <button class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 450px" v-on:click="pauseBidding"><span v-if="paused">Unpause</span><span v-else>Pause</span> Bidding</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SetFinalBidPrice from './SetFinalBidPrice'
import peerToPeerService from '@/services/peerToPeerService'
import utils from '@/services/utils'

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
    }
  },
  methods: {
    sell (amount) {
      let serverTime = this.$store.getters['serverTime']
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      let data = {
        bid: {
          amount: amount,
          bidder: myProfile.username,
          ts: serverTime,
        },
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      }
      let signedBid = utils.signBitcoin(myProfile.publicKey, myProfile.privateKey, JSON.stringify(data.bid))
      data.bid.signedBid = signedBid
      this.$store.commit('myAuctionsStore/sellEvent', data)
    },
    openSetFinalBidPriceDialog (value) {
      this.setFinalBidPriceActive = true
    },
    pauseBidding () {
      let data = {
        username: this.$store.getters['myAccountStore/getMyProfile'].username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      }
      this.$store.commit('myAuctionsStore/pauseEvent', data)
    },
    closeDialog (value) {
      this.setFinalBidPriceActive = false
    },
    bid (amount) {
      let serverTime = this.$store.getters['serverTime']
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      let bid = {
        amount: amount,
        bidder: myProfile.username,
        ts: serverTime,
      }
      bid.signedBid = utils.signBitcoin(myProfile.publicKey, myProfile.privateKey, JSON.stringify(bid))

      let data = {
        bid: bid,
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      }
      if (this.admin) {
        this.$store.commit('myAuctionsStore/sendBidEvent', data)
      } else {
        peerToPeerService.sendPeerSignal({
          type: 'wa-adm-bid-send',
          data: data
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
    itemStatusClass () {
      let currentHighestBid = this.item.bids[this.item.bids.length - 1]
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      if (this.item.sellingStatus === 'paused') {
        return 'grey-bg'
      } else if (currentHighestBid.bidder === myProfile.username) {
        return 'btn-success white'
      } else {
        return 'yellow-bg'
      }
    },
    paused () {
      return (this.item.sellingStatus === 'paused')
    },
    inplay () {
      return (this.item.itemId)
    },
    currencySymbol () {
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      let fiatCurrency = this.item.fiatCurrency
      if (fiatRates && fiatCurrency && fiatRates[fiatCurrency]) {
        return fiatRates[fiatCurrency]['symbol']
      } else {
        return '?'
      }
    },
    nextBid () {
      if (this.item.bids && this.item.bids.length > 0) {
        let current = this.item.bids[this.item.bids.length - 1]
        return current.amount + this.item.increment
      } else {
        return this.item.increment
      }
    },
    currentBid () {
      if (this.item.bids && this.item.bids.length > 0) {
        let current = this.item.bids[this.item.bids.length - 1]
        return current.amount
      } else {
        return this.item.increment
      }
    },
    currentBidder () {
      if (this.item.bids && this.item.bids.length > 0) {
        let current = this.item.bids[this.item.bids.length - 1]
        return current.bidder
      } else {
        return ''
      }
    },
  }
}
</script>
