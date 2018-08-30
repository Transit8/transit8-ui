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
      <p>Uploaded by: <b>{{ provenanceRecord.indexData.uploader }}</b> on {{ niceTime(provenanceRecord.indexData.id) }} {{ parseAppUrl(provenanceRecord.indexData.appUrl) }}</p>
      <p v-if="provenanceRecord.provData">
        <span v-if="provenanceRecord.provData.owner && provenanceRecord.provData.creator">
          Owned and created by: {{ provenanceRecord.indexData.uploader }}
        </span>
        <span v-else-if="provenanceRecord.provData.owner">
          Owned by: {{ provenanceRecord.indexData.uploader }}
        </span>
        <span v-else-if="provenanceRecord.provData.creator">
          Created by: {{ provenanceRecord.indexData.uploader }}
        </span>
        <span v-else>
          Owner and creator unknown
        </span>
      </p>
      <p v-if="provenanceRecord.indexData">
        <span v-if="provenanceRecord.indexData.itemType === 'physart'">
          Type: <b>physical artwork</b>
        </span>
        <span v-else-if="provenanceRecord.indexData.itemType === 'photoart'">
          Type: <b>photographic artwork</b>
        </span>
        <span v-else-if="provenanceRecord.indexData.itemType === 'digiart'">
          Type: <b>digital artwork</b>
        </span>
        <span v-else>
          Type: <b>unknown</b>
        </span>
      </p>
    </div>
    <nav class="has-text-right" v-if="allowEdit">
        <a :href="'#/provenance/edit/'+provenanceRecord.indexData.id">edit</a> |
        <a v-if="provenanceRecord.indexData.registered">registered on blockchain</a>
        <a v-else :href="'#/provenance/register/'+provenanceRecord.indexData.id">register on blockchain</a>
    </nav>
  </div>
  <div class="media-right" v-if="allowEdit && !searching">
    <div v-if="provenanceRecord.indexData.saleData">
      <provenance-sellers-info v-bind:saleData="provenanceRecord.indexData.saleData"/>
      <p class="has-text-right"><button class="button is-outlined" v-on:click="openSaleDataModal">Change Sale Data</button></p>
    </div>
    <div v-else>
      <p class="has-text-right"><button class="button is-outlined" v-on:click="openSaleDataModal">Set Sale Data</button></p>
    </div>
  </div>
  <div class="media-right" v-else>
    <div v-if="provenanceRecord.indexData.saleData">
      <provenance-buyers-info v-bind:saleData="provenanceRecord.indexData.saleData" v-bind:recordId="provenanceRecord.indexData.id"/>
    </div>
  </div>
</article>
</template>

<script>
import ProvenanceBuyersInfo from '@/components/provenance/sales/ProvenanceBuyersInfo'
import ProvenanceSellersInfo from '@/components/provenance/sales/ProvenanceSellersInfo'
import moment from 'moment'

export default {
  props: ['provenanceRecord', 'userData'],
  data () {
    return {
      allowEdit: false,
      searching: true
    }
  },
  mounted () {
    this.searching = (this.$route.name === 'marketSearch')
    if (this.userData) {
      this.allowEdit = this.userData.username === this.provenanceRecord.indexData.uploader
    }
  },
  events: {
  },
  methods: {
    parseAppUrl (appUrl) {
      if (!appUrl || appUrl.length === 0) {
        return ''
      }
      let showUrl = 'App Url: '
      if (appUrl.startsWith(':')) {
        showUrl += appUrl.substring(3)
      } else if (appUrl.startsWith('http:')) {
        showUrl += appUrl.substring(7)
      } else if (appUrl.startsWith('https:')) {
        showUrl += appUrl.substring(8)
      } else if (appUrl.startsWith('s:')) {
        showUrl += appUrl.substring(4)
      } else if (appUrl.startsWith('p:')) {
        showUrl += appUrl.substring(4)
      } else {
        showUrl += appUrl
      }
      return showUrl
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
