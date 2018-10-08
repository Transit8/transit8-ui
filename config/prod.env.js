'use strict'
const abi = require('./abi/ArtMarket')
console.log(abi)

module.exports = {
  NODE_ENV: '"production"',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  ETH_GATEWAY_URL: '"https://api.brightblock.org"',
  SEARCH_INDEX_URL: '"https://api.brightblock.org"',
  ETHEREUM_NETWORK: '"Ropsten (3)"',
  ETHEREUM_ABI: '\'' + abi + '\'',
}
