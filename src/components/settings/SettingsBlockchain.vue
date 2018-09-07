<template>
<section class="main-page">
  <div class="columns">
    <div class="column is-one-fifth" style="padding: 30px">
      <ul>
        <li></li>
      </ul>
    </div>
    <div class="column">
      <h1 class="title is-1">Blockchain Settings</h1>
      <p>This application is part of the new decentralised internet based on blockchain technology.</p>
      <h3 class="title is-5" style="margin-top: 40px;">1. Ethereum Blockchain - Meta Mask Wallet</h3>
      <div v-if="metamask && metamask.accounts && metamask.accounts.length > 0">
        <div v-for="(key, value) in metamask.accounts" v-bind:key="key">
          <p>Account {{ value }} : {{ key }}</p>
        </div>
      </div>
      <div v-else>
        <p>Meta Mask not detected.</p>
        <ul>
          <li>Install meta mask browser extension: chrome, firefox</li>
          <li>For Ropsten you can get free ether from here: <a href="https://faucet.metamask.io">faucet</a></li>
        </ul>
        <p>Some <a target="blank" href="https://medium.com/@followcoin/how-to-install-metamask-88cbdabc1d28">instructions on medium</a>.</p>
      </div>
      <div class="subtitle is-1" style="margin-top: 40px;">
        <button class="button" v-on:click="$emit('continue-onward')">Click here to continue!</button>
      </div>
    </div>
  </div>
</section>
</template>

<script>

export default {
  name: 'SettingsBlockchain',
  props: ['metamask'],
  data: () => {
    return {
    }
  },
  mounted () {
    console.log(this.metamask)
  },
  methods: {
    onward: function (event) {
      event.preventDefault()
      this.$emit('continue-onward')
    },
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main-page {
  margin: 50px 100px;
}
</style>
