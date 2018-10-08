'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const abi = require('./abi/ArtMarket')
// const json = require('./abi/ArtMarket')
// truffleFile = json.load(open('./abi/ArtMarket.json'))
console.log(abi)

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  ETH_GATEWAY_URL: '"http://localhost:8191"',
  SEARCH_INDEX_URL: '"http://localhost:8191"',
  ETHEREUM_NETWORK: '"Rinkby (4)"',
  ETHEREUM_ABI: '\'' + JSON.stringify(abi) + '\'',
})
