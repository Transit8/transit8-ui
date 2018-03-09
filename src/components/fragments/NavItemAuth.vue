<template>
<div class="navbar-end">
  <nav-item-blockstack v-if="debug"/>
  <nav-item-dev-tools v-if="debug"/>
  <div class="navbar-item has-dropdown" v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
    <div v-if="loggedIn" class="navbar-link">
      <img
        class="rounded-circle avatar"
        v-bind:src="avatarUrl"/>
        {{ name }}
    </div>
    <div v-if="loggedIn" class="navbar-dropdown">
      <a @click="logout"
        class="navbar-item">
          {{ labelLogout }}
      </a>
    </div>
  </div>
  <router-link
    v-if="!loggedIn && !cantLogIn"
    class="navbar-item"
    to="/login">
      {{ labelLogin }}
  </router-link>
  <router-link
    v-if="cantLogIn"
    class="navbar-item"
    to="/getBrowser">
      Download Blockstack!
  </router-link>
</div>
</template>

<script>
import authorization from '@/services/authorization'
import bulma from '@/services/bulma'
import NavItemBlockstack from '@/components/fragments/NavItemBlockstack'
import NavItemDevTools from '@/components/fragments/NavItemDevTools'

export default {
  name: 'NavItemAuth',
  data: () => {
    return {
      debug: false,
      loggedIn: false,
      avatarUrl: '',
      name: '',
      isActive: false,
      cantLogIn: false,
      labelLogin: 'Blockstack Login',
      labelLogout: 'Blockstack Logout'
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.debug) {
      // this.router.push('/')
      this.debug = true
    }
    bulma.initDropdowns()
    if (authorization.isLoggedIn()) {
      this.avatarUrl = authorization.person.avatarUrl()
      this.name = authorization.person.name()
      this.loggedIn = true
    } else if (authorization.isPending()) {
      authorization.handlePending().then((data) => {
        console.log('userData: ' + data)
        this.avatarUrl = authorization.person.avatarUrl()
        this.name = authorization.person.name()
        this.loggedIn = true
      })
    }
    authorization.canLogIn().then((data) => {
      if (!data) {
        this.cantLogIn = true
      }
    })
  },
  methods: {
    logout: function (event) {
      authorization.logout()
    },
  },
  components: {
    NavItemBlockstack,
    NavItemDevTools
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
