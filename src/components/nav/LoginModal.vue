<template>
  <div>
    <div v-if="modalType === 'login'">
      <uiv-modal :value="isModalActive" :append-to-body="true">
        <div slot="title"><i class="glyphicon glyphicon-heart"></i> Login</div>

        <p>Login to brightblock uses your own id.</p>
        <p>You can get one from <a href="https://blockstack.org">blockstack</a>!</p>

        <div slot="footer">
          <p class="is-size-7"><a v-on:click="login">Signin</a> without multiplayer support if your zone file is linked
            to
            dropbox or you have an anonymous address.</p>
        </div>
      </uiv-modal>
    </div>
    <div v-else>
      <uiv-modal v-if="modalType !== 'login'" v-model="isModalActive" :append-to-body="true">
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
          <p class="is-size-7"><a v-on:click="login">Signin</a> without multiplayer support if your zone file is linked
            to
            dropbox or you have an anonymous address.</p>
        </div>
      </uiv-modal>
    </div>
  </div>
</template>

<script>
import authorization from 'bright-block-auth'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LoginModal',
  props: {
    isModalActive: {
      type: Boolean,
      default: false,
    },
    modalType: {
      type: String,
      default: 'login',
    }
  },
  methods: {
    close () {
      // this.isModalActive = false
      // this.$router.push('/')
      this.$emit('closed')
    },
    login: () => {
      return authorization.login()
    },
    loginMultiPlayer: () => {
      return authorization.loginMultiPlayer()
    }
  }
}
</script>
