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
      <search-form @submit="searchIndex($event)"/>
      <user-menu :user-data="userData" class="pull-right col-md-2"/>
      <languages :languages="languages" @change="changeLanguage($event)" class="pull-right"/>
    </div>
    <div id="menu" class="menu" :class="{'open': showNavigation}">
      <ul>
        <li>
          <router-link to="/artworks">Artworks</router-link>
        </li>
        <li>
          <router-link to="/artists">Artists</router-link>
        </li>
        <li>
          <router-link to="/blog">Blog</router-link>
        </li>
        <li>
          <router-link to="/competition">Competitions</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <!-- End navbar -->
</template>

<script>
import BrightBlockAuth from 'bright-block-auth/src/components/auth/BrightBlockAuth'
import authorization from 'bright-block-auth'
import provenanceService from '@/services/provenance/ProvenanceService'
import messagingService from '@/services/webrtc/messagingService'
import AuthLinks from './AuthLinks'
import Languages from './Languages'
import SearchForm from './SearchForm'
import UserMenu from './UserMenu'

// noinspection JSUnusedGlobalSymbols
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
      queryString: null,
      languages: [
        { name: 'English', iso: 'en' },
        // { name: 'Korean', iso: 'ko' },
        // { name: 'Arabic', iso: 'ar' },
      ],
      userData: {},
    }
  },
  mounted () {
    let userData = provenanceService.getUserData()
    this.userData = userData

    if (userData) {
      this.username = userData.username
      this.showAdmin = true
    }
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
    searchIndex (query) {
      this.$router.push({ path: '/search', query: { title: query } })
    },
    changeLanguage (iso) {
      console.log(iso)
      // TODO add language change logic
    }
  },
  components: {
    UserMenu,
    SearchForm,
    Languages,
    AuthLinks,
    BrightBlockAuth,
  }
}
</script>
