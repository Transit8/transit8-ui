<template>
<div class="col-md-12">
  <div class="media">
    <div class="media-left">
      <img :src="artwork.image" :alt="artwork.title" class="media-object" style="max-width: 150px"/>
    </div>
    <div class="media-body">
      <div class="row">
        <div class="col-md-12">
          <h4 class="media-heading">{{artwork.title}}</h4>
          {{artwork.description}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleAuctionItem',
  components: { },
  props: {
    auctionId: null,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  methods: {
  },
  computed: {
    artwork () {
      return this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
    },
  }
}
</script>
