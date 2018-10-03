// ethStore.js
import ethereumService from '@/services/ethereumService'
import Vue from 'vue'
import _ from 'lodash'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import store from '@/storage/store'

const ethStore = {
  namespaced: true,
  state: {
    clientState: {
      metaMaskNetwork: {}
    },
    blockchainEvents: [],
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
    blockchainEvent (state, event) {
      state.blockchainEvents.push(event)
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
    receiveBlockchainEvents ({ commit, state }, event) {
      return new Promise((resolve, reject) => {
        const SERVER_URL = store.state.constants.searchUrl
        let socket = new SockJS(SERVER_URL + '/exchanges')
        let stompClient = Stomp.over(socket)
        stompClient.connect({}, function (o) {
          stompClient.subscribe('/topic/exchanges', function (blockchainEvent) {
            commit('blockchainEvent', blockchainEvent)
          })
          resolve('Connected to blockchain events' + o)
        }, function (error) {
          if (error.headers) {
            console.log('[SysadmOnly] WebSocket Error: ' + error)
          } else {
            console.log('[SysadmOnly] WebSocket Error: ' + error)
          }
        })
      })
    },
  }
}
export default ethStore
