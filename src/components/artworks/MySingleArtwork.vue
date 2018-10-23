<template>
  <div>
    <div class="">
      <div class="col-xs-12 grid-item">
        <router-link :to="url" :class="[artworkWidth]">
          <img :src="artwork.image" :alt="artwork.title">
        </router-link>
        <!-- TO DO: in design, artwork caption is artist name -->
        <p class="art-title">{{artwork.title}}</p>
        <p class="artwork-caption">{{artwork.description}}</p>
        <p class="artwork-caption">Artist: {{artistProfile.name}}</p>

        <router-link :to="registerUrl" class="artwork-action"  v-if="status === 'new' && !sold">Register</router-link>
        <!-- <router-link :to="setPriceUrl" class="artwork-action"  v-if="status !== 'new' && !sold">Set Price</router-link> -->
        <a class="artwork-action" v-if="canSellBuyNow" v-on:click="openBuyNowDialog">Buy</a>
        <a class="artwork-action" v-if="canSell" v-on:click="openAuctionDialog">Bid</a>
        <router-link :to="editUrl"    class="artwork-action" v-if="editable">Edit</router-link>
        <router-link :to="auctionUrl" class="artwork-action" v-if="artwork.saleData.auctionId">Auction</router-link>

        <sell-via-buy-now v-if="sellBuyNowActive" :artwork="artwork" :isModalActive="true" @closeDialog="closeDialog"/>
        <sell-via-auction v-if="sellAuctionActive" :artwork="artwork" :isModalActive="true" @closeDialog="closeDialog"/>

        <br/>
        <div v-if="debugMode">
            <p class="artwork-caption">Owner: {{artwork.owner}}</p>
            <p class="artwork-caption">Uploader: {{artwork.uploader}}</p>
            <p class="artwork-caption">Artist: {{artwork.artist}}</p>
            <p class="artwork-caption">SaleData: {{artwork.saleData.soid}} / {{artwork.saleData.amount}} {{artwork.saleData.fiatCurrency}} / {{artwork.saleData.amountInEther}}</p>
            <p class="artwork-caption">SaleData.auctionId: {{artwork.saleData.auctionId}}</p>
            <p class="artwork-caption">BCData: {{artwork.bcitem.owner}} / {{artwork.bcitem.price}} / {{artwork.bcitem.priceInFiat}} / {{artwork.bcitem.fiatCurrency}}</p>
            <p class="artwork-caption">Location: {{artwork.gaiaUrl}}</p>
        </div>
        <button class="button" @click="deleteArtwork(artwork.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import SellViaAuction from './SellViaAuction'
import SellViaBuyNow from './SellViaBuyNow'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleArtwork',
  components: { SellViaBuyNow, SellViaAuction },
  props: {
    sold: true,
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      sellBuyNowActive: false,
      sellAuctionActive: false
    }
  },
  mounted () {
  },
  methods: {
    deleteArtwork (id) {
      this.$store.dispatch('myArtworksStore/deleteMyArtwork', id)
    },
    closeDialog (value) {
      this.sellBuyNowActive = false
      this.sellAuctionActive = false
    },
    openAuctionDialog (value) {
      this.sellBuyNowActive = false
      this.sellAuctionActive = true
    },
    openBuyNowDialog (value) {
      this.sellBuyNowActive = true
      this.sellAuctionActive = false
    }
  },
  computed: {
    editable (id) {
      return this.$store.getters['myArtworksStore/editable'](this.artwork.id)
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    canSell () {
      let bcitem = this.artwork.bcitem
      return (bcitem && bcitem.itemIndex > -1 && !this.sold)
    },
    canSellBuyNow () {
      let bcitem = this.artwork.bcitem
      let canBuyNow = (bcitem && bcitem.itemIndex > -1 && !this.sold)
      return canBuyNow && !this.artwork.saleData.auctionId
    },
    status () {
      return this.$store.getters['myArtworksStore/bcstatus'](this.artwork.id)
    },
    artistProfile () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.artist)
    },
    ownerProfile () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.owner)
    },
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    registerUrl () {
      return `/my-artworks/register/${this.artwork.id}`
    },
    auctionUrl () {
      return `/my-auctions/manage/${this.artwork.saleData.auctionId}`
    },
    setPriceUrl () {
      return `/my-artworks/set-price/${this.artwork.id}`
    },
    editUrl () {
      return `/my-artwork/update/${this.artwork.id}`
    },
    url () {
      return `/artworks/${this.artwork.id}`
    }
  }
}
</script>
