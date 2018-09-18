<template>
  <router-link :to="url" class="grid-item">
    <img :src="artist.image" :alt="artist.title">
    <p class="artwork-caption mt-30">{{artist.title}}</p>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtist',
  props: {
    artist: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    url () {
      return '/artists/' + this.artist.id
    }
  }
}
</script>
