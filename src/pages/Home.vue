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
      let $self = this
      searchIndexService.searchIndex('art', 'title', title)
        .then((results) => {
          $self.provenanceRecords = []
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                if (record && record.indexData && record.indexData.id) {
                  $self.provenanceRecords[ index ] = record
                  let dataUrl = ''
                  if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
                    dataUrl = record.provData.artwork[ 0 ].dataUrl
                  }
                  $self.artworks.push({
                    id: record.indexData.id,
                    title: record.indexData.title,
                    caption: record.indexData.uploader,
                    image: dataUrl
                  })
                  // $self.$emit('update:numbResults', $self.provenanceRecords.length)
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
