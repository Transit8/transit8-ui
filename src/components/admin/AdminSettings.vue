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
    <div class="col-sm-12 pt-5">Eth Gateway URL: {{ constants.ethGatewayUrl }}</div>
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
    <div class="col-sm-12 pt-5">Meta Mask Network {{ clientState.metaMaskNetwork.networkId }} ({{ clientState.metaMaskNetwork.networkName }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Expected Network {{ networkExpected }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-1">Items Registered: {{ clientState.numbItems }}</div>
  </div>

  <h1 class="title ptb-1">Debug Settings</h1>
  <div class="row">
    <div class="col-sm-12 pt-5">Debug Mode: <a @click="toggleDebugMode">{{debugMode}}</a></div>
  </div>

</div>
</template>

<script>
import ethereumService from '@/services/ethereumService'

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
    this.network = ethereumService.getNetworkType()
    this.networkExpected = process.env.ETHEREUM_NETWORK
    this.networkExpected = process.env.ETHEREUM_NETWORK
  },
  methods: {
    toggleDebugMode () {
      this.$store.commit('debugMode')
    },
  },
  computed: {
    clientState () {
      let clientState = this.$store.state.ethStore.clientState
      return clientState
    },
    debugMode () {
      let debugMode = this.$store.getters['isDebugMode']
      return debugMode
    },
    constants () {
      return this.$store.state.constants
    },
    localComputed () {
      return 'hi there!'
    },
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
