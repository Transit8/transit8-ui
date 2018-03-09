<template>
  <div class="modal is-active">
    <div class="modal-background" v-on:click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Download Blockstack - Own Your Online Identity</p>
        <router-link to="/"><button class="delete" aria-label="close"></button></router-link>
      </header>
      <section class="modal-card-body content">
        <ol>
          <li><a href="#" v-on:click="getBrowser">Download Blockstack</a></li>
          <li>Buy you're own online identity (requires bitcoin)</li>
          <li>Switch back to this tab and login</li>
        </ol>
        <p>Why? Good question. Blockstack are re-imagining the internet. A place where we own our own online identities.
        Where we control our own posts and art work and media and decide with whom and how and when to share them. In effect Blockstack
        are pulling then internet inside so rather than a small number of enormous companies owning and controlling everything the
        actual makers and creators on the internet have control!
        </p>
        <p>After all isn't this the original dream?</p>
      </section>
      <footer class="modal-card-foot">
        <button v-on:click="close" class="modal-close is-large"></button>
        <button class="button">Cancel</button>
        <button class="button is-success" v-on:click="getBrowser">Get Started</button>
      </footer>
    </div>
  </div>
</template>

<script>
import authorization from '@/services/authorization'
import router from '@/router/index'

export default {
  name: 'GetBrowser',
  methods: {
    close: () => {
      router.push('/')
    },
    getBrowser: () => {
      return authorization.login()
    }
  }
}
</script>

<style>
</style>
