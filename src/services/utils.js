import SHA256 from 'crypto-js/sha256'
import _ from 'lodash'
import store from '@/storage/store'
import moment from 'moment'

const utils = {
  dt_Offset (serverTime, compareTime) {
    let message = 'Starts in: '
    if (serverTime > compareTime) {
      message = 'Finished: '
    }
    let now = moment(serverTime)
    let starts = moment(compareTime)
    let days = starts.diff(now, 'days')
    if (days !== 0) {
      message += Math.abs(days) + ' days '
    }
    starts = starts.subtract(days, 'day')
    let hours = starts.diff(now, 'hours')
    if (hours !== 0) {
      message += Math.abs(hours) + ' hours '
    }
    starts = starts.subtract(hours, 'hour')
    let mins = starts.diff(now, 'minutes')
    if (mins !== 0) {
      message += Math.abs(mins) + ' mins '
    }
    starts = starts.subtract(mins, 'minute')
    let seconds = starts.diff(now, 'seconds')
    if (seconds !== 0) {
      message += Math.abs(seconds) + ' secs '
    }
    if (serverTime > compareTime) {
      message += ' ago.'
    }
    return message
  },

  convertPrices (artwork, blockchainItem) {
    if (!blockchainItem) {
      return
    }
    if (!artwork.bcitem) {
      artwork.bcitem = {}
    }
    let priceInWei = blockchainItem.price
    let precision = 1000000000000000000
    let priceInEth = priceInWei / precision
    let fiatCurrency = artwork.saleData.fiatCurrency
    if (!fiatCurrency) {
      fiatCurrency = 'EUR'
    }
    let fiatRate = store.getters['conversionStore/getFiatRate'](fiatCurrency)
    let fiatToBtc = fiatRate['15m']
    let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
    let priceInBtc = priceInEth * ethToBtc
    let priceInFiat = priceInBtc * fiatToBtc

    _.merge(artwork.bcitem, blockchainItem)
    artwork.bcitem.fiatCurrency = fiatCurrency
    artwork.bcitem.fiatCurrencySymbol = fiatRate.symbol
    artwork.bcitem.priceInEth = Math.round(priceInEth * 100000) / 100000
    artwork.bcitem.priceInFiat = Math.round(priceInFiat * 100) / 100
    artwork.bcitem.priceInBtc = Math.round(priceInBtc * 100000) / 100000
  },

  buildArtworkHash (artworkUrl) {
    if (artworkUrl && artworkUrl.length > 0) {
      return '0x' + SHA256(artworkUrl).toString()
    }
  },
  buildGaiaUrl (gaiaUrl, artworkId) {
    let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    // let url = null
    // building gaiaUrl from userProfile data is possibly more efficient but it seems to give the wrong value..
    // if (userProfileGaiaUrl) {
    //  url = userProfile.gaiaUrl + indexData.id + '.json'
    // }
    let urlLastSlash = gaiaUrl.lastIndexOf('/')
    let url = gaiaUrl.substring(0, urlLastSlash)
    if (!url.endsWith('/')) {
      url = url + '/'
    }
    return url + gaiaArtworkFileName + artworkId + '.json'
  },
  buildInitialSaleData () {
    return {
      soid: 0,
      amount: 0,
      reserve: 0,
      increment: 0,
      fiatCurrency: 'EUR',
      initialRateBtc: 0,
      initialRateEth: 0,
      amountInEther: 0,
      auctionId: 0,
    }
  },
  valueInEther (fiatRate, amount, precision) {
    let conversion = fiatRate['15m']
    let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
    conversion = conversion * ethToBtc
    if (typeof amount === 'string') {
      amount = Number(amount)
    }
    if (typeof amount === 'number') {
      conversion = amount / conversion
    }
    return Math.round(conversion * precision) / precision
  },

  buildSaleDataFromUserInput (auctionId, currency, userSaleData) {
    let fiatRate = store.getters['conversionStore/getFiatRate'](currency)
    let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
    let saleData = {}
    saleData.soid = (auctionId) ? 2 : 1
    saleData.amount = Number(userSaleData.amount)
    saleData.reserve = Number(userSaleData.reserve)
    saleData.increment = Number(userSaleData.increment)
    saleData.fiatCurrency = currency
    saleData.initialRateBtc = fiatRate['15m']
    saleData.initialRateEth = ethToBtc
    saleData.amountInEther = utils.valueInEther(fiatRate, saleData.amount, 100000000)
    saleData.auctionId = auctionId
    return saleData
  },

  convertFromBlockstack: function (record) {
    if (!record.indexData.uploader || !record.indexData.id) {
      throw new Error({ERR_CODE: 200, error: 'Uploader and id must be present.'})
    }
    let artworkData = this.getArtworkData(record.provData)
    return _.merge(artworkData, {
      id: record.indexData.id,
      title: record.indexData.title,
      gaiaUrl: record.provData.gaiaUrl,
      bcitem: record.provData.bcitem,
      description: record.indexData.description,
      keywords: record.indexData.keywords,
      itemType: record.indexData.itemType,
      uploader: record.indexData.uploader,
      artist: (record.indexData.artist) ? record.indexData.artist : record.indexData.uploader,
      owner: (record.indexData.owner) ? record.indexData.owner : record.indexData.uploader,
      saleData: record.indexData.saleData,
      editions: (record.indexData.editions) ? record.indexData.editions : 1,
    })
  },

  convertToBlockstack: function (artwork) {
    if (!artwork.uploader || !artwork.id) {
      throw new Error({ERR_CODE: 200, error: 'Uploader and id must be present.'})
    }
    let indexData = {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      itemType: artwork.itemType,
      keywords: artwork.keywords,
      uploader: artwork.uploader,
      owner: artwork.owner,
      artist: artwork.artist,
      editions: (artwork.editions) ? artwork.editions : 1,
    }

    if (artwork.saleData) {
      indexData.saleData = artwork.saleData
    } else {
      indexData.saleData = utils.buildInitialSaleData()
    }

    let provData = {
      id: artwork.id,
      images: artwork.images,
      artwork: artwork.artwork,
      supportingDocuments: artwork.supportingDocuments,
      bcitem: artwork.bcitem,
    }
    if (artwork.artwork && artwork.artwork.length > 0) {
      provData.derivedTimestamp = utils.buildArtworkHash(artwork.artwork[0].dataUrl)
    }
    return {
      indexData: indexData,
      provData: provData
    }
  },

  getArtworkData: function (provData) {
    let artworkData = {
      artwork: provData.artwork,
      images: provData.images,
      supportingDocuments: provData.supportingDocuments,
      bcitem: provData.bcitem,
    }
    if (provData && provData.artwork && provData.artwork[0] && provData.artwork[0].dataUrl.length > 0) {
      artworkData.image = provData.artwork[0].dataUrl
      artworkData.timestamp = utils.buildArtworkHash(provData.artwork[0].dataUrl)
    } else {
      artworkData.image = '/static/images/artwork1.jpg'
    }
    return artworkData
  }
}

export default utils
