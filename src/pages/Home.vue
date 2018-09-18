<template>
  <div>
    <!-- Content -->
    <slider :slides="slides"/>
    <last-artworks :artworks="artworks"/>
    <div class="divider"></div>
    <latest-stories :stories="stories"/>
    <!-- /Content-->
  </div>
</template>

<script>
import Slider from '../components/home/Slider'
import LastArtworks from '../components/home/LastArtworks'
import LatestStories from '../components/home/LatestStories'
import ethService from '@/services/experimental/ethApiService'
import provenanceService from '@/services/provenance/provenanceService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Home',
  components: { LatestStories, LastArtworks, Slider },
  data () {
    return {
      stories: [],
      artworks: [],
      slides: []
    }
  },
  mounted () {
    this.loadArtworks(6)
    this.fetchStories()
    this.fetchSlides()
  },
  methods: {

    loadArtworks: function (numberToLoad) {
      this.artworks = []
      ethService.loadArtworks(numberToLoad, this.loadArtwork)
    },

    loadArtwork: function (blockchainItem) {
      let $self = this
      provenanceService.findArtworkFromBlockChainData(blockchainItem, function (record) {
        $self.artworks.push({
          id: record.indexData.id,
          title: record.indexData.title,
          caption: record.profile.name,
          // caption: record.indexData.uploader,
          image: record.image
        })
      })
    },

    /**
     * Fetch 3 stories from prismic CMS
     */
    fetchStories () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'stories'),
        { orderings: '[document.last_publication_date desc]', pageSize: 3 }
      ).then((response) => {
        this.stories = response.results
      })
    },

    /**
     * Fetch 10 slides from prismic CMS
     */
    fetchSlides () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'slides'),
        { orderings: '[document.last_publication_date desc]', pageSize: 10 }
      ).then((response) => {
        this.slides = response.results
      })
    }
  },
}
</script>
