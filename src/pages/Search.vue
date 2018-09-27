<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage mb-0">Search results for: {{ queryString }} ({{numberArtworks}})</h1>
            <results-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ResultsList from '../components/artworks/ResultsList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Search',
  components: { ResultsList },
  data () {
    return {
      queryString: (this.$route && this.$route.params.query) ? parseInt(this.$route.params.query) : undefined,
    }
  },
  created () {
    this.queryString = this.$route.query.title
    if (!this.queryString) {
      this.queryString = '*'
    }
    this.$store.dispatch('artworkSearchStore/fetchSearchArtworks', {term: 'title', query: this.queryString}, {root: true})
  },
  methods: {
  },
  computed: {
    artworks () {
      return this.$store.getters['artworkSearchStore/getArtworks']
    },
    numberArtworks () {
      return this.$store.getters['artworkSearchStore/numberArtworks']
    },
  }

}
</script>
