<template>
<div>
  <p v-if="saleData.soid === 0">Listing</p>
  <p v-else-if="saleData.soid === 1">
    <button class="button"><a :href="'#/provenance/item/'+recordId" @click="buyNow">Buy Now: {{ saleData.amount }}</a></button>
  </p>
  <p v-else-if="saleData.soid === 2">
    <button class="button"><a :href="'#/provenance/item/'+recordId">Place Bid: {{ saleData.reserve + saleData.increment }}</a></button>
  </p>
</div>
</template>

<script>
import moment from 'moment'
import exchangeRatesService from '@/services/exchangeRatesService'

export default {
  props: ['saleData', 'recordId'],
  data () {
    return {
      descriptionHash: 'description hash',
      memo: 'memo'
    }
  },
  mounted () {
  },
  methods: {
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
    buyNow: function () {
      let invoiceData = {
        amount: this.saleData.amount,
        memo: this.memo,
        descriptionHash: this.descriptionHash
      }
      exchangeRatesService.generateInvoice(invoiceData).then(function (message) {
        console.log('Indexed new record.')
      }).catch(function (e) {
        console.log('Unable to index new record - it should be picked up in next sweep. ', e)
      })
    },
  },
  components: {
  }
}
</script>

<style>
</style>
