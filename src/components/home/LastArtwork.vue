<template>
  <router-link :to="'artworks/'+artwork.id" class="col-sm-4 col-xs-12 grid-item">
    <img :src="artwork.image" :alt="artwork.title">
    <p class="artwork-caption">{{artwork.description}}</p>
    <p class="art-title">{{artwork.title}}</p>
    <p class="art-title" v-if="debugMode">{{artwork.bcitem.itemIndex}}</p>
    <p class="art-title" v-if="debugMode">Artist: {{artwork.artist}}</p>
    <p class="art-title" v-if="debugMode">Owner: {{artwork.owner}}</p>
  </router-link>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LastArtwork',
  props: {
    artwork: {
      type: Object,
      required: true,
    }
  },
  computed: {
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
  }
}
</script>
