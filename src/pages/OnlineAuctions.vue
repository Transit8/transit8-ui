<template>
<section class="white-bg black">
<div class="container wide">
  <div class="row">
    <h4>Upcoming Auctions ({{auctionsSize}} found)</h4>
    <single-auction v-for="(auction, index) of auctions" :key="index" :auction="auction"/>
  </div>
</div>
</section>
</template>

<script>
import SingleAuction from '../components/auctions/SingleAuction'
import utils from '@/services/utils'

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
    startsIn (date) {
      return utils.dt_Offset(date)
    },
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
