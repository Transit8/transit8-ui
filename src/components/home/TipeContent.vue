<template>
<section class="container">
  <div class="columns">
    <div class="column" v-html="homepage">
    </div>
  </div>
</section>
</template>

<script>
import tipes from '@/services/tipes'

export default {
  data: () => {
    return {
      homepage: '<i class="fas fa-cog fa-spin"></i>',
    }
  },
  mounted () {
    tipes.fetch().then((response) => {
      if (response) {
        this.homepage = response.data.blocks[0].value
      }
    })
  }
}
</script>

<style>
</style>
