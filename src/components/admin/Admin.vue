<template>
<section class="main-page">
  <div class="row">
    <div class="col-sm-2">
      <admin-actions/>
    </div>
    <div class="col-sm-10">
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
