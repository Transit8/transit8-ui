<template>
<section class="page">
  <div class="columns">
    <div class="column is-one-fifth">
        <iota-api-side-bar  v-on:make-call="onMakeCall"/>
    </div>
    <div class="column">
      <vue-json-pretty
        :response="{ key: 'value' }"
        :data="response"
        @click="handleClick">
      </vue-json-pretty>
    </div>
  </div>
</section>
</template>

<script>
import IotaApiSideBar from '@/components/experimental/iota/IotaApiSideBar'
import iotaApi from '@/services/experimental/iotaApiService'
import VueJsonPretty from 'vue-json-pretty'

export default {
  data () {
    return {
      response: {}
    }
  },
  mounted () {
    iotaApi.getJson('getNodeInfo').then((response) => {
      if (response) {
        this.response = response
      }
    })
  },
  methods: {
    onMakeCall: function (argument) {
      iotaApi.getJson(argument).then((response) => {
        if (response) {
          this.response = response
        }
      })
    },
    handleClick: function (argument) {
      console.log('click')
    },
  },
  components: {
    IotaApiSideBar,
    VueJsonPretty
  }
}
</script>

<style>
</style>
