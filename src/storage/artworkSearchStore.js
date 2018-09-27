// artworkSearchStore.js
import artworkSearchService from '@/services/artworkSearchService'

const artworkSearchStore = {
  namespaced: true,
  state: {
    artworks: [],
  },
  getters: {
    getArtworks: state => {
      return state.artworks
    },
    numberArtworks: (state, getters) => {
      return state.artworks.length
    },
  },
  mutations: {
    addArtwork (state, artwork) {
      if (!state.artworks) {
        state.artworks = []
      }
      state.artworks.push(artwork)
    },
    clearArtwork (state) {
      state.artworks = []
    }
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
  }
}
export default artworkSearchStore
