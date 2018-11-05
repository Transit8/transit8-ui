// artworkSearchStore.js
import artworkSearchService from '@/services/artworkSearchService'
import _ from 'lodash'
import utils from '../services/utils'
import moneyUtils from '../services/moneyUtils'
import store from '@/storage/store'

const artworkSearchStore = {
  namespaced: true,
  state: {
    artworks: [],
    artists: [],
  },
  getters: {
    getArtworks: state => {
      return state.artworks
    },
    getRegisteredArtworks: state => {
      let registered = state.artworks.filter(artwork => (artwork.bcitem && artwork.bcitem.itemIndex > -1))
      registered = registered.sort(function compare (a, b) {
        if (a.bcitem.itemIndex > b.bcitem.itemIndex) {
          return -1
        }
        if (a.bcitem.itemIndex < b.bcitem.itemIndex) {
          return 1
        }
        return 0
      })
      return registered
    },
    getArtwork: (state) => (id) => {
      let artworks = state.artworks.filter(artwork => artwork.id === id)
      if (artworks && artworks.length > 0) {
        return artworks[0]
      } else {
        return {}
      }
    },
    getArtistsPage: (state) => {
      return state.artists
    },
    getHomePageArtworks: (state, getters) => {
      let registered = getters.getRegisteredArtworks
      return registered.slice(0, 6)
    },
    getArtworksPageArtworks: (state, getters) => {
      let registered = getters.getRegisteredArtworks
      return registered.slice(0, 9)
    },
    getArtworksByArtist: (state, getters) => (username) => {
      let artworks = []
      let registered = getters.getRegisteredArtworks
      _.forEach(registered, function (artwork) {
        if (artwork.artist === username) {
          artworks.push(artwork)
        }
      })
      return artworks
    },
    numberArtworks: (state, getters) => {
      return state.artworks.length
    },
  },
  mutations: {
    addArtwork (state, registeredArtwork) {
      let index = _.findIndex(state.artworks, function (o) { return o.id === registeredArtwork.id })
      if (index === -1) {
        state.artworks.push(registeredArtwork)
      } else {
        state.artworks.splice(index, 1, registeredArtwork)
      }
    },
    addArtist (state, userProfile) {
      if (userProfile && userProfile.username) {
        let index = _.findIndex(state.artists, function (o) {
          return o.username === userProfile.username
        })
        if (index === -1) {
          state.artists.push(userProfile)
        } else {
          state.artists.splice(index, 1, userProfile)
        }
      }
    },
    clearArtwork (state) {
      state.artworks = []
    },
  },
  actions: {
    fetchSearchArtworks ({ commit, state }, query) {
      commit('clearArtwork')
      artworkSearchService.findArtworks(query, function (artwork) {
        if (artwork) {
          store.dispatch('artworkSearchStore/userArtwork', {username: artwork.owner, artworkId: artwork.id})
        }
      },
      function (error) {
        console.log('Error fetching artworks: ', error)
      })
    },

    fetchArtwork ({ commit, state }, artworkId) {
      return new Promise((resolve, reject) => {
        artworkSearchService.findArtwork(artworkId, function (artwork) {
          if (artwork) {
            if (artwork.artwork && artwork.artwork[0] && artwork.artwork[0].dataUrl.length > 0) {
              let timestamp = utils.buildArtworkHash(artwork.artwork[0].dataUrl)
              let blockchainItem = store.getters['ethStore/getBlockchainItem'](timestamp)
              moneyUtils.convertPrices(artwork, blockchainItem)
              if (artwork.owner !== artwork.bcitem.blockstackId) {
                artwork.owner = artwork.bcitem.blockstackId
              }
            }
            commit('addArtwork', artwork)
            resolve(artwork)
          } else {
            console.log('Error no artwork found: ' + artworkId)
            resolve()
          }
        },
        function (error) {
          console.log('Error fetching artwork: ' + artworkId, error)
          resolve(error)
        })
      })
    },

    userArtwork ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        artworkSearchService.userArtwork(data.artworkId, data.username, function (artwork) {
          if (artwork) {
            if (artwork.artwork && artwork.artwork[0] && artwork.artwork[0].dataUrl.length > 0) {
              let timestamp = utils.buildArtworkHash(artwork.artwork[0].dataUrl)
              let blockchainItem = store.getters['ethStore/getBlockchainItem'](timestamp)
              moneyUtils.convertPrices(artwork, blockchainItem)
              if (artwork.owner !== artwork.bcitem.blockstackId) {
                artwork.owner = artwork.bcitem.blockstackId
              }
            }
            commit('addArtwork', artwork)
          }
        },
        function (error) {
          console.log('Error fetching recent artworks: ', error)
        })
      })
    },

    fetchRegisteredArtworks ({ commit, state }, blockchainItems) {
      // let blockchainItems = store.getters['ethStore/getBlockchainItems']
      let maximum = Math.min(blockchainItems.length, 20)
      let users = ''
      for (var index = 0; index < maximum; index++) {
        let blockchainItem = blockchainItems[index]
        if (users.indexOf(blockchainItem.blockstackId) === -1) {
          users += blockchainItem.blockstackId + ','
          artworkSearchService.userArtworks(blockchainItem.blockstackId, function (artwork) {
            if (artwork) {
              moneyUtils.convertPrices(artwork, blockchainItem)
              if (artwork.owner !== artwork.bcitem.blockstackId) {
                artwork.owner = artwork.bcitem.blockstackId
              }
              commit('addArtwork', artwork)
            }
          },
          function (error) {
            console.log('Error fetching recent artworks: ', error)
          })
        }
      }
    },
  }
}
export default artworkSearchStore
