<template>
<section class="section content">
  <div class="columns">
    <div class="column">
      <h1 class="is-title">Profile Information</h1>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Name</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.name }}</p>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Username</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.username }}</p>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Description</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.description }}</p>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Avatar Url</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.avatarUrl }}</p>
    </div>
  </div>
<!--
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">appPrivateKey</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.appPrivateKey }}</p>
    </div>
  </div>
-->
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">hubUrl</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.hubUrl }}</p>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Recent Apps</p>
    </div>
    <div class="column">
      <div class="columns is-mobile">
        <div class="column is-4">
          <p class="is-info"><b>d-app</b></p>
        </div>
        <div class="column">
          <div >
              <p class="is-info"><b>gaia storage location</b></p>
          </div>
        </div>
      </div>
      <div class="columns is-mobile" v-for="(value, key) in account.apps" v-bind:key="value">
        <div class="column is-4">
          <p class="is-info">{{ key }}</p>
        </div>
        <div class="column">
          <div >
              <p class="is-info">{{ value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</section>
</template>

<script>
import authorization from 'bright-block-auth'

export default {
  data () {
    return {
      account: {},
    }
  },
  mounted () {
    authorization.getUserData().then((account) => {
      this.account = account
    })
  },
  components: {
  }
}
</script>

<style lang="scss">
    @import "../../../node_modules/bulma/bulma.sass";
</style>
