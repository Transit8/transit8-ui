<template>
<div>
  <p>Sale Information</p>
  <p>Buy this item for {{ saleData.amount }}</p>
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
