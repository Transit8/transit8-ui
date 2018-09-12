<template>
  <router-link :to="url" :class="[artworkWidth]" class="col-xs-12 grid-item">
    <img :src="artwork.image" :alt="artwork.title">
    <!-- TO DO: in design, artwork caption is artist name -->
    <p class="artwork-caption">{{artwork.caption}}</p>
    <p class="art-title">{{artwork.title}}</p>
    <!--
    <p class="artwork-caption">{{artwork.owner}}</p>
    <p class="artwork-caption">{{artwork.state}}</p>
    -->
    <router-link :to="'provenance/register/'+artwork.id" class="artwork-action" v-if="artwork.showRegistration">Register</router-link>
    <router-link :to="'provenance/edit/'+artwork.id" class="artwork-action" v-if="artwork.showRegistration">Edit</router-link>
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
