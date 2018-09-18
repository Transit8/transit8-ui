<template>
  <section id="pdp-action" class="pdp-action black pb-0">
    <div class="container-fluid p-0">
      <div class="row  m-0">
        <div class="col-md-9 col-xs-12 product-price">
          <span class="price inline-block">&euro; {{artwork.saleData.amount}} {{ artwork.saleData.fiatCurrency }}</span>
          <span class="price-small inline-block grey-medium">ETH {{ artwork.saleData.amountInEther }}</span>
        </div>
        <button class="btn btn-block black action-button text-uppercase" :disabled="!purchaseState.canBuy" v-bind:class="{ 'yellow-bg': purchaseState.canBuy, 'grey-bg': !purchaseState.canBuy }"  @click="buyArtwork()">buy</button>
      </div>
    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BuyArtworkForm',
  props: {
    purchaseState: {},
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
