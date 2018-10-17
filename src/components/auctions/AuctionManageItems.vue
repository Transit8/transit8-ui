<template>
<section>
  <div class="row">
    <div class="col-md-12">
      <h1>Upcoming Auctions <span>({{myAuctionsFutureCount}})</span></h1>
      <my-single-auction v-for="(auction, index) of myAuctionsFuture" :key="index" :auction="auction" :future="true"/>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <h1>Past Auctions <span>({{myAuctionsPastCount}})</span></h1>
      <div class="row" v-for="(auction, index) of myAuctionsPast" :key="index">
        <p>{{auction.title}} (Starts {{auction.startDate}})</p>
        <p>{{auction.description}}</p>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import utils from '@/services/utils'
import MySingleAuction from './MySingleAuction'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionManageItems',
  components: { AuctionManageItem },
  props: {
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
  },
  computed: {
    myAuctionsFuture () {
      return this.$store.getters['auctionsStore/myAuctionsFuture']
    },
    myAuctionsPast () {
      return this.$store.getters['auctionsStore/myAuctionsPast']
    },
    myAuctionsFutureCount () {
      return this.$store.getters['auctionsStore/myAuctionsFutureCount']
    },
    myAuctionsPastCount () {
      return this.$store.getters['auctionsStore/myAuctionsPastCount']
    },
    debugMode () {
      let debugMode = this.$store.getters['isDebugMode']
      return debugMode
    }
  }
}
</script>
