<template>
<div>
  <div>
    <uiv-modal :value="isModalActive" :append-to-body="true">
      <div slot="title"><h1 class="login-modal-title">Updating Data</h1></div>
      <div class="login-modal-body">
        <p>Please wait - we are updating the information.</p>
      </div>
      <div slot="footer">
        <div class="login-modal-footer">
          <button class="btn" v-on:click="closeModal">Close</button>
        </div>
      </div>
    </uiv-modal>
  </div>

  <form class="">
    <p v-if="errors.length" :key="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
      </ul>
    </p>

    <div class="form-group">
      <label>Auctioneer: {{username}}</label>
    </div>

    <div class="form-group">
      <label>Administrator: {{username}}</label>
      <p>Only the auction administrator is able to change information about the auction.</p>
    </div>

    <div class="form-group">
      <label>Title</label>
      <input class="form-control" placeholder="Title of your auction" v-model="auction.title">
    </div>

    <div class="form-group">
      <datetime type="datetime" v-model="auction.startDate" input-id="startDate">
        <label for="startDate" slot="before">Auction Starts&nbsp;&nbsp;&nbsp;</label>
        <input id="startDate" class="form-control">
      </datetime>
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea class="form-control" placeholder="Auction description - for marketing and discovery" v-model="auction.description"></textarea>
    </div>

    <div class="form-group">
      <label>Keywords</label>
      <textarea class="form-control" placeholder="Auction keywords - for marketing and discovery" v-model="auction.keywords"></textarea>
    </div>

    <div class="radio-inline">
      <label>
        <input type="radio" name="auction.privacy" value="private" v-model="auction.privacy">
        Private
      </label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" name="auction.privacy" value="public" v-model="auction.privacy" checked>
        Public
      </label>
    </div>

    <hr/>

    <div class="form-group">
      <button type="submit" class="btn btn-default" v-on:click.prevent="upload">Submit</button>
    </div>

  </form>
</div>
</template>

<script>
import moment from 'moment'
import { Datetime } from 'vue-datetime'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionUploadForm',
  components: {datetime: Datetime},
  props: ['auctionId', 'mode'],
  data () {
    return {
      isModalActive: false,
      errors: [],
      auction: {
        title: 'Egyptian Artworks Auction',
        description: 'Egyptian artifacts auctioned from a private collection',
        keywords: 'Egypt,Ancient,Sculpture',
        auctioneer: '',
        privacy: 'private',
        sellingList: []
      },
    }
  },
  mounted () {
    let auction = this.$store.getters['auctionsStore/myAuction'](this.auctionId)
    if (auction) {
      this.auction = auction
    } else {
      let daysTillStart = Math.floor(Math.random() * 14) + 7
      let dd = moment({}).add(daysTillStart, 'days')
      dd.hour(10)
      dd.minute(0)
      this.auction.startDate = dd.format() // '2018-10-18T11:05:00.000Z'
    }
  },
  computed: {
    username () {
      let profile = this.$store.getters['myAccountStore/getMyProfile']
      return profile.username
    },
  },
  methods: {
    upload: function () {
      if (this.validate()) {
        this.isModalActive = true
        let profile = this.$store.getters['myAccountStore/getMyProfile']
        this.auction.auctioneer = profile.username
        this.auction.administrator = profile.username
        if (this.mode === 'update') {
          this.auction.auctionId = this.auctionId
          this.$store.dispatch('auctionsStore/updateAuction', this.auction).then((auction) => {
            this.auction = auction
            this.$router.push('/auctions')
          })
        } else {
          this.auction.auctionId = moment({}).valueOf()
          this.$store.dispatch('auctionsStore/uploadAuction', this.auction).then((auction) => {
            this.auction = auction
            this.$router.push('/auctions')
          })
        }
      }
    },
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
    validate: function () {
      this.errors = []
      if (!this.auction.title) {
        this.errors.push('title required.')
      }
      if (moment(this.auction.startDate).isBefore(moment({}))) {
        this.errors.push('StartDate before now.')
      }
      if (!this.auction.description) {
        this.errors.push('description required.')
      }
      if (!this.auction.keywords) {
        this.errors.push('keywords required.')
      }
      if (this.errors.length > 0) {
        return false
      } else {
        return true
      }
    },
  }
}
</script>
<style>
</style>
