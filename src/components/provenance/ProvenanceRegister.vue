<template>
  <div class="column" v-if="spinner">
    <h1 class="title is-1">{{ provenanceRecord.indexData.title }}</h1>
    <h2 class="title is-3">Register Your Ownership on Chain</h2>
    <p class="modal-card-title"><i class="fa fa-snowflake fa-spin fa-3x fa-fw"></i> nearly done - hang on in there.</p>
  </div>
  <div class="column" v-else>
    <h1 class="title is-1">{{ provenanceRecord.indexData.title }}</h1>
    <h2 class="title is-3">Register Your Ownership on Chain</h2>
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
      <p v-if="provenanceRecord.indexData.regData.result">Registered in transaction: {{ provenanceRecord.indexData.regData.result }}</p>
    </div>
    <provenance-sale-data v-if="saleDataModalActive" v-on:close-sale-data-modal="closeSaleDataModal" v-bind:ethToBtc="ethToBtc" v-bind:fiatRates="fiatRates" v-bind:recordForSaleData="recordForSaleData" v-bind:saleDataModalActive="saleDataModalActive"/>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" v-on:click="openSaleDataModal">Set Price</button>
      </div>
    </div>
  </div>
</template>

<script>
import ethService from '@/services/experimental/ethApiService'
import ProvenanceRegBar from '@/components/provenance/ProvenanceRegBar'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import provenanceService from '@/services/provenance/ProvenanceService'
import moment from 'moment'
import exchangeRatesService from '@/services/exchangeRatesService'
import ProvenanceSaleData from '@/components/provenance/sales/ProvenanceSaleData'

export default {
  name: 'ProvenanceRegister',
  data () {
    return {
      error: null,
      saleDataModalActive: false,
      spinner: false,
      allowEdit: false,
      provenanceId: (this.$route && this.$route.params.provenanceId) ? parseInt(this.$route.params.provenanceId) : undefined,
      provenanceRecord: null,
      fiatRates: {},
      ethToBtc: {},
      userData: null
    }
  },
  validations: {
  },
  created () {
    this.provenanceRecord = provenanceService.getProvenanceRecord(this.provenanceId)
    this.userData = provenanceService.getUserData()
    exchangeRatesService.fetchFiatRates().then((fiatRates) => {
      this.fiatRates = fiatRates
    })
    exchangeRatesService.fetchCoinPair('eth_btc').then((ethToBtc) => {
      this.ethToBtc = ethToBtc
    })
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
        if (result.failed && result.reason) {
          this.error = result.reason.message
          this.spinner = false
        } else {
          this.provenanceRecord.indexData.regData.result = result
          provenanceService.createOrUpdateRecord(this.provenanceRecord.indexData, this.provenanceRecord.provData)
            .then((record) => {
              this.error = 'Record has been successfully registered on the block chain. Tx=' + this.provenanceRecord.indexData.regData.result
              this.spinner = false
            })
            .catch(e => {
              this.spinner = false
              this.error = 'Record has been successfully registered on the block chain - but an error was thrown saving to user storage. Tx=' + this.provenanceRecord.indexData.regData.result
            })
        }
      })
    },
    closeSaleDataModal: function (response) {
      this.saleDataModalActive = false
    },
    openSaleDataModal: function (id) {
      this.recordForSaleData = this.provenanceRecord
      this.saleDataModalActive = true
    },
  },
  components: {
    ProvenanceActions,
    ProvenanceRegBar,
    ProvenanceSaleData
  }
}
</script>

<style lang="sass" src="bulma">
</style>
