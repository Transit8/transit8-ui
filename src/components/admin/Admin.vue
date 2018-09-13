<template>
<section class="main-page">
  <div class="columns">
    <div class="column is-one-fifth" style="padding: 30px">
      <admin-actions/>
    </div>
    <div class="column">
      <router-view></router-view>
    </div>
  </div>
</section>
</template>

<script>
import AdminActions from '@/components/admin/AdminActions'

export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  components: {
    AdminActions
  }
}
</script>

<style>
.main-page {
  margin: 50px 100px;
}
</style>
