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
            <img :src="artwork.image" :alt="artwork.title">
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

    <buy-artwork-form :artwork="artwork" @buy="buyArtwork()" v-if="artwork.forSale && !owner"/>
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
import webrtcService from '@/services/webrtc/WebrtcService'
import provenanceService from '@/services/provenance/ProvenanceService'
// import ProvenanceBuyersInfo from '@/components/provenance/sales/ProvenanceBuyersInfo'
// import ProvenanceSellersInfo from '@/components/provenance/sales/ProvenanceSellersInfo'
// import moment from 'moment'
import messagingService from '@/services/webrtc/messagingService'
import eventBus from '@/services/eventBus'
// import cacheService from '@/services/cacheService'
import _ from 'lodash'
import ethService from '@/services/experimental/ethApiService'
import searchIndexService from '@/services/searchindex/SearchIndexService'

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
      tokbox: {},
      userMessages: messagingService.messages,
      messageSignal: {time: 'then', message: 'happy?'},
      username: 'anon',
      loggedIn: false,
      webrtcState: 0,
      owner: false,
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
    let userData = provenanceService.getUserData()
    if (userData && userData.username) {
      this.loggedIn = true
      this.username = userData.username
      this.artist = {
        name: userData.profile.name,
        description: userData.profile.description,
        image: (userData.profile.avatarUrl) ? userData.profile.avatarUrl : '/static/images/artist_preview.png',
      }
    }
    let recordId = (this.$route && this.$route.params.artworkId) ? parseInt(this.$route.params.artworkId) : undefined
    provenanceService.getProvenanceRecordsInLS(recordId).then((record) => {
      if (!record || !record.provData || !record.indexData.id) {
        this.searchIndex(recordId)
      } else {
        this.setBrokenLink(record)
      }
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
      let buyer = this.username
      let seller = this.record.indexData.uploader
      ethService.buy(this.record.indexData.title, seller, buyer).then((item) => {
        this.record.indexData.uploader = buyer
        this.record.indexData.gaiaUrl = null
        this.record.indexData.appUrl = null
        provenanceService.createOrUpdateRecord(this.record.indexData, this.record.provData).then((records) => {
          this.spinner = false
        }).catch(e => {
          console.log('ProvenanceVue: Unable to lookup ', e)
        })
      })
    },

    searchIndex: function (recordId) {
      let $self = this
      searchIndexService.searchIndex('art', 'id', recordId)
        .then((results) => {
          $self.provenanceRecords = []
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                if (record && record.indexData && record.indexData.id) {
                  $self.setBrokenLink(record)
                }
              })
              .catch(e => {
                console.log('Unable to get from: ', indexData)
              })
          })
        })
        .catch(e => {
          console.log('Unable to contact search index.', e)
        })
    },

    setRegData: function (record, artwork) {
      provenanceService.setRegData(record).then((regData) => {
        record.indexData.regData = regData
        if (regData.state === 120 && this.username !== regData.currentOwner) {
          console.log('found a bought item!')
          console.log('regData: ', regData)
        }
      })
    },

    bidArtwork (value) {
      console.log(value)
    },

    setBrokenLink (record) {
      // let recordId = (this.$route && this.$route.params.artworkId) ? parseInt(this.$route.params.artworkId) : undefined
      let $elfist = this
      $elfist.record = record
      $elfist.owner = record.indexData.uploader === this.username
      webrtcService.startSession($elfist.username, $elfist.artworkId)
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
        uploadedBy: record.indexData.uploader,
        ownedBy: record.indexData.uploader,
        category: record.indexData.itemType,
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
