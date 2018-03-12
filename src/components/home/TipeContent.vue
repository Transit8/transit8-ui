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
      homepage: 'nothing yet',
    }
  },
  mounted () {
    tipes.fetch().then((response) => {
      if (response) {
        this.homepage = response.data.blocks[0].value
        // this.homepage = text1.replace('{{link1}}', response.data.blocks[1].value)
      }
    })
  }
}
</script>

<style>
.container {
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>
