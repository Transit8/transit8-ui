<template>
<div class="container wide">
  <div class="row">
    <div class="col-md-6">
      <h3>{{auction.title}}</h3>
      <p>{{auction.description}}</p>
      <!--
      <p v-html="auction.items" v-if="debugMode"></p>
      -->
      <p>Starts: {{startsIn(auction.startDate)}}</p>
      <p><router-link :to="onlineAuctionUrl">manage auction</router-link></p>
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
    <video-stream :canPublish="true"/>
    <message-stream :auctionId="auctionId" :administrator="true"/>
  </div>
  <div class="row">
    <div class="col-md-9">
      <hammer-item :item="hammerItem" :auctionId="auctionId"/>
    </div>
    <div class="col-md-3">
      <h4>Peers</h4>
      <p v-for="(peer, index) of peers" :key="index">
        {{peer.username}}
      </p>
    </div>
  </div>
  <div class="row">
    <div class="col-md-9">
      <h4>Selling Items</h4>
      <my-single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="true"/>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <h4>Available Items</h4>
      <my-single-auction-item class="auction-item-container" v-for="(item, index) of availableItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="false"/>
    </div>
  </div>
</div>
</template>

<script>
import MessageStream from '@/components/rtc/MessageStream'
import VideoStream from '@/components/rtc/VideoStream'
import MySingleAuction from '../components/auctions/MySingleAuction'
import MySingleAuctionItem from '../components/auctions/MySingleAuctionItem'
import utils from '@/services/utils'
import notify from '@/services/notify'
import peerToPeerService from '@/services/peerToPeerService'
import eventBus from '@/services/eventBus'
import HammerItem from '@/components/auctions/HammerItem'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctionManage',
  components: { HammerItem, MySingleAuction, MySingleAuctionItem, VideoStream, MessageStream },
  data () {
    return {
      auctionId: null
    }
  },
  beforeDestroy () {
    peerToPeerService.disconnect()
    eventBus.$off('signal-in-message')
  },
  created () {
    this.auctionId = Number(this.$route.params.auctionId)
    this.$store.dispatch('myAccountStore/fetchMyAccount').then((myProfile) => {
      this.$store.dispatch('myAuctionsStore/fetchMyAuction', this.auctionId).then((auction) => {
        // this.auction = auction
        try {
          peerToPeerService.startSession(myProfile.username, auction.auctionId)
        } catch (e) {
          console.log(e)
        }
      })
    })
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
    deleteAuction () {
      this.$store.dispatch('myAuctionsStore/deleteMyAuction', this.auctionId)
    },
    makePublic () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      auction.privacy = 'public'
      this.$store.dispatch('myAuctionsStore/makePublic', auction)
      notify.info({title: 'Manage Auction', text: auction.title + ' is now public and can be found by others via search results.'})
    },
    makePrivate () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      auction.privacy = 'private'
      this.$store.dispatch('myAuctionsStore/makePrivate', auction)
      notify.info({title: 'Manage Auction', text: auction.title + ' is now private and can not be found by other users.'})
    },
  },
  computed: {
    sellingItemsSize () {
      let sellingItems = this.$store.getters['myArtworksStore/auctioning'](this.auctionId)
      return sellingItems.length
    },
    auction () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      return auction | {}
    },
    peers () {
      return this.$store.getters['onlineAuctionsStore/getPeers']
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    updateUrl () {
      return `/my-auctions/update/${this.auctionId}`
    },
    hammerItem () {
      let hammerItem = {}
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      if (auction) {
        let hammerItems = auction.items.filter(item => item.inplay)
        if (hammerItems && hammerItems.length === 1) {
          hammerItem = hammerItems[0]
          hammerItem.admin = true
        }
      }
      return hammerItem
    },
    availableItems () {
      let available = this.$store.getters['myArtworksStore/available'](this.auctionId)
      if (available && available.length > 0) {
        let items = []
        for (let key in available) {
          items.push({
            itemId: available[key].id
          })
        }
        return items
      } else {
        return []
      }
    },
    sellingItems () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      if (auction && auction.items) {
        let following = auction.items.filter(item => !item.inplay)
        return following
      } else {
        return []
      }
    },
    onlineAuctionUrl () {
      return `/online-auction/${this.auctionId}`
    },
  },
}
</script>
