<template>
<div>
  <section id="pdp-slider" class="pb-3 white-bg pt-60 pb-60">
    <div class="container wide">
      <div class="row">
        <h1>Upload Artwork</h1>
        <my-artwork-upload-form/>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import MyArtworkUploadForm from '../components/artworks/MyArtworkUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkUpload',
  components: {
    MyArtworkUploadForm
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
