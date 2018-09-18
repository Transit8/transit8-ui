<template>
  <section id="artworks">
    <div class="container wide pt-80">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="section-title">Artworks at Sybella</h2>
        </div>
      </div>
      <div class="row" v-for="(artworkChunked, index) of artworksChunked" :key="index">
        <div class="grid">
          <div class="grid-sizer"></div>
          <last-artwork v-for="(artwork, index) in artworkChunked" :key="index" :artwork="artwork"/>
        </div>
      </div>
    </div>
  </section>
  <!-- /#artworks-->
</template>

<script>
import chunk from 'lodash/chunk'
import LastArtwork from './LastArtwork'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LastArtworks',
  components: { LastArtwork },
  props: {
    artworks: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    artworksChunked () {
      return chunk(this.artworks, 3)
    }
  }
}
</script>
