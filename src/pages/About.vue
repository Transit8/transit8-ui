<template>
  <!-- Content -->
  <div>
    <section class="light-gray-bg black">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 pt-75">
            <div class="container-fluid">
              <div class="col-xs-12 col-sm-10">
                <h1 class="h3 m-0">{{$prismic.richTextAsPlain(content.data.intro)}}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="white-bg black">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 pt-60">
            <div class="container-fluid">
              <div class="col-md-6">
                <h2 class="h4">{{$prismic.richTextAsPlain(content.data.first_section_title)}}</h2>
              </div>
              <div class="col-md-6">
                <p class="font-size-24">
                  {{$prismic.richTextAsPlain(content.data.first_section_content)}}
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-12 pt-120">
            <div class="container-fluid">
              <div class="col-md-6">
                <h2 class="h4">{{$prismic.richTextAsPlain(content.data.second_section_title)}}</h2>
              </div>
              <div class="col-md-6">
                <p class="font-size-24">
                  {{$prismic.richTextAsPlain(content.data.second_section_content)}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- /Content-->
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'About',
  data () {
    return {
      content: {
        data: {}
      }
    }
  },
  mounted () {
    /**
     * Fetch content from prismic CMS
     */
    this.$prismic.client.getSingle('about_us')
      .then((document) => {
        this.content = document
      })
  }
}
</script>
