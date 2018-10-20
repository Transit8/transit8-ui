'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  DEBUG_MODE: '"false"',
  TOK_BOX_API_KEY: '46171452',
})
