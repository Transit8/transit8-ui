<template>
<section class="main-page">
  <div class="columns">
    <div class="column is-one-fifth" style="padding: 30px">
      <provenance-actions/>
    </div>
    <div class="column">
      <router-view></router-view>
    </div>
  </div>
</section>
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

<style>
.main-page {
  margin: 50px 100px;
}
</style>
