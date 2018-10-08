<template>
  <router-link :to="url" class="col-sm-12">
  <div class="row result-item">
  <div class="clearfix">
    <div class="col-sm-2">
     <img :src="artwork.image" :alt="artwork.title" class="img-responsive">
    </div>
    <div class="col-sm-3">
        <p class="art-title">{{artwork.title}}</p>
        <p class="artwork-caption">{{artwork.description}}</p>
    </div>
    <div class="col-sm-3" v-if="debugMode">
        <p class="art-title">Owner: {{artwork.owner}}</p>
        <p class="artwork-caption">Uploader: {{artwork.uploader}}</p>
        <p class="artwork-caption">Artist: {{artwork.artist}}</p>
        <p class="artwork-caption">SaleData: {{artwork.saleData.soid}} / {{artwork.saleData.amount}} {{artwork.saleData.fiatCurrency}} / {{artwork.saleData.amountInEther}}</p>
        <p class="artwork-caption">BCData: {{artwork.bcitem.owner}} / {{artwork.bcitem.price}}</p>
        <p class="artwork-caption">Location: {{artwork.gaiaUrl}}</p>
    </div>
    <div class="col-sm-7 col-description">
      <!--  TO DO: add real decription with keywords -->
     <!--   <p> Edition 1/1, Photography</p>
            <p>At vero eos et accusamus et iusto odio dignissimos...</p>
            <p class="grey-medium">Keywords:</p> -->
    </div>
        <router-link :to="url" class="artwork-action" v-if="artwork.forSale">Buy</router-link>
        <router-link :to="url" class="artwork-action" v-if="artwork.forAuction">Bid</router-link>
   </div>
   </div>
     <div class="divider divider-grey"></div>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleResult',
  props: {
    debugMode: false,
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
    registerUrl () {
      return `/provenance/register/${this.artwork.id}`
    },
    editUrl () {
      return `/provenance/edit/${this.artwork.id}`
    },
    url () {
      return `/artworks/${this.artwork.id}`
    }
  }
}
</script>
