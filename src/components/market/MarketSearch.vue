<template>
<div class="column">
  <h1 class="title is-2">Search Market</h1>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">Search</label>
    </div>
    <div class="field-body">
      <div class="control">
        <div class="select">
          <select v-model="queryTerm">
            <option>title</option>
            <option>description</option>
            <option>keywords</option>
            <option>itemType</option>
            <option>uploader</option>
            <option>registered</option>
          </select>
        </div>
      </div>
      <div class="field">
        <input class="input is-success" type="text" placeholder="enter query" v-model="queryString">
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" @click="searchIndex()">
            Search Index
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-for="provenanceRecord in provenanceRecords" :key="provenanceRecord.indexData.id">
    <provenance-item-bar v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData" v-bind:allowEdit="allowEdit"/>
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
      allowEdit: false,
      provenanceRecords: [],
      sizeOfIndex: null,
      queryString: null,
      queryTerm: 'title'
    }
  },
  mounted () {
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
          this.$emit('update:numbResults', results.length)
          $elfie.provenanceRecords = []
          _.forEach(results, function (indexData) {
            let urlLastSlash = indexData.gaiaUrl.lastIndexOf('/') + 1
            let url = indexData.gaiaUrl.substring(0, urlLastSlash)
            url = url + provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
            searchIndexService.getByGaiaUrl(url)
              .then((provData) => {
                $elfie.provenanceRecords.push({
                  indexData: indexData,
                  provData: provData
                })
              })
              .catch(e => {
                console.log('Unable to get from: ' + indexData.gaiaUrl)
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
