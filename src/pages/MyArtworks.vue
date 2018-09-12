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
import provenanceService from '@/services/provenance/ProvenanceService'
import exchangeRatesService from '@/services/exchangeRatesService'
import _ from 'lodash'

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
    let $self = this
    provenanceService.getProvenanceRecordsInLS().then((records) => {
      _.forEach(records, function (record) {
        try {
          let artwork = provenanceService.convertToArtwork(record)
          if (record.indexData.regData && record.indexData.regData.state === 130) {
            $self.soldArtworks.push(artwork)
          } else {
            $self.artworks.push(artwork)
          }
        } catch (e) {
          console.log('Skipping record: ', e)
        }
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
