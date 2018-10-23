<template>
<div class="row  m-0 pdp-action-row">
  <div class="col-md-6 col-xs-12 product-price bid-price">
    <span class="price-label inline-block grey-medium">Reserve:</span>
    <span class="price inline-block">&euro; {{saleData.reserved}}</span>
  </div>
  <div class="col-md-3 col-xs-12">
    <p class="auction-label">
      <span class="grey-medium">Auction starts in 2 days, 2h, 30min</span> <br />
      <span>Minimum increment {{saleData.minBidIncrement}} Eur</span>
    </p>
  </div>
  <button class="btn btn-block yellow-bg black action-button text-uppercase" @click.prevent="bid()">bid {{currentBid}}</button>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BiddingBar',
  props: {
    saleData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentBid () {
      return this.saleData.increment + (this.saleData.currentBid) ? this.saleData.currentBid : 0
    },
  },
  methods: {
    bid () {
      this.$emit('bid', this.bidValue)
    }
  }
}
</script>
