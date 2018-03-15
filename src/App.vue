<template>
    <div>
      <navigation/>
      <login />
      <router-view></router-view>
      <footBar/>
    </div>
</template>

<script>
import Navigation from '@/components/nav/Navigation'
import Login from 'bright-block-auth/src/components/auth/Login'
import FootBar from '@/components/home/FootBar'

export default {
  name: 'App',
  components: {
    Navigation,
    Login,
    FootBar
  }
}
</script>

<style lang="scss">
    @import "../node_modules/bulma/bulma.sass";
</style>
