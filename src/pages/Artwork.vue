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

    <buy-artwork-form :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()" v-if="artwork.forSale"/>
    <bid-artwork-form :purchaseState="purchaseState" :artwork="artwork" @bid="bidArtwork($event)" v-if="artwork.forAuction"/>
    <!-- /#pdp-action -->

    <about-artwork :artwork="artwork" :purchaseState="purchaseState" ref="about"/>
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
      user: {},
      purchaseState: {},
      webrtcState: 0,
      artworkId: (this.$route && this.$route.params.artworkId) ? parseInt(this.$route.params.artworkId) : undefined,
      sliderImage: 0,
      artist: {},
      artwork: {},
      artworks: [],
    }
  },
  beforeDestroy () {
    webrtcService.unpublish()
    eventBus.$off('signal-in-message')
  },
  mounted () {
    let $elfie = this
    this.user = provenanceService.getUserProfile()
    window.addEventListener('beforeunload', this.stopPublishing)
    let recordId = (this.$route && this.$route.params.artworkId) ? parseInt(this.$route.params.artworkId) : undefined
    provenanceService.getRecordFromSearchIndexById(recordId).then((record) => {
      if (!record.indexData.owner) {
        record.indexData.owner = record.indexData.uploader
      }
      $elfie.purchaseState = {
        ownedBy: record.indexData.owner,
        canBuy: record.indexData.owner !== $elfie.user.username,
      }
      ethService.fetchArtworkByHash(record.indexData.timestamp, function (data) {
        if (data && !data.failed) {
          $elfie.artwork.owner = data[1]
          $elfie.artwork.scData = data
          $elfie.purchaseState = {
            ownedBy: data[1],
            canBuy: data[1] !== $elfie.user.username,
          }
        }
      })
      provenanceService.getArtistProfile(record).then((profile) => {
        $elfie.record = record
        this.artist = profile
        this.user = provenanceService.getUserProfile(record)
        this.setRecord(record)
        this.loadArtworks(50)
      })
    })
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
    loadArtworks: function (numberToLoad) {
      ethService.loadArtworks(numberToLoad, this.loadArtwork)
    },

    loadArtwork: function (blockchainItem) {
      let $self = this
      provenanceService.findArtworkFromBlockChainData(blockchainItem, function (record) {
        if (record.indexData.uploader === $self.record.indexData.uploader) {
          let saleData = record.indexData.saleData
          $self.artworks.push({
            id: String(record.indexData.id),
            title: record.indexData.title,
            caption: record.profile.name,
            // caption: record.indexData.uploader,
            forSale: (saleData && saleData.soid === 1),
            forAuction: (saleData && saleData.soid === 2),
            image: record.image
          })
        }
      })
    },

    buyArtwork () {
      let buyer = this.user.username
      let seller = this.artwork.owner
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
            location.reload()
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
        uploadedBy: this.artist.name,
        image: images[0],
        category: record.indexData.itemType,
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
