<template>
  <section id="about-artwork" class="grey-light-bg black pt-60 about-artwork">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-6">
          <h2 class="h4 mb-40">About artwork</h2>
          <p>
            {{artwork.title}}, {{artwork.year}}<br />
            Edition 1/1, {{artwork.category}}
          </p>
          <div v-html="artwork.description"></div>
          <p>
            Uploaded by: {{artwork.uploadedBy}}<br />
            Owned by: {{purchaseState.ownedBy}}
          </p>
          <p class="keywords">Keywords ︱ {{keywords}}</p>
        </div>
        <div class="col-sm-6">
          <img class="img-responsive" :src="artwork.image">
        </div>
      </div>

    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AboutArtwork',
  props: {
    purchaseState: {},
    artwork: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    keywords () {
      return this.artwork.keywords
    }
  }
}
</script>
