import SHA256 from 'crypto-js/sha256'

const utils = {
  buildArtworkHash (artworkUrl) {
    return '0x' + SHA256(artworkUrl).toString()
  }
}

export default utils
