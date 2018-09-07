<template>
<div>
  <notifications group="foo" />
  <div class="main">
    <navigation/>
    <login />
    <settings-blockchain v-if="error" v-on:continue-onward="continueOnward" v-bind:metamask="metamask"></settings-blockchain>
    <router-view v-else></router-view>
  </div>
  <footBar/>
</div>
</template>

<script>
import SettingsBlockchain from '@/components/settings/SettingsBlockchain'
import Navigation from '@/components/nav/Navigation'
import Login from 'bright-block-auth/src/components/auth/Login'
import FootBar from '@/components/home/FootBar'
import ethService from '@/services/experimental/ethApiService'

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
  mounted () {
    console.log('Running App version ', process.env)
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
    Navigation,
    Login,
    SettingsBlockchain,
    FootBar
  }
}
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";
</style>
<style lang="css">
p {
  margin-bottom: 15px;
}
.container {
  padding-top: 20px;
}
.main {
  min-height: calc(100vh - 90px);
}
.footer {
  height: 50px;
}
</style>
