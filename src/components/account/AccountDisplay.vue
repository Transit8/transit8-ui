<template>
<div class="modal" v-bind:class="{ 'is-active': isModalActive }">
  <div class="modal-background" v-on:click="close"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Account Information</p>
      <button class="delete" v-on:click="close" aria-label="close"></button>
    </header>
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
    </section>
    <footer class="modal-card-foot">
      <button v-on:click="close" class="modal-close is-large"></button>
      <button class="button" v-on:click="close">Cancel</button>
    </footer>
  </div>
</div>
</template>

<script>

export default {
  name: 'AccountDisplay',
  props: [ 'account', 'isModalActive' ],
  data () {
    return {
    }
  },
  components: {
  },
  methods: {
    close (event) {
      this.$emit('close-modal')
      // this.isModalActive = false
      // this.$router.push('/')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import "../../../node_modules/bulma/bulma.sass";
</style>
