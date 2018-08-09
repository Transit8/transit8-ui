<template>
<div class="column">
  <provenance-sale-data v-if="saleDataModalActive" v-on:close-sale-data-modal="closeSaleDataModal" v-bind:recordForSaleData="recordForSaleData" v-bind:saleDataModalActive="saleDataModalActive"/>
  <h1 class="title is-1">{{ environment }} - My Artworks</h1>
  <div class="notification">
    Found: {{ numbResults }}
    <p class="has-text-right"><a @click="reindexRoot()">reindex</a></p>
  </div>
  <div v-for="provenanceRecord in provenanceRecords" :key="provenanceRecord.indexData.id">
    <provenance-item-bar v-on:open-sale-data-modal="openSaleDataModal" v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData" v-bind:allowEdit="allowEdit"/>
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

export default {
  data () {
    return {
      recordForSaleData: null,
      saleDataModalActive: false,
      numbResults: 0,
      allowEdit: true,
      userData: {},
      provenanceRecords: [],
      environment: 'dfsdf'
    }
  },
  mounted () {
    console.log('Running App version ', process.env)
    this.environment = process.env.SEARCH_INDEX_URL
    this.provenanceRecords = provenanceService.getProvenanceRecordsInLS()
    this.numbResults = this.provenanceRecords.length
    this.userData = provenanceService.getUserData()
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
      if (response) {
        this.provenanceRecords = provenanceService.getProvenanceRecordsInLS()
      }
    },
    openSaleDataModal: function (id) {
      let record = provenanceService.getProvenanceRecord(id)
      this.recordForSaleData = {
        id: record.indexData.id,
        title: record.indexData.title,
      }
      if (record.indexData.saleData) {
        this.recordForSaleData.saleData = record.indexData.saleData
        this.recordForSaleData.saleData.amount = Number(record.indexData.saleData.amount)
        this.recordForSaleData.saleData.reserve = Number(record.indexData.saleData.reserve)
        this.recordForSaleData.saleData.increment = Number(record.indexData.saleData.increment)
      } else {
        this.recordForSaleData.saleData = {
          saleOption: provenanceService.saleOptions[0],
          title: 'Options for selling your item.',
          amount: 0.00,
          reserve: 0.00
        }
      }
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
