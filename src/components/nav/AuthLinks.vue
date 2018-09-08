<template>
  <div class="auth-links">
    <ul v-if="loggedIn">
      <li>
        <router-link to="/account/userData">
          My Account
        </router-link>
      </li>
      <li>
        <router-link to="/account/lookup">
          Who's who
        </router-link>
      </li>
      <li>
        <a href="#" @click.prevent="logout">
          Logout
        </a>
      </li>
    </ul>

    <ul v-if="!loggedIn">
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
    </ul>

    <div v-if="!cantLogIn">
      <uiv-modal :value="isModalActive" :append-to-body="true">
        <div slot="title"><i class="glyphicon glyphicon-heart"></i> Login</div>

        <p>Login to brightblock uses your own id.</p>
        <p>You can get one from <a href="https://blockstack.org">blockstack</a>!</p>

        <div slot="footer">
          <button class="btn btn-primary" v-on:click="closeModal">Cancel</button>
          <button class="btn btn-success is-pulled-right" v-on:click="loginMultiPlayer">Login</button>

          <p class="is-size-7">
            <a href="#" @click.prevent="login">Signin</a> without multiplayer support if your zone file is linked
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
  name: 'AuthLinks',
  data () {
    return {
      loggedIn: false,
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
  },
}
</script>
