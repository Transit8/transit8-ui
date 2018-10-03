<template>
<section class="grey-light-bg black pt-60 about-artwork">
  <div class="container wide">
    <div class="row">
      <div class="col-sm-12">
        <div v-for="(registration, index) in registrations" :key="index">
          <p>{{registration}}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div v-for="(registration, index) in registrations" :key="index">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
          <vue-json-pretty
            :response="{ key: 'value' }"
            :data="registrations">
      </div>
    </div>
  </div>
</section>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
  data () {
    return {
    }
  },
  computed: {
    registrations () {
      return this.$store.getters['ethStore/getBlockchainItems']
    },
  },
  methods: {
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
