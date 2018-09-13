<template>
<div class="column">
  <h1 class="title is-2">Search Market</h1>
  <div v-for="provenanceRecord in provenanceRecords" :key="provenanceRecord.indexData.id">
    <provenance-item-bar v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData"/>
  </div>
</div>
</template>

<script>
import provenanceService from '@/services/provenance/ProvenanceService'
import searchIndexService from '@/services/searchindex/SearchIndexService'
import ProvenanceItemBar from '@/components/provenance/ProvenanceItemBar'
import moment from 'moment'
import _ from 'lodash'

export default {
  props: ['numbResults'],
  data () {
    return {
      userData: {},
      provenanceRecords: [],
      sizeOfIndex: null,
      queryTerm: 'title',
      queryString: (this.$route && this.$route.params.query) ? parseInt(this.$route.params.query) : undefined,
    }
  },
  mounted () {
    this.queryString = this.$route.query.title
    this.userData = provenanceService.getUserData()
    searchIndexService.sizeOfIndex('art')
      .then((result) => {
        this.$emit('update:numbResults', result)
      })
      .catch(e => {
        console.log('Unable to contact search index.', e)
      })
    this.searchIndex()
  },
  methods: {
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
    searchIndex: function () {
      let query = (this.queryString) ? this.queryString : '*'
      let $elfie = this
      searchIndexService.searchIndex('art', this.queryTerm, query)
        .then((results) => {
          $elfie.provenanceRecords = []
          console.log('Total records found in search (may differ from number fetched from gaia storage): ' + results.length)
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                console.log('Record: ' + record)
                if (record && record.indexData && record.indexData.id) {
                  $elfie.provenanceRecords.push(record)
                  $elfie.$emit('update:numbResults', $elfie.provenanceRecords.length)
                }
              })
              .catch(e => {
                console.log('Unable to get from: ', indexData)
              })
          })
        })
        .catch(e => {
          console.log('Unable to contact search index.', e)
        })
    },
  },
  components: {
    ProvenanceItemBar
  }
}
</script>

<style>
.main-page {
  margin: 50px 100px;
}
</style>
