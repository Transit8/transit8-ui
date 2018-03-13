<template>
  <div v-if="loggedIn" class="navbar-item has-dropdown"  v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
    <div class="navbar-link">
      <div v-if="hasAvatar">
      <img
        class="avatar"
        v-bind:src="avatarUrl"/>
      </div>
      <div v-else class="fa-large avatar">
        <i class="fas fa-user"></i>
      </div>
      {{ name }}
    </div>
    <div v-if="loggedIn" class="navbar-dropdown is-right">
      <a @click="logout"
        class="navbar-item">
          {{ labelLogout }}
      </a>
    </div>
  </div>
  <div
    v-else
    class="navbar-item has-dropdown"
    v-bind:class="{ 'is-active': isActive }" @click="isActive = ! isActive">
    <div class="navbar-link">
      Login
    </div>
    <login-modal v-bind:is-modal-active="isModalActive" v-bind:modal-type="modalType" @closeModal="closeModal"/>
    <div class="navbar-dropdown is-right">
      <a
        class="navbar-item"
        @click="openLoginModal">
            {{ labelLogin }}
      </a>
      <a
        class="navbar-item"
        @click="openDownloadModal">
            {{ labelDownload }}
      </a>
    </div>
  </div>
</template>

<script>
import LoginModal from './LoginModal'
import authorization from '../../services/authorization'

const bulma = {
  initDropdowns: function () {
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
  }
}

export default {
  name: 'BrightBlockAuth',
  data: () => {
    return {
      isModalActive: false,
      modalType: 'login',
      isActive: false,
      loggedIn: false,
      avatarUrl: '',
      hasAvatar: false,
      name: '',
      cantLogIn: false,
      labelLogin: 'Signin With Blockstack',
      labelDownload: 'Download the Blockstack Browser',
      labelLogout: 'Blockstack Logout'
    }
  },
  mounted () {
    bulma.initDropdowns()
    if (authorization.isLoggedIn()) {
      this.setLoginData()
    } else if (authorization.isPending()) {
      authorization.handlePending().then((data) => {
        this.setLoginData()
      })
    }
    authorization.canLogIn().then((data) => {
      if (!data) {
        this.cantLogIn = true
      }
    })
  },
  methods: {
    setLoginData: function () {
      this.avatarUrl = authorization.avatarUrl
      if (this.avatarUrl && this.avatarUrl.length > 0) {
        this.hasAvatar = true
      }
      this.name = authorization.name
      this.loggedIn = true
    },
    logout: function (event) {
      authorization.logout()
    },
    openLoginModal: function () {
      this.modalType = 'login'
      this.isModalActive = true
    },
    openDownloadModal: function () {
      this.modalType = 'download'
      this.isModalActive = true
    },
    closeModal: function (value) {
      this.isModalActive = false
    }
  },
  components: {
    LoginModal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar.is-dark .navbar-end > .navbar-item, .navbar.is-dark .navbar-end .navbar-link > .modal-card-body {
  color: #4a4a4a;
}
.avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.fa-large {
  font-size:2em;
}
</style>
