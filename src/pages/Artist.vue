<template>
  <div>
    <section class="white-bg black">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 pt-120">
            <artist-details :artist="artist"/>
          </div>
        </div>
      </div>
    </section>
    <div class="divider"></div>
    <section>
      <div class="container wide pt-60">
        <div class="row">
          <div class="col-sm-12">
            <h2 class="h4 mb-50">All artworks by {{artist.name}}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12" id="artist-all-artworks">
            <artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ArtistDetails from '../components/artists/ArtistDetails'
import SingleArtwork from '../components/artworks/SingleArtwork'
import ArtworksList from '../components/artworks/ArtworksList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: { ArtworksList, SingleArtwork, ArtistDetails },
  data () {
    return {
      artist: {
        name: 'Artist Name',
        description: 'Born in Osaka in 1978, Hiroe Saeki graduated from the Faculty of Fine Art, Kyoto Seika University in 2001.<br />Making her debut at the exhibition held at Taka Ishii Gallery in 2004, Saeki won the VOCA Encouragement Prize and held her first overseas solo exhibition at Galerie Almine Rech in Paris, in 2006.',
        image: '/static/images/artist_preview.png',
      },
      artworks: [
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork1.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork2.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork3.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork4.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork5.jpg',
        },
        {
          id: '1',
          caption: 'Artwork caption',
          title: 'Artwork title',
          image: '/static/images/artwork6.jpg',
        },
      ]
    }
  }
}
</script>
