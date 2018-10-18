<template>
<div>
  <section id="pdp-slider" class="white-bg">
    <div class="container wide">
      <div class="row">
        <h1>Auction Management</h1>
        <my-single-auction :auction="auction" :future="true" :managing="true"/>
      </div>
      <div class="row">
        <h1>Selling Items</h1>
        <single-auction-item v-for="(item, index) of sellingItems" :key="index" :item="item" :sellingItem="true"/>
      </div>
      <div class="row">
        <h1>All Items</h1>
        <single-auction-item v-for="(item, index) of auctionItems" :key="index" :item="item" :sellingItem="false"/>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import MySingleAuction from '../components/auctions/MySingleAuction'
import SingleAuctionItem from '../components/auctions/SingleAuctionItem'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionManagement',
  components: { MySingleAuction, SingleAuctionItem },
  data () {
    return {
    }
  },
  created () {
    this.auctionId = Number(this.$route.params.auctionId)
  },
  computed: {
    auction () {
      return this.$store.getters['auctionsStore/myAuction'](this.auctionId)
    },
    auctionItems () {
      return this.$store.getters['myArtworksStore/unsold']
    },
    sellingItems () {
      return this.$store.getters['myArtworksStore/auctioning'](this.auctionId)
    },
  },
  methods: {
  }
}
</script>
