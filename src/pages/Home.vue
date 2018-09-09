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
import provenanceService from '@/services/provenance/ProvenanceService'
import searchIndexService from '@/services/searchindex/SearchIndexService'
import _ from 'lodash'

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
    let $elfie = this
    $elfie.registrations = []
    ethService.fetchNumberOfItems().then((numberOfItems) => {
      this.numberOfItems = numberOfItems
      for (let index = numberOfItems; index > (numberOfItems - 6); index--) {
        if (index < 0) {
          break
        }
        $elfie = this
        ethService.fetchItemByIndex(index, 0).then((item) => {
          $elfie.searchIndex(index, item[0])
        })
      }
    })

    this.fetchStories()
    this.fetchSlides()
  },
  methods: {
    searchIndex: function (index, title) {
      let $elfie = this
      searchIndexService.searchIndex('art', 'title', title)
        .then((results) => {
          $elfie.provenanceRecords = []
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                if (record && record.indexData && record.indexData.id) {
                  $elfie.provenanceRecords[ index ] = record
                  $elfie.artworks[ index ].id = record.indexData.id
                  $elfie.artworks[ index ].title = record.indexData.title
                  $elfie.artworks[ index ].caption = record.indexData.uploader
                  if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
                    $elfie.artworks[ index ].image = record.provData.artwork[ 0 ].dataUrl
                  }
                  // $elfie.$emit('update:numbResults', $elfie.provenanceRecords.length)
                }
              })
              .catch(e => {
                console.log('Unable to get from: ', indexData)
              })
          })
        })
        .catch(e => {
          console.log('Unable to contact search index.', e)
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
