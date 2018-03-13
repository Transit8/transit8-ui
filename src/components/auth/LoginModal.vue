<template>
  <div class="modal" v-bind:class="{ 'is-active': isModalActive }" v-if="modalType === 'login'">
    <div class="modal-background" v-on:click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Login with Blockstack</p>
        <button class="delete" v-on:click="close" aria-label="close"></button>
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
        <button class="button is-success is-pulled-right" v-on:click="login">Signin with Blockstack</button>
      </footer>
    </div>
  </div>
  <div class="modal" v-bind:class="{ 'is-active': isModalActive }" v-else>
    <div class="modal-background" v-on:click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Download Blockstack - Own Your Online Identity</p>
        <button class="delete" v-on:click="close" aria-label="close"></button>
      </header>
      <section class="modal-card-body content">
        <ol>
          <li><a href="#" v-on:click="login">Download Blockstack</a></li>
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
        <button class="button is-success" v-on:click="login">Get Started</button>
      </footer>
    </div>
  </div>
</template>

<script>
import authorization from '@/services/authorization'

export default {
  name: 'Login',
  props: [
    'isModalActive',
    'modalType',
    'myMessage'
  ],
  data: () => {
    return {
      header1: 'Login with Blockstack',
      header2: 'Download the Blockstack Browser'
    }
  },
  methods: {
    close (event) {
      console.log('close: ' + this.isModalActive)
      this.$emit('closeModal', false)
    },
    login: () => {
      return authorization.login()
    }
  }
}
</script>

<style>
</style>
