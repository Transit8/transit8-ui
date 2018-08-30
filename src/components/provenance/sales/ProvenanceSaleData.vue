<template>
<div class="modal" v-bind:class="{ 'is-active': saleDataModalActive }">
  <div class="modal-background" v-on:click="close"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title" v-if="recordForSaleData">{{ recordForSaleData.indexData.title }}</p>
      <button class="delete" v-on:click="close" aria-label="close"></button>
    </header>
    <section class="modal-card-body content">
      <div v-if="saleOptionSoid == 0">
        <h2 class="title is-4">Listing Only</h2>
        <p>This item will be listed on the site but will not be for sale.</p>
      </div>
      <div v-else-if="saleOptionSoid == 1">
        <h2 class="title is-4">Buy Now Enabled</h2>
        <p>This item can be bought for the price you specify.</p>
      </div>
      <div v-else-if="saleOptionSoid == 2">
        <h2 class="title is-4">Bidding Enabled</h2>
        <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
      </div>
      <div v-if="saleOptionSoid > 0" style="margin-top: 20px">
        <p class="modal-card-title" v-if="recordForSaleData">Select Trading Currency</p>
        <conversion-rates v-bind:currency="currency" v-on:x-update-currency="updateCurrency"></conversion-rates>
      </div>
      <form id="create-provenance" @submit="checkForm">
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
          </ul>
        </p>
        <div class="field is-horizontal" style="margin-top: 30px;">
          <div class="field is-grouped is-grouped-left">
            <div class="field-label is-normal">
              <label class="label">Sale Option</label>
            </div>
            <div class="control">
              <label class="radio">
                <input type="radio" name="saleOptionSoid" value="0" v-model="saleOptionSoid"> Listing
              </label>
            </div>
            <div class="control">
              <label class="radio">
                <input type="radio" name="saleOptionSoid" value="1" v-model="saleOptionSoid"> Buy Now
              </label>
            </div>
            <div class="control">
              <label class="radio">
                <input type="radio" name="saleOptionSoid" value="2" v-model="saleOptionSoid"> Bidding
              </label>
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
                <input class="input is-info" type="number" step="50" placeholder="Title the cost value" v-model="recordForSaleData.indexData.saleData.amount">
                <p class="help is-danger">
                  Value in Bitcoin: {{ getValueInBitcoin(recordForSaleData.indexData.saleData.amount) }}
                </p>             </div>
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
                <input class="input is-info" type="number" step="50" placeholder="Reserve price" v-model="recordForSaleData.indexData.saleData.reserve">
                <p class="help is-info">
                  This item will not sell if the bidding does not meet or exceed this amount
                </p>
                <p class="help is-danger">
                  Value in Bitcoin: {{ getValueInBitcoin(recordForSaleData.indexData.saleData.reserve) }}
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
                <input class="input is-info" type="number" step="5" placeholder="The bidding increment" v-model="recordForSaleData.indexData.saleData.increment">
                <p class="help is-info">
                  This is the amount the bidding will increase by with each bid (coming soon increment tables).
                </p>
                <p class="help is-danger">
                  Value in Bitcoin: {{ getValueInBitcoin('reserve', recordForSaleData.indexData.saleData.increment) }}
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
    </section>
  </div>
</div>
</template>

<script>
import provenanceService from '@/services/provenance/ProvenanceService'
import exchangeRatesService from '@/services/exchangeRatesService'
import ConversionRates from '@/components/rates/ConversionRates'

export default {
  name: 'ProvenanceSaleData',
  props: ['recordForSaleData', 'saleDataModalActive'],
  data () {
    return {
      errors: [],
      amount: 0,
      reserve: 0,
      increment: 0,
      currency: 'EUR',
      fiatRates: {},
      saleOptionSoid: 0,
      username: null,
      saleOptions: provenanceService.saleOptions,
    }
  },
  created () {
    this.username = provenanceService.getUserData().username
    this.saleOptionSoid = this.recordForSaleData.indexData.saleData.soid
    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
      console.log(fiatRates)
      this.$nextTick(() => this.getValueInBitcoin(2))
      this.$nextTick(() => this.currentSymbol())
    })
  },
  computed: {
  },
  methods: {
    close (event) {
      this.$emit('close-sale-data-modal', false)
    },
    updateCurrency (currency) {
      this.currency = currency
    },
    getValueInBitcoin (amount) {
      exchangeRatesService.fetchFiatRates().then((fiatRates) => {
        this.fiatRates = fiatRates
        let currentCurrency = this.fiatRates[this.currency]
        let val = currentCurrency['15m']
        if (typeof amount === 'string') {
          amount = Number(amount)
        }
        if (typeof amount === 'number') {
          val = amount / val
        }
        return Math.round(val * 100000000) / 100000000
      })
    },
    currentSymbol () {
      if (this.fiatRates && this.currency && this.fiatRates[this.currency]) {
        return this.fiatRates[this.currency]['symbol']
      }
    },
    checkForm: function (e) {
      this.errors = []
      let saleData = this.recordForSaleData.indexData.saleData
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
      } else if (this.recordForSaleData.indexData.saleData.soid === 2) {
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
      this.recordForSaleData.indexData.saleData.soid = Number(this.saleOptionSoid)
      this.checkForm()
      if (this.errors.length > 0) {
        return
      }
      let tempSaleData = this.recordForSaleData.indexData.saleData
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
      this.recordForSaleData.indexData.saleData = saleData
      provenanceService.createOrUpdateRecord(this.recordForSaleData.indexData, this.recordForSaleData.provData)
        .then((records) => {
          console.log(records)
          this.$emit('close-sale-data-modal', {id: this.recordForSaleData.id, saleData: saleData})
        })
        .catch(e => {
          console.log('ProvenanceVue: Unable to lookup ', e)
        })
    }
  },
  components: {
    ConversionRates
  }
}
</script>

<style lang="sass" src="bulma">
</style>
