<template>
  <router-link :to="url" :class="[artworkWidth]" class="col-xs-12 grid-item">
    <img :src="artwork.image" :alt="artwork.title">
    <p class="artwork-caption">{{artwork.caption}}</p>
    <p class="art-title">{{artwork.title}}</p>
    <router-link :to="'provenance/register/'+artwork.id" class="artwork-action" v-if="artwork.showRegistration">Register</router-link>
    <router-link :to="artwork.id" class="artwork-action" v-if="artwork.forSale">Buy</router-link>
    <router-link :to="artwork.id" class="artwork-action" v-if="artwork.forAuction">Bid</router-link>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtwork',
  props: {
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
  computed: {
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    url () {
      return `/artworks/${this.artwork.id}`
    }
  }
}
</script>
