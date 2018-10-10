<template>
<div>
  <section>
    <div>
      <div class="row">
        <h1>Update an Auction</h1>
        <auction-upload-form :auctionId="auctionId" :mode="'update'"/>
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
    this.auctionId = Number(this.$route.params.auctionId)
  },
  computed: {
  },
  methods: {
  }
}
</script>
