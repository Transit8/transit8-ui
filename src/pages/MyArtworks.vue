<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row" v-if="message">
        <div class="col-sm-12 pt-120">
          <h2>{{ message }}</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">My Artworks <span>Artworks added: {{artworks.length}}</span></h1>
          <my-artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
          <h1 class="innerpage mt-50">Sold Artworks <span>Artworks sold: {{soldArtworks.length}}</span></h1>
          <my-artworks-list :artworks="soldArtworks" :show-load-button="false" :chunks="6"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MyArtworksList from '../components/artworks/MyArtworksList'
import provenanceService from '@/services/provenance/provenanceService'
import ethService from '@/services/experimental/ethApiService'
import _ from 'lodash'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworks',
  components: { MyArtworksList },
  data () {
    return {
      records: [],
      artworks: [],
      soldArtworks: [],
      message: null
    }
  },
  mounted () {
    this.loadMyArtworks()
  },
  methods: {
    loadMyArtworks: function () {
      provenanceService.loadMyArtworks(this.loadMyArtwork)
    },
    loadMyArtwork: function (record) {
      let user = provenanceService.getUserProfile()
      let $self = this
      if (!record.indexData.owner) {
        record.indexData.owner = record.indexData.uploader
      }
      let isOwner = user.username === record.indexData.owner
      $self.records.push(record)
      let artwork = {
        id: record.indexData.id,
        title: record.indexData.title,
        timestamp: record.indexData.timestamp,
        owner: record.indexData.owner,
        uploader: record.indexData.uploader,
        caption: record.indexData.uploader,
        canRegister: (isOwner && record.provData.artwork && record.provData.artwork[0].dataUrl),
        image: (record.provData.artwork && record.provData.artwork[0].dataUrl) ? record.provData.artwork[0].dataUrl : '/static/images/artwork1.jpg'
      }
      artwork.canSetPrice = false
      artwork.canEdit = false
      if (!record.indexData.owner) {
        if (record.indexData.uploader === user.username) {
          artwork.canSetPrice = true
          artwork.canEdit = true
          this.artworks.push(artwork)
        } else {
          this.soldArtworks.push(artwork)
        }
      } else {
        if (user.username === record.indexData.owner) {
          artwork.canSetPrice = true
          artwork.canEdit = true
          this.artworks.push(artwork)
        } else {
          this.soldArtworks.push(artwork)
        }
      }
      ethService.fetchArtworkByHash(record.indexData.timestamp, function (data) {
        if (data && !data.failed) {
          let myIndex = _.findIndex($self.records, function (o) {
            return o.indexData.timestamp === data[2]
          })
          if (myIndex > -1) {
            let recordToChange = $self.records[myIndex]
            if (data[1] !== recordToChange.indexData.owner) {
              recordToChange.indexData.owner = data[1]
              provenanceService.createOrUpdateRecord(recordToChange.indexData, recordToChange.provData).then((result) => {
                console.log('result *******', result)
                $self.message = 'We noticed your artwork [' + recordToChange.indexData.title + '] has been sold - please refresh this page for details!'
                // location.reload()
              }).catch(e => {
                console.log('record: error ', e)
              })
            }
            let index = _.findIndex($self.artworks, {id: recordToChange.indexData.id})
            if (index > -1) {
              $self.artworks[index].scData = data
              $self.artworks[index].canSetPrice = true
              $self.artworks[index].canEdit = true
            } else {
              index = _.findIndex($self.soldArtworks, {id: recordToChange.indexData.id})
              if (index > -1) {
                $self.soldArtworks[index].canSetPrice = false
                $self.soldArtworks[index].canEdit = false
                $self.soldArtworks[index].scData = data
              }
            }
          }
        }
      })
    },

  }

}
</script>
