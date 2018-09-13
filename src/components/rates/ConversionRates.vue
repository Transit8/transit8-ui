<template>
<div>
  <p>Select Trading Currency</p>
  <div class="field has-addons">
    <p class="control">
      <span class="select">
        <select v-model="currency">
          <option v-for="(value,key) in fiatRates" :key="key">{{ key }}</option>
        </select>
      </span>
    </p>
    <p class="control is-expanded">
      <input readonly class="input" type="text" :value="conversionMessage">
    </p>
  </div>
</div>
</template>

<script>
import exchangeRatesService from '@/services/exchangeRatesService'

export default {
  name: 'ConversionRates',
  data () {
    return {
      currency: 'EUR',
      conversionMessage: '',
      fiatRates: {},
    }
  },
  watch: {
    currency: function () {
      this.currentRateValue()
      this.$emit('x-update-currency', this.currency)
    }
  },
  mounted () {
    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
    })
    this.conversionMessage = this.currentRateValue()
  },
  computed: {
  },
  methods: {
    currentRateValue () {
      // return '1 Bitcoin = ' + exchangeRatesService.getFiatToBtc(this.currency) + ' ' + exchangeRatesService.getSymbol(this.currency)
      let c = this.currency
      exchangeRatesService.getFiatToBtc(c).then((fiatToBtc) => {
        exchangeRatesService.getSymbol(c).then((symbol) => {
          exchangeRatesService.getFiatToEther(c).then((fiatToEther) => {
            this.conversionMessage = '1 Bitcoin = ' + fiatToBtc + ' ' + symbol + ' / 1 Ether = ' + fiatToEther + ' ' + symbol
          })
        })
      })
    },
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
