<template>
<nav class="navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <router-link class="fa-rotate-270" to="/" style="font-size:2.6em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
      <router-link class="fa-rotate-270" to="/" style="margin-left: -20px; margin-bottom: 0px; font-size:2.6em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
    </div>
    <div class="navbar-burger" data-target="navMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div id="navMenu" class="navbar-menu">
    <nav-item-auth />
  </div>
</nav>
</template>

<script>
import NavItemAuth from '@/components/fragments/NavItemAuth'

export default {
  name: 'Navigation',
  data: () => {
    return {
    }
  },
  components: {
    NavItemAuth
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
