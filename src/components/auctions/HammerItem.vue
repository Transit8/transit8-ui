<template>
<div class="col-md-12">
  <div class="media">
    <div class="media-left">
      <img :src="artwork.image" :alt="artwork.title" class="media-object" style="max-width: 350px"/>
    </div>
    <div class="media-body">
      <div class="row">
        <div class="col-md-12">
          <h4 class="media-heading">{{artwork.title}}</h4>
          {{artwork.description}}
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <button class="btn btn-block yellow-bg black action-button text-uppercase" @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</button>
        </div>
      </div>
      <div v-if="item.admin" class="row" style="margin-top: 20px;">
        <div class="col-md-12">
          Current Bid: {{currentBidder}} {{currencySymbol}} {{currentBid}} {{item.fiatCurrency}}
        </div>
      </div>
      <div v-if="item.admin" class="row" style="margin-top: 20px;">
        <div class="col-md-6">
          <button class="btn btn-block yellow-bg black action-button text-uppercase" @click.prevent="sell(currentBid)">Sell ({{currentBid}})</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import peerToPeerService from '@/services/peerToPeerService'
import utils from '@/services/utils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'HammerItem',
  components: { },
  props: {
    auctionId: null,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  methods: {
    sell (amount) {
      let serverTime = this.$store.getters['serverTime']
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']

      peerToPeerService.sendPeerSignal({
        type: 'bid',
        data: {
          bid: {
            amount: amount,
            bidder: myProfile.username,
            ts: serverTime,
          },
          username: myProfile.username,
          auctionId: this.auctionId,
          itemId: this.item.itemId
        }
      })
    },
    bid (amount) {
      let serverTime = this.$store.getters['serverTime']
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      let bid = {
        amount: amount,
        bidder: myProfile.username,
        ts: serverTime,
      }
      // type WordArray = object
      // let signedBid = utils.signHex(bid)
      let signedBid = utils.signBitcoin(myProfile.publicKey, myProfile.privateKey, JSON.stringify(bid))

      peerToPeerService.sendPeerSignal({
        type: 'bid',
        data: {
          bid: {
            amount: amount,
            bidder: myProfile.username,
            ts: serverTime,
            signedBid: signedBid
          },
          username: myProfile.username,
          auctionId: this.auctionId,
          itemId: this.item.itemId
        }
      })
    },
  },
  computed: {
    artwork () {
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
      if (artwork) {
        return artwork
      } else {
        return {
          image: '/static/images/artwork1.jpg'
        }
      }
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
