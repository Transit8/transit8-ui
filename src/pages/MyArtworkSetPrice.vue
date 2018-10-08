<template>
<section class="container" style="margin: 80px;">
  <div>
    <uiv-modal :value="isModalActive" :append-to-body="true">
      <div slot="title"><h1 class="login-modal-title">Updating Data</h1></div>
      <div slot="title"><h2 class="login-modal-title">{{myArtwork.title}}</h2></div>
      <div class="login-modal-body">
        <p v-html="message"></p>
      </div>
      <div slot="footer">
        <div class="login-modal-footer">
          <button class="btn" v-on:click="closeModal">Close</button>
        </div>
      </div>
    </uiv-modal>
  </div>

  <div class="row">
    <div class="col-md12">
      <h2>{{myArtwork.title}}</h2>
    </div>
  </div>
  <div class="row" v-if="saleData.soid == 0">
    <div class="col-md12">
      <p>This item will be listed on the site but will not be for sale.</p>
    </div>
  </div>
  <div class="row" v-else-if="saleData.soid == 1">
    <div class="col-md12">
      <p>This item can be bought for the price you specify.</p>
    </div>
  </div>
  <div class="row" v-else-if="saleData.soid == 2">
    <div class="col-md12">
      <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
    </div>
  </div>

  <form class="form-horizontal" style="margin: 0 150px;" @submit.prevent="setPrice">

    <p v-if="errors.length" :key="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
      </ul>
    </p>

    <div class="radio-inline">
      <label>
        <input type="radio" name="saleData.soid" value="0" v-model="saleData.soid" @click="errors = []">Listing</label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" name="saleData.soid" value="1" v-model="saleData.soid" @click="errors = []">Buy Now</label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" name="saleData.soid" value="2" v-model="saleData.soid" @click="errors = []">Bidding</label>
    </div>

    <hr/>

    <div class="form-group" v-if="saleData.soid > 0">
      <label for="currencyHelpBlock">Select Currency</label>
      <select class="form-control" v-model="currency">
        <option v-for="(value,key) in fiatRates" :key="key">{{ key }}</option>
      </select>
      <p id="currencyHelpBlock" class="form-text text-muted">
        {{conversionMessage}}
      </p>
    </div>

    <div v-if="saleData.soid == 1">
      <div class="form-group">
        <label>Amount {{currentSymbol}}</label>
        <input class="form-control" type="number" step="50" placeholder="Sale value of artwork" v-model="saleData.amount"  aria-describedby="amountHelpBlock">
        <p id="amountHelpBlock" class="form-text text-muted">
          {{valueInBitcoin(saleData.amount)}} Btc / {{valueInEther(saleData.amount)}} Eth
        </p>
      </div>
    </div>

    <div v-if="saleData.soid == 2">
      <div class="form-group">
        <label>Reserve {{currentSymbol}}</label>
        <input class="form-control" type="number" step="50" placeholder="Reserve price" v-model="saleData.reserve"  aria-describedby="reserveHelpBlock">
        <p id="reserveHelpBlock" class="form-text text-muted">
          This item will not sell if the bidding does not meet or exceed this amount.<br/>
          {{valueInBitcoin(saleData.reserve)}} Btc / {{valueInEther(saleData.reserve)}} Eth
        </p>
      </div>
      <div class="form-group">
        <label>Increment {{currentSymbol}}</label>
        <input class="form-control" type="number" step="50" placeholder="Increment value" v-model="saleData.increment"  aria-describedby="incrementHelpBlock">
        <p id="incrementHelpBlock" class="form-text text-muted">
          {{valueInBitcoin(saleData.increment)}} Btc / {{valueInEther(saleData.increment)}} Eth
        </p>
      </div>
    </div>

    <div class="form-group">
      <button type="submit" class="btn btn-default" @click.prevent="setPrice">Submit</button>
    </div>

  </form>
</section>
</template>

