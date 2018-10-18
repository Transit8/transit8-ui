<template>
<div class="col-md-12">
  <div class="media">
    <div class="media-left">
      <a href="#">
        <img :src="item.image" :alt="item.title" class="media-object" style="max-width: 150px"/>
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">{{item.title}}</h4>
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
