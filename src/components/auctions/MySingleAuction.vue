<template>
<div class="col-md-12">
  <h3>{{auction.title}}</h3>
  <p>{{auction.description}}</p>
  <p>Starts: {{startsIn(auction.startDate)}}</p>
  <div class="row" v-if="future">
    <div class="col-sm-3" v-if="!managing">
      <router-link :to="manageUrl">manage auction ({{auction.sellingList.length}} items)</router-link>
    </div>
    <div class="col-sm-3 pull-right" v-if="future">
      <router-link :to="updateUrl">edit</router-link> |
      <a href="#" @click="deleteAuction()">delete</a> |
      <span v-if="auction.privacy === 'private'">make public</span>
      <span v-else>make private</span>
    </div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'

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
    managing: false
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
    deleteAuction () {
      this.$store.dispatch('auctionsStore/deleteMyAuction', this.auction.auctionId)
    },
  },
  computed: {
    myAuctionsFuture () {
      return this.$store.getters['auctionsStore/myAuctionsFuture']
    },
    myAuctionsPast () {
      return this.$store.getters['auctionsStore/myAuctionsPast']
    },
    myAuctionsFutureCount () {
      return this.$store.getters['auctionsStore/myAuctionsFutureCount']
    },
    myAuctionsPastCount () {
      return this.$store.getters['auctionsStore/myAuctionsPastCount']
    },
    updateUrl () {
      return `/auctions/update/${this.auction.auctionId}`
    },
    manageUrl () {
      return `/auctions/manage/${this.auction.auctionId}`
    },
    debugMode () {
      let debugMode = this.$store.getters['isDebugMode']
      return debugMode
    }
  }
}
</script>
