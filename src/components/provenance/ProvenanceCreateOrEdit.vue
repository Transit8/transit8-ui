<template>
<div class="column" v-if="spinner">
  <p class="modal-card-title"><i class="glyphicon glyphicon-repeat normal-left-spinner"></i> nearly done - hang on in there.</p>
</div>
<div class="column" v-else>
  <h1 class="title is-1">{{ formTitle }}</h1>
  <form id="create-provenance" @submit="checkForm">

    <p v-if="errors.length" :key="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors"
        :key="error.message"
        v-bind:error="error"
        >{{ error }}</li>
      </ul>
    </p>

    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input class="input" type="text" placeholder="Title of your item" v-model="indexData.title">
      </div>
    </div>

    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" placeholder="What inspired you to create this?" v-model="indexData.description"></textarea>
      </div>
    </div>

    <div class="field">
      <label class="label">Keywords</label>
      <div class="control">
        <textarea class="textarea" placeholder="keywords" v-model="indexData.keywords"></textarea>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="radio">
          <input type="radio" name="indexData.itemType" value="physart" v-model="indexData.itemType">
          Physical Artwork
        </label>
        <label class="radio">
          <input type="radio" name="indexData.itemType" value="digiart" v-model="indexData.itemType">
          Digital Artwork
        </label>
        <label class="radio">
          <input type="radio" name="indexData.itemType" value="photoart" v-model="indexData.itemType">
          Photographic work
        </label>
      </div>
    </div>
    <div class="field" v-if="indexData.itemType == 'digiart' || indexData.itemType == 'photoart'">
        <b>Please upload you artwork here by dragging and dropping the file:</b>
        <div id="load-artwork">
          <div class="drop_area" @drop.prevent="loadArtwork" @dragover.prevent>
            Drop your artwork file here!
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth">modified</div>
          <div class="column is-one-fifth">name</div>
          <div class="column is-one-fifth">size</div>
          <div class="column is-one-fifth">type</div>
          <div class="column is-one-fifth">file</div>
        </div>
        <provenance-create-images
          :key="file.lastModified"
          v-for="file in provData.artwork"
          v-bind:file="file"
        >
        </provenance-create-images>
    </div>

    <div class="field">
      <label class="label">How many editions?</label>
      <div class="control">
        <input class="input" type="number" placeholder="How many editions would you like?" v-model="provData.editions">
      </div>
    </div>

    <h2 class="title is-4">Owner / Creator?</h2>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :checked="provData.owner" :value="provData.owner" v-model="provData.owner">
          This item belongs to me.
        </label>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :checked="provData.creator" :value="provData.creator" v-model="provData.creator">
          This item was created by me.
        </label>
      </div>
    </div>

    <h2 class="title is-4">Gallery Images</h2>
    <p class="hint">Please attach some images to display your item on a gallery or market place. We crop and pad images
    in order to display them in various contexts such as listings and item display pages. These images are not required
    for registration but will be needed when you chose to sell the item.</p>

    <div id="app">
      <div class="drop_area" @drop.prevent="loadImageFiles" @dragover.prevent>
        Drop images to represent you item to potential buyer.
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-fifth">modified</div>
      <div class="column is-one-fifth">name</div>
      <div class="column is-one-fifth">size</div>
      <div class="column is-one-fifth">type</div>
      <div class="column is-one-fifth">file</div>
    </div>
    <provenance-create-images
      :key="file.lastModified"
      v-for="file in provData.images"
      v-bind:file="file"
    >
    </provenance-create-images>

    <h2 class="title is-4">Supporting documentation</h2>
    <p class="hint">These can be official ownership documents, valuation and condition reports and also
    photos and videos of relevance to the items provenance</p>

    <div id="supporting">
      <div class="drop_area" @drop.prevent="loadSupportingFiles" @dragover.prevent>
        Drop any files (images in jpg or png format or documents in pdf format) which support your claim.
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-fifth">modified</div>
      <div class="column is-one-fifth">name</div>
      <div class="column is-one-fifth">size</div>
      <div class="column is-one-fifth">type</div>
      <div class="column is-one-fifth">file</div>
    </div>
    <provenance-create-images
      :key="file.lastModified"
      v-for="file in provData.supportingDocuments"
      v-bind:file="file"
    >
    </provenance-create-images>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" v-on:click="upload">Save</button>
      </div>
      <div class="control">
        <button class="button is-text">Cancel</button>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import ProvenanceActions from '@/components/provenance/ProvenanceActions'
