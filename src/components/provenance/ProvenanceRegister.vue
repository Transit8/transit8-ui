<template>
  <div class="column" v-if="spinner">
    <p class="modal-card-title"><i class="fa fa-snowflake fa-spin fa-3x fa-fw"></i> nearly done - hang on in there.</p>
  </div>
  <div class="column" v-else>
    <h1 class="title is-1">Register Your Ownership on Chain</h1>
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <form id="create-provenance" v-if="provenanceRecord.indexData.regData.state === 110">
        <div class="field">
          <label class="label">Timestamp Proofs</label>
          <div class="control">
            <p>
            The following string uniquely identifies your digital artwork and will be stored in the block chain as
            proof of your ownership of this item.
            </p>
            <p>{{ provenanceRecord.indexData.regData.timestamp }}</p>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" v-on:click="register">Register</button>
          </div>
        </div>
      </form>
      <div v-else-if="provenanceRecord.indexData.regData.state === 120">
        <p>This art work is already registered on the block chain.</p>
        <p>{{ provenanceRecord.indexData.regData.timestamp }}</p>
      </div>
      <div v-else>
        <p>Only support registering digital artworks on the block chain right now - this will change soon so stay tuned!</p>
      </div>
      <provenance-reg-bar v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData" v-bind:allowEdit="allowEdit"/>
      <p>Registered in transaction: {{ provenanceRecord.indexData.regData.txId }}</p>
    </div>
  </div>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'
import ProvenanceRegBar from '@/components/provenance/ProvenanceRegBar'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import provenanceService from '@/services/provenance/ProvenanceService'
import moment from 'moment'

export default {
  name: 'ProvenanceRegister',
  data () {
    return {
      error: null,
      spinner: false,
      allowEdit: false,
      provenanceId: (this.$route && this.$route.params.provenanceId) ? parseInt(this.$route.params.provenanceId) : undefined,
      provenanceRecord: null,
      userData: null
    }
  },
  validations: {
  },
  created () {
    this.provenanceRecord = provenanceService.getProvenanceRecord(this.provenanceId)
    this.userData = provenanceService.getUserData()
  },
  methods: {
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
    register: function (e) {
      e.preventDefault()
      this.spinner = true
      ethService.register(this.provenanceRecord.indexData.title, this.provenanceRecord.indexData.regData.timestamp, this.userData.username).then((result) => {
        if (result.failed) {
          this.error = result.reason
          this.spinner = false
        } else {
          this.provenanceRecord.indexData.regData.txId = result.txId
          provenanceService.createOrUpdateRecord(this.provenanceRecord.indexData, this.provenanceRecord.provData)
            .then((record) => {
              this.error = 'Record has been successfully registered on the block chain. Tx=' + this.provenanceRecord.indexData.regData.txId
              this.spinner = false
            })
            .catch(e => {
              this.spinner = false
              this.error = 'Record has been successfully registered on the block chain - but an error was thrown saving to user storage. Tx=' + this.provenanceRecord.indexData.regData.txId
            })
        }
      })
    },
  },
  components: {
    ProvenanceActions,
    ProvenanceRegBar
  }
}
</script>

<style lang="sass" src="bulma">
</style>
