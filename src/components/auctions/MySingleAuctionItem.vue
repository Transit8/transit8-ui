<template>
<div class="col-md-12">
  <div class="media">
    <div class="media-left">
      <img :src="artwork.image" :alt="artwork.title" class="media-object" style="max-width: 150px"/>
    </div>
    <div class="media-body" v-if="sellingItem">
      <h4 class="media-heading">{{artwork.title}}</h4>
      <!--
      <p v-html="artwork.id" v-if="debugMode"></p>
      <p v-html="artwork.saleData" v-if="debugMode"></p>
      <p v-html="artwork.bcitem" v-if="debugMode"></p>
      -->
      <a v-if="!item.inplay" v-on:click="activateBidding">Activate Bidding</a>
      <a v-else v-on:click="deactivateBidding">Deactivate Bidding</a>
      <a v-on:click="removeFromAuction">Remove from Auction</a>
    </div>
    <div class="media-body" v-else>
      <h4 class="media-heading">{{artwork.title}}</h4>
      <!--
      <p v-html="artwork.id" v-if="debugMode"></p>
      <p v-html="artwork.saleData" v-if="debugMode"></p>
      <p v-html="artwork.bcitem" v-if="debugMode"></p>
      -->
      <router-link :to="registerUrl" class="artwork-action"  v-if="artwork.bcitem && artwork.bcitem.itemIndex === -1">Register</router-link>
      <a v-if="canSell" v-on:click="openAuctionDialog">Add to Auction</a>
      <sell-via-auction v-if="sellAuctionActive" :artwork="artwork" :isModalActive="true" @closeDialog="closeDialog"/>
    </div>
  </div>
</div>
</template>

<script>
import SellViaAuction from '@/components/artworks/SellViaAuction'
// import peerToPeerService from '@/services/peerToPeerService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleAuctionItem',
  components: { SellViaAuction },
  props: {
    auctionId: null,
    sellingItem: false,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      sellAuctionActive: false
    }
  },
  mounted () {
  },
  methods: {
    removeFromAuction () {
      this.$store.dispatch('myArtworksStore/removeFromAuction', {auctionId: this.auctionId, itemId: this.item.itemId}).then((artwork) => {

      }).catch(e => {
        console.log(e.message)
      })
    },
    activateBidding (value) {
      this.$store.commit('myAuctionsStore/activateItem', {auctionId: this.auctionId, itemId: this.item.itemId})
    },
    deactivateBidding (value) {
      this.$store.commit('myAuctionsStore/activateItem', {auctionId: this.auctionId, itemId: null})
    },
    closeDialog (value) {
      this.sellAuctionActive = false
    },
    openAuctionDialog (value) {
      this.sellAuctionActive = true
    },
  },
  computed: {
    canSell () {
      let artwork = this.$store.getters['myArtworksStore/myArtwork'](this.item.itemId)
      let bcitem = artwork.bcitem
      return (bcitem && bcitem.itemIndex > -1)
    },
    artwork () {
      return this.$store.getters['myArtworksStore/myArtwork'](this.item.itemId)
    },
    registerUrl () {
      return `/my-artworks/register/${this.item.itemId}`
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
  }
}
</script>
