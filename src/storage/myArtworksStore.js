// myArtworksStore.js
import myArtworksService from '@/services/myArtworksService'

const myArtworksStore = {
  state: {
    count: 0,
    myArtworks: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    myArtworksLength: (state, getters) => {
      return getters.unsold.length
    },
    myArtwork: (state, id) => () => {
      return state.myArtworks.filter(myArtwork => myArtwork.indexData.id === id)
    },
    unsold: (state) => () => {
      return state.myArtworks.filter(myArtworks => myArtworks.indexData.uploader === myArtworks.indexData.owner)
    },
    sold: state => {
      return state.myArtworks.filter(myArtworks => myArtworks.indexData.uploader !== myArtworks.indexData.owner)
    }
  },
  mutations: {
    myArtworks (state, myArtworks) {
      state.myArtworks = myArtworks
    }
  },
  actions: {
    getMyArtworks ({ commit, state }) {
      myArtworksService.getMyArtworks(function (myArtworks) {
        commit('myArtworks', myArtworks)
      },
      function (error) {
        commit('myArtworks', [])
        alert('Error fetching artworks: ' + error)
      })
    },
  }
}
export default myArtworksStore
