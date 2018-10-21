// myArtworksStore.js
import auctionSearchService from '@/services/auctionSearchService'
import _ from 'lodash'

const onlineAuctionsStore = {
  namespaced: true,
  state: {
    onlineAuctions: [],
  },
  getters: {
    onlineAuction: (state) => (auctionId) => {
      let onlineAuctions = state.onlineAuctions.filter(auction => auction.auctionId === auctionId)
      if (onlineAuctions && onlineAuctions.length > 0) {
        return onlineAuctions[0]
      }
    },
    onlineAuctions: (state, getters) => {
      return state.onlineAuctions
    },
  },
  mutations: {
    onlineAuctions (state, auctions) {
      state.onlineAuctions = auctions
    },
    onlineAuction (state, auction) {
      let index = _.findIndex(state.onlineAuctions, function (o) {
        return o.auctionId === auction.auctionId
      })
      if (index === -1) {
        state.onlineAuctions.splice(0, 0, auction)
      } else {
        state.onlineAuctions.splice(index, 1, auction)
      }
    }
  },
  actions: {
    fetchOnlineAuction ({ commit, state }, auctionId) {
      return new Promise((resolve, reject) => {
        auctionSearchService.searchIndex('auctionId', auctionId).then((results) => {
          if (results && results.length === 1) {
            commit('onlineAuction', results[0])
            resolve(results[0])
          } else {
            reject(new Error('No auction found for id: ' + auctionId))
          }
        })
      })
    },
    fetchOnlineAuctions ({ commit, state }) {
      return new Promise((resolve, reject) => {
        auctionSearchService.searchIndex('title', '*').then((results) => {
          commit('onlineAuctions', results)
          resolve(results)
        })
      })
    },
  }
}
export default onlineAuctionsStore
