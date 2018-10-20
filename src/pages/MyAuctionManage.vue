<template>
<div class="container wide">
  <div class="row">
    <div class="col-md-12">
      <h3>{{auction.title}}</h3>
      <p>{{auction.description}}</p>
      <p>Starts: {{startsIn(auction.startDate)}}</p>
      <p>{{sellingItemsSize}} items</p>
      <div class="row">
        <div class="col-sm-3 pull-right">
          <router-link :to="updateUrl">edit</router-link> |
          <!-- <a href="#" @click="deleteAuction()">delete</a> | -->
          <span v-if="auction.privacy === 'private'"><a href="#" @click="makePublic()">make public</a></span>
          <span v-else><a href="#" @click="makePrivate()">make private</a></span>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <h4>Selling Items</h4>
    <single-auction-item v-for="(item, index) of sellingItems" :key="index" :item="item" :sellingItem="true"/>
  </div>
  <div class="row">
    <h4>Available Items</h4>
    <single-auction-item v-for="(item, index) of availableItems" :key="index" :item="item" :sellingItem="false"/>
  </div>
</div>
</template>

<script>
import MySingleAuction from '../components/auctions/MySingleAuction'
import SingleAuctionItem from '../components/auctions/SingleAuctionItem'
import utils from '@/services/utils'
import notify from '@/services/notify'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctionManage',
  components: { MySingleAuction, SingleAuctionItem },
  data () {
    return {
      auction: {
        type: Object,
        default () {
          return {}
        }
      },
    }
  },
  created () {
    this.auctionId = Number(this.$route.params.auctionId)
    this.$store.dispatch('myAuctionsStore/fetchMyAuction', this.auctionId).then((auction) => {
      this.auction = auction
    })
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
    deleteAuction () {
      this.$store.dispatch('myAuctionsStore/deleteMyAuction', this.auction.auctionId)
    },
    makePublic () {
      this.auction.privacy = 'public'
      this.$store.dispatch('myAuctionsStore/makePublic', this.auction)
      notify.info({title: 'Manage Auction', text: this.auction.title + ' is now public and can be found by others via search results.'})
    },
    makePrivate () {
      this.auction.privacy = 'private'
      this.$store.dispatch('myAuctionsStore/makePrivate', this.auction)
      notify.info({title: 'Manage Auction', text: this.auction.title + ' is now private and can not be found by other users.'})
    },
  },
  computed: {
    sellingItemsSize () {
      let sellingItems = this.$store.getters['myArtworksStore/auctioning'](this.auction.auctionId)
      return sellingItems.length
    },
    updateUrl () {
      return `/my-auctions/update/${this.auction.auctionId}`
    },
    debugMode () {
      let debugMode = this.$store.getters['isDebugMode']
      return debugMode
    },
    availableItems () {
      return this.$store.getters['myArtworksStore/available']
    },
    sellingItems () {
      return this.$store.getters['myArtworksStore/auctioning'](this.auctionId)
    },
  },
}
</script>
