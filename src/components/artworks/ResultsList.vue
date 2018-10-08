<template>
  <div>
    <div v-for="(chunkedArtwork, index) of chunkedArtworks" :key="index">
    <single-result v-for="(artwork, index) of chunkedArtwork" :key="index" :artwork="artwork"
                    :width="artworkWidth" :debugMode="debugMode"/>
    </div>
    <button v-if="showLoadButton" class="button btn btn-load" id="load-more" @click.prevent="loadMore()">
      Load more
    </button>
  </div>
</template>

<script>
import chunk from 'lodash/chunk'
import SingleResult from './SingleResult'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ResultsList',
  components: { SingleResult },
  props: {
    debugMode: false,
    artworks: {
      type: Array,
      default () {
        return []
      }
    },
    chunks: {
      type: Number,
      default: 3
    },
    showLoadButton: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    loadMore () {
      this.$emit('load-more')
    }
  },
  computed: {
    chunkedArtworks () {
      return chunk(this.artworks, this.chunks)
    },
    artworkWidth () {
      return 12 / this.chunks
    }
  }
}
</script>
