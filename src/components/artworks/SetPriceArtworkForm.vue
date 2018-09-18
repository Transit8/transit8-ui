<template>
  <section id="" class=" pb-0">
    <div class="container-fluid p-0" v-if="message">
      <div class="row">
        <p>{{ message }}</p>
      </div>
    </div>
    <div class="container-fluid p-0" v-else>
      <div class="row">
        <div class="btn-group">
          <label class="btn btn-primary">
            <input type="radio" name="saleOptionSoid" value="0" v-model="saleOptionSoid"> Listing
          </label>
          <label class="btn btn-primary">
            <input type="radio" name="saleOptionSoid" value="1" v-model="saleOptionSoid"> Buy Now
          </label>
          <label class="btn btn-primary">
            <input type="radio" name="saleOptionSoid" value="2" v-model="saleOptionSoid"> Bidding
          </label>
        </div>
      </div>

      <div class="row" style="margin-top: 30px;">
          <div v-if="saleOptionSoid == 0">
            <h2>Listing Only</h2>
            <p>This item will be listed on the site but will not be for sale.</p>
          </div>
          <div v-else-if="saleOptionSoid == 1">
            <h2>Buy Now Enabled</h2>
            <p>This item can be bought for the price you specify.</p>
          </div>
          <div v-else-if="saleOptionSoid == 2">
            <h2>Bidding Enabled</h2>
            <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
          </div>
          <div v-if="saleOptionSoid > 0" style="margin-top: 20px">
            <p class="modal-card-title">Select Trading Currency</p>
            <conversion-rates v-bind:currency="currency" v-on:x-update-currency="updateCurrency"></conversion-rates>
          </div>
          <form id="create-provenance" @submit="checkForm">
            <p v-if="errors.length" :key="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
              </ul>
            </p>

            <div class="form-group" style="margin-top: 30px;">
              <div class="field is-grouped is-grouped-left">
                <div class="field-label is-normal">
                  <label class="label">Sale Option</label>
                </div>
              </div>
            </div>
            <div v-if="saleOptionSoid == 1">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Amount: {{ currentSymbol() }}</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <input class="form-control" type="number" step="50" placeholder="Title the cost value" v-model="record.indexData.saleData.amount">
                    <p class="help is-danger">
                      {{ getValueInBitcoin(record.indexData.saleData.amount) }} Btc / {{ getValueInEther(record.indexData.saleData.amount) }} Eth
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="saleOptionSoid == 2">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Reserve ({{ currentSymbol() }})</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <input class="input is-info" type="number" step="50" placeholder="Reserve price" v-model="record.indexData.saleData.reserve">
                    <p class="help is-info">
                      This item will not sell if the bidding does not meet or exceed this amount
                    </p>
                    <p class="help is-danger">
                      {{ getValueInBitcoin(record.indexData.saleData.reserve) }} Btc / {{ getValueInEther(record.indexData.saleData.reserve) }} Eth
                    </p>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal" style="margin-top: 20px;">
                <div class="field-label is-normal">
                  <label class="label">Increment ({{ currentSymbol() }})</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <input class="input is-info" type="number" step="5" placeholder="The bidding increment" v-model="record.indexData.saleData.increment">
                    <p class="help is-info">
                      This is the amount the bidding will increase by with each bid (coming soon increment tables).
                    </p>
                    <p class="help is-danger">
                      {{ getValueInBitcoin(record.indexData.saleData.increment) }} Btc / {{ getValueInEther(record.indexData.saleData.increment) }} Eth
                  </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-grouped is-grouped-right" style="margin-top: 40px;">
              <div class="control has-text-right">
                <button class="button is-link" v-on:click="saveSaleData">Save</button>
              </div>
            </div>
          </form>
      </div>
    </div>
  </section>
</template>

