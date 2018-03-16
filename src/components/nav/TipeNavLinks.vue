<template>
<div class="navbar-item has-dropdown" v-html="navLinks" v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
</div>
</template>

<script>
import tipes from '@/services/tipes'

export default {
  name: 'TipeNavLinks',
  data: () => {
    return {
      isActive: false,
      navLinks: ''
    }
  },
  mounted () {
    tipes.fetchNavLinks().then((response) => {
      if (response) {
        this.navLinks = response.data.blocks[0].value
      }
    })
  }
}
</script>

<style>
</style>
