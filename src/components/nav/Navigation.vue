<template>
<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <router-link class="fa-rotate-270" to="/" style="font-size:2.6em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
      <router-link class="fa-rotate-270" to="/" style="margin-left: -25px; margin-bottom: 0px; font-size:2.6em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
      <router-link to="/" style="font-size:1.6em; color:Tomato">
        BrightBlock
      </router-link>
    </div>
    <div class="navbar-burger" data-target="navMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div id="navMenu" class="navbar-menu">
    <div class="navbar-start">
    </div>
    <div class="navbar-end">
    <!--
      <a href="http://localhost:8888/"
        class="navbar-item"
        target="_blank">
          Blockstack Browser
      </a>
      -->
      <nav-item-blockstack v-if="debug"/>
      <nav-item-dev-tools v-if="debug"/>
      <!-- <tipe-nav-links /> -->
      <bright-block-auth showAccountLink="true"/>
    </div>
  </div>
</nav>
</template>

<script>
import BrightBlockAuth from 'bright-block-auth/src/components/auth/BrightBlockAuth'
import NavItemBlockstack from '@/components/nav/NavItemBlockstack'
import NavItemDevTools from '@/components/nav/NavItemDevTools'
import bulma from '@/services/bulma'
import TipeNavLinks from './TipeNavLinks'

export default {
  name: 'Navigation',
  data: () => {
    return {
      isModalActive: true,
      debug: false
    }
  },
  mounted () {
    bulma.initDropdowns()
    if (this.$route.query && this.$route.query.debug) {
      this.debug = true
    }
  },
  components: {
    BrightBlockAuth,
    NavItemBlockstack,
    NavItemDevTools,
    TipeNavLinks
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
</style>
