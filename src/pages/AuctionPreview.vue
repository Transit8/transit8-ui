<template>
<div>
  <section id="pdp-slider" class="white-bg">
    <div class="container wide">
      <div class="row">
        <h1>Auction Preview</h1>
      </div>
    </div>
  </section>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionPreview',
  components: {
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
