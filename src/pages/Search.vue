<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage mb-0">Search results for: {{ queryString }} ({{results.length}})</h1>
            <results-list :artworks="results" :show-load-button="false" :chunks="6"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ResultsList from '../components/artworks/ResultsList'
import provenanceService from '@/services/provenance/ProvenanceService'
import searchIndexService from '@/services/searchindex/SearchIndexService'
// import ProvenanceItemBar from '@/components/provenance/ProvenanceItemBar'
import moment from 'moment'
import _ from 'lodash'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Search',
  components: { ResultsList },
  data () {
    return {
      userData: {},
      provenanceRecords: [],
      sizeOfIndex: null,
      queryTerm: 'title',
      queryString: (this.$route && this.$route.params.query) ? parseInt(this.$route.params.query) : undefined,
      results: [],
      query: 'query string'
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
      let $self = this
      searchIndexService.searchIndex('art', this.queryTerm, query)
        .then((results) => {
          $self.provenanceRecords = []
          console.log('Total records found in search (may differ from number fetched from gaia storage): ' + results.length)
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                if (record && record.indexData && record.indexData.id) {
                  $self.provenanceRecords.push(record)
                  let dataUrl = ''
                  if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
                    dataUrl = record.provData.artwork[ 0 ].dataUrl
                  }
                  let caption = record.indexData.uploader
                  $self.results.push({
                    id: record.indexData.id,
                    title: record.indexData.title,
                    caption: caption,
                    image: dataUrl,
                    forAuction: false
                  })
                  $self.$emit('update:numbResults', $self.provenanceRecords.length)
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

}
</script>
