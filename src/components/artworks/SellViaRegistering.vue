<template>
<div>
  <uiv-modal :value="isModalActive" :append-to-body="false">
    <div slot="title"><h1 class="modal-title">Register Artwork</h1></div>
    <div slot="close"><button type="button" class="close" v-on:click="closeModal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>
    <div class="modal-body" v-if="message">
      {{message}}
    </div>
    <div class="modal-body" v-else>
      <div class="row  m-0">
        <div class="col-xs-6 grid-item">
          <img :src="artwork.image" :alt="artwork.title">
        </div>
        <div class="col-xs-6 grid-item">
          <h4>{{artwork.title}}</h4>
          {{myArtist.name}}
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" v-on:click="closeModal">Close</button>
      <button type="button" class="btn btn-primary" :disabled="status !== 'new'" @click="registerArtwork()" v-if="!message">Register</button>
    </div>
  </uiv-modal>
</div>
</template>

<script>
import utils from '@/services/utils'
import notify from '@/services/notify'
import ethereumService from '@/services/ethereumService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SellViaRegistering',
  props: {
    isModalActive: false,
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      message: null,
    }
  },
  mounted () {
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },
    myArtist () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.artist)
    },
    status () {
      return this.$store.getters['myArtworksStore/bcstatus'](this.artworkId)
    },
  },
  methods: {
    closeModal () {
      this.$emit('closeDialog')
    },
    registerArtwork: function () {
      this.message = 'Registering your artwork - please allow a few minutes for the transaction to complete...'
      let artwork = this.artwork
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
          $self.$store.dispatch('myArtworksStore/syncBlockchainState', artwork).then((artwork) => {
            if (artwork) {
              $self.artwork = artwork
            }
          })
        })
      }, function (error) {
        console.log(error)
        $self.message = 'Please check you are logged into your Meta Mask account and on the correct network.'
        notify.error({title: 'Register Artwork.', text: 'Error registering your item - please check meta mask is running and unlocked. <br>'})
      })
    },
  }
}
</script>
