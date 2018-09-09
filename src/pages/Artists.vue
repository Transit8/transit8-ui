<template>
  <section class="light-gray-bg black">
    <div class="container wide pt-120">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="h4">Artists at Sybella</h2>
        </div>
        <div class="col-sm-12 pt-75 pt-30m">
          <artists-list :artists="artists"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArtistsList from '../components/artists/ArtistsList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artists',
  components: { ArtistsList },
  data () {
    return {
      artists: [
        { id: '1', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '2', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '3', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '4', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '5', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '6', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '7', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '8', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '9', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '10', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
        { id: '11', image: '/static/images/artist_preview.png', title: 'First Last (name)' },
      ]
    }
  }
}
</script>
