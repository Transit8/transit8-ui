<template>
<aside class="menu">
  <p class="menu-label">
    Methods
  </p>
  <ul class="menu-list">
    <li>
      <button v-on:click="$emit('make-call', 'getNodeInfo')">node info</button>
    </li>
    <li>
      <button @click="$emit('make-call', 'getTips')">tips</button>
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  data () {
    return {
      link1Active: false,
      link2Active: false,
    }
  },
  mounted () {
  },
}
</script>

<style lang="scss">
</style>
