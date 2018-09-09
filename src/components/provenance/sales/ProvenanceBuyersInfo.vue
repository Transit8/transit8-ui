<template>
<div>
  <div v-if="provenanceRecord.indexData.saleData.soid === 0">Listing</div>
  <div v-else-if="provenanceRecord.indexData.saleData.soid === 1">
  <button class="button">Price: {{ provenanceRecord.indexData.saleData.fiatCurrency }} {{ provenanceRecord.indexData.saleData.amount }} ({{ priceInEther }} Eth)</button>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" v-on:click="buyNow">Buy Now</button>
      </div>
    </div>
  </div>
  <div v-else-if="provenanceRecord.indexData.saleData.soid === 2">
    <button class="button"><a :href="'#/provenance/item/'+recordId">Place Bid: {{ saleData.reserve + saleData.increment }}</a></button>
  </div>
</div>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'
import provenanceService from '@/services/provenance/ProvenanceService'

export default {
  props: ['provenanceRecord', 'recordId'],
  data () {
    return {
      descriptionHash: 'description hash',
      username: 0,
      priceInEther: 0,
      ethItem: {},
      memo: 'memo'
    }
  },
  mounted () {
    let $elfist = this
    try {
      this.username = provenanceService.getUserData().username
      ethService.fetchItemByData(this.provenanceRecord.indexData.title, this.provenanceRecord.indexData.uploader).then((item) => {
        console.log('item: ', item)
        $elfist.ethItem = item
        let price = item[4].toString()
        $elfist.priceInEther = price / 1000000000000000000
      })
    } catch (err) {
      this.username = 'anon'
    }
  },
  methods: {
    buyNow: function () {
      let buyer = this.username
      let seller = this.provenanceRecord.indexData.uploader
      ethService.buy(this.provenanceRecord.indexData.title, seller, buyer).then((item) => {
        this.provenanceRecord.indexData.uploader = buyer
        this.provenanceRecord.indexData.gaiaUrl = null
        this.provenanceRecord.indexData.appUrl = null
        provenanceService.createOrUpdateRecord(this.provenanceRecord.indexData, this.provenanceRecord.provData).then((records) => {
          this.spinner = false
        }).catch(e => {
          console.log('ProvenanceVue: Unable to lookup ', e)
        })

        console.log(' item: ', item)
      })
    },
  },
  components: {
  }
}
</script>

<style>
</style>
