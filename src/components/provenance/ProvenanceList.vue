<template>
<div class="column">
  <h1 class="title is-1">My Artworks</h1>
  <article class="media" v-for="provenanceRecord in provenanceRecords" :key="provenanceRecord.indexData.id">
    <figure class="media-left">
      <p class="image is-128x128" v-if="provenanceRecord.provData && provenanceRecord.provData.artwork && provenanceRecord.provData.artwork.length > 0">
        <img :src="provenanceRecord.provData.artwork[0].dataUrl" alt="Artwork image"/>
      </p>
      <p class="image is-128x128" v-else>
        <img src="/static/tree.jpg" alt="Missing image"/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
      <p class="subtitle is-4">{{ provenanceRecord.indexData.title }} (ID: {{ provenanceRecord.indexData.id }})</p>
      <p>{{ provenanceRecord.indexData.description }}</p>
      <p>
        <span v-if="provenanceRecord.provData && provenanceRecord.provData.owner && provenanceRecord.provData.creator">
          Owned and created by: {{ userData.username }}
        </span>
        <span v-else-if="provenanceRecord.provData && provenanceRecord.provData.owner">
          Owned by: {{ userData.username }}
        </span>
        <span v-else-if="provenanceRecord.provData && provenanceRecord.provData.creator">
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
      <nav class="level">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small"></span>&nbsp;&nbsp;{{ provenanceRecord.indexData.itemType }}
          </a>
          <a class="level-item" v-if="provenanceRecord.indexData.registered">
            <span class="icon is-small"><i class="fas fa-reply"></i></span>&nbsp;&nbsp;registered on blockchain
          </a>
          <a class="level-item" v-else>
            <span class="icon is-small"><i class="fas fa-retweet"></i></span>&nbsp;&nbsp;<a :href="'#/provenance/register/'+provenanceRecord.indexData.id">register on blockchain</a>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-retweet"></i></span>&nbsp;&nbsp;<a :href="'#/provenance/edit/'+provenanceRecord.indexData.id">edit</a>
          </a>
        </div>
      </nav>
    </div>
    <!-- <div class="media-right">
      <button class="delete"></button>
    </div>
    -->
  </article>
</div>
</template>

<script>
import provenanceService from '@/services/provenance/ProvenanceService'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import moment from 'moment'

export default {
  data () {
    return {
      userData: {},
      provenanceRecords: []
    }
  },
  mounted () {
    this.provenanceRecords = provenanceService.getProvenanceRecordsInLS()
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