<script>
import provenanceService from '@/services/provenance/provenanceService'
import ethService from '@/services/experimental/ethApiService'
import ConversionRates from '@/components/rates/ConversionRates'
import exchangeRatesService from '@/services/exchangeRatesService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SetPriceArtworkForm',
  components: {
    ConversionRates
  },
  props: {
    record: {}
  },
  data () {
    return {
      errors: [],
      message: null,
      spinner: false,
      amount: 0,
      reserve: 0,
      increment: 0,
      currency: 'EUR',
      fiatRates: {},
      ethToBtc: {},
      owners: [],
      saleOptionSoid: 0,
      username: null,
      saleOptions: provenanceService.saleOptions,
    }
  },
  mounted () {
    this.username = provenanceService.getUserData().username
    if (!this.record.indexData.saleData) {
      this.record.indexData.saleData = {
        fiatCurrency: this.currency,
        initialRateBtc: 0,
        initialRateEth: 0,
        amountInEther: 0,
        amount: 0,
        soid: 0
      }
    }
    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
    })
    exchangeRatesService.fetchCoinPair('eth_btc').then((ethToBtc) => {
      this.ethToBtc = ethToBtc
    })
  },
  methods: {
    close (event) {
      this.$emit('close-sale-data-modal', false)
    },
    updateCurrency (currency) {
      this.currency = currency
    },
    getValueInEther (amount) {
      let currentCurrency = this.fiatRates[this.currency]
      let conversion = currentCurrency['15m']
      conversion = conversion * this.ethToBtc.rate
      return this.convert(amount, conversion, 100000000)
    },
    getValueInBitcoin (amount) {
      // exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      // })
      // this.fiatRates = fiatRates
      let currentCurrency = this.fiatRates[this.currency]
      let conversion = currentCurrency['15m']
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
    currentSymbol () {
      if (this.fiatRates && this.currency && this.fiatRates[this.currency]) {
        return this.fiatRates[this.currency]['symbol']
      }
    },
    checkForm: function (e) {
      this.errors = []
      let saleData = this.record.indexData.saleData
      this.saleOptionSoid = Number(this.saleOptionSoid)
      if (!saleData || !saleData.soid) {
        this.errors.push({id: 300, message: 'Sale options required.'})
      }
      if (this.saleOptionSoid === 0) {
        saleData.amount = 0
        saleData.reserve = 0
        saleData.increment = 0
      } else if (this.saleOptionSoid === 1) {
        if (!saleData.amount || saleData.amount === 0) {
          this.errors.push({id: 301, message: 'Amount required if selling by buy now.'})
        }
      } else if (this.record.indexData.saleData.soid === 2) {
        if (!saleData.reserve || saleData.reserve === 0) {
          this.errors.push({id: 302, message: 'Reserve required if selling by auction.'})
        }
        if (!saleData.increment || saleData.increment === 0) {
          this.errors.push({id: 303, message: 'Increment required if selling by auction.'})
        }
      }
    },
    saveSaleData: function (event) {
      event.preventDefault()
      this.record.indexData.saleData.soid = Number(this.saleOptionSoid)
      this.checkForm()
      if (this.errors.length > 0) {
        return
      }
      let tempSaleData = this.record.indexData.saleData
      let saleData = {
        soid: this.saleOptionSoid,
        amount: (tempSaleData.amount) ? Number(tempSaleData.amount) : 0,
        reserve: (tempSaleData.reserve) ? Number(tempSaleData.reserve) : 0,
        increment: (tempSaleData.increment) ? Number(tempSaleData.increment) : 0,
      }
      if (saleData.soid === 0 || saleData.soid === 2) {
        saleData.amount = 0
      }
      if (saleData.soid === 0 || saleData.soid === 1) {
        saleData.reserve = 0
        saleData.increment = 0
      }
      saleData.fiatCurrency = this.currency
      saleData.initialRateBtc = this.fiatRates[this.currency]['15m']
      saleData.initialRateEth = this.ethToBtc.rate
      saleData.amountInEther = this.getValueInEther(saleData.amount)
      this.record.indexData.saleData = saleData
      this.spinner = true
      let $elfist = this
      provenanceService.createOrUpdateRecord(this.record.indexData, this.record.provData).then((records) => {
        let amountInWei = Math.trunc(saleData.amountInEther * 1000000000000000000)
        ethService.sell($elfist.record.indexData.title, $elfist.username, amountInWei).then((item) => {
          console.log(' amountInWei: ' + amountInWei + ' item: ', item)
          $elfist.spinner = false
          $elfist.message = 'new prices has been set in the blockchain'
        })
      }).catch(e => {
        console.log('ProvenanceVue: Unable to lookup ', e)
      })
    }
  }
}
</script>
