<template>
  <div>
    <section id="pdp-slider" class="pb-0 black-bg white pdp-slider pt-60 pb-60">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 clearfix">
            <div class="pull-left">
              <h1 class="product-title">{{artist.name}}, {{artwork.name}}</h1>
              <p class="mb-0">
                <register-artwork-form :artwork="artwork" :artist="artist" @register-artwork="registerArtwork()" v-if="showRegister"/>
                <set-price-artwork-form :record="record" @set-price="setPriceArtwork()" v-if="showSetPrice"/>
              </p>
            </div>
             <artwork-slider-controls :images="artwork.images" @change="sliderImageChanged($event)"
                                     :image-displayed="sliderImage"/>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-8 col-sm-offset-2 pt-80">
            <img :src="artwork.image" :alt="artwork.title" class="img-responsive">
            <artwork-slider :images="artwork.images" :image-num="sliderImage" @change="sliderImageChanged($event)"/>
          </div>
        </div>
      </div>
    </section>
    <!-- /#pdp slider -->

  </div>
</template>

<script>
import ArtworkSlider from '../components/artworks/ArtworkSlider'
import ArtworkSliderControls from '../components/artworks/ArtworkSliderControls'
import RegisterArtworkForm from '../components/artworks/RegisterArtworkForm'
import SetPriceArtworkForm from '../components/artworks/SetPriceArtworkForm'
import provenanceService from '@/services/provenance/provenanceService'
import ethService from '@/services/experimental/ethApiService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artwork',
  components: {
    ArtworkSliderControls,
    ArtworkSlider,
    RegisterArtworkForm,
    SetPriceArtworkForm,
  },
  data () {
    return {
      sliderImage: 0,
      record: {},
      artist: {},
      artwork: {},
      showSetPrice: false,
      showRegister: false,
    }
  },

  mounted () {
    let recordId = this.$route.params.artworkId
    provenanceService.loadMyArtwork(recordId, this.loadMyArtwork)
  },
  methods: {
    loadMyArtwork: function (record) {
      let $self = this
      this.record = record
      this.artist = provenanceService.getUserProfile(record.indexData.uploader)
      if (record.provData.artwork && record.provData.artwork.length > 0 && record.provData.artwork[0].dataUrl) {
        $self.showRegister = true
      }
      this.artwork = {
        id: record.indexData.id,
        name: record.indexData.title,
        caption: this.artist.name,
        timestamp: record.indexData.timestamp,
        saleData: record.indexData.saleData,
        image: (record.provData.artwork && record.provData.artwork[0].dataUrl) ? record.provData.artwork[0].dataUrl : '/static/images/artwork1.jpg'
      }
      ethService.fetchArtworkByHash(record.indexData.timestamp, function (data) {
        if (data && !data.failed) {
          $self.artwork.scData = data
          $self.showSetPrice = true
          $self.showRegister = false
        }
      })
    },

    scrollToAboutSection () {
      const element = this.$refs.about
      const top = element.$el.offsetTop

      window.scrollTo(0, top)
    },

    sliderImageChanged (imageNum) {
      this.sliderImage = imageNum
    }
  }
}
</script>
