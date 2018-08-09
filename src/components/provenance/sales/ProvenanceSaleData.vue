<template>
<div class="modal" v-bind:class="{ 'is-active': saleDataModalActive }">
  <div class="modal-background" v-on:click="close"></div>
  <div class="modal-card">
    <header class="modal-card-head">
    <p class="modal-card-title" v-if="recordForSaleData">{{ recordForSaleData.title }}</p>
      <button class="delete" v-on:click="close" aria-label="close"></button>
    </header>
    <section class="modal-card-body content">
    <div v-if="saleOptionSoid == 0">
      <h2 class="title is-4">Listing Only</h2>
      <p>This item will be listed on the site but will not be for sale.</p>
    </div>
    <div v-else-if="saleOptionSoid == 1">
      <h2 class="title is-4">Buy Now Enabled</h2>
      <p>This item can be bought for the price you specify.</p>
    </div>
    <div v-else-if="saleOptionSoid == 2">
      <h2 class="title is-4">Bidding Enabled</h2>
      <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
    </div>
    <form id="create-provenance" @submit="checkForm">
      <p v-if="errors.length" :key="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
        </ul>
      </p>
      <div class="field is-horizontal" style="margin-top: 30px;">
        <div class="field is-grouped is-grouped-left">
          <div class="field-label is-normal">
            <label class="label">Sale Option</label>
          </div>
          <div class="control">
            <label class="radio">
              <input type="radio" name="saleOptionSoid" value="0" v-model="saleOptionSoid"> Listing
            </label>
          </div>
          <div class="control">
            <label class="radio">
              <input type="radio" name="saleOptionSoid" value="1" v-model="saleOptionSoid"> Buy Now
            </label>
          </div>
          <div class="control">
            <label class="radio">
              <input type="radio" name="saleOptionSoid" value="2" v-model="saleOptionSoid"> Bidding
            </label>
          </div>
        </div>
      </div>
      <div v-if="saleOptionSoid == 1">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Amount</label>
          </div>
          <div class="field-body">
            <div class="field">
              <input class="input is-info" type="number" step="0.5" placeholder="Title the cost value" v-model="recordForSaleData.saleData.amount">
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="saleOptionSoid == 2">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Reserve</label>
          </div>
          <div class="field-body">
            <div class="field">
              <input class="input is-info" type="number" step="0.5" placeholder="Reserve price" v-model="recordForSaleData.saleData.reserve">
              <p class="help is-info">
                This item will not sell if the bidding does not meet or exceed this amount
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal" style="margin-top: 20px;">
          <div class="field-label is-normal">
            <label class="label">Increment</label>
          </div>
          <div class="field-body">
            <div class="field">
              <input class="input is-info" type="number" step="0.5" placeholder="The bidding increment" v-model="recordForSaleData.saleData.increment">
              <p class="help is-info">
                This is the amount the bidding will increase by with each bid (coming soon increment tables).
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="field is-grouped is-grouped-right" style="margin-top: 40px;">
        <div class="control has-text-right">
          <button class="button is-link" v-on:click="saveSaleData">Save</button>
        </div>
      </div>
    </form>
    </section>
  </div>
</div>
</template>

<script>
import provenanceService from '@/services/provenance/ProvenanceService'

export default {
  name: 'ProvenanceSaleData',
  props: ['recordForSaleData', 'saleDataModalActive'],
  data () {
    return {
      errors: [],
      saleOptionSoid: 0,
      username: null,
      saleOptions: provenanceService.saleOptions,
    }
  },
  mounted () {
    this.username = provenanceService.getUserData().username
    this.saleOptionSoid = this.recordForSaleData.saleData.saleOption.soid
  },
  computed: {
  },
  methods: {
    close (event) {
      this.$emit('close-sale-data-modal', false)
    },
    checkForm: function (e) {
      this.errors = []
      this.saleOptionSoid = Number(this.saleOptionSoid)
      if (!this.recordForSaleData.saleData || !this.recordForSaleData.saleData.saleOption) {
        this.errors.push({id: 300, message: 'Sale options required.'})
      }
      if (this.saleOptionSoid === 0) {
        this.recordForSaleData.saleData.amount = 0
        this.recordForSaleData.saleData.reserve = 0
        this.recordForSaleData.saleData.increment = 0
      } else if (this.saleOptionSoid === 1) {
        if (!this.recordForSaleData.saleData.amount || this.recordForSaleData.saleData.amount === 0) {
          this.errors.push({id: 301, message: 'Amount required if selling by buy now.'})
        }
      } else if (this.recordForSaleData.saleData.saleOption.soid === 2) {
        if (!this.recordForSaleData.saleData.reserve || this.recordForSaleData.saleData.reserve === 0) {
          this.errors.push({id: 302, message: 'Reserve required if selling by auction.'})
        }
        if (!this.recordForSaleData.saleData.increment || this.recordForSaleData.saleData.increment === 0) {
          this.errors.push({id: 303, message: 'Increment required if selling by auction.'})
        }
      }
    },
    saveSaleData: function (event) {
      event.preventDefault()
      this.recordForSaleData.saleData.saleOption.soid = Number(this.saleOptionSoid)
      this.checkForm()
      if (this.errors.length > 0) {
        return
      }
      let saleData = this.recordForSaleData.saleData
      provenanceService.updateSaleInfo(this.recordForSaleData.id, saleData)
        .then((records) => {
          console.log(records)
          this.$emit('close-sale-data-modal', {id: this.recordForSaleData.id, saleData: saleData})
        })
        .catch(e => {
          console.log('ProvenanceVue: Unable to lookup ', e)
        })
    }
  },
  components: {
  }
}
</script>

<style lang="sass" src="bulma">
</style>
