<template>
<article class="media">
  <figure class="media-left">
    <p class="image is-128x128" v-if="provenanceRecord.provData && provenanceRecord.provData.artwork && provenanceRecord.provData.artwork.length > 0">
      <img :src="provenanceRecord.provData.artwork[0].dataUrl" alt="Artwork image"/>
    </p>
    <p class="image is-128x128" v-else>
      <img src="/static/tree.jpg" alt="Missing image"/>
    </p>
  </figure>
  <div class="media-content" v-if="provenanceRecord.indexData">
    <div class="content">
      <p class="subtitle is-4" v-if="searching"><a :href="'#/provenance/item/'+provenanceRecord.indexData.id">{{ provenanceRecord.indexData.title }}</a></p>
      <p class="subtitle is-4" v-else><a :href="'#/provenance/edit/'+provenanceRecord.indexData.id">{{ provenanceRecord.indexData.title }}</a></p>
      <p>{{ provenanceRecord.indexData.description }}</p>
      <p v-if="provenanceRecord.indexData.regData && provenanceRecord.indexData.regData.currentOwner">Sold to: <b>{{ provenanceRecord.indexData.regData.currentOwner }}</b></p>
      <p>Uploaded by: <b>{{ provenanceRecord.indexData.uploader }}</b> on {{ niceTime(provenanceRecord.indexData.id) }} {{ parseAppUrl(provenanceRecord.indexData.appUrl) }}</p>
      <p v-if="provenanceRecord.provData">
        <span>
          Owner: {{ provenanceRecord.indexData.owner }}
        </span>
        <span>
          Artist: {{ provenanceRecord.indexData.uploader }}
        </span>
      </p>
      <p>
        <span>
          Type: <b>{{ artType }}</b>
        </span>
      </p>
    </div>
    <nav class="has-text-right" v-if="allowEdit">
      <a :href="'#/provenance/edit/'+provenanceRecord.indexData.id">edit</a> |
    </nav>
  </div>
</article>
</template>

<script>
import provenanceService from '@/services/provenance/provenanceService'
import ProvenanceBuyersInfo from '@/components/provenance/sales/ProvenanceBuyersInfo'
import ProvenanceSellersInfo from '@/components/provenance/sales/ProvenanceSellersInfo'
import moment from 'moment'

export default {
  props: ['provenanceRecord', 'username'],
  data () {
    return {
      allowEdit: false,
      artType: '',
      searching: true
    }
  },
  mounted () {
    this.searching = (this.$route.name === 'marketSearch')
    if (this.username) {
      this.allowEdit = true
    }
    if (this.provenanceRecord.indexData.itemType === 'physart') {
      this.artType = 'Pysical Art'
    } else if (this.provenanceRecord.indexData.itemType === 'photoart') {
      this.artType = 'Photo Art'
    } else {
      this.artType = 'Digital Art'
    }
  },
  events: {
  },
  methods: {
    parseAppUrl (appUrl) {
      return provenanceService.parseAppUrl(appUrl)
    },
    openSaleDataModal () {
      this.$emit('open-sale-data-modal', this.provenanceRecord.indexData.id)
      // this.mySaleDataModalActive = !mySaleDataModalActive
    },
    closeSaleDataModal: function (argument) {
      this.saleDataModalActive = false
    },
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
  },
  components: {
    ProvenanceBuyersInfo,
    ProvenanceSellersInfo,
  }
}
</script>

<style>
article {
  background: #ccc;
  border: 1pt solid black;
  border-radius: 15px;
  margin: 15px;
  padding: 10px;
}
</style>
