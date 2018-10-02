// artworkSearchStore.js
import artworkSearchService from '@/services/artworkSearchService'
import store from '@/storage/store'
import _ from 'lodash'

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
      let index = _.findIndex(state.artworks, function (o) {
        return o.id === registeredArtwork.id
      })
      if (index === -1) {
        state.artworks.push(registeredArtwork)
      } else {
        state.artworks.splice(index, 1, registeredArtwork)
      }
    },
    addArtist (state, userProfile) {
      let index = _.findIndex(state.artists, function (o) {
        return o.username === userProfile.username
      })
      if (index === -1) {
        state.artists.push(userProfile)
      } else {
        state.artists.splice(index, 1, userProfile)
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
          commit('addArtwork', artwork)
        }
      },
      function (error) {
        console.log('Error fetching artworks: ', error)
      })
    },
    fetchArtwork ({ commit, state }, artworkId) {
      return new Promise((resolve, reject) => {
        let index = _.findIndex(state.registeredArtworks, function (o) {
          return o.id === artworkId
        })
        if (index > -1) {
          let artwork = state.registeredArtworks[index]
          resolve(artwork)
        } else {
          artworkSearchService.findArtwork(artworkId, function (artwork) {
            if (artwork) {
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
        }
      })
    },
    fetchRegisteredArtworks ({ commit, state }, blockchainItems) {
      // let blockchainItems = store.getters['ethStore/getBlockchainItems']
      let maximum = Math.min(blockchainItems.length, 20)
      for (var index = 0; index < maximum; index++) {
        let blockchainItem = blockchainItems[index]
        artworkSearchService.findArtworks({term: 'title', query: blockchainItem.title}, function (artwork) {
          if (artwork) {
            // NOTE: this loads the most recent 6 images for the homepage/artworks page but in
            // no particular order. An alternative would be to load 6 dummy images
            // and then replace them bt the correct index or to load them into a temp
            // array and load them all at once in the right order.
            commit('addArtwork', artwork)
            let userProfile = store.getters['userProfilesStore/getProfile'](artwork.artist)
            commit('addArtist', userProfile)
          }
        },
        function (error) {
          console.log('Error fetching recent artworks: ', error)
        })
      }
    },
  }
}
export default artworkSearchStore
