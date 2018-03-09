<template>
  <div class="modal is-active">
    <div class="modal-background" v-on:click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Login with Blockstack</p>
        <router-link to="/"><button class="delete" aria-label="close"></button></router-link>
      </header>
      <section class="modal-card-body content">
        <p>Content block is a decentralised CMS built on top of Blockstack and Bitcoin Blockchain!
        </p>
        <p>Blockstack are re-imagining the internet. A place where we own our own online identities
        and control our own posts, art work and media and decide with whom and how and when to share them!
        </p>
      </section>
      <footer class="modal-card-foot">
        <button v-on:click="close" class="modal-close is-large"></button>
        <button class="button" v-on:click="close">Cancel</button>
        <button class="button is-success is-pulled-right" v-on:click="login">Login</button>
      </footer>
    </div>
  </div>
</template>

<script>
import authorization from '@/services/authorization'
import router from '@/router/index'

export default {
  name: 'Login',
  methods: {
    close: () => {
      router.push('/')
    },
    login: () => {
      return authorization.login()
    }
  }
}
</script>

<style>
</style>
