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
  <div v-for="result in results" :key="result.docIndex" style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc">
    <div class="columns"><div class="column is-one-fifth">id:</div> <div class="column">{{ result.id }}</div></div>
    <div class="columns"><div class="column is-one-fifth">created:</div> <div class="column">{{ niceTime(result.id) }}</div></div>
    <div class="columns"><div class="column is-one-fifth">title:</div> <div class="column">{{ result.title }}</div></div>
    <div class="columns"><div class="column is-one-fifth">description:</div> <div class="column">{{ result.description }}</div></div>
    <div class="columns"><div class="column is-one-fifth">keywords:</div> <div class="column">{{ result.keywords }}</div></div>
    <div class="columns"><div class="column is-one-fifth">itemType:</div> <div class="column">{{ result.itemType }}</div></div>
    <div class="columns"><div class="column is-one-fifth">uploader:</div> <div class="column">{{ result.uploader }}</div></div>
    <div class="columns"><div class="column is-one-fifth">registered:</div> <div class="column">{{ result.registered }}</div></div>
    <div class="columns"><div class="column is-one-fifth">app url:</div> <div class="column">{{ result.appUrl }}</div></div>
    <div class="columns"><div class="column is-one-fifth">gaia url:</div> <div class="column">{{ result.gaiaUrl }}</div></div>
  </div>

</div>
</template>

<script>
import searchIndexService from '@/services/searchindex/SearchIndexService'
import moment from 'moment'

export default {
  props: ['numbResults'],
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
      return moment(updated).format('LLLL')
    },
    searchIndex: function () {
      let query = (this.queryString) ? this.queryString : '*'
      searchIndexService.searchIndex('art', this.queryTerm, query)
        .then((results) => {
          this.results = results
          this.$emit('update:numbResults', results.length)
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

<style>
.main-page {
  margin: 50px 100px;
}
</style>
