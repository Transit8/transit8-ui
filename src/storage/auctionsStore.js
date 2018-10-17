// myArtworksStore.js
import auctionsService from '@/services/auctionsService'
import _ from 'lodash'
import notify from '@/services/notify'
import store from '@/storage/store'
import moment from 'moment'

const auctionsStore = {
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
      auctionsService.deleteMyAuction(auctionId, function (result) {
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

    fetchMyAuctions ({ commit, state }) {
      auctionsService.getMyAuctions(function (myAuctions) {
        commit('myAuctions', myAuctions)
      },
      function (error) {
        console.log('Error fetching auction: ', error)
      })
    },

    uploadAuction ({ commit, state }, myAuction) {
      return new Promise((resolve, reject) => {
        auctionsService.uploadAuction(myAuction, function (myAuction) {
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
        auctionsService.updateAuction(myAuction, function (myAuction) {
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
export default auctionsStore
