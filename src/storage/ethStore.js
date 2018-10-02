// ethStore.js
import ethereumService from '@/services/ethereumService'
import Vue from 'vue'
import _ from 'lodash'

const ethStore = {
  namespaced: true,
  state: {
    clientState: {
      metaMaskNetwork: {}
    },
    blockchainItems: [],
  },
  getters: {
    getClientState: (state) => {
      return state.clientState
    },
    getBlockchainItem: (state, getters) => (timestamp) => {
      if (timestamp && timestamp.length > 0) {
        let items = state.blockchainItems.filter(blockchainItem => blockchainItem.timestamp === timestamp)
        if (items && items.length === 1) {
          return items[0]
        }
      }
    },
    getBlockchainItems: (state) => {
      return state.blockchainItems
    },
  },
  mutations: {
    ethereumClientState (state, clientState) {
      state.clientState = clientState
    },
    blockchainItems (state, blockchainItems) {
      state.blockchainItems = _.sortBy(blockchainItems, ['itemIndex'])
    },
    blockchainItem (state, blockchainItem) {
      state.blockchainItems.splice(0, 0, blockchainItem)
    },
    numbItems (state, numbItems) {
      state.clientState.numbItems = numbItems
    },
  },
  actions: {
    getClientState ({ commit, state }) {
      ethereumService.getClientState(function (clientState) {
        commit('ethereumClientState', clientState)
      },
      function (error) {
        Vue.notify({type: 'info', group: 'artwork-actions', title: 'Blockchain Client', text: 'Error fetching blockchain state.<br>' + error})
      })
    },
    fetchBlockchainItems ({ commit, state }) {
      return new Promise((resolve, reject) => {
        ethereumService.fetchBlockchainItems(function (blockchainItems) {
          commit('blockchainItems', blockchainItems)
          resolve(blockchainItems)
        },
        function (error) {
          Vue.notify({type: 'info', group: 'artwork-actions', title: 'Blockchain Client', text: 'Error fetching blockchain items.<br>' + error})
          resolve([])
        })
      })
    },
    fetchBlockchainItem ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        ethereumService.fetchBlockchainItem(data, function (blockchainItem) {
          if (blockchainItem) {
            // commit('blockchainItem', blockchainItem)
            resolve(blockchainItem)
          } else {
            resolve()
          }
        })
      })
    },
  }
}
export default ethStore
