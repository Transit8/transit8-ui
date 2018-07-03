<template>
<div>
  <section class="hero is-primary">
  <!--
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1">Brightonmmm Blockchain</h1>
        <h2 class="subtitle is-3">Building Decentralised Applications</h2>
        <h3 class="subtitle is-1">
          <button class="button"><a href="http://dcms.brightblock.org">Content Block</a></button>
        </h3>
      </div>
    </div>
    -->
  </section>
  <!-- <tipe-content class="page"/> -->
  <home-actions/>
</div>
</template>

<script>
import TipeContent from '@/components/home/TipeContent'
import HomeActions from '@/components/home/HomeActions'

export default {
  data () {
    return {
      prof: {},
      state: {}
    }
  },
  mounted () {
  },
  components: {
    TipeContent, HomeActions
  }
}
</script>

<style lang="sass" src="bulma">
</style>
