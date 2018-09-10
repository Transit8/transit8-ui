<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">My Artworks <span>Artworks added: {{artworks.length}}</span></h1>
          <div class="container-fluid footer-bottom">
            <div class="col-sm-12">
              <artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArtworksList from '../components/artworks/ArtworksList'
import provenanceService from '@/services/provenance/ProvenanceService'
// import ProvenanceItemBar from '@/components/provenance/ProvenanceItemBar'
import exchangeRatesService from '@/services/exchangeRatesService'
import _ from 'lodash'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworks',
  components: { ArtworksList },
  data () {
    return {
      artworks: []
    }
  },
  mounted () {
    console.log('Running App version ', process.env)
    let $elfist = this
    provenanceService.getProvenanceRecordsInLS().then((provenanceRecords) => {
      $elfist.provenanceRecords = provenanceRecords
      $elfist.numbResults = $elfist.provenanceRecords.length
      _.forEach(provenanceRecords, function (record) {
        let dataUrl = '/static/images/artwork1.jpg'
        if (record.provData && record.provData.artwork && record.provData.artwork.length > 0) {
          dataUrl = record.provData.artwork[0].dataUrl
        }
        $elfist.artworks.push({
          id: record.indexData.id,
          caption: record.indexData.uploader,
          image: dataUrl,
          title: record.indexData.title,
          showRegistration: true,
          // forSale: record.indexData.saleData.soid === 1,
          // forAuction: record.indexData.saleData.soid === 2,
        })
      })
    })

    this.userData = provenanceService.getUserData()
    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
    })
    exchangeRatesService.fetchCoinPair('eth_btc').then((ethToBtc) => {
      this.ethToBtc = ethToBtc
    })
  },

}
</script>
