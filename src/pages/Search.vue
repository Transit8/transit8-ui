<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">Search result for: {{ query }} <span>Results found: {{results.length}}</span></h1>
          <div class="container-fluid footer-bottom">
            <div class="col-sm-12">
              <artworks-list :artworks="results" :show-load-button="false" :chunks="6"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArtworksList from '../components/artworks/ArtworksList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Search',
  components: { ArtworksList },
  data () {
    return {
      results: [
        {
          id: '1',
          image: '/static/images/artwork1.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forSale: true
        },
        {
          id: '1',
          image: '/static/images/artwork2.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forSale: true
        },
        {
          id: '1',
          image: '/static/images/artwork3.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forAuction: true
        },
        {
          id: '1',
          image: '/static/images/artwork4.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forSale: true
        },
        {
          id: '1',
          image: '/static/images/artwork5.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forSale: true
        },
        {
          id: '1',
          image: '/static/images/artwork6.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forAuction: true
        },
        {
          id: '1',
          image: '/static/images/artwork1.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forSale: true
        },
        {
          id: '1',
          image: '/static/images/artwork2.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
          forSale: true
        },
      ],
      query: 'query string'
    }
  }
}
</script>
