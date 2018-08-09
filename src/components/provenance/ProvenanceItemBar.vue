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
  <div class="media-content">
    <div class="content">
      <p class="subtitle is-4">{{ provenanceRecord.indexData.title }}</p>
      <p>{{ provenanceRecord.indexData.description }}</p>
      <p>Uploaded by: <b>{{ provenanceRecord.indexData.uploader }}</b> on {{ niceTime(provenanceRecord.indexData.id) }}</p>
      <p v-if="provenanceRecord.provData">
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
  <div class="media-right" v-if="allowEdit">
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
      <provenance-buyers-info v-bind:saleData="provenanceRecord.indexData.saleData"/>
    </div>
  </div>
</article>
</template>

<script>
import ProvenanceBuyersInfo from '@/components/provenance/sales/ProvenanceBuyersInfo'
import ProvenanceSellersInfo from '@/components/provenance/sales/ProvenanceSellersInfo'
import moment from 'moment'

export default {
  props: ['provenanceRecord', 'userData', 'allowEdit'],
  data () {
    return {
    }
  },
  mounted () {
  },
  events: {
  },
  methods: {
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
