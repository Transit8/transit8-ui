<template>
<div class="column">
  <h1 class="title is-2">Names Search Settings</h1>
  <p>Index Size: {{ sizeOfIndex }}
  <h1 class="title is-4">Build Search Index by Pages</h1>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">20 entries per page</label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="number" placeholder="from page" v-model="fromPage">
        </p>
      </div>
      <div class="field">
        <p class="control is-expanded has-icons-left has-icons-right">
          <input class="input is-success" type="number" placeholder="to page" v-model="toPage">
        </p>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label">
      <!-- Left empty for spacing -->
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <button class="button is-primary" @click="buildIndex('pages')">
            Build Index
          </button>
        </div>
      </div>
    </div>
  </div>

  <h1 class="title is-4">Build The Search Index by User Names</h1>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">Comma'd Usernames</label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="text" placeholder="comma separated user names" v-model="names">
        </p>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label">
      <!-- Left empty for spacing -->
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <button class="button is-primary" @click="buildIndex('names')">
            Build Index
          </button>
        </div>
      </div>
    </div>
  </div>
  <div>{{ result }}</div>

  <h1 class="title is-4">Test Search</h1>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">Select term</label>
    </div>
    <div class="field-body">
      <div class="control">
        <div class="select">
          <select v-model="queryTerm">
            <option>Select term</option>
            <option>name</option>
            <option>description</option>
            <option>zonefile</option>
            <option>apps</option>
          </select>
        </div>
      </div>
      <div class="field">
        <p class="control is-expanded has-icons-left has-icons-right">
          <input class="input is-success" type="text" placeholder="enter query" v-model="queryString">
        </p>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label">
      <!-- Left empty for spacing -->
    </div>
    <div class="field-body">
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
    <div class="columns"><div class="column is-one-fifth">name:</div> <div class="column">{{ result.name }}</div></div>
    <div class="columns"><div class="column is-one-fifth">description:</div> <div class="column">{{ result.description }}</div></div>
    <div class="columns"><div class="column is-one-fifth">status:</div> <div class="column">{{ result.status }}</div></div>
    <div class="columns"><div class="column is-one-fifth">zonefile:</div> <div class="column">{{ result.zonefile }}</div></div>
    <div class="columns"><div class="column is-one-fifth">apps:</div> <div class="column">{{ result.apps }}</div></div>
    <div class="columns"><div class="column is-one-fifth">zonefile_hash:</div> <div class="column">{{ result.zonefile_hash }}</div></div>
    <div class="columns"><div class="column is-one-fifth">last_txid:</div> <div class="column">{{ result.last_txid }}</div></div>
  </div>

</div>
</template>

<script>
import searchIndexService from '@/services/searchindex/searchIndexService'

export default {
  data () {
    return {
      results: null,
      result: null,
      names: null,
      fromPage: null,
      toPage: null,
      sizeOfIndex: null,
      queryString: null,
      queryTerm: 'description'
    }
  },
  mounted () {
    searchIndexService.sizeOfIndex('names')
      .then((result) => {
        this.sizeOfIndex = result.details
      })
      .catch(e => {
        console.log('Unable to contact search index.', e)
      })
  },
  methods: {
    buildIndex: function (type) {
      if (type === 'names') {
        searchIndexService.buildIndexByNames(this.names)
          .then((result) => {
            this.result = result
          })
          .catch(e => {
            console.log('Unable to contact search index.', e)
          })
      } else {
        searchIndexService.buildIndexByPages(this.fromPage, this.toPage)
          .then((result) => {
            this.result = result
          })
          .catch(e => {
            console.log('Unable to contact search index.', e)
          })
      }
    },
    searchIndex: function () {
      searchIndexService.searchIndex('names', this.queryTerm, this.queryString)
        .then((results) => {
          this.results = results.details
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
