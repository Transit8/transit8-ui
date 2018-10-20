<template>
<div>
  <section>
    <div>
      <div class="row">
        <h1>Update an Auction</h1>
        <my-auction-upload-form :auctionId="auctionId" :mode="'update'"/>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import MyAuctionUploadForm from '../components/auctions/MyAuctionUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctionUpload',
  components: {
    MyAuctionUploadForm
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
