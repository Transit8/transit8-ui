<template>
<div>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1">The Open Art Market</h1>
        <h2 class="subtitle is-3">Buy and sell direct from artists and collectors</h2>
        <h3 class="subtitle is-1">
          <button class="button"><a href="#/">No middle men in sight!</a></button>
        </h3>
      </div>
    </div>
  </section>
  <tipe-content class="page"/>
</div>
</template>

<script>
import TipeContent from '@/components/home/TipeContent'

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
    TipeContent
  }
}
</script>
