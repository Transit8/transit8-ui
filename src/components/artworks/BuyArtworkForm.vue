<template>
  <section id="pdp-action" class="pdp-action black pb-0">
    <div class="container-fluid p-0">
      <div class="row  m-0">
        <div class="col-md-9 col-xs-12 product-price">
          <span class="price inline-block">&euro; {{artwork.prices.eur}}</span>
          <span class="price-small inline-block grey-medium">&#36; {{artwork.prices.usd}} ETH {{artwork.prices.eth}} BTC {{artwork.prices.btc}}</span>
        </div>
        <div class="col-md-3 col-xs-12 p-0">
          <button class="btn btn-block yellow-bg black action-button text-uppercase" @click="buyArtwork()">buy</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BuyArtworkForm',
  props: {
    artwork: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    buyArtwork () {
      this.$emit('buy')
    }
  }
}
</script>
