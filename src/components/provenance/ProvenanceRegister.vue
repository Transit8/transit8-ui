<template>
<div class="columns">
  <div class="column is-one-fifth">
    <provenance-actions/>
  </div>
  <div class="column">
    <h1 class="title is-1">Record of Ownership Saved</h1>
    <p class="subtitle is-3">Next step is to register the record on the blockchain</p>
    <p class="subtitle is-3">Next step is to register the record on the blockchain</p>
    <form id="create-provenance" @submit="checkForm">
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
      <div class="card-image" v-if="provenanceRecord.artwork">
        <figure class="image">
          <img :src="provenanceRecord.artwork[0].dataUrl" alt="Artwork image"/>
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="content">
            <p class="subtitle is-1">{{ provenanceRecord.title }}</p>
            <p class="subtitle is-4">{{ provenanceRecord.inspiration }}</p>
            <p class="subtitle is-6">
              <span v-if="provenanceRecord.owner && provenanceRecord.creator">
                Owned and created by: {{ userData.username }}
              </span>
              <span v-else-if="provenanceRecord.owner">
                Owned by: {{ userData.username }}
              </span>
              <span v-else-if="provenanceRecord.creator">
                Created by: {{ userData.username }}
              </span>
              <span v-else>
                Owner and creator unknown
              </span>
              <span v-if="provenanceRecord.itemType === 'pysart'">
                Type: <b>physical artwork</b>
              </span>
              <span v-else-if="provenanceRecord.itemType === 'digiart'">
                Type: <b>digital artwork</b>
              </span>
              <span v-else>
                Type: <b>photographic artwork</b>
              </span>
            </p>
          </div>
        </div>

        <div class="media-content" v-for="image in provenanceRecord.images" :key="image.lastModified">
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

        <div class="media-content" v-for="image in provenanceRecord.supportingDocuments" :key="image.lastModified">
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
          <time datetime="2016-1-1">Created: {{ niceTime(provenanceRecord.created) }}</time>
          <br>
          <time datetime="2016-1-1">Last Updated: {{ niceTime(provenanceRecord.updated) }}</time>
        </div>
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
  },
  components: {
    ProvenanceActions
  }
}
</script>

<style lang="sass" src="bulma">
</style>
