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
import searchIndexService from '@/services/searchindex/searchIndexService'
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
    this.fetchArtworks()
    this.fetchStories()
    this.fetchSlides()
  },
  methods: {

    /**
     * Fetch most recently registered artworks from ethereum.
     */
    fetchArtworks: function () {
      let $elfist = this
      $elfist.blockchainResults = []
      ethService.fetchNumberOfItems().then((numberOfItems) => {
        for (let index = numberOfItems; index >= numberOfItems - 6; index--) {
          $elfist.index = index
          setTimeout(function timer () {
            // $elfist.index--
            ethService.fetchItemByIndex(index, 0).then((item) => {
              let title = item[0]
              let searched = false
              if (title && title.length > 0) {
                console.log('Blockchain result: ' + title + ' index: ' + index)
                $elfist.blockchainResults.push({index: index, title: title})
                if ($elfist.blockchainResults.length === 6 && !searched) {
                  $elfist.fetchArtwork(index, $elfist.blockchainResults)
                  searched = true
                }
              // $elfist.fetchArtwork(index, item[0])
              }
            })
          }, 250)
        }
      })
    },

    fetchArtwork: function (index, results) {
      let $self = this
      _.forEach(results, function (result) {
        let title = result.title
        console.log('Searching for item with title: ' + result.title + ' index: ' + result.index + ' index: ' + index)
        searchIndexService.searchIndex('art', 'title', '"' + title + '"').then((results) => {
          let indexData = results[0]
          provenanceService.getRecordForSearch(indexData).then((record) => {
            if (record && record.indexData && record.indexData.id) {
              let dataUrl = ''
              if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
                dataUrl = record.provData.artwork[ 0 ].dataUrl
              }
              if (dataUrl && dataUrl.length > 0) {
                provenanceService.getArtistProfile(record).then((profile) => {
                  $self.artworks.push({
                    id: record.indexData.id,
                    title: record.indexData.title,
                    caption: profile.displayName,
                    // caption: record.indexData.uploader,
                    image: dataUrl
                  })
                })
              }
            }
          }).catch(e => {
            console.log('Unable to get from: ', indexData)
          })
        }).catch(e => {
          console.log('Unable to contact search index.', e)
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
