<template>
<div class="container wide">
  <h1 class="title is-2">Settings</h1>
  <div class="row">
    <div class="col-sm-12 pt-1">Environment: {{ environment }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-1">Domain: {{ domain }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-1">Node: {{ nodeInfo }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-1">Items: {{ numberOfItems }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Contract Address: {{ contractAddress }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Contract Deployed: {{ contract }}</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Meta Mask Network {{ network.networkId }} ({{ network.networkName }})</div>
  </div>
  <div class="row">
    <div class="col-sm-12 pt-5">Expected Network {{ networkExpected }})</div>
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
import ethereumService from '@/services/ethereumService'

export default {
  data () {
    return {
      apiKey: '',
      environment: '',
      shapeShiftUrl: '',
      searchUrl: '',
      contractAddress: '',
      network: '',
      networkExpected: '',
      domain: '',
      nodeInfo: '',
      contract: '',
      numberOfItems: '',
    }
  },
  mounted () {
    this.apiKey = process.env.TOK_BOX_API_KEY
    this.environment = process.env.NODE_ENV
    this.shapeShiftUrl = process.env.SHAPE_SHIFT_URL
    this.searchUrl = process.env.SEARCH_INDEX_URL
    this.contractAddress = process.env.ETHEREUM_CONTRACT_ADDRESS
    this.network = ethService.getNetworkType()
    this.networkExpected = process.env.ETHEREUM_NETWORK
    this.domain = location.origin
    ethereumService.getNodeInfo().then((result) => {
      this.nodeInfo = result
    })
    ethereumService.loadContract().then((result) => {
      this.contract = result
      ethereumService.getNumberOfItems().then((result) => {
        this.numberOfItems = result
      })
    })
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
