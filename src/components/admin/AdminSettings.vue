<template>
<div class="container wide">
  <h1 class="title is-2">Settings</h1>
  <div class="row">
    <div class="col-sm-12 pt-1">Environment: {{ environment }} (Target env: {{ releaseTarget }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Contract Address: {{ contract }} on network {{ network.networkId }} ({{ network.networkName }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Shape Shift Url: {{ shapeShiftUrl }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Search URL: {{ searchUrl }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-20">Tokbox api key: {{ apiKey }}</div>
  </div>
</div>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'

export default {
  data () {
    return {
      apiKey: '',
      environment: '',
      releaseTarget: '',
      shapeShiftUrl: '',
      searchUrl: '',
      contract: '',
      network: '',
    }
  },
  mounted () {
    this.apiKey = process.env.TOK_BOX_API_KEY
    this.releaseTarget = process.env.RELEASE_TARGET
    this.environment = process.env.NODE_ENV
    this.shapeShiftUrl = process.env.SHAPE_SHIFT_URL
    this.searchUrl = process.env.SEARCH_INDEX_URL
    this.contract = process.env.ETHEREUM_CONTRACT_ADDRESS
    this.network = ethService.getNetworkType()
  },
  methods: {
    findAll: function () {
    },
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
