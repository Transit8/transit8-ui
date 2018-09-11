<template>
  <div>
    <div class="user-menu">
      <uiv-dropdown menu-right>
        <uiv-btn><span class="icon-user"></span></uiv-btn>
        <template v-if="loggedIn" slot="dropdown">
          <li class="delimited">
            <span>{{username}}</span>
          </li>
          <li>
            <router-link to="/my-artworks" class="navbar-item">
              My Art Work
            </router-link>
          </li>
          <li>
            <router-link to="/provenance/create" class="navbar-item">
              Upload Artwork
            </router-link>
          </li>
          <li>
            <router-link to="/search" class="navbar-item">
              Search
            </router-link>
          </li>
          <li>
            <router-link to="/admin/search/art" class="navbar-item" v-if="showAdmin">
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
          <li v-if="!cantLogIn">
            <a href="#" @click.prevent="openModal()">
              Login
            </a>
          </li>
          <li v-if="cantLogIn">
            <router-link to="/getBrowser">
              Download the Blockstack Browser
            </router-link>
          </li>
        </template>
      </uiv-dropdown>
    </div>

    <div v-if="!cantLogIn">
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
    <div v-else>
      <uiv-modal v-model="isModalActive" :append-to-body="true">
        <div slot="title"><i class="glyphicon glyphicon-heart"></i> Download Blockstack - Own Your Online Identity</div>

        <ol>
          <li><a href="#" v-on:click="login">Download Blockstack</a></li>
          <li>Buy you're own online identity (requires bitcoin)</li>
          <li>Switch back to this tab and login</li>
        </ol>
        <p>Why? Good question. Blockstack are re-imagining the internet. A place where we own our own online
          identities.
          Where we control our own posts and art work and media and decide with whom and how and when to share them.
          In effect Blockstack
          are pulling then internet inside so rather than a small number of enormous companies owning and controlling
          everything the
          actual makers and creators on the internet have control!
        </p>
        <p>After all isn't this the original dream?</p>

        <div slot="footer">
          <button @click="closeModal" class="btn btn-primary">Cancel</button>
          <button class="btn btn-success" v-on:click="openModal">Get Started</button>

          <p class="is-size-7"><a v-on:click="openModal">Signin</a> without multiplayer support if your zone file is
            linked to dropbox or you have an anonymous address.</p>
        </div>
      </uiv-modal>
    </div>
  </div>
</template>

<script>
import authorization from 'bright-block-auth'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'UserMenu',
  data () {
    return {
      loggedIn: false,
      showAdmin: false,
      cantLogIn: false,
      name: null,
      username: null,
      isModalActive: false,
    }
  },
  mounted () {
    if (authorization.isLoggedIn()) {
      this.setLoginData()
    } else if (authorization.isPending()) {
      authorization.handlePending().then(() => {
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
    setLoginData () {
      authorization.getUserData().then((account) => {
        /*
        this.avatarUrl = account.avatarUrl
        if (this.avatarUrl && this.avatarUrl.length > 0) {
          this.hasAvatar = true
        }
        */
        this.name = account.name
        if (!this.name || this.name.length === 0) {
          this.name = account.username
        }
        this.username = account.username
        this.showAdmin = true
        this.loggedIn = true
      })
    },
    logout () {
      localStorage.clear()
      sessionStorage.clear()
      authorization.logout()
    },
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
    login: () => {
      return authorization.login()
    },
    loginMultiPlayer: () => {
      return authorization.loginMultiPlayer()
    },
  }
}
</script>
