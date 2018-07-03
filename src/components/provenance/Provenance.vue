<template>
<div class="columns">
  <div class="column is-one-fifth">
    <provenance-actions/>
  </div>
  <div class="column">
    <h1 class="title is-1">Provenance Records</h1>
    <p>Your root file was created on: {{ niceTime(rootFile.created) }} and contains;</p>

    <ul class="menu-list" v-if="rootFile">
      <li v-for="record in rootFile.records"
      :key="record.id"
      >{{ record.title }}
        <span v-if="record.registered">registered on blockchain</span>
        <span v-else><a :href="'#/provenance/register/'+record.id">register on blockchain</a></span>
        (<i>{{ niceTime(record.id) }}</i>)
      </li>
    </ul>

  </div>
</div>
</template>

<script>
import provenanceService from '@/services/provenance/ProvenanceService'
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import moment from 'moment'

export default {
  data () {
    return {
      rootFile: {},
      userData: {},
      provenanceRecords: {}
    }
  },
  mounted () {
    provenanceService.fetchRootFile()
      .then((rootFile) => {
        let counter = 0
        this.rootFile = rootFile
        this.userData = provenanceService.getUserData()
        let myTimer = setInterval(function () {
          if (counter === 4) {
            clearInterval(myTimer)
          }
          this.provenanceRecords = provenanceService.getProvenanceRecords()
          counter++
        }, 2000)
        console.log(this.rootFile)
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
