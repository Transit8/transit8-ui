// artworkSearchStore.js
import artworkSearchService from '@/services/artworkSearchService'
import store from '@/storage/store'
import _ from 'lodash'

const artworkSearchStore = {
  namespaced: true,
  state: {
    artworks: [],
    artists: [],
    recentArtworks: [],
  },
  getters: {
    getArtworks: state => {
      return state.artworks
    },
    getArtistsPageArtworks: (state) => {
      return state.artists
    },
    getHomePageArtworks: (state) => {
      return state.recentArtworks.slice(0, 6)
    },
    getArtworksPageArtworks: (state) => {
      return state.recentArtworks.slice(0, 9)
    },
    numberArtworks: (state, getters) => {
      return state.artworks.length
    },
  },
  mutations: {
    addArtwork (state, artwork) {
      state.artworks.push(artwork)
    },
    addRecentArtwork (state, recentArtwork) {
      let index = _.findIndex(state.recentArtworks, function (o) {
        return o.id === recentArtwork.id
      })
      if (index === -1) {
        state.recentArtworks.push(recentArtwork)
      } else {
        state.recentArtworks.splice(index, 1, recentArtwork)
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
    fetchRecentArtworks ({ commit, state }, query) {
      let blockchainItems = store.getters['ethStore/getBlockchainItems']
      let maximum = Math.min(blockchainItems.length, 20)
      for (var index = 0; index < maximum; index++) {
        let blockchainItem = blockchainItems[index]
        artworkSearchService.findArtworks({term: 'title', query: blockchainItem.title}, function (artwork) {
          if (artwork) {
            commit('addRecentArtwork', artwork)
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
