<template>
<section class="white-bg black">
<div class="container wide">
  <div class="row">
    <div class="col-md-12">
      <h3>Online Auction: {{auction.title}}</h3>
      <p>{{auction.description}}</p>
      <p>Starts: {{startsIn(auction.startDate)}}</p>
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
import MySingleAuction from '../components/auctions/MySingleAuction'
import SingleAuctionItem from '../components/auctions/SingleAuctionItem'
import utils from '@/services/utils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'OnlineAuction',
  components: { MySingleAuction, SingleAuctionItem },
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
  created () {
    this.auctionId = Number(this.$route.params.auctionId)
    this.$store.dispatch('onlineAuctionsStore/fetchOnlineAuction', this.auctionId).then((auction) => {
      this.auction = auction
    })
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
  },
  computed: {
    sellingItemsSize () {
      let sellingItems = this.$store.getters['myArtworksStore/auctioning'](this.auction.auctionId)
      return sellingItems.length
    },
    updateUrl () {
      return `/my-auctions/update/${this.auction.auctionId}`
    },
    sellingItems () {
      return this.$store.getters['myArtworksStore/auctioning'](this.auctionId)
    },
  },
}
</script>
