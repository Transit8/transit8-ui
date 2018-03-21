<template>
<div>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1">Brighton Blockchain</h1>
        <h2 class="subtitle is-3">Building Decentralised Applications</h2>
      </div>
    </div>
  </section>
  <tipe-content class="page"/>
</div>
</template>

<script>
import TipeContent from '@/components/home/TipeContent'

export default {
  data: () => ({
  }),
  components: {
    TipeContent
  }
}
</script>

<style lang="sass" src="bulma">
$blue: #72d0eb;
$primary: #000;
$primary: $blue;
$danger: $blue;
@import '~bulma/sass/utilities/_all'
@import '~bulma/sass/base/_all'
</style>
