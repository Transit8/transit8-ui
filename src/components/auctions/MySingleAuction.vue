<template>
<div class="col-md-12">
  <h3>{{auction.title}}</h3>
  <p>{{auction.description}}</p>
  <p>Starts: {{convertDate(auction.startDate)}}</p>
  <p>Ends: {{convertDate(auction.endDate)}}</p>
  <p>Countdown: {{startsIn(auction.startDate)}}</p>
  <div class="row" v-if="future">
    <div class="col-sm-3">
      <router-link :to="manageUrl">manage auction</router-link>
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
    manageUrl () {
      return `/my-auctions/manage/${this.auction.auctionId}`
    },
  }
}
</script>
