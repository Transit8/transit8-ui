<template>
<section id="pdp-slider" class="pb-3 white-bg pt-60 pb-60">
  <div class="container wide">
    <div class="row">
      <h1>Update Artwork</h1>
      <my-artwork-upload-form :artworkId="artworkId" :mode="'update'"/>
    </div>
  </div>
</section>
</template>

<script>
import MyArtworkUploadForm from '../components/artworks/MyArtworkUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkUpdate',
  components: {
    MyArtworkUploadForm
  },
  data () {
    return {
    }
  },
  created () {
    this.artworkId = Number(this.$route.params.artworkId)
  },
  computed: {
  },
  methods: {
  }
}
</script>
