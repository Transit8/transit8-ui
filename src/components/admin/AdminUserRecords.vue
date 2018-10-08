<template>
<div class="column">
  <h1 class="title is-2">User Records</h1>
  <div>{{ result }}</div>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">Find By User</label>
    </div>
    <div class="field-body">
      <div class="field">
        <input class="input is-success" type="text" placeholder="enter username e.g. username.id" v-model="username">
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" @click="findByUser()">
            Index User
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-for="entry in appurls" :key="entry.appUrl" style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc">
    <div class="columns">
      <div class="column"><b>{{ entry.appUrl }}</b></div>
      <div class="column"><b>{{ entry.gaiaUrl }}</b></div>
    </div>
    <div class="columns" v-if="entry.rootFile">
      <div class="column is-one-fifth">Created</div>
      <div class="column is-four-fifth">{{ niceTime(entry.rootFile.created) }}</div>
    </div>
    <div v-if="entry.rootFile" v-for="record in entry.rootFile.records" :key="record.id" style="margin: 10px; background: cyan; padding: 20px;">
      <div class="columns">
        <div class="column is-one-fifth">Title</div>
        <div class="column is-four-fifth">{{ record.title }}</div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">Id</div>
        <div class="column is-four-fifth">{{ record.id }}</div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">Created</div>
        <div class="column is-four-fifth">{{ niceTime(record.id) }}</div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">Description</div>
        <div class="column is-four-fifth">{{ record.description }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import artworkSearchService from '@/services/artworkSearchService'
import moment from 'moment'

export default {
  data () {
    return {
      appurls: [],
      result: null,
      username: 'mike.personal.id',
    }
  },
  mounted () {
  },
  methods: {
    niceTime: function (updated) {
      return moment(updated).format('LLLL')
    },
    findByUser: function () {
      artworkSearchService.searchIndex('names', 'name', this.username)
        .then((results) => {
          let zonefile = results[0]
          this.appurls.push(zonefile.apps)
        })
    },
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
