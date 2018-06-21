<template>
<aside class="menu">
  <p class="menu-label">
    Data Types
  </p>
  <ul class="menu-list">
    <li>
      <button v-on:click="$emit('make-call', 'loadUserRecord')">User Record</button>
    </li>
    <li>
      <button @click="$emit('make-call', 'loadDAD')">Digital Art Definition</button>
    </li>
    <li>
      <button @click="$emit('make-call', 'loadPAD')">Physical Art Definition</button>
    </li>
    <li>
      <button @click="$emit('make-call', 'loadSaleInfo')">Sale Info</button>
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
