<template>
<div class="col-md-12">
  <h3>{{auction.title}}</h3>
  <p>{{auction.description}}</p>
  <p>Countdown: {{countdown}}</p>
  <div class="row">
    <div class="col-sm-3">
      <router-link :to="manageUrl">manage auction</router-link>
      <router-link :to="onlineAuctionUrl">online auction</router-link>
    </div>
  </div>
  <div class="row" v-if="debugMode">
    <div class="col-sm-12">
      <p v-html="auction"></p>
    </div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleAuction',
  components: { },
  props: {
    auction: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  methods: {
    convertDate (date) {
      return moment(date).format()
    },
  },
  computed: {

    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    countdown () {
      let serverTime = this.$store.getters['serverTime']
      return utils.dt_Offset(serverTime, this.auction.startDate)
    },
    manageUrl () {
      return `/my-auctions/manage/${this.auction.auctionId}`
    },
    onlineAuctionUrl () {
      return `/online-auction/${this.auction.auctionId}`
    },
  }
}
</script>
