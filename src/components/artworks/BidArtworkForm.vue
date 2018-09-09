<template>
  <section id="pdp-action" class="pdp-action black pb-0">
    <div class="container-fluid p-0">
      <div class="row  m-0 pdp-action-row">
        <div class="col-md-5 col-xs-12 product-price bid-price">
          <span class="price-label inline-block grey-medium">Reserved price:</span>
          <span class="price inline-block">&euro; {{artwork.reservedPrice}}</span>
        </div>
        <div class="col-md-2 col-xs-12">
          <p class="auction-label">
            <span class="grey-medium">Auction starts in 2 days, 2h, 30min</span> <br />
            <span>Minimum increment {{artwork.minBidIncrement}} Eur</span>
          </p>
        </div>
        <div class="col-md-2 col-xs-12 col-bid-input">
          <input class="form-control bid-input" type="text" placeholder="Enter bid" v-model="bidValue">
        </div>
        <div class="col-md-3 col-xs-12 p-0">
          <button class="btn btn-block yellow-bg black action-button text-uppercase" @click.prevent="bid()">bid</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BidArtworkForm',
  props: {
    artwork: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      bidValue: 0
    }
  },
  methods: {
    bid () {
      this.$emit('bid', this.bidValue)
    }
  }
}
</script>
