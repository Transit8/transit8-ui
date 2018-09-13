<template>
<section class="main-page">
  <div class="columns">
    <div class="column is-one-fifth" style="padding: 30px">
      <market-actions v-bind:numbResults="numbResults"/>
    </div>
    <div class="column">
      <router-view v-bind:numbResults.sync="numbResults"></router-view>
    </div>
  </div>
</section>
</template>

<script>
import MarketActions from '@/components/market/MarketActions'

export default {
  data () {
    return {
      numbResults: 0,
    }
  },
  mounted () {
  },
  components: {
    MarketActions
  }
}
</script>

<style>
.main-page {
  margin: 50px 100px;
}
</style>
