<template>
  <section id="homepage-slider" class="pb-0">
    <div class="top-bg"></div>
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12">
          <uiv-carousel :indicators="true" :controls="false" :interval="8000" ref="carousel" class="slider">
            <uiv-slide v-for="(slide, index) in slides" :key="index">
              <div style="width: 100%;height: 969px; background-size:cover"
                   :style="{backgroundImage: 'url(' + slide.image + ')'}"></div>
              <div class="slider-content">
                <h2 class="title-big">{{slide.title}}</h2>
                <h3 class="subtitle">{{slide.subtitle}}</h3>
                <a class="button btn btn-sm black-bg white" :href="slide.url">Explore</a>
              </div>
            </uiv-slide>
          </uiv-carousel>
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
      default() {
        return []
      }
    }
  },
  data() {
    return {
      slide: 0,
    }
  },
}
</script>
