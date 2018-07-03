<template>
<section class="page">
  <div class="events"></div>
  <div class="columns">
    <div class="column is-one-fifth">
      <lightning-actions />
    </div>
    <div class="column is-four-fifths">
      <h1 class="title is-1">Explore Lightning</h1>
    </div>
    <div class="column is-four-fifths" v-for="node in nodes" :key="node.name">
      <lightning-node />
      <!-- <router-view :key="$route.params.action"></router-view> -->
    </div>
  </div>
</section>
</template>

<script>
import LightningActions from '@/components/lightning/LightningActions'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'

export default {
  data () {
    return {
      nodes: ['alice', 'bob'],
      node: (this.$route && this.$route.params.node) ? this.$route.params.node : 'alice',
      action: (this.$route && this.$route.params.action) ? this.$route.params.action : 'getinfo',
      rates: {}
    }
  },
  mounted () {
    // var socket = new WebSocket('http://localhost:8080/ws')
    let socket = new SockJS('http://localhost:8080/exchanges')
    let stompClient = Stomp.over(socket)
    let connectSuccess = function (frame) {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/exchanges', function (response) {
        let rates = {rates: JSON.parse(response.body)}
        console.log(rates)
      })
    }
    let connectError = function (error) {
      if (error.headers) {
        console.log('[SysadmOnly] WebSocket Error: ' + error)
      } else {
        console.log('[SysadmOnly] WebSocket Error: ' + error)
      }
    }
    stompClient.connect({}, connectSuccess, connectError)
  },
  methods: {
    setNode: function (node) {
      this.node = node
    },
  },
  components: {
    LightningActions
  }
}
</script>

<style lang="sass" src="bulma">
</style>
