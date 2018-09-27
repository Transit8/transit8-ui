<template>
<div>
  <notifications group="artwork-actions" />
  <div class="main">
    <navigation/>
    <settings-blockchain v-if="error" v-on:continue-onward="continueOnward" v-bind:metamask="metamask"></settings-blockchain>
    <router-view v-else></router-view>
  </div>
  <app-footer/>
</div>
</template>

<script>
import SettingsBlockchain from '@/components/settings/SettingsBlockchain'
import Navigation from '@/components/nav/Navigation'
import ethService from '@/services/experimental/ethApiService'
import AppFooter from './components/common/AppFooter'
import provenanceService from '@/services/provenance/provenanceService'
// import ethereumService from '@/services/ethereumService'

export default {
  name: 'App',
  data () {
    return {
      error: null,
      metamask: {},
      connected: false,
      accounts: {},
    }
  },
  created () {
    console.log('Running App version ', process.env)
    provenanceService.initRootFile()
      .then((result) => {
        provenanceService.initProvenanceRecords()
      })
      .catch(e => {
        console.log(e)
      })
    let web3 = ethService.getWeb3()
    if (!web3) {
      this.error = 'no meta mask - routing to settings'
      return
    }
    let $elfie = this
    ethService.connectToBlockChain().then((result) => {
      if (result.failed) {
        $elfie.error = result.reason
      } else {
        $elfie.metamask = result
      }
    }).catch(e => {
      $elfie.spinner = false
      $elfie.error = 'Record has been successfully registered on the block chain - but an error was thrown saving to user storage. Tx=' + this.provenanceRecord.indexData.regData.result
    })
  },
  methods: {
    continueOnward: function () {
      this.error = undefined
    },
  },
  components: {
    AppFooter,
    Navigation,
    SettingsBlockchain,
  }
}
</script>
