<template>
  <div>
    <section id="pdp-slider" class="pb-0 black-bg white pdp-slider pt-60 pb-60">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 clearfix">
            <div class="pull-left">
              <h1 class="product-title">{{artist.name}}, {{artwork.title}}</h1>
              <p class="mb-0">
                1/1 Edition, {{artwork.description}}<br/>
                <a href="#" @click.prevent="scrollToAboutSection()"><u>About artwork</u></a>
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

    <buy-artwork-form :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()" v-if="forSale"/>
    <bid-artwork-form :purchaseState="purchaseState" :artwork="artwork" @bid="bidArtwork($event)" v-if="forAuction"/>
    <!-- /#pdp-action -->

    <about-artwork :aboutArtwork="aboutArtwork" ref="about"/>
    <!-- /#about-artwork-->

    <div class="divider divider-white"></div>
    <about-artist :artist="artist"/>
    <!-- /#about-artist-->

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
import ArtworksList from '../components/artworks/ArtworksList'
import AboutArtist from '../components/artists/AboutArtist'
import AboutArtwork from '../components/artworks/AboutArtwork'
import BuyArtworkForm from '../components/artworks/BuyArtworkForm'
import BidArtworkForm from '../components/artworks/BidArtworkForm'
import ArtworkSlider from '../components/artworks/ArtworkSlider'
import ArtworkSliderControls from '../components/artworks/ArtworkSliderControls'
import ethereumService from '@/services/ethereumService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artwork',
  components: {
    ArtworkSliderControls,
    ArtworkSlider,
    BidArtworkForm,
    BuyArtworkForm,
    AboutArtwork,
    AboutArtist,
    ArtworksList,
  },
  data () {
    return {
      message: '',
      sliderImage: 0,
    }
  },
  created () {
    this.artworkId = Number(this.$route.params.artworkId)
    this.$store.dispatch('artworkSearchStore/fetchArtwork', this.artworkId)
  },
  computed: {
    artist () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.artist)
    },
    artwork () {
      return this.$store.getters['artworkSearchStore/getArtwork'](this.artworkId)
    },
    forSale () {
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.artworkId)
      if (artwork.bcitem && artwork.saleData) {
        return (artwork.bcitem.itemIndex > -1 && artwork.bcitem.price > 0 && artwork.saleData.soid === 1)
      } else {
        return false
      }
    },
    forAuction () {
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.artworkId)
      if (artwork.bcitem && artwork.saleData) {
        return (artwork.bcitem.itemIndex > -1 && artwork.bcitem.price > 0 && artwork.saleData.soid === 2)
      } else {
        return false
      }
    },
    aboutArtwork () {
      let artist = this.$store.getters['userProfilesStore/getProfile'](this.artwork.artist)
      let owner = this.$store.getters['userProfilesStore/getProfile'](this.artwork.owner)
      return {
        artist: artist,
        owner: owner,
        title: this.artwork.title,
        keywords: this.artwork.keywords,
        year: this.artwork.year,
        image: this.artwork.image
      }
    },
    purchaseState () {
      let username = this.$store.getters['myAccountStore/getMyProfile'].username
      let ownedBySomeElse = this.artwork.owner !== username
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.artworkId)
      let priceSet = artwork.bcitem.price > 0
      let forSale = artwork.saleData.soid === 1
      let purchaseState = {
        canBuy: (forSale && priceSet && ownedBySomeElse)
      }
      return purchaseState
    },
    artworks () {
      return this.$store.getters['artworkSearchStore/getArtworksByArtist'](this.artwork.artist)
    },
  },
  mounted () {
  },
  methods: {
    buyArtwork () {
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.artworkId)
      let seller = artwork.owner
      let buyer = this.$store.getters['myAccountStore/getMyProfile'].username
      if (!buyer || !seller || buyer === seller) {
        return
      }
      ethereumService.buy(this.artwork.title, seller, buyer).then((item) => {
        console.log('buying item ********', item)
        if (item.failed !== true) {
          this.record.indexData.gaiaUrl = null
          this.record.indexData.appUrl = null
          this.record.indexData.owner = buyer

          if (!this.record.provData.owners) {
            this.record.provData.owners = [{
              owner: this.record.indexData.uploader,
              saleData: this.record.indexData.saleData,
            }]
          }
          this.record.provData.owners.push({
            owner: this.record.indexData.owner,
            saleData: this.record.indexData.saleData,
          })

          this.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
            this.message = 'User storage has been updated...'
          })
        }
      })
    },

    bidArtwork (value) {
      console.log(value)
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
