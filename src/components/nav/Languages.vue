<template>
  <ul class="list-inline language-menu col-md-3">
    <li v-for="(lang, index) of languages" :key="index">
      <a href="#" @click.prevent="changeLanguage(lang.iso)">{{lang.name}}</a>
    </li>
  </ul>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Languages',
  props: {
    languages: {
      type: Array,
      default () {
        return []
      }
    },
  },
  methods: {
    changeLanguage (iso) {
      this.$emit('change', iso)
    }
  }
}
</script>
