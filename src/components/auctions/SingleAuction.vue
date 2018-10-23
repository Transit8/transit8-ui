<template>
<div class="col-md-12">
  <h3><router-link :to="auctionUrl">{{auction.title}}</router-link></h3>
  <p>{{auction.description}}</p>
  <p>Countdown: {{countdown}}</p>
</div>
</template>

<script>
import utils from '@/services/utils'
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleAuction',
  components: { },
  props: {
    auction: {
      type: Object,
      default () {
        return {}
      }
    },
    future: false,
  },
  methods: {
    convertDate (date) {
      return moment(date).format()
    },
  },
  computed: {
    auctionUrl () {
      return `/online-auction/${this.auction.auctionId}`
    },
    countdown () {
      let serverTime = this.$store.getters['serverTime']
      return utils.dt_Offset(serverTime, this.auction.startDate)
    },
  }
}
</script>
