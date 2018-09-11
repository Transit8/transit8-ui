<template>
  <router-link :to="url" :class="[artworkWidth]" class="col-xs-12">
  <div class="row result-item clearfix">
    <div class="col-sm-2">
    <img :src="artwork.image" :alt="artwork.title" class="img-responsive">
    </div>
    <div class="col-sm-3">
        <p class="art-title">{{artwork.title}}</p>
        <p class="artwork-caption">{{artwork.caption}}</p>
    </div>
    <div class="col-sm-7">
      <!--  TO DO: add real decription with keywords -->
     <!--   <p> Edition 1/1, Photography</p>
            <p>At vero eos et accusamus et iusto odio dignissimos...</p>
            <p class="grey-medium">Keywords:</p> -->
    </div>
        <!--
        <p class="artwork-caption">{{artwork.owner}}</p>
        <p class="artwork-caption">{{artwork.state}}</p>
        -->
      <!--  <router-link :to="'provenance/register/'+artwork.id" class="artwork-action" v-if="artwork.showRegistration">Register</router-link>
        <router-link :to="'provenance/edit/'+artwork.id" class="artwork-action" v-if="artwork.showRegistration">Edit</router-link>
        <router-link :to="artwork.id" class="artwork-action" v-if="artwork.forSale">Buy</router-link>
        <router-link :to="artwork.id" class="artwork-action" v-if="artwork.forAuction">Bid</router-link> -->
   </div>
     <div class="col-xs-12 divider divider-grey"></div>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleResult',
  props: {
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  computed: {
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    url () {
      return `/artworks/${this.artwork.id}`
    }
  }
}
</script>
