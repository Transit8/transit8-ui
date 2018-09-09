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
import ethService from '@/services/experimental/ethApiService'
import provenanceService from '@/services/provenance/ProvenanceService'
import searchIndexService from '@/services/searchindex/SearchIndexService'

export default {
  data () {
    return {
      prof: {},
      userData: {},
      provenanceRecords: [],
      state: {}
    }
  },
  mounted () {
    let $elfie = this
    $elfie.registrations = []
    ethService.fetchNumberOfItems().then((numberOfItems) => {
      this.numberOfItems = numberOfItems
      for (let index = 0; index < 6; index++) {
        if (index === numberOfItems) {
          break
        }
        $elfie = this
        setTimeout(function timer () {
          ethService.fetchItemByIndex(index, 1).then((item) => {
            item.index = index
            let value = item[4].toString()
            console.log('item: ', item + ' value=' + value)
            $elfie.registrations.push(item)
            $elfie.searchIndex(item[0])
          })
        }, index * 3000)
      }
    })
  },
  methods: {
    searchIndex: function (query) {
      let $elfie = this
      searchIndexService.searchIndex('art', this.queryTerm, query)
        .then((results) => {
          $elfie.provenanceRecords = []
          console.log('Total records found in search (may differ from number fetched from gaia storage): ' + results.length)
          _.forEach(results, function (indexData) {
            provenanceService.getRecordForSearch(indexData)
              .then((record) => {
                console.log('Record: ' + record)
                if (record && record.indexData && record.indexData.id) {
                  $elfie.provenanceRecords.push(record)
                  $elfie.$emit('update:numbResults', $elfie.provenanceRecords.length)
                }
              })
              .catch(e => {
                console.log('Unable to get from: ', indexData)
              })
          })
        })
        .catch(e => {
          console.log('Unable to contact search index.', e)
        })
    },
  },
  components: {
    TipeContent
  }
}
</script>

<style lang="sass" src="bulma">
</style>
