<template>
<section class="container">
  <account-display :account="account" :isModalActive="isModalActive" v-on:close-modal="closeModal"/>
  <div class="columns">
    <div class="column content is-8">
      <h1 class="title">Blockstack Namespace</h1>
      <div class="field">
        <label class="label">Lookup Name</label>
        <div class="control">
          <input
            v-model="username"
            class="input"
            type="text"
            placeholder="name of your project..">
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" v-on:click="enterName">View</button>
        </div>
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <div class="field">
        <label class="label">Or browse names by entering a page number</label>
        <div class="control">
          <input
            @change="changePage"
            v-model="page"
            class="input"
            type="text"
            placeholder="enter a page number..">
        </div>
      </div>
    </div>
  </div>
  <div class="columns is-multiline">
    <div class="column content is-2" v-for="name in names.data" :key="name">
        <p><a href="#" @click="clickName(name)">{{ name }}</a></p>
    </div>
  </div>
</section>
</template>
<script>
import authorization from 'bright-block-auth'
import AccountDisplay from '@/components/account/AccountDisplay'
// $ORIGIN muneeb.id       $TTL 3600 _http._tcp URI 10 1 "https://gaia.blockstack.org/hub/1J3PUxY5uDShUnHRrMyU6yKtoHEUPhKULs/0/profile.json"
// $ORIGIN mikecohen.id    $TTL 3600 _http._tcp URI 10 1 "https://www.dropbox.com/s/1pan4es3lkzf62s/profile.json?dl=1"
// $ORIGIN fredpignerol.id $TTL 3600 _http._tcp URI 10 1 "https://gaia.blockstack.org/hub/19SfFHhYViXN8ry1a5XXGSJ2GmMXM7VrMV/0/profile.json"
export default {
  name: 'AccountLookup',
  data () {
    return {
      page: 100,
      display: false,
      names: {},
      username: '',
      profile: {},
      isModalActive: false,
      account: {}
    }
  },
  components: {
    AccountDisplay
  },
  mounted () {
    authorization.fetchNames(this.page).then((names) => {
      this.names = names
    })
    authorization.getUserData().then((data) => {
      this.username = data.username
      console.log(data)
    })
  },
  methods: {
    clickName: function (name) {
      this.viewProfile(name)
    },
    enterName: function () {
      this.viewProfile(this.username)
    },
    viewProfile: function (name) {
      authorization.fetchName(name).then((account) => {
        if (account) {
          console.log('AccountLookup: account: ', account)
          this.account = account.data
          if (!this.account.zonefile || account.data.status === 'registered_subdomain') {
            this.account.zonefile = account.data.zonefile_txt
          }
          this.isModalActive = true
        }
      })
    },
    closeModal: function (event) {
      this.isModalActive = false
    },
    changePage: function (event) {
      authorization.fetchNames(this.page).then((names) => {
        this.names = names
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import "../../../node_modules/bulma/bulma.sass";
</style>
