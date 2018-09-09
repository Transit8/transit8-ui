<template>
  <section class="light-gray-bg black">
    <div class="container wide pt-120">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="h4">Resources</h2>
        </div>
        <div class="col-sm-12 pt-75 pt-30m">
          <div class="col-sm-12 p-0 artist-list" id="artist-all-artworks">
            <div class="row">
              <resource v-for="(resource, index) of resources" :key="index" :resource="resource"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Resource from '../components/resources/Resource'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Resources',
  components: { Resource },
  data () {
    return {
      resources: [
        {
          id: 1,
          image: '/static/images/artist_preview.png',
          title: 'Title',
          publishDate: '2018-09-09',
          version: '1.0.1'
        },
        {
          id: 1,
          image: '/static/images/artist_preview.png',
          title: 'Title',
          publishDate: '2018-09-09',
          version: '1.0.1'
        },
        {
          id: 1,
          image: '/static/images/artist_preview.png',
          title: 'Title',
          publishDate: '2018-09-09',
          version: '1.0.1'
        },
        {
          id: 1,
          image: '/static/images/artist_preview.png',
          title: 'Title',
          publishDate: '2018-09-09',
          version: '1.0.1'
        },
        {
          id: 1,
          image: '/static/images/artist_preview.png',
          title: 'Title',
          publishDate: '2018-09-09',
          version: '1.0.1'
        },
        {
          id: 1,
          image: '/static/images/artist_preview.png',
          title: 'Title',
          publishDate: '2018-09-09',
          version: '1.0.1'
        },
      ]
    }
  }
}
</script>
