<template>
<div>
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
  <section id="pdp-action" class="pdp-action black pb-0">
    <div class="container-fluid p-0">
      <div class="row  m-0">
        <div class="col-md-9 col-xs-12 product-price">
          <span class="price inline-block">Register Your Ownership</span>
        </div>
        <button class="btn btn-block black action-button text-uppercase"
                    :disabled="status !== 'new'"
                    v-bind:class="{ 'yellow-bg': status === 'new', 'grey-bg': status !== 'new' }" @click="registerArtwork()">register</button>
      </div>
    </div>
  </section>
  <div>
    <uiv-modal :value="isModalActive">
      <div slot="title"><h1 class="login-modal-title">Updating Data</h1></div>
      <div class="login-modal-body">
        <p v-html="message"></p>
      </div>
      <div slot="footer">
        <div class="login-modal-footer">
          <button class="btn" v-on:click="closeModal">Close</button>
        </div>
      </div>
    </uiv-modal>
  </div>
</div>
</template>

<script>
import ethereumService from '@/services/ethereumService'
import _ from 'lodash'
import utils from '@/services/utils'
import notify from '@/services/notify'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkRegister',
  props: {
    artist: {},
    artwork: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isModalActive: false,
      errors: [],
      message: 'Please wait - we are registering your ownership on the blockchain.'
    }
  },
  created () {
    this.artworkId = Number(this.$route.params.artworkId)
  },
  computed: {
    clientState () {
      return this.$store.getters['ethStore/getClientState']
    },
    status () {
      return this.$store.getters['myArtworksStore/bcstatus'](this.artworkId)
    },
    myArtwork () {
      return this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
    },
    myArtist () {
      let myArtwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      return this.$store.getters['userProfilesStore/getProfile'](myArtwork.artist)
    },
  },
  methods: {
    registerArtwork: function () {
      this.message = 'Registering your artwork - please allow a few minutes for the transaction to complete...'
      this.openModal()
      let artwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      let uploader = this.$store.getters['myAccountStore/getMyProfile'].username
      let regData = {
        title: artwork.title,
        timestamp: utils.buildArtworkHash(artwork.artwork[0].dataUrl),
        uploader: uploader,
      }
      let $self = this
      ethereumService.registerOnChain(regData, function (result) {
        notify.info({title: 'Register Artwork.', text: 'Transaction sent to the blockchain...'})
        artwork.bcitem = {
          registerTxId: result.txId,
          status: 'pending-register'
        }
        $self.$store.commit('myArtworksStore/addMyArtwork', artwork)
        $self.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
          notify.info({title: 'Register Artwork.', text: 'User storage has been updated...'})
          $self.closeModal()
          $self.$store.dispatch('ethStore/fetchBlockchainItem', {timestamp: artwork.timestamp}).then((blockchainItem) => {
            if (blockchainItem) {
              _.merge(artwork.bcitem, blockchainItem)
              $self.$store.commit('myArtworksStore/addMyArtwork', artwork)
            }
            notify.info({title: 'Register Artwork.', text: 'Your artwork has been registered - please allow a few minutes for the transaction to complete...'})
          })
        })
      }, function (error) {
        notify.error({title: 'Register Artwork.', text: 'Error registering your item. <br>' + error.message})
      })
    },
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
  }
}
</script>
