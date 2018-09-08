<template>
  <!-- Navbar -->
  <nav class="navbar navbar-default">
    <div class="navbar-header col-md-4 col-xs-12">
      <button id="menu-toggle" type="button" class="navbar-toggle" @click="toggleNavigation()">
        <!-- data-toggle="collapse" data-target="#menu"  -->
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-menu"></span>
      </button>
      <router-link class="logo" to="/">sybella</router-link>
    </div>
    <div class="navbar-right col-md-8 col-xs-12">
      <div class="search-form col-md-6 col-md-offset-2 col-xs-12 col-xs-offset-0">
        <input type="text" class="form-control" placeholder="Search">
        <span class="icon-search"></span>
      </div>
      <ul class="list-inline language-menu col-md-4 col-xs-12">
        <li><a href="#">English</a></li>
        <li><a href="#">Korean</a></li>
        <li><a href="#">Arabic</a></li>
        <router-link to="/admin/search/art" class="navbar-item" v-if="showAdmin">
          Admin
        </router-link>
      </ul>
    </div>
    <div id="menu" class="menu" :class="{'open': showNavigation}">
      <ul>
        <li><a href="#">Artworks</a></li>
        <li><a href="#">Artists</a></li>
        <li><a href="#">Competitions</a></li>
        <li><a href="#">About</a></li>
      </ul>

      <auth-links/>
    </div>
  </nav>
  <!-- End navbar -->

  <!--
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
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
        <bright-block-auth showAccountLink="true"/>
      </div>
    </div>
  </nav>
  -->
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
import AuthLinks from './AuthLinks'

export default {
  name: 'Navigation',
  data: () => {
    return {
      username: '',
      isActive: false,
      loggedIn: false,
      showAdmin: false,
      isModalActive: true,
      debug: false,
      peers: messagingService.peers,
      showNavigation: false,
    }
  },
  mounted () {
    let userData = provenanceService.getUserData()
    if (userData) {
      this.username = userData.username
      this.showAdmin = true
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
  watch: {
    '$route' () {
      this.showNavigation = false
    }
  },
  methods: {
    toggleNavigation () {
      this.showNavigation = !this.showNavigation
    },
  },
  components: {
    AuthLinks,
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
