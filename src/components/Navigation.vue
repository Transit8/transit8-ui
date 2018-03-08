<template>
<nav class="navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <router-link class="fa-rotate-270" to="/" style="font-size:3em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
      <router-link class="fa-rotate-270" to="/" style="margin: -25px; font-size:3em; color:Tomato">
        <i class="fas fa-bicycle"></i>
      </router-link>
    </div>
    <div class="navbar-burger" data-target="navMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div id="navMenu" class="navbar-menu">
    <div class="navbar-end">
      <div class="navbar-item has-dropdown is-active">
        <a class="navbar-link">
          Blockstack Info
        </a>

        <div class="navbar-dropdown">
          <a
            href="https://blockstack.org"
            class="navbar-item"
            target="_blank">
            blockstack.org
          </a>
          <a
            href="https://core.blockstack.org"
            class="navbar-item"
            target="_blank">
            blockstack core
          </a>
          <hr class="navbar-divider">
          <a
            href="http://blockstack.github.io/blockstack.js/"
            class="navbar-item"
            target="_blank">
            blockstack portal
          </a>
        </div>
      </div>
      <router-link class="navbar-item" to="/login">Login</router-link>
      <router-link class="navbar-item" to="/signup">Signup</router-link>
    </div>
    </div>
</nav>
</template>

<script>
// import authorization from '../services/authorization'
document.addEventListener('DOMContentLoaded', function () {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target
        var $target = document.getElementById(target)
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active')
        $target.classList.toggle('is-active')
      })
    })
  }
})

export default {
  name: 'Navigation',
  data: () => {
    return {
      signedIn: false // authorization.isSignedIn()
    }
  },
  methods: {
    signout: function (event) {
      return false // authorization.signout()
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
