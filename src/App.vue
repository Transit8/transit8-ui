<template>
    <div>
      <navigation/>
      <router-view></router-view>
      <footBar/>
    </div>
</template>

<script>
import Navigation from '@/components/nav/Navigation'
import Home from '@/components/home/Home'
import FootBar from '@/components/home/FootBar'

export default {
  name: 'App',
  components: {
    Navigation,
    Home,
    FootBar
  }
}
</script>

<style lang="scss">
    @import "../node_modules/bulma/bulma.sass";
</style>
