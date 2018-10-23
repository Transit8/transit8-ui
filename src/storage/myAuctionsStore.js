// myArtworksStore.js
import myAuctionsService from '@/services/myAuctionsService'
import _ from 'lodash'
import notify from '@/services/notify'
import store from '@/storage/store'
import moment from 'moment'

const myAuctionsStore = {
  namespaced: true,
  state: {
    myAuctions: [],
  },
  getters: {
    myAuctionsPastCount: (state, getters) => {
      let now = moment({})
      return state.myAuctions.filter(auction => moment(auction.startDate).isBefore(now)).length
    },
    myAuctionsPast: (state, getters) => {
      let now = moment({})
      return state.myAuctions.filter(auction => moment(auction.startDate).isBefore(now))
    },
    myAuctionsFuture: (state, getters) => {
      let now = moment({})
      return state.myAuctions.filter(auction => moment(auction.startDate).isAfter(now))
    },
    myAuctionsFutureCount: (state, getters) => {
      let now = moment({})
      return state.myAuctions.filter(auction => moment(auction.startDate).isAfter(now)).length
    },
    myAuction: (state) => (auctionId) => {
      if (!auctionId) {
        return
      }
      let userProfile = store.getters['myAccountStore/getMyProfile']
      let myAuctions = state.myAuctions.filter(auction => auction.auctionId === auctionId)
      if (myAuctions && myAuctions.length > 0) {
        let auction = myAuctions[0]
        if (auction.administrator === userProfile.username) {
          return auction
        }
      }
    },
  },
  mutations: {
    myAuctions (state, auctions) {
      state.myAuctions = auctions
    },
    addMyAuction (state, auction) {
      let index = _.findIndex(state.myAuctions, function (o) {
        return o.auctionId === auction.auctionId
      })
      if (index === -1) {
        state.myAuctions.splice(0, 0, auction)
      } else {
        state.myAuctions.splice(index, 1, auction)
      }
    }
  },
  actions: {
    deleteMyAuction ({ commit, state }, auctionId) {
      myAuctionsService.deleteMyAuction(auctionId, function (result) {
        let myAuctions = state.myAuctions
        let index = _.findIndex(myAuctions, function (o) {
          return o.auctionId === result.auctionId
        })
        myAuctions.splice(index, 1)
        commit('myAuctions', myAuctions)
        notify.info({title: 'Delete Auction.', text: result.message})
      },
      function (error) {
        notify.error({title: 'Delete Auction.', text: 'Error deleting your auction: <br>' + error.message})
        console.log('Error deleting auction.', error)
      })
    },

    addItem ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        if (!data.auctionId) {
          reject(new Error('No auctionId found on the item - cannot add it to an auction it is not part of?'))
        }
        let auction = state.myAuctions.filter(auction => auction.auctionId === data.auctionId)[0]
        if (!auction.items) {
          auction.items = []
        }
        let index = _.findIndex(auction.items, function (o) {
          return o.itemId === data.itemId
        })
        let auctionItem = {
          itemId: data.itemId,
          bids: [],
        }
        if (index > -1) {
          reject(new Error('Unable to add item to auction: ' + auction.title + ' - can only add new items here.'))
        } else {
          auction.items.push(auctionItem)
          return store.dispatch('myAuctionsStore/updateAuction', auction)
        }
      })
    },

    removeItem ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        if (!data.auctionId) {
          reject(new Error('No auctionId found on the item - cannot remove an item from an auction it is not part of?'))
        }
        let auction = state.myAuctions.filter(auction => auction.auctionId === data.auctionId)[0]
        if (!auction.items) {
          auction.items = []
        }
        let itemsToRemove = _.find(auction.items, function (o) {
          return o.itemId === data.itemId
        })
        if (itemsToRemove && itemsToRemove.length > 0) {
          _.forEach(itemsToRemove, function () {
            let index = _.findIndex(itemsToRemove.items, function (o) {
              return o.itemId === data.itemId
            })
            auction.items.splice(index, 1)
          })
          return store.dispatch('myAuctionsStore/updateAuction', auction)
        } else {
          resolve({})
        }
      })
    },

    fetchMyAuctions ({ commit, state }) {
      myAuctionsService.getMyAuctions(function (myAuctions) {
        commit('myAuctions', myAuctions)
      },
      function (error) {
        console.log('Error fetching auction: ', error)
      })
    },

    fetchMyAuction ({ commit, state }, auctionId) {
      return new Promise((resolve, reject) => {
        let auctions = state.myAuctions.filter(auction => auction.auctionId === auctionId)
        if (auctions.length === 1) {
          resolve(auctions[0])
        } else {
          myAuctionsService.getMyAuction(auctionId, function (auction) {
            commit('addMyAuction', auction)
            resolve(auction)
          },
          function (error) {
            console.log(error)
            resolve()
          })
        }
      })
    },

    makePublic ({ commit, state }, myAuction) {
      return new Promise((resolve, reject) => {
        myAuctionsService.makePublic(myAuction, function (myAuction) {
          commit('addMyAuction', myAuction)
          resolve(myAuction)
        },
        function (error) {
          console.log('Error uploading auction: ', error)
          resolve()
        })
      })
    },

    makePrivate ({ commit, state }, myAuction) {
      return new Promise((resolve, reject) => {
        myAuctionsService.makePrivate(myAuction, function (myAuction) {
          commit('addMyAuction', myAuction)
          resolve(myAuction)
        },
        function (error) {
          console.log('Error uploading auction: ', error)
          resolve()
        })
      })
    },

    uploadAuction ({ commit, state }, myAuction) {
      return new Promise((resolve, reject) => {
        myAuctionsService.uploadAuction(myAuction, function (myAuction) {
          commit('addMyAuction', myAuction)
          resolve(myAuction)
        },
        function (error) {
          console.log('Error uploading auction: ', error)
          resolve()
        })
      })
    },

    updateAuction ({ commit, state }, myAuction) {
      return new Promise((resolve, reject) => {
        myAuctionsService.updateAuction(myAuction, function (myAuction) {
          commit('addMyAuction', myAuction)
          resolve(myAuction)
        },
        function (error) {
          console.log('Error uploading auction: ', error)
          resolve()
        })
      })
    },
  }
}
export default myAuctionsStore
