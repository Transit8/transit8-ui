<template>
<div>
  <p v-if="saleData.soid === 0">Listing</p>
  <p v-else-if="saleData.soid === 1">
    <button class="button"><a :href="'#/provenance/item/'+recordId">Buy Now: {{ saleData.amount }}</a></button>
  </p>
  <p v-else-if="saleData.soid === 2">
    <button class="button"><a :href="'#/provenance/item/'+recordId">Place Bid: {{ saleData.reserve + saleData.increment }}</a></button>
  </p>
</div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['saleData', 'recordId'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    niceTime: function (updated) {
      if (typeof updated === 'string') {
        updated = Number(updated)
      }
      return moment(updated).format('LLLL')
    },
  },
  components: {
  }
}
</script>

<style>
</style>
