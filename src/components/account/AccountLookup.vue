<template>
<section class="container">
  <div class="columns">
    <div class="column content is-8">
      <h1 class="title">New Project</h1>
      <p>Provide a name and short description of your new project!</p>
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input
            v-model="name"
            class="input"
            type="text"
            placeholder="name of your project..">
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" v-on:click="viewProfile">View</button>
        </div>
        <div class="control">
            <router-link
              class="button"
              id="cancel-create-project"
              to="/projects"
              tag="button">
              Cancel
            </router-link>
        </div>
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column content is-8">
      {{ profile }}
    </div>
  </div>
</section>
</template>

<script>
import authorization from 'bright-block-auth'

export default {
  name: 'AccountLookup',
  data () {
    return {
      name: 'mikecohen.id',
      profile: {},
    }
  },
  components: {
  },
  methods: {
    viewProfile: function (event) {
      console.log('CreateProject: name: ' + this.name)
      // let prof = authorization.lookupUserProfile(this.name)
      // this.profile = prof
      authorization.lookupUserProfile(this.name).then((profile) => {
        if (profile) {
          console.log('AccountLookup: profile: ', profile)
          this.profile = profile
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import "../../../node_modules/bulma/bulma.sass";
</style>
