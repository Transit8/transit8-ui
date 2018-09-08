<template>
  <div>
    <!-- Content -->
    <slider :slides="slides"/>
    <last-artworks :artworks="artworks"/>
    <div class="divider"></div>
    <latest-stories :stories="stories"/>
    <!-- /Content-->
    <tipe-content class="page"/>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
import Slider from '../components/home/Slider'
import LastArtworks from '../components/home/LastArtworks'
import LatestStories from '../components/home/LatestStories'
import TipeContent from '@/components/home/TipeContent'
import ethService from '@/services/experimental/ethApiService'
import provenanceService from '@/services/provenance/ProvenanceService'
import searchIndexService from '@/services/searchindex/SearchIndexService'
import _ from 'lodash'

export default {
  name: 'Home',
  components: { LatestStories, LastArtworks, Slider, TipeContent },
  data () {
    return {
      stories: [
        { id: '', image: '/static/images/artwork2.jpg', title: 'Story Title' },
        { id: '', image: '/static/images/artwork2.jpg', title: 'Story Title 2' },
        { id: '', image: '/static/images/artwork2.jpg', title: 'Story Title 3' },
      ],
      artworks: [
        { id: '', image: '/static/images/artwork1.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork2.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork3.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork4.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork5.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork6.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
      ],
      slides: [
        { image: '/static/images/slider.jpg', title: 'Title 1', subtitle: 'Subtitle 1', url: '#' },
        { image: '/static/images/slider.jpg', title: 'Title 2', subtitle: 'Subtitle 2', url: '#' },
        // { image: '/static/images/slider.jpg', title: 'Title 3', subtitle: 'Subtitle 3', url: '#' },
      ]
    }
  },
  mounted () {
    let $elfie = this
    $elfie.registrations = []
    ethService.fetchNumbRegistrations().then((numbRegistrations) => {
      this.numbRegistrations = numbRegistrations
      for (let index = numbRegistrations; index > (numbRegistrations - 6); index--) {
        if (index < 0) {
          break
        }
        $elfie = this
        ethService.fetchItemByIndex(index, 1).then((item) => {
          console.log('index: ' + index, item)
          $elfie.searchIndex(index, item[0])
        })
        // setTimeout(function timer () {
        // }, 200)
      }
    })
  },
  methods: {
    searchIndex: function (index, title) {
      let $elfie = this
      searchIndexService.searchIndex('art', 'title', title)
        .then((results) => {
          $elfie.provenanceRecords = []
          console.log('Total records found in search (may differ from number fetched from gaia storage): ' + results.length)
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                console.log('Record: ' + record)
                if (record && record.indexData && record.indexData.id) {
                  $elfie.provenanceRecords[index] = record
                  $elfie.artworks[index].id = record.indexData.id
                  $elfie.artworks[index].title = record.indexData.title
                  $elfie.artworks[index].caption = record.indexData.uploader
                  if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
                    $elfie.artworks[index].image = record.provData.artwork[0].dataUrl
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
  },
}
</script>
