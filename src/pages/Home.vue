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
    this.fetchArtworks()
    this.fetchStories()
    this.fetchSlides()
  },
  methods: {

    /**
     * Fetch most recently registered artworks from ethereum.
     */
    fetchArtworks () {
      let $elfie = this
      $elfie.blockchainResults = []
      ethService.fetchNumberOfItems().then((numberOfItems) => {
        this.numberOfItems = numberOfItems
        for (let index = numberOfItems; index > 0; index--) {
          ethService.fetchItemByIndex(index, 0).then((item) => {
            let title = item[0]
            let searched = false
            if (title && title.length > 0) {
              console.log('Blockchain result: ' + title + ' owner: ' + item[1])
              $elfie.blockchainResults.push({index: index, title: item[0]})
              if ($elfie.blockchainResults.length === 6 && !searched) {
                $elfie.fetchArtwork(index, $elfie.blockchainResults)
                searched = true
              }
              // $elfie.fetchArtwork(index, item[0])
            }
          })
        }
        /*
        $elfie.index = -1
        setTimeout(function timer () {
          $elfie.index++
          ethService.fetchItemByIndex($elfie.index).then((item) => {
            let title = item[0]
            console.log('Blockchain result: ' + title + ' owner: ' + item[1])
            if (title && title.length > 0) {
              if (index < 7) {
                $elfie.blockchainResults.push({index: index, title: item[0]})
              }
              if ($elfie.blockchainResults.length === 6) {
                $elfie.fetchArtwork(index, $elfie.blockchainResults)
              }
            }
          })
        }, 500)
        */
      })
    },

    fetchArtwork: function (index, results) {
      let $self = this
      _.forEach(results, function (result) {
        let title = result.title
        searchIndexService.searchIndex('art', 'title', '"' + title + '"').then((results) => {
          console.log('Searching for item with title found: ', results)
          let indexData = results[0]
          provenanceService.getRecordForSearch(indexData).then((record) => {
            if (record && record.indexData && record.indexData.id) {
              let dataUrl = ''
              if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
                dataUrl = record.provData.artwork[ 0 ].dataUrl
              }
              if (dataUrl && dataUrl.length > 0) {
                $self.artworks.push({
                  id: record.indexData.id,
                  title: record.indexData.title,
                  caption: record.indexData.uploader,
                  image: dataUrl
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
