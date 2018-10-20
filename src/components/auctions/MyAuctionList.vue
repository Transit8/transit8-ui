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
      <my-single-auction v-for="(auction, index) of myAuctionsPast" :key="index" :auction="auction" :future="false"/>
    </div>
  </div>
</section>
</template>

<script>
import utils from '@/services/utils'
import MySingleAuction from './MySingleAuction'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionList',
  components: { MySingleAuction },
  props: {
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
  },
  computed: {
    myAuctionsFuture () {
      return this.$store.getters['myAuctionsStore/myAuctionsFuture']
    },
    myAuctionsPast () {
      return this.$store.getters['myAuctionsStore/myAuctionsPast']
    },
    myAuctionsFutureCount () {
      return this.$store.getters['myAuctionsStore/myAuctionsFutureCount']
    },
    myAuctionsPastCount () {
      return this.$store.getters['myAuctionsStore/myAuctionsPastCount']
    },
  }
}
</script>
