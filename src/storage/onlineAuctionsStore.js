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
        auctionSearchService.getOnlineAuctions(function (onlineAuctions) {
          commit('onlineAuctions', onlineAuctions)
          resolve(onlineAuctions)
        },
        function (error) {
          console.log('Error fetching auction: ', error)
        })
      })
    },
  }
}
export default onlineAuctionsStore
