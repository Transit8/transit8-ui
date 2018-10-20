<template>
  <div class="modal-dialog" role="document">
  <form @submit.prevent="setPrice">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Sell Via Buy Now</h4>
      </div>
      <div class="modal-body">
        <p>This item can be bought for the price you specify.</p>
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
          </ul>
        </p>
        <div class="form-group">
          <label>Amount {{currentSymbol}}</label>
          <input class="form-control" type="number" step="50" placeholder="Sale value of artwork" v-model="artwork.saleData.amount"  aria-describedby="amountHelpBlock">
          <p id="amountHelpBlock" class="form-text text-muted">
            {{valueInBitcoin(artwork.saleData.amount)}} Btc / {{valueInEther(artwork.saleData.amount)}} Eth
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click.prevent="setPrice">Save</button>
      </div>
    </div><!-- /.modal-content -->
    </form>
  </div><!-- /.modal-dialog -->
</template>

<script>
import notify from '@/services/notify'
import ethereumService from '@/services/ethereumService'
import _ from 'lodash'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SellViaAuction',
  props: {
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      errors: [],
      auctionId: null,
      currency: 'EUR',
      message: 'Please wait - we are updating the price of your item on the blockchain.',
      isModalActive: false,
    }
  },
  mounted () {
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },
    auctions () {
      return this.$store.getters['myAuctionsStore/myAuctionsFuture']
    },
    conversionMessage () {
      let fiatRate = this.$store.getters['conversionStore/getFiatRate'](this.currency)
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      let fiatToBtc = fiatRate['15m']
      let symbol = fiatRate['symbol']
      fiatToBtc = Math.round(fiatRate['15m'] * 100) / 100
      let fiatToEther = fiatRate['15m'] * ethToBtc
      let conversionMessage = '1 Bitcoin = ' + fiatToBtc + ' ' + symbol + ' / 1 Ether = ' + fiatToEther + ' ' + symbol
      return conversionMessage
    },
    currentSymbol () {
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      if (fiatRates && this.currency && fiatRates[this.currency]) {
        return fiatRates[this.currency]['symbol']
      }
    },
  },
  methods: {
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
    valueInBitcoin (amount) {
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      let currentCurrency = fiatRates[this.currency]
      let conversion = currentCurrency['15m']
      return this.convert(amount, conversion, 100000000)
    },
    valueInEther (amount) {
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      let currentCurrency = fiatRates[this.currency]
      let conversion = currentCurrency['15m']
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      conversion = conversion * ethToBtc
      return this.convert(amount, conversion, 100000000)
    },
    convert (amount, conversion, precision) {
      if (typeof amount === 'string') {
        amount = Number(amount)
      }
      if (typeof amount === 'number') {
        conversion = amount / conversion
      }
      return Math.round(conversion * precision) / precision
    },
    validate: function (saleData) {
      this.errors = []
      if (!saleData.amount || saleData.amount === 0) {
        this.errors.push({ERR_CODE: 301, message: 'Amount required if selling by buy now.'})
      }
      if (saleData.soid !== 1) {
        this.errors.push({ERR_CODE: 301, message: 'Selling via buy now?'})
      }
    },
    setPrice: function () {
      let artwork = this.artwork
      artwork.saleData.soid = 1
      artwork.saleData.amount = Number(artwork.saleData.amount)
      artwork.saleData.reserve = 0
      artwork.saleData.increment = 0
      artwork.saleData.fiatCurrency = this.currency
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      artwork.saleData.initialRateBtc = fiatRates[this.currency]['15m']
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      artwork.saleData.initialRateEth = ethToBtc
      artwork.saleData.amountInEther = this.valueInEther(artwork.saleData.amount)
      artwork.saleData.auctionId = null

      this.validate(artwork.saleData)
      if (this.errors.length > 0) {
        return
      }

      this.message = 'Calling blockchain to set the price...'
      let priceData = {
        itemIndex: artwork.bcitem.itemIndex,
        amountInWei: Math.trunc(artwork.saleData.amountInEther * 1000000000000000000)
      }
      let $self = this
      ethereumService.setPriceOnChain(priceData, function (result) {
        $self.closeModal()
        artwork.bcitem.setPriceTxId = result.txId
        artwork.bcitem.status = 'price-set'
        $self.$store.commit('myArtworksStore/addMyArtwork', artwork)
        $self.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
          notify.info({title: 'Register Artwork.', text: 'Your user storage has been updated.'})
        })
        $self.$store.dispatch('ethStore/fetchBlockchainItem', {timestamp: artwork.timestamp}).then((blockchainItem) => {
          if (blockchainItem) {
            _.merge(artwork.bcitem, blockchainItem)
            notify.info({title: 'Register Artwork.', text: 'Registration sent to blockchain.'})
          }
        })
        $self.message = 'Your artwork has been registered - please allow a few minutes for the transaction to complete...'
        notify.info({title: 'Register Artwork.', text: 'Your artwork has been registered - please allow a few minutes for the transaction to complete...'})
      }, function (error) {
        notify.error({title: 'Register Artwork.', text: 'Error setting price for your item. <br>' + error.message})
      })
    }
  }
}
</script>
