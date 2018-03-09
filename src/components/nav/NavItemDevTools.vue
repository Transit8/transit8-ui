<template>
<div class="navbar-item has-dropdown" v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
  <div class="navbar-link">
    Dev Tools
  </div>
  <div class="navbar-dropdown">
    <div class="navbar-item is-size-6 has-text-primary">
      Vuejs
    </div>
    <hr class="navbar-divider">
    <a
      href="https://vuejs.org/v2/style-guide/#Component-style-scoping-essential"
      class="navbar-item"
      target="_blank">
      Vue Style Guidelines
    </a>
    <a
      href="https://vuejs-templates.github.io/webpack/static.html"
      class="navbar-item"
      target="_blank">
      Vue Handling Static Assets
    </a>
    <div class="navbar-item is-size-6 has-text-primary">
      Bulma
    </div>
    <hr class="navbar-divider">
    <a
      href="https://bulma.io/"
      class="navbar-item"
      target="_blank">
      Bulma Home
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'NavItemDevTools',
  data: () => {
    return {
      isActive: false
    }
  }
}
</script>

<style>
</style>
