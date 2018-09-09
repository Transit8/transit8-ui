<template>
  <div>
    <span class="grey">Join our mailing list and stay updated</span>
    <form class="form-inline newsletter-form" @submit.prevent="submit()">
      <input type="email" placeholder="Your email address" class="form-control input-lg grey" v-model="email">
      <button class="btn btn-lg black" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'NewsletterForm',
  data () {
    return {
      email: null,
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.email)
    }
  }
}
</script>
