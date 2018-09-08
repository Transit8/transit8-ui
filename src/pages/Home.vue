<template>
  <div>
    <!-- Content -->
    <slider :slides="slides"/>
    <last-artworks :artworks="artworks"/>
    <div class="divider"></div>
    <latest-stories :stories="stories"/>
    <!-- /Content-->
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
import Slider from '../components/home/Slider'
import LastArtworks from '../components/home/LastArtworks'
import LatestStories from '../components/home/LatestStories'

export default {
  name: 'Home',
  components: { LatestStories, LastArtworks, Slider },
  data () {
    return {
      stories: [
        { id: '', image: '/static/images/artwork2.jpg', title: 'Story Title' },
        { id: '', image: '/static/images/artwork2.jpg', title: 'Story Title 2' },
        { id: '', image: '/static/images/artwork2.jpg', title: 'Story Title 3' },
      ],
      artworks: [
        { id: '', image: '/static/images/artwork1.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork2.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork3.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork4.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork5.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
        { id: '', image: '/static/images/artwork6.jpg', caption: 'First Last (name)', title: 'Untitled, 2017' },
      ],
      slides: [
        { image: '/static/images/slider.jpg', title: 'Title 1', subtitle: 'Subtitle 1', url: '#' },
        { image: '/static/images/slider.jpg', title: 'Title 2', subtitle: 'Subtitle 2', url: '#' },
        // { image: '/static/images/slider.jpg', title: 'Title 3', subtitle: 'Subtitle 3', url: '#' },
      ]
    }
  },
}
</script>
