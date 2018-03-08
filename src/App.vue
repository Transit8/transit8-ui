<template>
    <div>
      <navigation/>
      <router-view></router-view>
      <footBar/>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import Home from '@/components/fragments/Home'
import FootBar from '@/components/fragments/FootBar'

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
