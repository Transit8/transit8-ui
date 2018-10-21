<template>
<div class="col-md-12">
  <h3><router-link :to="auctionUrl">{{auction.title}}</router-link></h3>
  <p>{{auction.description}}</p>
  <p>Starts: {{convertDate(auction.startDate)}}</p>
  <p>Ends: {{convertDate(auction.endDate)}}</p>
  <p>Countdown: {{startsIn(auction.startDate)}}</p>
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
    startsIn (date) {
      return utils.dt_Offset(date)
    },
    convertDate (date) {
      return moment(date).format()
    },
  },
  computed: {
    auctionUrl () {
      return `/online-auction/${this.auction.auctionId}`
    },
  }
}
</script>
