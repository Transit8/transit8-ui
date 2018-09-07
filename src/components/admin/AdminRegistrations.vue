<template>
<div class="column">
  <h1 class="title is-2">On Chain Registrations</h1>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">{{ numbRegistrations }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <button class="button is-primary" @click="findAll()">
            Find All
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-for="registration in registrations" :key="registration.title">
    <div>{{ registration }}</div>
  </div>
</div>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'

export default {
  data () {
    return {
      numbRegistrations: -1,
      registrations: [],
    }
  },
  mounted () {
  },
  methods: {
    findAll: function () {
      let $elfie = this
      $elfie.registrations = []
      ethService.fetchNumbRegistrations().then((numbRegistrations) => {
        this.numbRegistrations = numbRegistrations
        for (let index = 0; index < numbRegistrations; index++) {
          $elfie = this
          setTimeout(function timer () {
            // alert('hello world')
            ethService.fetchItemByIndex(index).then((item) => {
              item.index = index
              $elfie.registrations.push(item)
            })
          }, index * 3000)
        }
      })
    },
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
