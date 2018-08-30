<template>
<div>
  <p>Sale Information</p>
  <p v-if="saleData.soid === 0">Listing only</p>
  <p v-else-if="saleData.soid === 1">Selling this item for {{ saleData.amount }}</p>
  <p v-else-if="saleData.soid === 2">Selling by auction with reserve price {{ saleData.reserve }} and increment {{ saleData.increment }}</p>
</div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['saleData'],
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
