<template>
  <a href="#" class="col-sm-2 col-xs-1 grid-item">
    <img :src="resource.image" :alt="resource.title">
    <p class="artwork-caption mt-30">{{resource.title}}</p>
    <p class="artwork-caption mt-0">Published date: {{ resource.publishDate }}</p>
    <p class="artwork-caption mt-0">Version: {{ resource.version }}</p>
  </a>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Resource',
  props: {
    resource: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
