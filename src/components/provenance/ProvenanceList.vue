<template>
<div class="column">
  <provenance-sale-data v-if="saleDataModalActive" v-on:close-sale-data-modal="closeSaleDataModal" v-bind:ethToBtc="ethToBtc" v-bind:fiatRates="fiatRates" v-bind:recordForSaleData="recordForSaleData" v-bind:saleDataModalActive="saleDataModalActive"/>
  <h1 class="title is-1">My Artworks</h1>
  <div class="notification">
    Found: {{ numbResults }}
    <p class="has-text-right"><a @click="reindexRoot()">reindex</a></p>
  </div>
  <div v-for="provenanceRecord in provenanceRecords" :key="provenanceRecord.indexData.id">
    <provenance-item-bar v-on:open-sale-data-modal="openSaleDataModal" v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData"/>
  </div>
</div>
</template>

<script>
import searchIndexService from '@/services/searchindex/SearchIndexService'
import provenanceService from '@/services/provenance/ProvenanceService'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import ProvenanceItemBar from '@/components/provenance/ProvenanceItemBar'
import ProvenanceSaleData from '@/components/provenance/sales/ProvenanceSaleData'
import moment from 'moment'
import exchangeRatesService from '@/services/exchangeRatesService'

export default {
  data () {
    return {
      recordForSaleData: null,
      saleDataModalActive: false,
      numbResults: 0,
      userData: {},
      fiatRates: {},
      ethToBtc: {},
      provenanceRecords: []
    }
  },
  mounted () {
    console.log('Running App version ', process.env)
    let $elfist = this
    provenanceService.getProvenanceRecordsInLS().then((provenanceRecords) => {
      $elfist.provenanceRecords = provenanceRecords
      $elfist.numbResults = $elfist.provenanceRecords.length
    })

    this.userData = provenanceService.getUserData()
    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
    })
    exchangeRatesService.fetchCoinPair('eth_btc').then((ethToBtc) => {
      this.ethToBtc = ethToBtc
    })
  },
  methods: {
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
    reindexRoot: function () {
      let username = this.userData.username
      searchIndexService.indexUser(username).then(function (message) {
        console.log('Indexed new record.')
      }).catch(function (e) {
        console.log('Unable to index new record - it should be picked up in next sweep. ', e)
      })
    },
    closeSaleDataModal: function (response) {
      this.saleDataModalActive = false
    },
    openSaleDataModal: function (id) {
      let record = provenanceService.getProvenanceRecord(id)
      this.recordForSaleData = record
      this.saleDataModalActive = true
    },
  },
  components: {
    ProvenanceActions,
    ProvenanceItemBar,
    ProvenanceSaleData
  }
}
</script>

<style lang="sass" src="bulma">
</style>
