<template>
  <section>
    <router-link :to="url" :class="[artworkWidth]" class="col-xs-12 grid-item">
      <img :src="artwork.image" :alt="artwork.title">
    </router-link>
    <!-- TO DO: in design, artwork caption is artist name -->
    <p class="art-title">{{artwork.title}}</p>
    <p class="artwork-caption">{{artwork.caption}}</p>
    <p class="artwork-caption">Artist: {{artistProfile.name}}</p>
    <p class="artwork-caption">Owner: {{ownerProfile.name}}</p>
    <router-link :to="registerUrl" class="artwork-action" v-if="showRegister">Register</router-link>
    <router-link :to="editUrl" class="artwork-action" v-if="editable">Edit</router-link>
    <router-link :to="url" class="artwork-action" v-if="artwork.forSale">Buy</router-link>
    <router-link :to="url" class="artwork-action" v-if="artwork.forAuction">Bid</router-link>
    <button class="button" @click="deleteArtwork(artwork.id)">Delete</button>
  </section>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleArtwork',
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
  data () {
    return {
    }
  },
  mounted () {
    // let $self = this
    // let user = provenanceService.getUserProfile()
    // ethService.fetchArtworkByHash(this.artwork.timestamp, function (data) {
    //  if (data && !data.failed) {
    //    $self.canSetPrice = user.username === data[1]
    //  }
    // })
  },
  methods: {
    deleteArtwork (id) {
      this.$store.dispatch('myArtworksStore/deleteMyArtwork', id)
    }
  },
  computed: {
    editable (id) {
      return this.$store.getters['myArtworksStore/editable'](this.artwork.id)
    },
    showRegister () {
      let userProfile = this.$store.getters['myAccountStore/getProfile']
      return (this.artwork.timestamp && this.artwork.timestamp.length > 0 && userProfile.username === this.artwork.ownerUid)
    },
    artistProfile () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.artistUid)
    },
    ownerProfile () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.ownerUid)
    },
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    registerUrl () {
      return `/my-artworks/${this.artwork.id}`
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
