// myArtworksStore.js
import auctionSearchService from '@/services/auctionSearchService'
import _ from 'lodash'
import store from '@/storage/store'
import biddingUtils from '@/services/biddingUtils'

const onlineAuctionsStore = {
  namespaced: true,
  state: {
    onlineAuctions: [],
    onlinePeers: [],
  },
  getters: {
    auctionItem: (state) => (auctionId, itemId) => {
      let index = _.findIndex(state.onlineAuctions, function (o) {
        return o.auctionId === auctionId
      })
      let auction = state.onlineAuctions[index]
      if (auction) {
        index = _.findIndex(auction.items, function (o) {
          return o.itemId === itemId
        })
        return auction.items[index]
      }
    },
    onlineAuction: (state) => (auctionId) => {
      let onlineAuctions = state.onlineAuctions.filter(auction => auction.auctionId === auctionId)
      if (onlineAuctions && onlineAuctions.length > 0) {
        return onlineAuctions[0]
      }
    },
    getPeers: (state) => {
      return state.onlinePeers
    },
    getPeer: (state) => (username) => {
      return state.onlinePeers.filter(peer => peer.username === username)[0]
    },
    getAdministratorPeer: (state, getters) => (auctionId) => {
      let auction = getters.onlineAuction(auctionId)
      let peer = getters.getPeer(auction.administrator)
      return peer
    },
    onlineAuctions: (state, getters) => {
      return state.onlineAuctions
    },
    messages: (state, getters) => (auctionId) => {
      let auction = state.onlineAuctions.filter(auction => auction.auctionId === auctionId)[0]
      if (auction) {
        return auction.messages
      } else {
        return []
      }
    },
  },
  mutations: {

    messageEvent (state, data) {
      let auctionId = data.auctionId
      let auction = state.onlineAuctions.filter(auction => auction.auctionId === auctionId)[0]
      if (!auction) return
      if (!auction.messages) {
        auction.messages = []
      }
      auction.messages.splice(0, 0, data)
      store.commit('onlineAuctionsStore/onlineAuction', auction)
    },

    activateItemEvent (state, data) {
      let auction = state.onlineAuctions.filter(auction => auction.auctionId === data.auctionId)[0]
      if (!auction) return
      biddingUtils.makeItemActive(auction, data.itemId)
      store.commit('onlineAuctionsStore/onlineAuction', auction)
    },

    receiveBidEvent (state, data) {
      let auction = state.onlineAuctions.filter(auction => auction.auctionId === data.auctionId)[0]
      if (!auction) return
      biddingUtils.addBid(auction, data.itemId, data.bid)
      store.commit('onlineAuctionsStore/onlineAuction', auction)
    },

    sellItemEvent (state, data) {
      let auction = state.myAuctions.filter(auction => auction.auctionId === data.auctionId)[0]
      let index = _.findIndex(auction.items, function (o) { return o.itemId === data.itemId })
      auction.items[index].sellingStatus = 'selling'
      auction.items[index].paused = true
      store.commit('onlineAuctionsStore/onlineAuction', auction)
    },

    pauseItemEvent (state, data) {
      let auctionId = data.auctionId
      let auction = state.onlineAuctions.filter(auction => auction.auctionId === auctionId)[0]
      if (!auction) {
        console.log('Auction not found - this means the logged in user is the administrator and the auction has already been updated in myAuctionsStore.')
        return
      }
      biddingUtils.pauseBidding(auction, data.itemId)
      store.commit('onlineAuctionsStore/onlineAuction', auction)
    },

    newPeer (state, data) {
      let index = _.findIndex(state.onlinePeers, function (o) { return o.username === data.username })
      if (index === -1) {
        state.onlinePeers.splice(0, 0, data)
      }
    },

    farewellPeer (state, data) {
      let index = _.findIndex(state.onlinePeers, function (o) { return o.username === data.username })
      if (index > -1) {
        state.onlinePeers.splice(index, 1)
      }
    },

    onlineAuctions (state, auctions) {
      for (var key in auctions) {
        store.commit('onlineAuctionsStore/onlineAuction', auctions[key])
      }
    },

    onlineAuction (state, auction) {
      if (!auction) return
      let index = _.findIndex(state.onlineAuctions, function (o) { return o.auctionId === auction.auctionId })
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
        let auction = store.getters['onlineAuctionsStore/onlineAuction'](auctionId)
        if (auction) {
          resolve(auction)
        } else {
          auctionSearchService.searchIndex('auctionId', auctionId).then((auctionsFromSearch) => {
            if (auctionsFromSearch && auctionsFromSearch.length === 1) {
              auctionSearchService.getUsersOnlineAuction(auctionsFromSearch[0].administrator).then((auctionsFromUserStorage) => {
                if (auctionsFromUserStorage) {
                  commit('onlineAuctions', auctionsFromUserStorage)
                  let index = _.findIndex(auctionsFromUserStorage, function (o) { return o.auctionId === auctionId })
                  if (index > -1) {
                    resolve(auctionsFromUserStorage[index])
                  } else {
                    resolve()
                  }
                } else {
                  commit('onlineAuction', auctionsFromSearch[0])
                  resolve(auctionsFromSearch[0])
                }
              })
            } else {
              reject(new Error('No auction found for id: ' + auctionId))
            }
          })
        }
      })
    },
    fetchOnlineAuctions ({ commit, state }) {
      return new Promise((resolve, reject) => {
        auctionSearchService.searchIndex('title', '*').then((auctionsFromSearch) => {
          // commit('onlineAuctions', auctionsFromSearch)
          for (var key in auctionsFromSearch) {
            auctionSearchService.getUsersOnlineAuction(auctionsFromSearch[key].administrator).then((auctionsFromUserStorage) => {
              if (auctionsFromUserStorage) {
                commit('onlineAuctions', auctionsFromUserStorage)
              }
            })
          }
          resolve(auctionsFromSearch)
        })
      })
    },
  }
}
export default onlineAuctionsStore
