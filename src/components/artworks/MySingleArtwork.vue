<template>
<div>
  <div class="row result-item">
    <div class="clearfix">
      <div class="col-sm-2">
        <router-link :to="url">
          <img :src="artwork.image" :alt="artwork.title" class="img-responsive">
        </router-link>
      </div>
      <div class="col-sm-3">
        <!-- TO DO: in design, artwork caption is artist name -->
        <p class="art-title">{{artwork.title}}</p>
        <p class="artwork-caption">{{artwork.description}}</p>
        <p class="artwork-caption">Artist: {{artistProfile.name}}</p>

        <a class="artwork-action" v-if="status === 'new' && !sold" v-on:click="sellRegisterActive = !sellRegisterActive">Register</a>
        <a class="artwork-action" v-if="canSell" v-on:click="sellBuyNowActive = !sellBuyNowActive">Buy</a>
        <a class="artwork-action" v-if="canSell" v-on:click="sellAuctionActive = !sellAuctionActive">Bid</a>
        <router-link :to="editUrl"    class="artwork-action" v-if="editable">Edit</router-link>

        <a class="artwork-action" @click="deleteArtwork(artwork.id)" v-if="debugMode">Delete</a>

        <sell-via-buy-now v-if="sellBuyNowActive" :artwork="artwork" :isModalActive="true" @closeDialog="closeDialog"/>
        <sell-via-auction v-if="sellAuctionActive" :artwork="artwork" :isModalActive="true" @closeDialog="closeDialog"/>
        <sell-via-registering v-if="sellRegisterActive" :artwork="artwork" :isModalActive="true" @closeDialog="closeDialog"/>
      </div>
      <div class="col-sm-7">
        <div v-if="sellingBuyNow">
          <p>Selling by buy now</p>
          Selling For: {{sellingCurrencySymbol}} {{artwork.saleData.amount}} {{sellingCurrency}} / {{valueInEther}} Eth / {{valueInBitcoin}} Btc<br>
        </div>
        <div v-else-if="sellingAuction">
          <p>Selling in auction</p>
          Reserve Set: {{sellingCurrencySymbol}} {{artwork.saleData.reserve}} {{sellingCurrency}} / {{valueReserveInEther}} Eth / {{valueReserveInBitcoin}} Btc<br>
          <router-link :to="manageAuctionUrl">manage auction</router-link> |
          <router-link :to="publicAuctionUrl">public auction view</router-link>
        </div>
        <div v-else>
          <p>Item not selling</p>
        </div>
        <div v-if="debugMode">
          <p class="artwork-caption">Owner: {{artwork.owner}}</p>
          <p class="artwork-caption">Uploader: {{artwork.uploader}}</p>
          <p class="artwork-caption">Artist: {{artwork.artist}}</p>
          <p class="artwork-caption">SaleData: {{artwork.saleData.soid}} / {{artwork.saleData.amount}} {{artwork.saleData.fiatCurrency}} / {{artwork.saleData.amountInEther}}</p>
          <p class="artwork-caption">SaleData.auctionId: {{artwork.saleData.auctionId}}</p>
          <p class="artwork-caption">BCData: {{artwork.bcitem.owner}} / {{artwork.bcitem.price}} / {{artwork.bcitem.priceInFiat}} / {{artwork.bcitem.fiatCurrency}}</p>
          <p class="artwork-caption">Location: {{artwork.gaiaUrl}}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SellViaAuction from './SellViaAuction'
import SellViaBuyNow from './SellViaBuyNow'
import SellViaRegistering from './SellViaRegistering'
import moneyUtils from '@/services/moneyUtils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleArtwork',
  components: { SellViaBuyNow, SellViaAuction, SellViaRegistering },
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
      sellAuctionActive: false,
      sellRegisterActive: false
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
      this.sellRegisterActive = false
    },
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
    sellingBuyNow () {
      return this.artwork.saleData.soid === 1
    },
    sellingAuction () {
      return this.artwork.saleData.soid === 2 && this.artwork.saleData.auctionId > 0
    },
    valueInEther () {
      return moneyUtils.valueInEtherFromWei(this.artwork.bcitem.price)
    },
    valueReserveInEther () {
      return moneyUtils.valueInEther(this.artwork.saleData.fiatCurrency, this.artwork.saleData.reserve)
    },
    valueReserveInBitcoin () {
      return moneyUtils.valueInBitcoin(this.artwork.saleData.fiatCurrency, this.artwork.saleData.reserve)
    },
    valueInBitcoin () {
      return moneyUtils.valueInBitcoinFromWei(this.artwork.bcitem.price)
    },
    sellingCurrency () {
      return this.artwork.saleData.fiatCurrency
    },
    sellingCurrencySymbol () {
      return moneyUtils.currencySymbol(this.artwork.saleData.fiatCurrency)
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
    manageAuctionUrl () {
      return `/my-auctions/manage/${this.artwork.saleData.auctionId}`
    },
    publicAuctionUrl () {
      return `/online-auction/${this.artwork.saleData.auctionId}`
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
