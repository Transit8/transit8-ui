<template>
<div class="column">
  <h1 class="title is-2">On Chain Registrations</h1>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">{{registrations.length}} Records</label>
    </div>
  </div>
  <div v-for="(registration, index) in registrations" :key="index">
    <div>{{registration}}</div>
  </div>
</div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  computed: {
    registrations () {
      return this.$store.getters['ethStore/getBlockchainItems']
    },
  },
  created () {
    // this.$store.dispatch('ethStore/fetchBlockchainItems').then((blockchainItems) => {
    //  console.log('Fetched: ', blockchainItems)
    // })
  },
  methods: {
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
