<template>
  <section id="homepage-slider" class="pb-0">
    <div class="top-bg"></div>
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12">
          <div class="slider-container">
            <uiv-carousel :indicators="true" :controls="false" :interval="8000" ref="carousel" class="slider"
                          v-model="slide" v-if="slides.length">
              <uiv-slide v-for="(sld, index) in slides" :key="index">
                <div class="slider-background" :style="{backgroundImage: 'url(' + sld.data.image.url + ')'}"></div>
                <div class="slider-content">
                  <h2 class="title-big">{{$prismic.richTextAsPlain(sld.data.title)}}</h2>
                  <h3 class="subtitle">{{$prismic.richTextAsPlain(sld.data.subtitle)}}</h3>
                  <prismic-link class="button btn btn-sm black-bg white" :field="sld.data.link">Explore</prismic-link>
                </div>
              </uiv-slide>
            </uiv-carousel>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#homepage slider -->
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Slider',
  props: {
    slides: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      /**
       * variable holding number of currently displayed slide
       */
      slide: 0,
    }
  },
}
</script>
