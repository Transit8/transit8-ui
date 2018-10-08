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
        <p class="artwork-caption">Owner: {{ownerProfile.name}}</p>
        <router-link :to="registerUrl" class="artwork-action"  v-if="status === 'new' && !sold" >Register</router-link>
        <router-link :to="setPriceUrl" class="artwork-action"  v-if="status !== 'new' && !sold">Set Price</router-link>
        <router-link :to="editUrl" class="artwork-action" v-if="editable">Edit</router-link>
        <router-link :to="url" class="artwork-action" v-if="artwork.forSale">Buy</router-link>
        <router-link :to="url" class="artwork-action" v-if="artwork.forAuction">Bid</router-link>
        <br/>
        <div v-if="debugMode">
            <p class="art-title">Owner: {{artwork.owner}}</p>
            <p class="artwork-caption">Uploader: {{artwork.uploader}}</p>
            <p class="artwork-caption">Artist: {{artwork.artist}}</p>
            <p class="artwork-caption">SaleData: {{artwork.saleData.soid}} / {{artwork.saleData.amount}} {{artwork.saleData.fiatCurrency}} / {{artwork.saleData.amountInEther}}</p>
            <p class="artwork-caption">BCData: {{artwork.bcitem.owner}} / {{artwork.bcitem.price}}</p>
            <p class="artwork-caption">Location: {{artwork.gaiaUrl}}</p>
        </div>
        <button class="button" @click="deleteArtwork(artwork.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleArtwork',
  props: {
    debugMode: false,
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
    }
  },
  mounted () {
  },
  methods: {
    deleteArtwork (id) {
      this.$store.dispatch('myArtworksStore/deleteMyArtwork', id)
    }
  },
  computed: {
    editable (id) {
      return this.$store.getters['myArtworksStore/editable'](this.artwork.id)
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
