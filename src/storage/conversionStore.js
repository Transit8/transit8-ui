// ethStore.js
import xhrService from '@/services/xhrService'
import store from '@/storage/store'

const conversionStore = {
  namespaced: true,
  state: {
    fiatRates: {},
    cryptoRates: {}
  },
  getters: {
    getFiatRates: (state) => {
      return state.fiatRates
    },
    getFiatRate: (state, getters) => (currency) => {
      return state.fiatRates[currency]
    },
    getCryptoRate: (state, getters) => (pair) => {
      return state.cryptoRates[pair]
    },
  },
  mutations: {
    setCryptoRate (state, cryptoRate) {
      state.cryptoRates[cryptoRate.pair] = Number(cryptoRate.rate)
    },
    setFiatRates (state, fiatRates) {
      state.fiatRates = fiatRates
    }
  },
  actions: {
    fetchFiatRates ({ commit, state }) {
      xhrService.makeGetCall('/api/exchange/rates').then(function (data) {
        commit('setFiatRates', data.rates)
      })
    },
    fetchShapeShiftCryptoRate: function ({ commit, state }, pair) {
      const url = store.state.constants.shapeShiftUrl + '/rate/' + pair
      xhrService.makeDirectCall(url).then(function (cryptoRate) {
        commit('setCryptoRate', cryptoRate)
      })
    },
  }
}
export default conversionStore
