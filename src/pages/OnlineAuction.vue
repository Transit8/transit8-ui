<template>
<section class="white-bg black">
<div class="container wide">
  <div class="row">
    <div class="col-md-12">
      <h3>Online Auction: {{auction.title}}</h3>
      <p>{{auction.description}}</p>
      <p>Countdown: {{countdown}}</p>
      <p>{{sellingItemsSize}} items</p>
    </div>
  </div>
  <div class="row">
    <h4>Selling Items</h4>
    <single-auction-item v-for="(item, index) of sellingItems" :key="index" :item="item" :sellingItem="true"/>
  </div>
</div>
</section>
</template>

<script>
import SingleAuctionItem from '../components/auctions/SingleAuctionItem'
import utils from '@/services/utils'
import peerToPeerService from '@/services/peerToPeerService'
import eventBus from '@/services/eventBus'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'OnlineAuction',
  components: { SingleAuctionItem },
  data () {
    return {
      auction: {
        type: Object,
        default () {
          return {}
        }
      },
    }
  },
  beforeDestroy () {
    peerToPeerService.unpublish()
    eventBus.$off('signal-in-message')
  },
  created () {
    window.addEventListener('beforeunload', this.stopPublishing)
    this.auctionId = Number(this.$route.params.auctionId)
    let myProfile = this.$store.getters['myAccountStore/getMyProfile']
    this.$store.dispatch('onlineAuctionsStore/fetchOnlineAuction', this.auctionId).then((auction) => {
      this.auction = auction
      try {
        peerToPeerService.startSession(myProfile.username, auction.auctionId)
      } catch (e) {
        console.log(e)
      }
    })
  },
  methods: {
  },
  computed: {
    sellingItemsSize () {
      let sellingItems = this.$store.getters['myArtworksStore/auctioning'](this.auction.auctionId)
      return sellingItems.length
    },
    countdown () {
      let serverTime = this.$store.getters['serverTime']
      return utils.dt_Offset(serverTime, this.auction.startDate)
    },
    sellingItems () {
      return this.$store.getters['myArtworksStore/auctioning'](this.auctionId)
    },
  },
}
</script>
