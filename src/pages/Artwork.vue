<template>
  <div>
    <section id="pdp-slider" class="pb-0 black-bg white pdp-slider pt-60">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12">
            <div class="pull-left">
              <h1 class="product-title">{{artist.name}}, {{artwork.name}}</h1>
              <p class="mb-0">
                1/1 Edition, {{artwork.category}}<br/>
                <a href="#" @click.prevent="scrollToAboutSection()"><u>About artwork</u></a>
              </p>
            </div>
            <artwork-slider-controls :images="artwork.images" @change="sliderImageChanged($event)"
                                     :image-displayed="sliderImage"/>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-8 col-sm-offset-2 pt-80">
            <artwork-slider :images="artwork.images" :image-num="sliderImage" @change="sliderImageChanged($event)"/>
          </div>
        </div>
      </div>
    </section>
    <!-- /#pdp slider -->

    <buy-artwork-form :artwork="artwork" @buy="buyArtwork()" v-if="artwork.forBuy"/>
    <bid-artwork-form :artwork="artwork" @bid="bidArtwork($event)" v-if="artwork.forAuction"/>
    <!-- /#pdp-action -->

    <about-artwork :artwork="artwork" ref="about"/>
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
    ArtworksList
  },
  data () {
    return {
      sliderImage: 0,
      artist: {
        name: 'Artist Name',
        description: 'Born in Osaka in 1978, Hiroe Saeki graduated from the Faculty of Fine Art, Kyoto Seika University in 2001.<br />Making her debut at the exhibition held at Taka Ishii Gallery in 2004, Saeki won the VOCA Encouragement Prize and held her first overseas solo exhibition at Galerie Almine Rech in Paris, in 2006.',
        image: '/static/images/artist_preview.png',
      },
      artwork: {
        name: 'Artwork name',
        keywords: [ 'pen', 'drawing', 'digital' ],
        description: '<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quasmolestias.</p>',
        uploadedBy: 'Uploader Name',
        ownedBy: 'Owner Name',
        image: '/static/images/product.jpg',
        category: 'Photography',
        year: '2017',
        prices: {
          eur: 500,
          usd: 580.12,
          eth: 2.38,
          btc: 0.084
        },
        forBuy: false,
        forAuction: true,
        minBidIncrement: 500,
        reservedPrice: 500,
        images: [
          '/static/images/product.jpg',
          '/static/images/product.jpg',
          '/static/images/product.jpg',
        ]
      },
      artworks: [
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork1.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork2.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork3.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork4.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork5.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork6.jpg',
        },
      ],
    }
  },
  methods: {
    buyArtwork () {
      //
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
