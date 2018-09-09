<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-120">
          <h1 class="innerpage">My Artworks <span>Artworks added: {{artworks.length}}</span></h1>
          <div class="container-fluid footer-bottom">
            <div class="col-sm-12">
              <artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
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
  name: 'MyArtworks',
  components: { ArtworksList },
  data () {
    return {
      artworks: [
        {
          id: '1',
          image: '/static/images/artwork1.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork2.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork3.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork4.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork5.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork6.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork1.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
        {
          id: '1',
          image: '/static/images/artwork2.jpg',
          caption: 'First Last (name)',
          title: 'Untitled, 2018',
        },
      ]
    }
  }
}
</script>
