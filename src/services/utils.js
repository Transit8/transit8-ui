import SHA256 from 'crypto-js/sha256'

const utils = {
  buildArtworkHash (artworkUrl) {
    return '0x' + SHA256(artworkUrl).toString()
  },

  convertFromBlockstack: function (record) {
    let artworkData = this.getArtworkImage(record.provData)
    return {
      id: record.indexData.id,
      title: record.indexData.title,
      caption: record.indexData.description,
      artistUid: record.indexData.uploader,
      ownerUid: record.indexData.owner,
      image: artworkData.image,
      timestamp: artworkData.timestamp,
    }
  },

  getArtworkImage: function (provData) {
    if (provData && provData.artwork && provData.artwork[0] && provData.artwork[0].dataUrl.length > 0) {
      return {
        image: provData.artwork[0].dataUrl,
        timestamp: utils.buildArtworkHash(provData.artwork[0].dataUrl)
      }
    } else {
      return {
        image: '/static/images/artwork1.jpg',
        timestamp: null
      }
    }
  }
}

export default utils
