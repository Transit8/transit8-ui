<template>
<section class="page">
  <div class="columns">
    <div class="column is-one-fifth">
        <eth-api-side-bar  v-on:make-call="onMakeCall"/>
    </div>
    <div class="column">
      <vue-json-pretty
        :response="{ key: 'value' }"
        :data="jsonStructure">
      </vue-json-pretty>
    </div>
  </div>
</section>
</template>

<script>
import EthApiSideBar from '@/components/eth/EthApiSideBar'
import VueJsonPretty from 'vue-json-pretty'

export default {
  data () {
    return {
      jsonStructure: {},
      userRecord: {
        username: 'my.id',
      },
      digitalItemDefinitionRecord: {
        id: 1,
        objectType: 'digitalImage',
        title: 'The Morning Star',
        summary: 'The star that rises in the morning and sets in at night',
        description: 'Deeper description of the work',
        artist: 'name of artist',
        created: 'date of creation',
        changed: 'last changed',
        assetClass: 'art',
        images: [
          {
            class: 'main',
            url: 'htp://...',
            bytes: '...ffdggf...',
            size: 101,
            format: 'jpg'
          }
        ],
        documents: [
          {
            type: 'description | valuation | condition report | ...',
            url: 'htp://...',
            bytes: '...ffdggf...'
          }
        ]
      },
      itemDefinitionRecord: {
        id: 1,
        objectType: 'art',
        title: 'The Morning Star',
        summary: 'The star that rises in the morning and sets in at night',
        description: 'Deeper description of the work',
        artist: 'name of artist',
        created: 'date of creation',
        changed: 'last changed',
        assetClass: 'art',
        images: [
          {
            class: 'main',
            url: 'htp://...',
            bytes: '...ffdggf...',
            size: 101,
            format: 'jpg'
          }
        ],
        documents: [
          {
            type: 'description | valuation | condition report | ...',
            url: 'htp://...',
            bytes: '...ffdggf...'
          }
        ]
      },
    }
  },
  mounted () {
  },
  methods: {
    onMakeCall: function (argument) {
      if (argument === 'loadDAD') {
        this.jsonStructure = this.digitalItemDefinitionRecord
      } else if (argument === 'loadPAD') {
        this.jsonStructure = this.itemDefinitionRecord
      } else {
        this.jsonStructure = this.userRecord
      }
    },
    handleClick: function (argument) {
      console.log('click')
    },
  },
  components: {
    EthApiSideBar,
    VueJsonPretty
  }
}
</script>

<style>
</style>
