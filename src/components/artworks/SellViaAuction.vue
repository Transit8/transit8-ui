<template>
<div>
  <uiv-modal :value="isModalActive" :append-to-body="true">
    <div slot="title"><h1 class="modal-title">Sell via Auction</h1></div>
    <div class="modal-body">
    <form @submit.prevent="setPrice">
      <p v-if="artwork.saleData.auctionId"><a class="button" v-on:click="removeFromAuction">remove from auction {{auctionTitle}}</a></p>
      <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
      <p v-if="errors.length" :key="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
        </ul>
      </p>
      <div class="form-group">
        <label for="currencyHelpBlock">Select Currency</label>
        <select class="form-control" v-model="currency">
          <option v-for="(value,key) in fiatRates" :key="key">{{ key }}</option>
        </select>
        <p id="currencyHelpBlock" class="form-text text-muted">
          {{conversionMessage}}
        </p>
      </div>
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
      </form>
    </div>
    <div slot="footer">
      <div class="modal-footer">
        <button type="button" class="btn btn-default" v-on:click="closeModal">Close</button>
        <button type="button" class="btn btn-primary" @click.prevent="addToAuction">Save</button>
      </div>
    </div>
  </uiv-modal>
</div>
</template>

<script>
import notify from '@/services/notify'
import utils from '@/services/utils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SellViaAuction',
  props: {
    isModalActive: false,
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
    }
  },
  mounted () {
    this.auctionId = this.artwork.saleData.auctionId
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },
    auctionTitle () {
      return this.$store.getters['myAuctionsStore/myAuction'](this.artwork.saleData.auctionId).title
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
    closeModal () {
      this.$emit('closeDialog')
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
      if (!saleData.auctionId) {
        this.errors.push({ERR_CODE: 304, message: 'Please select an auction for this item.'})
      }
    },
    removeFromAuction () {
      this.$store.dispatch('myArtworksStore/removeFromAuction', this.artwork).then((artwork) => {
        this.$emit('closeModal', 'Stored values')
      }).catch(e => {
        console.log(e.message)
      })
    },
    addToAuction () {
      this.artwork.saleData = utils.buildSaleDataFromUserInput(this.auctionId, this.currency, this.artwork.saleData)
      this.validate(this.artwork.saleData)
      if (this.errors.length > 0) {
        return
      }
      this.$store.dispatch('myArtworksStore/addToAuction', this.artwork).then((artwork) => {
        this.$emit('closeModal', 'Stored values')
      }).catch(e => {
        console.log(e.message)
      })
    },
    setPrice: function () {
      let artwork = this.artwork
      artwork.saleData.soid = 2
      artwork.saleData.amount = 0
      artwork.saleData.reserve = Number(artwork.saleData.reserve)
      artwork.saleData.increment = Number(artwork.saleData.increment)
      artwork.saleData.fiatCurrency = this.currency
      let fiatRate = this.$store.getters['conversionStore/getFiatRate'](this.currency)
      artwork.saleData.initialRateBtc = fiatRate['15m']
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      artwork.saleData.initialRateEth = ethToBtc
      artwork.saleData.amountInEther = this.valueInEther(artwork.saleData.amount)
      artwork.saleData.auctionId = this.auctionId

      this.validate(artwork.saleData)
      if (this.errors.length > 0) {
        return
      }

      this.message = 'Updating your user data...'
      this.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
        notify.info({title: 'Sell Via Auction', text: 'Updated item - updating auction now.'})
        this.$store.dispatch('myAuctionsStore/addItem', artwork).then((auction) => {
          notify.debug({title: 'Sell Via Auction', text: 'This artwork has been added to auction: ' + auction.title})
          this.$emit('closeModal', 'Stored values')
        }).catch(e => {
          console.log(e.message)
        })
      })
    }
  }
}
</script>
