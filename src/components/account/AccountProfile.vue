<template>
<div class="columns">
  <div class="column">
    Profile Info {{ profile }}
  </div>
</div>
</template>

<script>
import authorization from 'bright-block-auth'

export default {
  data () {
    return {
      profile: {}
    }
  },
  mounted () {
    this.profile = authorization.lookupUserProfile()
  },
  components: {
  }
}
</script>

<style>
</style>
