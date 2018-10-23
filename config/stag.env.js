'use strict'
const abi = require('./abi/ArtMarket')
console.log(abi)

module.exports = {
  NODE_ENV: '"staging"',
  DEBUG_MODE: '"false"',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  ETH_GATEWAY_URL: '"https://staging-api.transit8.com"',
  SEARCH_INDEX_URL: '"https://staging-api.transit8.com"',
  ETHEREUM_NETWORK: '"Rinkby (4)"',
  ETHEREUM_ABI: '\'' + JSON.stringify(abi) + '\'',
}
