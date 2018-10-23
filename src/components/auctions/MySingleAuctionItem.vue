<template>
<div class="col-md-12">
  <div class="media">
    <div class="media-left">
      <img :src="item.image" :alt="item.title" class="media-object" style="max-width: 150px"/>
    </div>
    <div class="media-body">
      <h4 class="media-heading">{{item.title}}</h4>
      {{item.description}}
    </div>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleAuctionItem',
  components: { },
  props: {
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
  }
}
</script>
