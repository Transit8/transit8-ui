<template>
  <div>
    <form class="search-form col-md-6 col-md-offset-2 col-sm-12 col-sm-offset-0 col-xs-12" @submit.prevent="submit()">
      <input type="text" class="form-control" placeholder="Search" v-model="queryString">
      <button type="submit"><span class="icon-search"></span></button>
    </form>
    <section id="pdp-slider" class="pb-0 black-bg white pdp-slider pt-60 pb-60">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-6 clearfix">
            <div class="pull-left">
              <h1 class="product-title">{{myArtist.name}}, {{myArtwork.title}}</h1>
            </div>
          </div>
          <div class="col-xs-6 grid-item">
            <img :src="myArtwork.image" :alt="myArtwork.title">
          </div>
        </div>
      </div>
    </section>
    <!-- /#pdp slider -->
    <register-artwork-form :artwork="myArtwork" :artist="myArtist" @register-artwork="registerArtwork()" v-if="showRegister"/>
    <set-price-artwork-form :artwork="myArtwork" @set-price="setPriceArtwork()" v-if="showPricing"/>

  </div>
</template>

<script>
import ArtworkSlider from '../components/artworks/ArtworkSlider'
import ArtworkSliderControls from '../components/artworks/ArtworkSliderControls'
import RegisterArtworkForm from '../components/artworks/RegisterArtworkForm'
import SetPriceArtworkForm from '../components/artworks/SetPriceArtworkForm'

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
    }
  },
  created () {
    this.artworkId = Number(this.$route.params.artworkId)
  },
  computed: {
    showRegister () {
      let myArtwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      let userProfile = this.$store.getters['myAccountStore/getProfile']
      return (myArtwork.timestamp && myArtwork.timestamp.length > 0 && userProfile.username === myArtwork.ownerUid)
    },
    showPricing () {
      let myArtwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      return myArtwork.blockchain
    },
    myArtwork () {
      return this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
    },
    myArtist () {
      let myArtwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      return this.$store.getters['userProfilesStore/getProfile'](myArtwork.artistUid)
    },
  },
  methods: {
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
