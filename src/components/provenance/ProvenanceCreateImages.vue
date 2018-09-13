<template>
<div class="columns">
  <div class="column is-one-fifth" v-bind:name="file.lastModifiedDate">
    {{ file.lastModifiedDate }}
  </div>
  <div class="column is-one-fifth" v-bind:name="file.name">
    {{ file.name }}
  </div>
  <div class="column is-one-fifth" v-bind:name="file.size">
    {{ file.size }}
  </div>
  <div class="column is-one-fifth" v-bind:name="file.type">
    {{ file.type }}
  </div>
  <div class="column is-one-fifth" v-bind:name="file.type">
    <img :src=file.dataUrl alt="none"/>
  </div>
</div>
</template>

<script>

export default {
  props: ['file'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
<style scoped>
#item-images {
  width: 100px;
  height: 40px;
  border: 1pt dashed #ccc;
}
#drop_area {
  width: 100%;
  height: 50px;
  background-color: #00f3f3;
  text-align: center;
  padding: 20px;
  padding: 5px;
  border: 1pt dashed #3366dd;
}

</style>
