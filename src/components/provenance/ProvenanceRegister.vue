<template>
  <div class="">
    <h1 class="title is-1">Register Your Ownership on Chain</h1>
    <form id="create-provenance" v-if="canRegister">
      <div class="field">
        <label class="label">Timestamp Proofs</label>
        <div class="control">
          <p>
          The following string uniquely identifies your digital artwork and will be stored in the block chain as
          proof of your ownership of this item.
          </p>
          <p>{{ timestamp }}</p>
        </div>
      </div>
      <p class="help is-danger">
        {{ dataUrl }}
      </p>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" v-on:click="register">Register</button>
        </div>
      </div>
    </form>
    <div v-else-if="isRegistered">
      {{ timestamp }}
    </div>
    <div v-else>
      {{ timestamp }}
    </div>
    <provenance-reg-bar v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData" v-bind:allowEdit="allowEdit"/>
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
      isRegistered: false,
      canRegister: false,
      allowEdit: false,
      dataUrl: null,
      timestamp: null,
      provenanceId: (this.$route && this.$route.params.provenanceId) ? parseInt(this.$route.params.provenanceId) : undefined,
      provenanceRecord: null,
      result: {},
      userData: null
    }
  },
  validations: {
  },
  created () {
    this.userData = provenanceService.getUserData()
    this.isRegistered = ethService.isRegistered()
    let result = provenanceService.canRegister(this.userData.username, this.provenanceId)
    this.provenanceRecord = result.provenanceRecord
    this.canRegister = result.canRegister
    this.timestamp = result.timestamp
    this.dataUrl = result.dataUrl
    ethService.isRegistered(this.timestamp.toString()).then((result) => {
      this.isRegistered = result.isRegistered
    })
    ethService.register(this.provenanceRecord.indexData.title, this.timestamp.toString(), this.userData.username).then((result) => {
      this.result = result
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
      ethService.register(this.provenanceRecord.indexData.title, this.timestamp.toString(), this.userData.username).then((result) => {
        this.result = result
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
