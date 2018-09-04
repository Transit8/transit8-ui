<template>
  <div class="">
    <h1 class="title is-1">Register Your Ownership on Chain</h1>
    <form id="create-provenance">
      <div class="field">
        <label class="label">Timestamp Proofs</label>
        <div class="control">
          <textarea readonly class="textarea" placeholder="Click 'submit' and your" v-model="timestamp"></textarea>
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
    <provenance-item-bar v-bind:provenanceRecord="provenanceRecord" v-bind:userData="userData" v-bind:allowEdit="allowEdit"/>
  </div>
</template>

<script>
import ProvenanceItemBar from '@/components/provenance/ProvenanceItemBar'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import provenanceService from '@/services/provenance/ProvenanceService'
import moment from 'moment'
import SHA256 from 'crypto-js/sha256'

export default {
  name: 'ProvenanceRegister',
  data () {
    return {
      allowEdit: false,
      dataUrl: null,
      timestamp: null,
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
    if (this.provenanceRecord.provData.artwork[0] && this.provenanceRecord.provData.artwork[0].dataUrl.length > 0) {
      this.dataUrl = this.provenanceRecord.provData.artwork[0].dataUrl
      this.timestamp = SHA256(this.userData.username + '::' + this.provenanceRecord.provData.artwork[0].dataUrl)
    }
  },
  methods: {
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
    register: function () {
      return 'LLLL'
    },
  },
  components: {
    ProvenanceActions,
    ProvenanceItemBar
  }
}
</script>

<style lang="sass" src="bulma">
</style>
