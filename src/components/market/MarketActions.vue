<template>
<aside class="">
  <ul class="">
    <li>
      Found: {{ numbResults }}
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  props: ['numbResults'],
  data () {
    return {
    }
  },
  components: {
  }
}
</script>

<style>
aside {
  margin-left: 50px;
  margin-top: 50px;
}
</style>
