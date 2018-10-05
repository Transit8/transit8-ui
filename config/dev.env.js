'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const abi = require('../../sybella-sol/truffle/build/contracts/ArtMarket')
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
  ETHEREUM_CONTRACT_ADDRESS: '"0x5D06B6b6653dbB62A4dC6CbABCBc719d7C5A3B46"',
  ETHEREUM_ABI: abi,
})
