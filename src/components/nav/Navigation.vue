<template>
<div>
  <!-- Navbar -->
  <nav class="navbar navbar-default">
    <div class="container wide">
    <div class="navbar-header col-md-4 col-xs-12">
    <button id="menu-toggle" type="button" class="navbar-toggle" @click="toggleNavigation()">
        <!-- data-toggle="collapse" data-target="#menu"  -->
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-menu"></span>
      </button>
      <router-link to="/"><img class="logo" src="/static/images/sybella-logo.png" alt="Sybella logo"></router-link>
    </div>
    <div class="navbar-right col-md-8 col-xs-12">
      <search-form @submit="searchIndex($event)"/>
      <user-menu class="pull-right col-md-1"/>
      <languages :languages="languages" @change="changeLanguage($event)" class="pull-right"/>
    </div>
    </div>
  </nav>

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
</div>
  <!-- End navbar -->
</template>

<script>
import Languages from './Languages'
import SearchForm from './SearchForm'
import UserMenu from './UserMenu'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Navigation',
  data: () => {
    return {
      isModalActive: true,
      debug: false,
      showNavigation: false,
      queryString: null,
      languages: [
        { name: 'English', iso: 'en' },
        // { name: 'Korean', iso: 'ko' },
        // { name: 'Arabic', iso: 'ar' },
      ],
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.debug) {
      this.debug = true
    }
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
  }
}
</script>
