<template>
  <div>
    <div class="user-menu">
      <uiv-dropdown menu-right>
        <uiv-btn><span class="icon-user"></span></uiv-btn>
        <template v-if="loggedIn" slot="dropdown">
          <li class="delimited">
            <span>{{ username }}</span>
          </li>
          <li>
            <router-link to="/my-artworks" class="navbar-item">
              My Art Work
            </router-link>
          </li>
          <li>
            <router-link to="/my-artwork/upload" class="navbar-item">
              Upload Artwork
            </router-link>
          </li>
          <li>
            <router-link to="/search" class="navbar-item">
              Search
            </router-link>
          </li>
          <li>
            <router-link to="/admin/registrations" class="navbar-item" v-if="showAdmin">
              Admin
            </router-link>
          </li>
          <li>
            <router-link to="/account/userData">
              My Account
            </router-link>
          </li>
          <li>
            <a href="#" @click.prevent="logout">
              Logout
            </a>
          </li>
        </template>

        <template v-if="!loggedIn" slot="dropdown">
          <li>
            <a href="#" @click.prevent="openModal()">
              Login
            </a>
          </li>
        </template>
      </uiv-dropdown>
    </div>

    <div>
      <uiv-modal :value="isModalActive" :append-to-body="true">
        <div slot="title"><h1 class="login-modal-title">Login</h1></div>
        <div class="login-modal-body">
          <p>Login to brightblock uses your own id.</p>
          <p>You can get one from <a href="https://blockstack.org">blockstack</a>!</p>
          <span class="icon-smile"></span>
        </div>
        <div slot="footer">
        <div class="login-modal-footer">
          <button class="btn btn-block btn-white-outline" v-on:click="closeModal">Cancel</button>
          <button class="btn btn-block btn-black" v-on:click="loginMultiPlayer">Login</button>
        </div>
        <!-- TO DO - paragraph below is not in design, remove if not neccessary -->
        <p class="text-left">
          <a href="#" @click.prevent="login"><u>Signin</u></a> without multiplayer support if your zone file is linked
          to dropbox or you have an anonymous address.
        </p>
        </div>
      </uiv-modal>
    </div>
  </div>
</template>

<script>
import myAccountService from '@/services/myAccountService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'UserMenu',
  data () {
    return {
      isModalActive: false,
    }
  },
  created () {
    if (myAccountService.isPending()) {
      myAccountService.handlePending()
    }
  },
  computed: {
    username () {
      return this.$store.state.myAccountStore.myProfile.name
    },
    showAdmin () {
      return this.$store.state.myAccountStore.myProfile.showAdmin
    },
    loggedIn () {
      return this.$store.state.myAccountStore.myProfile.loggedIn
    },
  },
  methods: {
    logout () {
      localStorage.clear()
      sessionStorage.clear()
      myAccountService.logout()
    },
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
    login: () => {
      return myAccountService.login()
    },
    loginMultiPlayer: () => {
      return myAccountService.loginMultiPlayer()
    },
  }
}
</script>
