<template>
<aside class="menu">
  <p class="menu-label">
    Account
  </p>
  <ul class="menu-list">
    <li>
      <router-link
        to="/account/profile">
        Profile
      </router-link>
    </li>
    <li>
      <router-link
        to="/account/lookup">
        Lookup
      </router-link>
    </li>
    <li>
      <router-link
        to="/account/zonefile">
        Zonefile
      </router-link>
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  data () {
    return {
    }
  },
}
</script>

<style lang="scss">
</style>
