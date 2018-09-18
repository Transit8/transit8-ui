<template>
  <section id="pdp-action" class="pdp-action pb-0">
    <div class="container-fluid p-0">
      <h2 class="title is-3">Register Your Ownership on Chain</h2>
      <div class="row  m-0">
        <div class="col-md-12 col-xs-12 p-0">
          <button class="btn btn-block black action-button text-uppercase yellow-bg"  @click="registerArtwork()">register</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import provenanceService from '@/services/provenance/provenanceService'
import ethService from '@/services/experimental/ethApiService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'RegisterArtworkForm',
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
      errors: [],
    }
  },
  methods: {
    registerArtwork: function () {
      this.spinner = true
      ethService.register(this.artwork.name, this.artwork.timestamp, this.artist.username).then((result) => {
        if (result.failed && result.reason) {
          this.error = result.reason.message
          this.spinner = false
        } else {
          provenanceService.setRegData(this.provenanceRecord).then((regData) => {
            this.provenanceRecord.indexData.regData = regData
            provenanceService.createOrUpdateRecord(this.provenanceRecord.indexData, this.provenanceRecord.provData)
              .then((record) => {
                this.error = 'Record has been successfully registered on the block chain - refresh this screen to set a price.'
                this.spinner = false
              })
              .catch(e => {
                this.spinner = false
                this.error = 'Record has been successfully registered on the block chain'
                console.log('Error: ', e)
              })
          })
        }
      }).catch(e => {
        this.spinner = false
        this.error = 'Record has been successfully registered on the block chain'
        console.log('Error: ', e)
      })
    },
  }
}
</script>
