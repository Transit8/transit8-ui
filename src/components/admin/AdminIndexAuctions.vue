<template>
<div class="column">
  <h1 class="title is-2">Auction Index</h1>
  <h1 class="title is-4">Indexing (Current Size: {{ sizeOfIndex }})</h1>
  <div>{{ result }}</div>
  <div>
    <ul>
      <li><a href="#" @click="buildIndex()">Build entire auction search index from blockstack zonefiles</a></li>
      <li><a href="#" @click="removeAll()">Clear entire auction search index</a></li>
      <li><a href="#" @click="reindex()">Reindex current users auctions</a></li>
      <li><a href="#" @click="fetchAll()">Fetch all indexed auctions</a></li>
    </ul>
  </div>

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
  <div>Found: {{ results.length }}</div>
  <div v-for="(result, index) in results" :key="index" class="row">
    <div class="columns">{{index}}: {{result}}</div>
  </div>

</div>
</template>

<script>
import auctionSearchService from '@/services/auctionSearchService'
import myAuctionsService from '@/services/myAuctionsService'
import moment from 'moment'

export default {
  data () {
    return {
      results: [],
      result: null,
      names: null,
      fromPage: null,
      toPage: null,
      sizeOfIndex: null,
      username: null,
      queryString: null,
      queryTerm: 'title'
    }
  },
  mounted () {
    auctionSearchService.sizeOfIndex('art')
      .then((result) => {
        this.sizeOfIndex = result
      })
      .catch(e => {
        console.log('Unable to contact search index.', e)
      })
  },
  computed: {
  },
  methods: {
    niceTime: function (updated) {
      return moment(updated).format('LLLL')
    },
    buildIndex: function () {
      auctionSearchService.buildIndex()
        .then((result) => {
          this.result = result.message
        })
        .catch(e => {
          console.log('Unable to contact search index.', e)
        })
    },
    fetchAll: function () {
      auctionSearchService.searchIndex('title', '*')
        .then((results) => {
          this.results = results
        })
        .catch(e => {
          console.log('Unable to fetch all documents.', e)
        })
    },
    removeAll: function () {
      auctionSearchService.removeAll()
        .then((result) => {
          this.result = result
          this.sizeOfIndex = result
          this.results = []
        })
        .catch(e => {
          console.log('Unable to clear all documents.', e)
        })
    },
    reindex: function () {
      let $self = this
      myAuctionsService.reindex(function (result) {
        $self.result = result
      }, function (e) {
        console.log('Unable to contact search index.', e)
      })
    },
    searchIndex: function () {
      auctionSearchService.searchIndex(this.queryTerm, this.queryString)
        .then((results) => {
          this.results = results
        })
        .catch(e => {
          console.log('Unable to contact search index.', e)
        })
    },
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
