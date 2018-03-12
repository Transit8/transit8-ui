<template>
<div class="page">
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1">Brighton Blockchain</h1>
        <h2 class="subtitle is-3">Building Decentralised Applications</h2>
      </div>
    </div>
  </section>
  <cards/>
  <tipe-content />
</div>
</template>

<script>
import Cards from '@/components/home/Cards'
import TipeContent from '@/components/home/TipeContent'

export default {
  data: () => ({
  }),
  components: {
    Cards,
    TipeContent
  }
}
</script>

<style>
.page {
  margin-top: 50px;
}
</style>
