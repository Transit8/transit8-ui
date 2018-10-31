import SHA256 from 'crypto-js/sha256'
import _ from 'lodash'
import store from '@/storage/store'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import {ec as EC} from 'elliptic'
import bitcoin from 'bitcoinjs-lib'
import bitcoinMessage from 'bitcoinjs-message'
import CryptoJS from 'crypto-js'
import bs58check from 'bs58check'

const UNCOMPRESSED_PUBKEY_HEADER = 27

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
    let fiatToBtc = 0
    let ethToBtc = 0
    let priceInBtc = 0
    let priceInFiat = 0
    let symbol = '?'

    let fiatRate = store.getters['conversionStore/getFiatRate'](fiatCurrency)
    if (fiatRate) {
      fiatToBtc = fiatRate['15m']
      ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
      priceInBtc = priceInEth * ethToBtc
      priceInFiat = priceInBtc * fiatToBtc
      symbol = fiatRate.symbol
    }

    _.merge(artwork.bcitem, blockchainItem)
    artwork.bcitem.fiatCurrency = fiatCurrency
    artwork.bcitem.fiatCurrencySymbol = symbol
    artwork.bcitem.priceInEth = Math.round(priceInEth * 100000) / 100000
    artwork.bcitem.priceInFiat = Math.round(priceInFiat * 100) / 100
    artwork.bcitem.priceInBtc = Math.round(priceInBtc * 100000) / 100000
  },

  buildWebrtcSessionData (data) {
    let pairs = data.split(',')
    let username = pairs[0].split('=')[1]
    let auctionId = pairs[1].split('=')[1]
    return {username: username, auctionId: auctionId}
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
      auctionId: undefined,
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
  },

  /**
   * Sign the given hex-encoded bytes.
   */
  signHex: function (bid) {
    const hash = CryptoJS.SHA3(bid, {outputLength: 256})
    const signature = utils.keypair.sign(hash.toString(CryptoJS.enc.Hex))
    return {
      v: UNCOMPRESSED_PUBKEY_HEADER + signature.recoveryParam,
      r: new BigNumber(signature.r.toString(16), 16),
      s: new BigNumber(signature.s.toString(16), 16),
    }
  },
  signBitcoin: function (publicKey, privkey, message) {
    // var addressHash = bitcoin.fromBase58Check(privkey).hash
    // var bscheck = bitcoin.toBase58Check(addressHash, this.layer1.pubKeyHash)
    // console.log(bscheck)
    var keyPair = bitcoin.ECPair.fromWIF(privkey)
    console.log(keyPair)
    var privateKey = keyPair.privateKey
    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
    console.log(signature.toString('base64'))

    publicKey = bs58check.encode(keyPair.publicKey)
    console.log(bitcoinMessage.verify(message, publicKey, signature))

    return signature.toString('base64')
    // => 'G9L5yLFjti0QTHhPyFrZCT1V/MMnBtXKmoiKDZ78NDBjERki6ZTQZdSMCtkgoNmp17By9ItJr8o7ChX0XxY91nk='
  },

  /**
   * Sign the given hex-encoded bytes.
   */
  generateKeyPair: function () {
    utils.ec = new EC('secp256k1')
    utils.keypair = utils.ec.genKeyPair()
    console.log('utils.keypair: ', utils.keypair)
  }

}

export default utils

utils.generateKeyPair()