<script>
import ethereumService from '@/services/ethereumService'
import _ from 'lodash'
import notify from '@/services/notify'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkSetPrice',
  data () {
    return {
      errors: [],
      currency: 'EUR',
      message: 'Please wait - we are updating the price of your item on the blockchain.',
      isModalActive: false,
    }
  },
  created () {
    this.artworkId = Number(this.$route.params.artworkId)
  },
  computed: {
    saleData () {
      let artwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      let saleData = artwork.saleData
      if (!saleData) {
        saleData = {
          soid: 0,
          amount: 0,
          reserve: 0,
          increment: 0
        }
      }
      return saleData
    },
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },
    conversionMessage () {
      let fiatRate = this.$store.getters['conversionStore/getFiatRate'](this.currency)
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      let fiatToBtc = fiatRate['15m']
      let symbol = fiatRate['symbol']
      fiatToBtc = Math.round(fiatRate['15m'] * 100) / 100
      let fiatToEther = fiatRate['15m'] * ethToBtc
      let conversionMessage = '1 Bitcoin = ' + fiatToBtc + ' ' + symbol + ' / 1 Ether = ' + fiatToEther + ' ' + symbol
      return conversionMessage
    },
    currentSymbol () {
      if (this.fiatRates && this.currency && this.fiatRates[this.currency]) {
        return this.fiatRates[this.currency]['symbol']
      }
    },
    myArtwork () {
      return this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
    },
    ethToBtc () {
      return this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
    },
  },
  methods: {
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
    valueInBitcoin (amount) {
      let currentCurrency = this.fiatRates[this.currency]
      let conversion = currentCurrency['15m']
      return this.convert(amount, conversion, 100000000)
    },
    valueInEther (amount) {
      let currentCurrency = this.fiatRates[this.currency]
      let conversion = currentCurrency['15m']
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      conversion = conversion * ethToBtc
      return this.convert(amount, conversion, 100000000)
    },
    convert (amount, conversion, precision) {
      if (typeof amount === 'string') {
        amount = Number(amount)
      }
      if (typeof amount === 'number') {
        conversion = amount / conversion
      }
      return Math.round(conversion * precision) / precision
    },
    validate: function (saleData) {
      this.errors = []
      if (saleData.soid === 1) {
        if (!saleData.amount || saleData.amount === 0) {
          this.errors.push({ERR_CODE: 301, message: 'Amount required if selling by buy now.'})
        }
      } else if (saleData.soid === 2) {
        if (!saleData.reserve || saleData.reserve === 0) {
          this.errors.push({ERR_CODE: 302, message: 'Reserve required if selling by auction.'})
        }
        if (!saleData.increment || saleData.increment === 0) {
          this.errors.push({ERR_CODE: 303, message: 'Increment required if selling by auction.'})
        }
      }
    },
    setPrice: function () {
      this.saleData.soid = Number(this.saleData.soid)
      this.saleData.amount = Number(this.saleData.amount)
      this.saleData.reserve = Number(this.saleData.reserve)
      this.saleData.increment = Number(this.saleData.increment)
      this.saleData.fiatCurrency = this.currency
      this.saleData.initialRateBtc = this.fiatRates[this.currency]['15m']
      this.saleData.initialRateEth = this.ethToBtc
      this.saleData.amountInEther = this.valueInEther(this.saleData.amount)

      this.validate(this.saleData)
      if (this.errors.length > 0) {
        return
      }

      if (this.saleData.soid === 0) {
        this.saleData.initialRateBtc = 0
        this.saleData.initialRateEth = 0
        this.saleData.amountInEther = 0
      }
      if (this.saleData.soid === 0 || this.saleData.soid === 2) {
        this.saleData.amount = 0
      }
      if (this.saleData.soid === 0 || this.saleData.soid === 1) {
        this.saleData.reserve = 0
        this.saleData.increment = 0
      }

      let artwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      artwork.saleData = this.saleData
      this.message = 'Updating your user storage...'
      this.openModal()
      this.message = 'Calling blockchain to set the price...'
      let priceData = {
        itemIndex: artwork.bcitem.itemIndex,
        amountInWei: Math.trunc(artwork.saleData.amountInEther * 1000000000000000000)
      }
      let $self = this
      ethereumService.setPriceOnChain(priceData, function (result) {
        $self.closeModal()
        artwork.bcitem.setPriceTxId = result.txId
        artwork.bcitem.status = 'price-set'
        $self.$store.commit('myArtworksStore/addMyArtwork', artwork)
        $self.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
          notify.info({title: 'Register Artwork.', text: 'Your user storage has been updated.'})
        })
        $self.$store.dispatch('ethStore/fetchBlockchainItem', {timestamp: artwork.timestamp}).then((blockchainItem) => {
          if (blockchainItem) {
            _.merge(artwork.bcitem, blockchainItem)
            notify.info({title: 'Register Artwork.', text: 'Registration sent to blockchain.'})
          }
        })
        $self.message = 'Your artwork has been registered - please allow a few minutes for the transaction to complete...'
        notify.info({title: 'Register Artwork.', text: 'Your artwork has been registered - please allow a few minutes for the transaction to complete...'})
      }, function (error) {
        notify.error({title: 'Register Artwork.', text: 'Error setting price for your item. <br>' + error.message})
      })
      // this.$router.push('/my-artworks')
    }
  }
}
</script>
