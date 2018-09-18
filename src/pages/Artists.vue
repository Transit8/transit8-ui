<template>
  <section class="light-gray-bg black">
    <div class="container wide pt-120">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="h4">Artists at Sybella</h2>
        </div>
        <div class="col-sm-12 pt-75 pt-30m">
          <artists-list :artists="artists"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArtistsList from '../components/artists/ArtistsList'
import ethService from '@/services/experimental/ethApiService'
import provenanceService from '@/services/provenance/provenanceService'
import _ from 'lodash'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artists',
  components: { ArtistsList },
  data () {
    return {
      artists: []
    }
  },

  mounted () {
    this.loadArtworks(50)
  },

  methods: {

    loadArtworks: function (numberToLoad) {
      ethService.loadArtworks(numberToLoad, this.loadArtwork)
    },

    loadArtwork: function (blockchainItem) {
      let $self = this
      provenanceService.findArtworkFromBlockChainData(blockchainItem, function (record) {
        let index = _.findIndex($self.artists, {title: record.profile.name})
        if (index === -1) {
          let blockstackId = record.indexData.uploader.replace(/\./g, '_')
          $self.artists.push({
            id: blockstackId,
            title: record.profile.name,
            image: record.profile.image
          })
        }
      })
    },

    updateFilters (filters) {
      this.filters = filters
    },
    loadMore () {
      //
    }
  }
}
</script>
