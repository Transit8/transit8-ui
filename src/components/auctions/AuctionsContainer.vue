<template>
  <div class="section">
    <h1 class="innerpage">Current Auctions <span>Auctions upcoming: {{numberAuctionsCurrent}}</span></h1>
    <auctions-list :auctions="current" :show-load-button="false" :chunks="6" :debugMode="debugMode"/>
  </div>
</template>

<script>
import AuctionsList from './AuctionsList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionsContainer',
  components: { AuctionsList },
  props: {
  },
  methods: {
  },
  computed: {
    current () {
      return this.$store.getters['auctionsStore/current']
    },
    past () {
      return this.$store.getters['auctionsStore/past']
    },
    numberAuctionsCurrent () {
      return this.$store.getters['auctionsStore/numberAuctionsCurrent']
    },
    numberAuctionsPast () {
      return this.$store.getters['auctionsStore/numberAuctionsPast']
    },
    debugMode () {
      let debugMode = this.$store.getters['isDebugMode']
      return debugMode
    }
  }
}
</script>
