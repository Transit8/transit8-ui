<template>
<section class="modal-card-body content">
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Address</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.address }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">blockchain</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.blockchain }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">expire_block</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.expire_block }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">last_txid</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.last_txid }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">status</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.status }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">zonefile</p>
    </div>
    <div class="column">
      <div class="field">
        <div class="control">
          <textarea
            v-model="account.zonefile"
            class="textarea"
            placeholder="">
          </textarea>
        </div>
      </div>
      <p class="is-info">{{ account.zonefile }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">zonefile_hash</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.zonefile_hash }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2"></div>
    <div class="column">
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" v-on:click="updateZonefile">Update</button>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import authorization from 'bright-block-auth'
// $ORIGIN muneeb.id    $TTL 3600 _http._tcp URI 10 1 "https://gaia.blockstack.org/hub/1J3PUxY5uDShUnHRrMyU6yKtoHEUPhKULs/0/profile.json"
// $ORIGIN mikecohen.id $TTL 3600 _http._tcp URI 10 1 "https://www.dropbox.com/s/1pan4es3lkzf62s/profile.json?dl=1"

export default {
  name: 'AccountZonefile',
  data () {
    return {
      account: {}
    }
  },
  components: {
  },
  mounted () {
    authorization.fetchName(name).then((account) => {
      if (account) {
        console.log('AccountLookup: account: ', account)
        this.account = account.data
        if (!this.account.zonefile || account.data.status === 'registered_subdomain') {
          this.account.zonefile = account.data.zonefile_txt
        }
      }
    })
  },
  methods: {
    updateZonefile: function () {
      console.log(this.account)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import "../../../node_modules/bulma/bulma.sass";
</style>
