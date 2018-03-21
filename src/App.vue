<template>
    <div>
      <div class="main">
        <navigation/>
        <login />
        <router-view></router-view>
      </div>
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
<style lang="css">
p {
  margin-bottom: 15px;
}
.container {
  padding-top: 20px;
}
.main {
  min-height: calc(100vh - 90px);
}
.footer {
  height: 50px;
}
</style>
