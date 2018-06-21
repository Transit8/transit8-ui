<template>
<section class="page">
  <div class="columns">
    <div class="column is-one-fifth">
        <eth-api-side-bar  v-on:make-call="onMakeCall"/>
    </div>
    <div class="column">
      <h2>Accounts {{ mainAccount.number }} {{ mainAccount.balance }}</h2>
      <ul>
        <li
           v-for="account in accounts"
           :key="account.balance">
            {{ account.number }} :  <a>{{ account.balance }}</a>
        </li>
      </ul>
      <vue-json-pretty
        :response="{ key: 'value' }"
        :data="nodeInfo">
      </vue-json-pretty>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <figure class="image is-128x128">
        <img src="http://cdn.recolor.com/u/tUrRNJ1YrDc0umq7nd0hVirSnNs2/p/Ljfj36nXtlFu?w=500">
      </figure>
    </div>
    <div class="column">
      <figure class="image is-128x128">
        <img src="http://cdn.recolor.com/u/2EJlWjZPOOcfaGnCNoO2xEOBafS2/p/LjgUX0G1lZHh?w=500">
      </figure>
    </div>
    <div class="column">
      <figure class="image is-128x128">
        <img src="http://cdn.recolor.com/u/nYsE9N7TbOOO1vtGGb1KE225Kdo1/p/LjfGuMwjZFFC?w=500">
      </figure>
    </div>
    <div class="column">
      <figure class="image is-128x128">
        <img src="http://cdn.recolor.com/u/BlHPqEvL1mMQhmOt7eyNxQRZP7g2/p/LjfHKd6cZVDZ?w=500">
      </figure>
    </div>
  </div>
</section>
</template>

<script>
import SideBar from '@/components/SideBar'
import EthApiSideBar from '@/components/eth/EthApiSideBar'
import ethService from '@/services/ethApiService'
import VueJsonPretty from 'vue-json-pretty'

export default {
  data () {
    return {
      mainAccount: {},
      accounts: [],
      nodeInfo: {}
    }
  },
  mounted () {
    let mystate = this
    ethService.getAccounts().then((accounts) => {
      mystate.nodeInfo.accounts = accounts
      mystate.mainAccount.number = accounts[0]
      mystate.accounts[0] = {
        number: mystate.mainAccount.number,
        balance: 0
      }
      ethService.getBalance(mystate.mainAccount.number).then((balance) => {
        mystate.mainAccount.balance = balance
        this.accounts[0].balance = balance
        console.log(mystate.nodeInfo)
        // console.log(this.nodeInfo)
        let acc0 = mystate.accounts[0]
        acc0['balance'] = balance
        mystate.nodeInfo = mystate.accounts[0]
      })
    })
  },
  methods: {
    onMakeCall: function (argument) {
      console.log(ethService)
    },
    handleClick: function (argument) {
      console.log('click')
    },
  },
  components: {
    SideBar,
    EthApiSideBar,
    VueJsonPretty
  }
}
</script>

<style>
</style>
