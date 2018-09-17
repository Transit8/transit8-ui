<template>
  <!-- Content -->
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">Explore & Collect Art on Sybella</h1>
        </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-lg-4">
            <filters @update="updateFilters($event)"/>
          </div>
          <div class="col-sm-12 col-lg-7 col-lg-offset-1">
            <div class="hr-spacer hr-mobile-spacer mb-100"></div>
            <h5 class="grey-medium normal-weight">{{artworks.length}} Artworks for sale</h5>
            <artworks-list :artworks="artworks" @load-more="loadMore()" />
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import Filters from '../components/artworks/Filters'
import ArtworksList from '../components/artworks/ArtworksList'
import ethService from '@/services/experimental/ethApiService'
import provenanceService from '@/services/provenance/provenanceService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artworks',
  components: { ArtworksList, Filters },
  data () {
    return {
      artworks: [],
      filters: {}
    }
  },
  mounted () {
    this.loadArtworks(9)
  },
  methods: {
    loadArtworks: function (numberToLoad) {
      ethService.loadArtworks(numberToLoad, this.loadArtwork)
    },

    loadArtwork: function (blockchainItem) {
      let $self = this
      provenanceService.findArtworkFromBlockChainData(blockchainItem, function (record) {
        let saleData = record.indexData.saleData
        $self.artworks.push({
          id: String(record.indexData.id),
          title: record.indexData.title,
          caption: record.profile.displayName,
          // caption: record.indexData.uploader,
          forSale: (saleData && saleData.soid === 1),
          forAuction: (saleData && saleData.soid === 2),
          image: record.image
        })
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
