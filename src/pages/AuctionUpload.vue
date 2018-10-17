<template>
<div>
  <section>
    <div>
      <div class="row">
        <h1>Upload an Auction</h1>
        <auction-upload-form :mode="'upload'"/>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import AuctionUploadForm from '../components/auctions/AuctionUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionUpload',
  components: {
    AuctionUploadForm
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
