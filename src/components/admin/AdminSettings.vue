<template>
<div class="container wide">
  <h1 class="title ptb-1">Main Settings</h1>
  <div class="row m-3">
    <div class="col-sm-12">Environment: {{ constants.environment }}</div>
  </div>
  <div class="row pt-1">
    <div class="col-sm-12">Domain: {{ constants.domain }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Shape Shift Url: {{ constants.shapeShiftUrl }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Search URL: {{ constants.searchUrl }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-20">Tokbox api key: {{ constants.apiKey }}</div>
  </div>
  <h1 class="title ptb-1">Ethereum Settings</h1>
  <div class="row">
    <div class="col-sm-12 pt-5">Contract Address: {{ clientState.contractAddress }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Client: {{ clientState.client }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Meta Mask Network {{ network.networkId }} ({{ network.networkName }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Expected Network {{ networkExpected }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-1">Items Registered: {{ clientState.numbItems }}</div>
  </div>
</div>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      network: '',
      networkExpected: '',
      contract: '',
      numberOfItems: '',
    }
  },
  created () {
    this.network = ethService.getNetworkType()
    this.networkExpected = process.env.ETHEREUM_NETWORK
  },
  methods: {
    todoById (id) {
      return this.$store.getters.getTodoById(id)
    },
    findAll: function () {
    },
  },
  computed: {
    clientState () {
      return this.$store.state.ethStore.ethereum.clientState
    },
    constants () {
      return this.$store.state.constants
    },
    localComputed () {
      return 'hi there!'
    },
    // mix this into the outer object with the object spread operator
    ...mapState({
      count: state => state.count + 2,
      todos: state => state.todos,
    })
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
