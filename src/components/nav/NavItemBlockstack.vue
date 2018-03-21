<template>
<div class="navbar-item has-dropdown" v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
  <div class="navbar-link">
    Blockstack Info
  </div>
  <div class="navbar-dropdown">
    <div class="navbar-item is-size-6 has-text-primary">
      Source Code
    </div>
    <a
      href="https://github.com/blockstack/blockstack.js/blob/master/src/auth/README.md"
      class="navbar-item"
      target="_blank">
      blockstack.js
    </a>

    <hr class="navbar-divider">
    <div class="navbar-item is-size-6 has-text-primary">
      Forum
    </div>
    <a
      href="https://forum.blockstack.org/"
      class="navbar-item"
      target="_blank">
      blockstack forum
    </a>

    <hr class="navbar-divider">
    <div class="navbar-item is-size-6 has-text-primary">
      API Docs
    </div>
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
      blockstack js
    </a>

    <hr class="navbar-divider">
    <div class="navbar-item is-size-6 has-text-primary">
      Tutorials
    </div>
    <a
      href="https://blockstack.org/tutorials/multi-player-storage"
      class="navbar-item"
      target="_blank">
      Multi Player Storage
    </a>
    <a
      href="https://blockstack.org/tutorials/managing-data-with-gaia"
      class="navbar-item"
      target="_blank">
      Gaia Data
    </a>
    <a
      href="https://blockstack.org/tutorials/todo-list"
      class="navbar-item"
      target="_blank">
      Todo List
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
