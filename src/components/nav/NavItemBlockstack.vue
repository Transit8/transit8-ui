<template>
<div class="navbar-item has-dropdown" v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
  <div class="navbar-link">
    Blockstack Info
  </div>
  <div class="navbar-dropdown">
    <div class="navbar-item is-size-6 has-text-primary">
      Github
    </div>
    <hr class="navbar-divider">
    <a
      href="https://github.com/blockstack/blockstack.js/blob/master/src/auth/README.md"
      class="navbar-item"
      target="_blank">
      blockstack.js
    </a>
    <div class="navbar-item is-size-6 has-text-primary">
      Website
    </div>
    <hr class="navbar-divider">
    <a
      href="https://core.blockstack.org"
      class="navbar-item"
      target="_blank">
      blockstack core
    </a>
    <a
      href="http://blockstack.github.io/blockstack.js/"
      class="navbar-item"
      target="_blank">
      blockstack portal
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'NavItemBlockstack',
  data: () => {
    return {
      isActive: false
    }
  }
}
</script>

<style>
</style>
