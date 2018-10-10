<template>
  <div class="row">
    <div class="grid innerpage-artworks mt-50">
      <div class="grid-sizer"></div>
      <div class="row" v-for="(auction, index) of auctions" :key="index">
        {{auction.title}}
        <div class="hr-spacer"></div>
        {{auction.description}}
      </div>
    </div>
  </div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionsList',
  components: { },
  props: {
    auctions: false,
    debugMode: false,
  },
  methods: {
  },
  computed: {
  }
}
</script>
