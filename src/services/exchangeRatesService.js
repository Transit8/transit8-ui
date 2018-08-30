// import eventBus from '@/services/eventBus'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import xhrService from '@/services/xhrService'

const SERVER_URL = process.env.SEARCH_INDEX_URL
const SHAPE_SHIFT_URL = process.env.SHAPE_SHIFT_URL

const exchangeRatesService = {
  pairs: [],
  fetchCoinPairs: function () {
    return new Promise(function (resolve) {
      if (exchangeRatesService.coinPairs) {
        resolve(exchangeRatesService.coinPairs)
      } else {
        let url = SHAPE_SHIFT_URL + '/getcoins'
        xhrService.makeDirectCall(url)
          .then(function (result) {
            exchangeRatesService.coinPairs = result
            resolve(exchangeRatesService.coinPairs)
          })
      }
    })
  },
  fetchCoinPair: function (pair) {
    return new Promise(function (resolve) {
      if (exchangeRatesService.pairs[pair]) {
        resolve(exchangeRatesService.pairs[pair])
      } else {
        let url = SHAPE_SHIFT_URL + '/rate/' + pair
        xhrService.makeDirectCall(url)
          .then(function (result) {
            exchangeRatesService.pairs[pair] = result
            resolve(exchangeRatesService.pairs[pair])
          })
      }
    })
  },
  fetchFiatRates: function (currency) {
    return new Promise(function (resolve) {
      if (exchangeRatesService.fiatRates) {
        resolve(exchangeRatesService.fiatRates)
      } else {
        xhrService.makeGetCall('/api/exchange/rates')
          .then(function (result) {
            exchangeRatesService.fiatRates = result.rates
            resolve(exchangeRatesService.fiatRates)
          }).catch(function (e) {
            console.error(e)
          })
      }
    })
  },
  fetchFiatRate: function (currency) {
    return new Promise(function (resolve) {
      if (exchangeRatesService.fiatRates && exchangeRatesService.fiatRates[currency]) {
        resolve(exchangeRatesService.fiatRates && exchangeRatesService.fiatRates[currency])
      } else {
        xhrService.makeGetCall('/api/exchange/rates')
          .then(function (result) {
            exchangeRatesService.fiatRates = result.rates
            resolve(exchangeRatesService.fiatRates[currency])
          }).catch(function (e) {
            console.error(e)
          })
      }
    })
  },
  connectExchangeRates: function (node) {
    let socket = new SockJS(SERVER_URL + '/exchanges')
    let stompClient = Stomp.over(socket)
    let connectSuccess = function (frame) {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/exchanges', function (response) {
        exchangeRatesService.fiatRates = JSON.parse(response.body)
      })
    }
    let connectError = function (error) {
      if (error.headers) {
        console.log('[SysadmOnly] WebSocket Error: ' + error)
      } else {
        console.log('[SysadmOnly] WebSocket Error: ' + error)
      }
    }
    stompClient.connect({}, connectSuccess, connectError)
  },
  getValueInBitcoin (currency, amount) {
    return new Promise(function (resolve) {
      exchangeRatesService.fetchFiatRate(currency).then(function (fiatRate) {
        let val = fiatRate['15m']
        if (typeof amount === 'string') {
          amount = Number(amount)
        }
        if (typeof amount === 'number') {
          val = amount / val
        }
        resolve(Math.round(val * 100000000) / 100000000)
      })
    })
  },
  getFiatToEther (currency) {
    return new Promise(function (resolve) {
      exchangeRatesService.fetchFiatRate(currency).then(function (fiatRate) {
        exchangeRatesService.fetchCoinPair('eth_btc').then(function (ethToBtc) {
          resolve(fiatRate['15m'] * ethToBtc.rate)
        })
      })
    })
  },
  getFiatToBtc (currency) {
    return new Promise(function (resolve) {
      exchangeRatesService.fetchFiatRate(currency).then(function (fiatRate) {
        resolve(Math.round(fiatRate['15m'] * 100) / 100)
      })
    })
  },
  getSymbol (currency) {
    return new Promise(function (resolve) {
      exchangeRatesService.fetchFiatRate(currency).then(function (fiatRate) {
        resolve(fiatRate['symbol'])
      })
    })
  },
}
export default exchangeRatesService
exchangeRatesService.connectExchangeRates()
