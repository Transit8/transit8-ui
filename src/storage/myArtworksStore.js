// myArtworksStore.js
import myArtworksService from '@/services/myArtworksService'
import _ from 'lodash'
import notify from '@/services/notify'
import store from '@/storage/store'
import utils from '@/services/utils'

const myArtworksStore = {
  namespaced: true,
  state: {
    myArtworks: [],
    blockstackRootFile: {}
  },
  getters: {
    bcstatus: (state, getters) => (id) => {
      let artwork = getters.myArtwork(id)
      if (!artwork.bcitem || artwork.bcitem.itemIndex < 0) {
        artwork.bcitem = {
          status: 'new',
          itemIndex: -1
        }
      }
      return artwork.bcitem.status
    },
    numberArtworksSold: (state, getters) => {
      return getters.sold.length
    },
    numberArtworksUnsold: (state, getters) => {
      return getters.unsold.length
    },
    editable: (state, getters) => (id) => {
      let artwork = getters.myArtwork(id)
      let userProfile = store.getters['myAccountStore/getMyProfile']
      return (userProfile.username === artwork.owner)
    },
    myArtwork: (state) => (id) => {
      let artworks = state.myArtworks.filter(myArtwork => myArtwork.id === id)
      if (artworks && artworks.length > 0) {
        return artworks[0]
      } else {
        return {}
      }
    },
    unsold: (state) => {
      let username = store.getters['myAccountStore/getMyProfile'].username
      return state.myArtworks.filter(artwork => username === artwork.owner)
    },
    sold: state => {
      let username = store.getters['myAccountStore/getMyProfile'].username
      return state.myArtworks.filter(artwork => username !== artwork.owner)
    },
    auctioning: (state) => (auctionId) => {
      return state.myArtworks.filter(artwork => auctionId === artwork.saleData.auctionId)
    },
    available: (state) => (auctionId) => {
      return state.myArtworks.filter(artwork => auctionId !== artwork.saleData.auctionId)
    }
  },
  mutations: {
    blockstackRootFile (state, blockstackRootFile) {
      state.blockstackRootFile = blockstackRootFile
    },
    myArtworks (state, myArtworks) {
      state.myArtworks = myArtworks
    },
    addMyArtwork (state, myArtwork) {
      let index = _.findIndex(state.myArtworks, function (o) {
        return o.id === myArtwork.id
      })
      if (index === -1) {
        state.myArtworks.splice(0, 0, myArtwork)
      } else {
        state.myArtworks.splice(index, 1, myArtwork)
      }
    }
  },
  actions: {
    addToAuction ({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        store.dispatch('myAuctionsStore/addItem', {itemId: artwork.id, owner: artwork.owner, auctionId: artwork.saleData.auctionId}).then((auction) => {
          notify.debug({title: 'Sell Via Auction', text: 'Item info added to auction.'})
          artwork.saleData = utils.buildInitialSaleData()
          store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
            notify.debug({title: 'Sell Via Auction', text: 'Auction info added to artwork.'})
            resolve(artwork)
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject(e)
        })
      })
    },
    removeFromAuction ({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        store.dispatch('myAuctionsStore/removeItem', {itemId: artwork.id, auctionId: artwork.saleData.auctionId}).then((auction) => {
          notify.debug({title: 'Sell Via Auction', text: 'Item info removed from auction.'})
          artwork.saleData = utils.buildInitialSaleData()
          store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
            notify.debug({title: 'Sell Via Auction', text: 'Auction info removed from artwork.'})
            resolve(artwork)
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject(e)
        })
      })
    },
    deleteMyArtwork ({ commit, state }, id) {
      myArtworksService.deleteMyArtwork(id, function (result) {
        let myArtworks = state.myArtworks
        let index = _.findIndex(myArtworks, function (o) {
          return o.id === result.id
        })
        myArtworks.splice(index, 1)
        commit('myArtworks', myArtworks)
        notify.info({title: 'Delete File.', text: result.message})
      },
      function (error) {
        notify.error({title: 'Delete File.', text: 'Error deleting your file: <br>' + error.message})
        console.log('Error deleting artwork.', error)
      })
    },
    fetchMyArtworks ({ commit, state }) {
      myArtworksService.getMyArtworks(function (myArtwork) {
        commit('addMyArtwork', myArtwork)
        store.dispatch('ethStore/fetchBlockchainItem', {timestamp: myArtwork.timestamp}, {root: true}).then((blockchainItem) => {
          if (blockchainItem && blockchainItem.itemIndex > -1) {
            if (!myArtwork.bcitem) {
              myArtwork.bcitem = {}
            }
            myArtwork.bcitem.status = 'registered'
            utils.convertPrices(myArtwork, blockchainItem)
            if (myArtwork.owner !== blockchainItem.blockstackId) {
              myArtwork.owner = blockchainItem.blockstackId
              store.dispatch('myArtworksStore/updateArtwork', myArtwork)
            }
            commit('addMyArtwork', myArtwork)
          } else {
            myArtwork.bcitem = {
              status: 'new',
              itemIndex: -1
            }
          }
        })
      })
    },
    fetchMyArtwork ({ commit, state }, artworkId) {
      return new Promise((resolve, reject) => {
        myArtworksService.getMyArtwork(artworkId, function (myArtwork) {
          let blockchainItem = store.getters['ethStore/getBlockchainItem'](myArtwork.timestamp)
          myArtwork.blockchainItem = blockchainItem
          utils.convertPrices(myArtwork, blockchainItem)
          if (myArtwork.owner !== blockchainItem.blockstackId) {
            myArtwork.owner = blockchainItem.blockstackId
            store.dispatch('myArtworksStore/updateArtwork', myArtwork)
          }
          commit('addMyArtwork', myArtwork)
          resolve(myArtwork)
        },
        function (error) {
          console.log('Error fetching artwork: ' + artworkId, error)
          resolve()
        })
      })
    },

    uploadArtwork ({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        myArtworksService.uploadArtwork(artwork, function (artwork) {
          commit('addMyArtwork', artwork)
          resolve(artwork)
        },
        function (error) {
          console.log('Error uploading artwork: ', error)
          resolve()
        })
      })
    },

    transferArtwork ({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        myArtworksService.transferArtwork(artwork, function (artwork) {
          commit('addMyArtwork', artwork)
          resolve(artwork)
        },
        function (error) {
          console.log('Error uploading artwork: ', error)
          resolve()
        })
      })
    },

    updateArtwork ({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        myArtworksService.updateArtwork(artwork, function (artwork) {
          commit('addMyArtwork', artwork)
          let intval = setInterval(function () {
            store.dispatch('ethStore/fetchBlockchainItem', {timestamp: artwork.timestamp}).then((blockchainItem) => {
              if (artwork.bcitem.price === blockchainItem.price) {
                clearInterval(intval)
              }
              if (blockchainItem) {
                utils.convertPrices(artwork, blockchainItem)
                commit('addMyArtwork', artwork)
                notify.info({title: 'Update Artwork', text: 'New price has been set in blockchain.'})
              }
            })
          }, 2000)
          resolve(artwork)
        },
        function (error) {
          console.log('Error uploading artwork: ', error)
          resolve()
        })
      })
    },
  }
}
export default myArtworksStore
