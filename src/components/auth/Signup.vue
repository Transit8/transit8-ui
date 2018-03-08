<template>
  <div class="modal is-active">
    <div class="modal-background" v-on:click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create an Identity</p>
        <router-link to="/"><button class="delete" aria-label="close"></button></router-link>
      </header>
      <section class="modal-card-body">
        Welcome to decentralised login with blockstack!
      </section>
      <footer class="modal-card-foot">
        <router-link to="/"><button v-on:click="close" class="modal-close is-large"></button></router-link>
        <button class="button is-success" v-on:click="reroute">Download</button>
        <router-link to="/"><button class="button">Cancel</button></router-link>
      </footer>
    </div>
  </div>
</template>

<script>
import authorization from '@/services/authorization'
import router from '@/router/index'

export default {
  name: 'Signup',
  methods: {
    close: () => {
      router.push('/')
    },
    reroute: () => {
      return authorization.signin()
    },
    signup: () => {
      console.log('sign up')
    }
  }
}
</script>

<style>
</style>
