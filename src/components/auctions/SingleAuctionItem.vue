<template>
<div class="col-md-12">
  <div class="media">
    <img :src="item.image" :alt="item.title" class="mr-3"/>
    <div class="media-body">
      <h5 class="mt-0">{{item.title}}</h5>
      {{item.description}}
      <hr>
      {{item.saleData}}
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
