<template>
<section class="white-bg black pt-120 pb-120">
  <div class="container wide">
    <div class="row">

      <h1 class="innerpage">Upcoming Auctions ({{auctionsSize}})</h1>
      <single-auction class="row" v-for="(auction, index) of auctions" :key="index" :auction="auction"/>

    </div>
  </div>
</section>
</template>

<script>
import SingleAuction from '../components/auctions/SingleAuction'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'OnlineAuctions',
  components: { SingleAuction },
  data () {
    return {
    }
  },
  created () {
    this.$store.dispatch('onlineAuctionsStore/fetchOnlineAuctions').then((auctions) => {
      // loading online auctions
    })
  },
  methods: {
  },
  computed: {
    auctionsSize () {
      return this.$store.getters['onlineAuctionsStore/onlineAuctions'].length
    },
    auctions () {
      return this.$store.getters['onlineAuctionsStore/onlineAuctions']
    },
  },
}
</script>