import ProvenanceCreateImages from '@/components/provenance/ProvenanceCreateImages'
import provenanceService from '@/services/provenance/ProvenanceService'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'ProvenanceCreateOrEdit',
  data () {
    return {
      spinner: false,
      provData: {
        artwork: [],
        owner: true,
        creator: true,
        supportingDocuments: [],
        images: [],
        editions: 1,
      },
      indexData: {
        title: 'Artwork ' + Math.round(Math.random() * (100000 - 1)) + 1,
        description: 'Artwork ' + Math.round(Math.random() * (100000 - 1) + 1) + ' genesis testing',
        itemType: 'physart',
        keywords: 'art,digital,blockchain,prototype',
        registered: false,
        uploader: provenanceService.getUserData().username,
      },
      formTitle: 'Update Artwork',
      provenanceId: (this.$route && this.$route.params.provenanceId) ? parseInt(this.$route.params.provenanceId) : undefined,
      createMode: true,
      errors: [],
    }
  },
  created () {
    this.createMode = this.$route.fullPath.indexOf('/provenance/create') > -1
    if (this.createMode) {
      this.formTitle = 'Upload Artwork'
      return
    }
    let provenanceRecord = provenanceService.getProvenanceRecord(this.provenanceId)
    this.indexData = provenanceRecord.indexData
    if (!this.indexData) {
      this.indexData = {}
    }
    if (!this.indexData.uploader) {
      this.indexData.uploader = provenanceService.getUserData().username
    }
    _.merge(this.provData, provenanceRecord.provData)
    if (!this.provData.auditData) {
      this.provData.auditData = []
      this.provData.auditData.push({
        event: 'uploaded',
        who: provenanceService.getUserData().username,
        when: this.indexData.id
      })
    }
    provenanceService.setRegData({indexData: this.indexData, provData: this.provData}).then((regData) => {
      this.indexData.regData = regData
    })
  },
  validations: {
  },
  methods: {
    deleteImages: function (e) {
      this.provData.images = []
    },
    deleteArtwork: function (e) {
      this.provData.artwork = []
    },
    deleteDocuments: function (e) {
      this.provData.supportingDocuments = []
    },
    checkForm: function (e) {
      this.errors = []
      if (this.indexData.title && this.indexData.description && this.provData.editions > 0 && this.provData.editions < 11) {
        return
      }
      if (!this.indexData.title) {
        this.errors.push('title required.')
      }
      if (!this.indexData.description) {
        this.errors.push('description required.')
      }
      if (this.provData.editions < 1 || this.provData.editions > 10) {
        this.errors.push('Editions between 1 and 10.')
      }
      if (this.indexData.itemType !== 'physart' && this.provData.artwork && this.provData.artwork.length === 0) {
        this.errors.push('Please include the artwork.')
      }
    },
    upload: function (event) {
      event.preventDefault()
      this.checkForm()
      if (this.errors.length > 0) {
        return
      }
      let userData = provenanceService.getUserData()

      if (this.createMode) {
        this.indexData.id = moment({}).valueOf()
        this.provData.auditData = [{
          event: 'uploaded',
          who: userData.username,
          when: this.indexData.id
        }]
      } else if (this.provenanceId) {
        this.indexData.id = this.provenanceId
        this.provData.auditData.push({
          event: 'edited',
          who: userData.username,
          when: moment({}).valueOf()
        })
      } else {
        throw new Error('Not create mode but provenance id is undefined.')
      }
      if (!this.provData.id || this.provData.id !== this.indexData.id) {
        this.provData.id = this.indexData.id
      }
      this.spinner = true
      provenanceService.createOrUpdateRecord(this.indexData, this.provData).then((records) => {
        console.log(records)
        this.$router.push('/my-artworks')
      })
        .catch(e => {
          console.log('ProvenanceVue: Unable to lookup ', e)
        })
    },
    loadArtwork: function (e) {
      this.load(e, this.provData.artwork, 1)
    },
    loadSupportingFiles: function (e) {
      this.load(e, this.provData.supportingDocuments, 5)
    },
    loadImageFiles: function (e) {
      this.load(e, this.provData.images, 3)
    },
    load: function (e, arrayToLoad, limit) {
      let userFiles = e.dataTransfer.files
      let fileObject = null
      for (let i = 0; i < userFiles.length; i++) {
        if (i === limit) {
          break
        }
        fileObject = userFiles[i]
        let thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type
        }
        var reader = new FileReader()
        reader.onload = function (e) {
          thisFile.dataUrl = e.target.result
          arrayToLoad.push(thisFile)
        }
        reader.readAsDataURL(fileObject)
      }
    }
  },
  components: {
    ProvenanceActions, ProvenanceCreateImages
  }
}
</script>

<style lang="sass" src="bulma">
</style>
<style scoped>
.drop_area {
  width: 100%;
  height: 50px;
  background-color: #00f3f3;
  text-align: center;
  padding: 20px;
  padding: 5px;
  border: 1pt dashed #3366dd;
}
</style>
