<template>
<aside class="menu">
  <h3 class="menu-label">
    Manage Content
  </h3>
  <ul class="menu-list">
    <li>
      <a href="#" @click="clickName(name)">node info</a>
    </li>
    <li>
      <a href="#" @click="clickName(name)">addresses</a>
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  data: () => ({
  }),
  components: {
  }
}
</script>

<style lang="scss">
    @import "../../node_modules/bulma/bulma.sass";
</style>
