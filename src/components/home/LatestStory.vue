<template>
  <router-link :to="story.id" class="col-sm-4 col-xs-12 story-item">
    <img class="img-responsive" :src="story.image" :alt="story.title">
    <p class="art-title">{{story.title}}</p>
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
}
</script>
