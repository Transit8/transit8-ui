<template>
<div class="column">
  <h1 class="title is-1">My Artworks</h1>
  <!-- <p>Your root file was created on: {{ niceTime(rootFile.created) }} and contains;</p> -->
  <article class="media" v-for="provenanceRecord in provenanceRecords" :key="provenanceRecord.id">
    <figure class="media-left">
      <p class="image is-128x128">
        <img :src="provenanceRecord.artwork[0].dataUrl" alt="Artwork image"/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
      <p class="subtitle is-4">{{ provenanceRecord.title }}</p>
      <p>{{ provenanceRecord.inspiration }}</p>
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
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" v-if="provenanceRecord.registered">
            <span class="icon is-small"><i class="fas fa-reply"></i> registered on blockchain</span>
          </a>
          <a class="level-item" v-else>
            <span class="icon is-small"><i class="fas fa-retweet"></i> <a :href="'#/provenance/register/'+provenanceRecord.id">register on blockchain</a></span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-heart"></i></span>
          </a>
        </div>
      </nav>
    </div>
    <div class="media-right">
      <button class="delete"></button>
    </div>
  </article>
</div>
</template>

<script>
import provenanceService from '@/services/provenance/ProvenanceService'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import moment from 'moment'
import _ from 'lodash'

export default {
  data () {
    return {
      rootFile: {},
      userData: {},
      provenanceRecords: []
    }
  },
  mounted () {
    provenanceService.fetchRootFile()
      .then((rootFile) => {
        let $selfie = this
        this.rootFile = rootFile
        this.userData = provenanceService.getUserData()
        _.forEach(rootFile.records, function (record) {
          if (record && record.id) {
            $selfie.provenanceRecords.push(provenanceService.getProvenanceRecord(record.id))
          }
        })
      })
      .catch(e => {
        console.log('ProvenanceVue: Unable to lookup ', e)
      })
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
