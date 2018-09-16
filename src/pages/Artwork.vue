<template>
  <div>
    <section id="pdp-slider" class="pb-0 black-bg white pdp-slider pt-60 pb-60">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 clearfix">
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
            <img :src="artwork.image" :alt="artwork.title" class="img-responsive">
            <artwork-slider :images="artwork.images" :image-num="sliderImage" @change="sliderImageChanged($event)"/>
          </div>
        </div>
      </div>
    </section>
    <!-- /#pdp slider -->

    <buy-artwork-form :artwork="artwork" @buy="buyArtwork()" v-if="artwork.forSale"/>
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
import webrtcService from '@/services/webrtc/webrtcService'
import provenanceService from '@/services/provenance/provenanceService'
// import ProvenanceBuyersInfo from '@/components/provenance/sales/ProvenanceBuyersInfo'
// import ProvenanceSellersInfo from '@/components/provenance/sales/ProvenanceSellersInfo'
// import moment from 'moment'
import messagingService from '@/services/webrtc/messagingService'
import eventBus from '@/services/eventBus'
// import cacheService from '@/services/cacheService'
import _ from 'lodash'
import ethService from '@/services/experimental/ethApiService'

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
      userMessages: messagingService.messages,
      messageSignal: {time: 'then', message: 'happy?'},
      webrtcState: 0,
      artworkId: (this.$route && this.$route.params.artworkId) ? parseInt(this.$route.params.artworkId) : undefined,
      sliderImage: 0,
      artist: {},
      artwork: {},
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
  beforeDestroy () {
    webrtcService.unpublish()
    eventBus.$off('signal-in-message')
  },
  created () {
    window.addEventListener('beforeunload', this.stopPublishing)
    let recordId = (this.$route && this.$route.params.artworkId) ? parseInt(this.$route.params.artworkId) : undefined
    provenanceService.getRecordFromSearchIndexById(recordId).then((record) => {
      provenanceService.getArtistProfile(record).then((profile) => {
        this.artist = profile
        this.user = provenanceService.getUserProfile(record)
        this.setRecord(record)
      })
    })
    let $elfie = this
    // eventBus.$on('signal-in-message', function (payLoad) {
    //  $elfie.userMessages.push(payLoad)
    // })
    eventBus.$on('signal-in-bid', function (payLoad) {
      $elfie.userMessages.push(payLoad)
    })
    eventBus.$on('auction-connected', function (payLoad) {
      $elfie.webrtcState = 1
    })
    eventBus.$on('item-edit', function (payLoad) {
      window.location.reload()
    })
  },
  methods: {
    buyArtwork () {
      let buyer = this.user.username
      let seller = this.artist.username
      if (!buyer || !seller || buyer === seller) {
        return
      }
      ethService.buy(this.record.indexData.title, seller, buyer).then((item) => {
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

          provenanceService.createOrUpdateRecord(this.record.indexData, this.record.provData).then((records) => {
            console.log('records *******', records)
            this.spinner = false
          }).catch(e => {
            console.log('ProvenanceVue: Unable to lookup ', e)
          })
        }
      })
    },

    setRegData: function (record, artwork) {
      provenanceService.setRegData(record).then((regData) => {
        record.indexData.regData = regData
      })
    },

    bidArtwork (value) {
      console.log(value)
    },

    setRecord (record) {
      let $elfist = this
      $elfist.record = record
      let user = provenanceService.getUserProfile()
      webrtcService.startSession(user.username, $elfist.artworkId)
      let images = []
      if (record.provData && record.provData.artwork && record.provData.artwork.length > 0) {
        _.forEach(record.provData.artwork, function (artwork) {
          images.push(record.provData.artwork[0].dataUrl)
        })
      } else {
        images.push('/static/images/artwork1.jpg')
      }
      $elfist.artwork = {
        id: record.indexData.id,
        name: record.indexData.title,
        description: record.indexData.description,
        keywords: record.indexData.keywords,
        uploadedBy: this.artist.displayName,
        ownedBy: record.scData[1],
        category: record.indexData.itemType,
        canBuy: record.indexData.owner !== user.username,
        image: images[0],
        images: images,
        year: '',
        saleData: record.indexData.saleData,
        forSale: record.indexData.saleData.soid === 1,
        forAuction: record.indexData.saleData.soid === 2,
        amount: record.indexData.saleData.amount,
        minBidIncrement: record.indexData.saleData.increment,
        reservedPrice: record.indexData.saleData.reserve,
      }
      $elfist.setRegData(record, $elfist.artwork)
      // $elfist.artworks.push({
      //  id: record.indexData.id,
      //  caption: record.indexData.uploader,
      //  title: record.indexData.title,
      //  image: dataUrl,
      // })
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
