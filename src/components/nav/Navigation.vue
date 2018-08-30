<template>
<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <!--
      <router-link class="fa-rotate-270" to="/" style="font-size:2.6em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
      <router-link class="fa-rotate-270" to="/" style="margin-left: 25px; margin-bottom: 0px; font-size:2.6em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
       -->
      <router-link to="/" style="font-size:1.6em; color:Tomato">
        OpenArtMarket
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
      <div v-if="loggedIn" class="navbar-item has-dropdown"  v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
        <div class="navbar-link">
          Session Users
        </div>
        <div class="navbar-dropdown is-right">
          <a class="navbar-item" v-for="peer in peers" :key="peer.username">{{ peer.username }}</a>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <router-link to="/admin/search/art" class="navbar-item" v-if="showAdmin">
        Admin
      </router-link>
      <router-link to="/provenance/list" class="navbar-item" v-if="loggedIn">
        My Art Work
      </router-link>
      <router-link to="/market/search" class="navbar-item">
        Search
      </router-link>
      <router-link to="/" class="navbar-item">
        Artists
      </router-link>
      <router-link to="/" class="navbar-item">
        Artworks
      </router-link>
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
import authorization from 'bright-block-auth'
import provenanceService from '@/services/provenance/ProvenanceService'
import messagingService from '@/services/webrtc/messagingService'

export default {
  name: 'Navigation',
  data: () => {
    return {
      isActive: false,
      loggedIn: false,
      showAdmin: false,
      isModalActive: true,
      debug: false,
      peers: messagingService.peers,
    }
  },
  mounted () {
    let userData = provenanceService.getUserData()
    if (userData) {
      let username = userData.username
      this.showAdmin = (username === 'mike.personal.id')
    }
    bulma.initDropdowns()
    if (this.$route.query && this.$route.query.debug) {
      this.debug = true
    }
    let $elfie = this
    let myTimer = setInterval(function () {
      let newloggedInState = authorization.isLoggedIn()
      if ($elfie.loggedIn !== newloggedInState) {
        $elfie.loggedIn = authorization.isLoggedIn()
        clearInterval(myTimer)
      }
    }, 500)
  },
  methods: {
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
