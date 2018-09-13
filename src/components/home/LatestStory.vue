<template>
  <router-link :to="url" class="col-sm-4 col-xs-12 story-item">
    <prismic-image :field="story.data.featured_image.listing" class="img-responsive"/>
    <p class="art-title">{{$prismic.richTextAsPlain(story.data.title)}}</p>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LatestStory',
  props: {
    story: {
      type: Object,
      required: true,
    },
  },
  computed: {
    url () {
      return `/stories/${this.story.id}`
    }
  }
}
</script>
