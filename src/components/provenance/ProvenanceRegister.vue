<template>
  <div class="column">
    <h1 class="title is-1">Record of Ownership Saved</h1>
    <p class="subtitle is-3">Next step is to register the record on the blockchain</p>
    <form id="create-provenance">
      <div class="field">
        <label class="label">Timestamp Proofs</label>
        <div class="control">
          <textarea readonly class="textarea" placeholder="Click 'submit' and your" v-model="timestamp"></textarea>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" v-on:click="register">Register</button>
        </div>
      </div>
    </form>
    <div class="card" v-if="provenanceRecord">
      <div class="card-image" v-if="provenanceRecord.provData.artwork">
        <figure class="image">
          <img :src="provenanceRecord.provData.artwork[0].dataUrl" alt="Artwork image"/>
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="content">
            <p class="subtitle is-1">{{ provenanceRecord.indexData.title }}</p>
            <p class="subtitle is-4">{{ provenanceRecord.indexData.description }}</p>
            <p class="subtitle is-6">
              <span v-if="provenanceRecord.provData.owner && provenanceRecord.provData.creator">
                Owned and created by: {{ userData.username }}
              </span>
              <span v-else-if="provenanceRecord.provData.owner">
                Owned by: {{ userData.username }}
              </span>
              <span v-else-if="provenanceRecord.provData.creator">
                Created by: {{ userData.username }}
              </span>
              <span v-else>
                Owner and creator unknown
              </span>
              <span v-if="provenanceRecord.indexData.itemType === 'pysart'">
                Type: <b>physical artwork</b>
              </span>
              <span v-else-if="provenanceRecord.indexData.itemType === 'digiart'">
                Type: <b>digital artwork</b>
              </span>
              <span v-else>
                Type: <b>photographic artwork</b>
              </span>
            </p>
          </div>
        </div>

        <div class="media-content" v-for="image in provenanceRecord.provData.images" :key="image.lastModified">
          <p class="subtitle is-3">Gallery Images</p>
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="image.dataUrl" alt="Gallery image"/>
            </figure>
          </div>
          <div class="media-content">
            <p class="subtitle is-6">{{ image.name }}</p>
            <p class="subtitle is-6">{{ image.type }}</p>
            <p class="subtitle is-6">{{ image.size }}</p>
          </div>
        </div>

        <div class="media-content" v-for="image in provenanceRecord.provData.supportingDocuments" :key="image.lastModified">
          <p class="subtitle is-3">Supporting Documents</p>
          <div class="media-left" v-if="image.type.indexOf('jpg') > 0">
            <figure class="image is-48x48">
              <img :src="image.dataUrl" alt="Gallery image"/>
            </figure>
          </div>
          <div class="media-content">
            <p class="subtitle is-6">Document: {{ image.name }}</p>
            <p class="subtitle is-6">Type: {{ image.type }}</p>
            <p class="subtitle is-6">Size: {{ image.size }}</p>
          </div>
        </div>

        <div class="content">
          <time datetime="2016-1-1">Created: {{ niceTime(provenanceRecord.provData.created) }}</time>
          <br>
          <time datetime="2016-1-1">Last Updated: {{ niceTime(provenanceRecord.provData.updated) }}</time>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import provenanceService from '@/services/provenance/ProvenanceService'
import moment from 'moment'
import SHA256 from 'crypto-js/sha256'

export default {
  name: 'ProvenanceRegister',
  data () {
    return {
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
    this.timestamp = SHA256(this.userData.username + '::' + this.provenanceRecord.artwork[0].dataUrl)
  },
  methods: {
    niceTime: function (updated) {
      return moment(updated).format('LLLL')
    },
    register: function () {
      return 'LLLL'
    },
  },
  components: {
    ProvenanceActions
  }
}
</script>

<style lang="sass" src="bulma">
</style>
