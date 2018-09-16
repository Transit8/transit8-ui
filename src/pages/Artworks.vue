<template>
  <!-- Content -->
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">Explore & Collect Art on Sybella</h1>
        </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-lg-4">
            <filters @update="updateFilters($event)"/>
          </div>
          <div class="col-sm-12 col-lg-7 col-lg-offset-1">
            <div class="hr-spacer hr-mobile-spacer mb-100"></div>
            <h5 class="grey-medium normal-weight">{{artworks.length}} Artworks for sale</h5>
            <artworks-list :artworks="artworks" @load-more="loadMore()" />
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import Filters from '../components/artworks/Filters'
import ArtworksList from '../components/artworks/ArtworksList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artworks',
  components: { ArtworksList, Filters },
  data () {
    return {
      artworks: [
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title 1',
          image: '/static/images/artwork1.jpg',
          forSale: true
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork2.jpg',
          forAuction: true
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork3.jpg',
          forSale: true
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork4.jpg',
          forSale: true
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork5.jpg',
          forAuction: true
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork6.jpg',
          forSale: true
        },
      ],
      filters: {}
    }
  },
  methods: {
    updateFilters (filters) {
      this.filters = filters
    },
    loadMore () {
      //
    }
  }
}
</script>
