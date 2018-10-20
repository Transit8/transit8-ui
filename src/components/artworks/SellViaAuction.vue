<template>
  <div class="modal-dialog" role="document">
  <form @submit.prevent="setPrice">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Sell via Auction</h4>
      </div>
      <div class="modal-body">
          <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
          <p v-if="errors.length" :key="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
            </ul>
          </p>
          <div>
            <div class="form-group">
              <label>Reserve {{currentSymbol}}</label>
              <input class="form-control" type="number" step="50" placeholder="Reserve price" v-model="artwork.saleData.reserve"  aria-describedby="reserveHelpBlock">
              <p id="reserveHelpBlock" class="form-text text-muted">
                This item will not sell if the bidding does not meet or exceed this amount.<br/>
                {{valueInBitcoin(artwork.saleData.reserve)}} Btc / {{valueInEther(artwork.saleData.reserve)}} Eth
              </p>
            </div>
            <div class="form-group">
              <label>Increment {{currentSymbol}}</label>
              <input class="form-control" type="number" step="50" placeholder="Increment value" v-model="artwork.saleData.increment"  aria-describedby="incrementHelpBlock">
              <p id="incrementHelpBlock" class="form-text text-muted">
                {{valueInBitcoin(artwork.saleData.increment)}} Btc / {{valueInEther(artwork.saleData.increment)}} Eth
              </p>
            </div>
            <div class="form-group">
              Display in auction
              <select class="form-control" v-model="auctionId">
                <option v-for="(auction,key) in auctions" :key="key" :value="auction.auctionId">{{auction.title}}</option>
              </select>
            </div>
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
      auctionId: -1,
      currency: 'EUR',
      message: 'Please wait - we are updating the price of your item on the blockchain.',
      isModalActive: false,
    }
  },
  mounted () {
    this.auctionId = this.artwork.saleData.auctionId
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
      if (saleData.soid !== 2) {
        this.errors.push({ERR_CODE: 301, message: 'Selling via auction?'})
      }
      if (!saleData.reserve || saleData.reserve === 0) {
        this.errors.push({ERR_CODE: 302, message: 'Reserve required if selling by auction.'})
      }
      if (!saleData.increment || saleData.increment === 0) {
        this.errors.push({ERR_CODE: 303, message: 'Increment required if selling by auction.'})
      }
    },
    setPrice: function () {
      let artwork = this.artwork
      artwork.saleData.soid = 2
      artwork.saleData.amount = 0
      artwork.saleData.reserve = Number(artwork.saleData.reserve)
      artwork.saleData.increment = Number(artwork.saleData.increment)
      artwork.saleData.fiatCurrency = this.currency
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      artwork.saleData.initialRateBtc = fiatRates[this.currency]['15m']
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      artwork.saleData.initialRateEth = ethToBtc
      artwork.saleData.amountInEther = this.valueInEther(artwork.saleData.amount)
      artwork.saleData.auctionId = this.auctionId

      this.validate(artwork.saleData)
      if (this.errors.length > 0) {
        return
      }

      this.message = 'Updating your user data...'
      this.openModal()
      this.message = 'Calling blockchain to set the price...'
      this.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
        notify.info({title: 'Sell Via Auction', text: 'Your user storage has been updated.'})
        this.closeModal()
        this.$emit('closeViaAuction', 'Stored values')
      })
    }
  }
}
</script>
