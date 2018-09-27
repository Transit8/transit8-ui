// myArtworksStore.js
import myArtworksService from '@/services/myArtworksService'
import _ from 'lodash'
import Vue from 'vue'
import store from '@/storage/store'

const myArtworksStore = {
  namespaced: true,
  state: {
    myArtworks: [],
    blockstackRootFile: {}
  },
  getters: {
    numberArtworksSold: (state, getters) => {
      return getters.sold.length
    },
    numberArtworksUnsold: (state, getters) => {
      return getters.unsold.length
    },
    showRegister ({state, getters}, id) {
      let artwork = getters.myArtwork(id)
      let userProfile = this.$store.getters['myAccountStore/getProfile']
      return (artwork.timestamp && artwork.timestamp.length > 0 && userProfile.username === artwork.ownerUid)
    },
    editable: (state) => (id) => {
      let artworks = state.myArtworks.filter(myArtwork => myArtwork.id === id)
      let username = store.state.myAccountStore.myProfile.username
      return artworks.length > 0 && username === artworks[0].ownerUid
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
      return state.myArtworks.filter(myArtwork => myArtwork.artistUid === myArtwork.ownerUid)
    },
    sold: state => {
      return state.myArtworks.filter(myArtwork => myArtwork.artistUid !== myArtwork.ownerUid)
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
      if (!state.myArtworks) {
        state.myArtworks = []
      }
      state.myArtworks.push(myArtwork)
    }
  },
  actions: {
    deleteMyArtwork ({ commit, state }, id) {
      myArtworksService.deleteMyArtwork(id, function (result) {
        let myArtworks = state.myArtworks
        let index = _.findIndex(myArtworks, function (o) {
          return o.id === result.id
        })
        myArtworks.splice(index, 1)
        commit('myArtworks', myArtworks)
        Vue.notify({group: 'artwork-actions', title: 'Delete File', text: result.message})
      },
      function (error) {
        Vue.notify({type: 'error', group: 'artwork-actions', title: 'Delete File ' + error.id, text: 'Error deleting your file: <br>' + error.message})
        console.log('Error deleting artwork.', error)
      })
    },
    fetchMyArtworks ({ commit, state }) {
      myArtworksService.getMyArtworks(function (myArtwork) {
        commit('addMyArtwork', myArtwork)
      },
      function (error) {
        // Vue.notify({type: 'error', group: 'artwork-actions', title: 'Delete Artworks.', text: 'Error fetching artwork files. <br>' + error.message})
        console.log('Error fetching artworks: ', error)
      })
    },
  }
}
export default myArtworksStore
