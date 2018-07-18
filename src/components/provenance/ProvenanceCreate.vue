<template>
<div class="column">
  <h1 class="title is-1">Upload Artwork</h1>
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
        <input class="input" type="text" placeholder="Title of your item" v-model="title">
      </div>
    </div>

    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" placeholder="What inspired you to create this?" v-model="inspiration"></textarea>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="radio">
          <input type="radio" name="itemType" value="physart" v-model="itemType">
          Physical Artwork
        </label>
        <label class="radio">
          <input type="radio" name="itemType" value="digiart" v-model="itemType">
          Digital Artwork
        </label>
        <label class="radio">
          <input type="radio" name="itemType" value="photoart" v-model="itemType">
          Photographic work
        </label>
      </div>
    </div>
    <div class="field" v-if="itemType !== 'physart'">
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
          v-for="file in artwork"
          v-bind:file="file"
        >
        </provenance-create-images>
    </div>

    <div class="field">
      <label class="label">How many editions?</label>
      <div class="control">
        <input class="input" type="number" placeholder="How many editions would you like?" v-model="editions">
      </div>
    </div>

    <h2 class="title is-4">Owner / Creator?</h2>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :checked="owner" :value="owner" v-model="owner">
          This item belongs to me.
        </label>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :checked="creator" :value="creator" v-model="creator">
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
      v-for="file in images"
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
      v-for="file in supportingDocuments"
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

export default {
  name: 'ProvenanceCreate',
  data () {
    return {
      title: 'Dreams of things to come',
      inspiration: 'An imaginary number.',
      editions: 1,
      itemType: 'physart',
      artwork: [],
      owner: true,
      creator: true,
      errors: [],
      supportingDocuments: [],
      images: []
    }
  },
  validations: {
  },
  mounted () {
    provenanceService.fetchRootFile()
      .then((rootFile) => {
        console.log(rootFile)
      })
      .catch(e => {
        console.log('ProvenanceVue: Unable to lookup ', e)
      })
  },
  methods: {
    checkForm: function (e) {
      if (this.title && this.inspiration && this.editions > 0 && this.editions < 11) {
        return true
      }
      this.errors = []
      if (!this.title) {
        this.errors.push('title required.')
      }
      if (!this.inspiration) {
        this.errors.push('inspiration required.')
      }
      if (this.editions < 1 || this.editions > 10) {
        this.errors.push('Editions between 1 and 10.')
      }
      if (this.itemType !== 'physart' && this.artwork.length === 0) {
        this.errors.push('Please include the artwork.')
      }
    },
    upload: function (event) {
      this.checkForm()
      if (this.errors.length > 0) {
        return
      }
      let myData = {
        title: this.title,
        inspiration: this.inspiration,
        editions: this.editions,
        itemType: this.itemType,
        artwork: this.artwork,
        owner: this.owner,
        creator: this.creator,
        images: this.images,
        supportingDocuments: this.supportingDocuments
      }
      provenanceService.createRecord(myData)
        .then((records) => {
          console.log(myData)
          this.$router.push('/')
        })
        .catch(e => {
          console.log('ProvenanceVue: Unable to lookup ', e)
        })
    },
    loadArtwork: function (e) {
      this.load(e, this.artwork, 1)
    },
    loadSupportingFiles: function (e) {
      this.load(e, this.supportingDocuments, 5)
    },
    loadImageFiles: function (e) {
      this.load(e, this.images, 3)
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
