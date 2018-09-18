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
    <div v-if="artwork.canRegister">
      <router-link :to="registerUrl" class="artwork-action" v-if="!canSetPrice">Register</router-link>
      <router-link :to="registerUrl" class="artwork-action" v-else>Set Price</router-link>
    </div>
    <router-link :to="editUrl" class="artwork-action">Edit</router-link>
    <router-link :to="url" class="artwork-action" v-if="artwork.forSale">Buy</router-link>
    <router-link :to="url" class="artwork-action" v-if="artwork.forAuction">Bid</router-link>
  </router-link>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleArtwork',
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
  data () {
    return {
      canSetPrice: false
    }
  },
  mounted () {
    let $self = this
    ethService.fetchArtworkByHash(this.artwork.timestamp, function (data) {
      if (data && !data.failed) {
        $self.canSetPrice = true
      }
    })
  },
  computed: {
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    registerUrl () {
      return `/my-artworks/${this.artwork.id}`
    },
    editUrl () {
      return `/provenance/edit/${this.artwork.id}`
    },
    url () {
      return `/artworks/${this.artwork.id}`
    }
  }
}
</script>
