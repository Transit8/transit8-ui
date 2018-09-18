<template>
  <div>
    <section class="white-bg black">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 pt-120">
            <artist-details :artist="artist"/>
          </div>
        </div>
      </div>
    </section>
    <div class="divider"></div>
    <section>
      <div class="container wide pt-60">
        <div class="row">
          <div class="col-sm-12">
            <h2 class="h4 mb-50">All artworks by {{artist.name}}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12" id="artist-all-artworks">
            <artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ArtistDetails from '../components/artists/ArtistDetails'
import SingleArtwork from '../components/artworks/SingleArtwork'
import ArtworksList from '../components/artworks/ArtworksList'
import provenanceService from '@/services/provenance/provenanceService'
import ethService from '@/services/experimental/ethApiService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: { ArtworksList, SingleArtwork, ArtistDetails },
  data () {
    return {
      artist: {
        name: 'Artist Name',
        description: 'Born in Osaka in 1978, Hiroe Saeki graduated from the Faculty of Fine Art, Kyoto Seika University in 2001.<br />Making her debut at the exhibition held at Taka Ishii Gallery in 2004, Saeki won the VOCA Encouragement Prize and held her first overseas solo exhibition at Galerie Almine Rech in Paris, in 2006.',
        image: '/static/images/artist_preview.png',
      },
      artworks: []
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
      let artistId = this.$route.params.artistId
      let blockstackId = artistId.replace(/_/g, '.')
      let found = false
      provenanceService.findArtworkFromBlockChainData(blockchainItem, function (record) {
        if (record.indexData.uploader === blockstackId) {
          if (!found) {
            $self.artist = {
              id: blockstackId,
              name: record.profile.name,
              description: record.profile.description,
              image: record.profile.image
            }
          }
          found = true
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
        }
      })
    },
  }
}
</script>
