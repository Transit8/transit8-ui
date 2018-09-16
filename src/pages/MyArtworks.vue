<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">My Artworks <span>Artworks added: {{artworks.length}}</span></h1>
          <artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
          <h1 class="innerpage mt-50">Sold Artworks <span>Artworks sold: {{soldArtworks.length}}</span></h1>
          <artworks-list :artworks="soldArtworks" :show-load-button="false" :chunks="6"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArtworksList from '../components/artworks/ArtworksList'
import provenanceService from '@/services/provenance/provenanceService'
import exchangeRatesService from '@/services/exchangeRatesService'
import Promise from 'bluebird'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworks',
  components: { ArtworksList },
  data () {
    return {
      artworks: [],
      soldArtworks: []
    }
  },
  mounted () {
    const $self = this
    const userData = provenanceService.getUserData()
    provenanceService.getProvenanceRecordsInLS().then((records) => {
      Promise.each(records, function (record) {
        return provenanceService.getRecordFromSearchIndexById(record.indexData.id)
          .then((result) => {
            console.log('result++++', result)

            const artworkData = {
              image: result.provData.artwork[0].dataUrl,
              title: result.indexData.title,
              caption: result.scData[1],
              id: result.indexData.id.toString(),
              forSale: result.indexData.saleData.soid === 1,
              forAuction: result.indexData.saleData.soid === 2,
              showRegistration: true,
            }

            if (result.scData[1] === userData.username) {
              $self.artworks.push(artworkData)
            } else {
              $self.soldArtworks.push(artworkData)
            }
          })
      })
    })

    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
    })

    exchangeRatesService.fetchCoinPair('eth_btc').then((ethToBtc) => {
      this.ethToBtc = ethToBtc
    })
  },

}
</script>
