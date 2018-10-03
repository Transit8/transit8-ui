import SHA256 from 'crypto-js/sha256'
import _ from 'lodash'
import store from '@/storage/store'

const utils = {
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
    }
  },
  convertFromBlockstack: function (record) {
    if (!record.indexData.uploader || !record.indexData.id) {
      throw new Error({ERR_CODE: 200, error: 'Uploader and id must be present.'})
    }
    let artworkData = this.getArtworkData(record.provData)
    return _.merge(artworkData, {
      id: record.indexData.id,
      title: record.indexData.title,
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
