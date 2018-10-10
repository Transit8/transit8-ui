// myArtworksStore.js
import auctionsService from '@/services/auctionsService'
import _ from 'lodash'
import notify from '@/services/notify'
import store from '@/storage/store'

const auctionsStore = {
  namespaced: true,
  state: {
    auctions: [],
  },
  getters: {
    numberAuctionsCurrent: (state, getters) => {
      return getters.current.length
    },
    numberAuctionsPast: (state, getters) => {
      return getters.past.length
    },
    editable: (state, getters) => (id) => {
      let auction = getters.auction(id)
      let userProfile = store.getters['myAccountStore/getMyProfile']
      return (userProfile.username === auction.owner)
    },
    auction: (state) => (id) => {
      let auctions = state.auctions.filter(myArtwork => auction.id === id)
      if (auctions && auctions.length > 0) {
        return auctions[0]
      } else {
        return {}
      }
    },
    current: (state) => {
      let username = store.getters['myAccountStore/getMyProfile'].username
      return state.auctions.filter(auction => username === auction.owner)
    },
    past: state => {
      let username = store.getters['myAccountStore/getMyProfile'].username
      return state.auctions.filter(auction => username !== auction.owner)
    }
  },
  mutations: {
    myArtworks (state, auctions) {
      state.auctions = auctions
    },
    addAuction (state, auction) {
      if (!state.auctions) {
        state.auctions = []
      }
      let index = _.findIndex(state.auctions, function (o) {
        return o.id === auction.id
      })
      if (index === -1) {
        state.auctions.splice(0, 0, auction)
      } else {
        state.auctions.splice(index, 1, auction)
      }
    }
  },
  actions: {
    deleteAuction ({ commit, state }, id) {
      auctionsService.deleteAuction(id, function (result) {
        let auctions = state.auctions
        let index = _.findIndex(auctions, function (o) {
          return o.id === result.id
        })
        auctions.splice(index, 1)
        commit('auctions', auctions)
        notify.info({title: 'Delete Auction.', text: result.message})
      },
      function (error) {
        notify.error({title: 'Delete Auction.', text: 'Error deleting your auction: <br>' + error.message})
        console.log('Error deleting auction.', error)
      })
    },
    fetchAuctions ({ commit, state }) {
      auctionsService.getAuctions(function (myArtwork) {
        commit('auctions', auctions)
      })
    },

    uploadAuction ({ commit, state }, auction) {
      return new Promise((resolve, reject) => {
        auctionsService.uploadAuction(auction, function (auction) {
          commit('addAuction', auction)
          resolve(auction)
        },
        function (error) {
          console.log('Error uploading auction: ', error)
          resolve()
        })
      })
    },

    updateAuction ({ commit, state }, auction) {
      return new Promise((resolve, reject) => {
        auctionsService.updateAuction(auction, function (auction) {
          commit('addAuction', auction)
          resolve(auction)
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
