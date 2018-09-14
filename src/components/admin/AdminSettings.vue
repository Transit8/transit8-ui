<template>
<div class="container wide">
  <h1 class="title is-2">Settings</h1>
  <div class="row">
    <div class="col-sm-12 pt-60">Environment: {{ environment }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-60">Search URL: {{ searchUrl }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-60">Shape Shift Url: {{ shapeShiftUrl }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-60">Contract Address: {{ contract }} on network {{ network }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-60">Tokbox api key: {{ apiKey }}</div>
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
      shapeShiftUrl: '',
      searchUrl: '',
      contract: '',
      network: '',
    }
  },
  mounted () {
    this.apiKey = process.env.TOK_BOX_API_KEY
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
