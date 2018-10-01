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
    bcstatus: (state, getters) => (id) => {
      let artwork = getters.myArtwork(id)
      if (artwork.bcitem) {
        return artwork.bcitem.status
      } else {
        return 'unknown'
      }
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
      return state.myArtworks.filter(myArtwork => myArtwork.artist === myArtwork.owner)
    },
    sold: state => {
      return state.myArtworks.filter(myArtwork => myArtwork.artist !== myArtwork.owner)
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
        store.dispatch('ethStore/fetchBlockchainItem', {timestamp: myArtwork.timestamp}, {root: true}).then((blockchainItem) => {
          if (blockchainItem && blockchainItem.itemIndex > -1) {
            myArtwork.bcitem.status = 'registered'
            _.merge(myArtwork.bcitem, blockchainItem)
            commit('addMyArtwork', myArtwork)
          }
        })
      })
    },
    fetchMyArtwork ({ commit, state }, artworkId) {
      return new Promise((resolve, reject) => {
        myArtworksService.getMyArtwork(artworkId, function (myArtwork) {
          let blockchainItem = store.getters['ethStore/getBlockchainItem'](myArtwork.timestamp)
          myArtwork.blockchainItem = blockchainItem
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
          // Vue.notify({type: 'error', group: 'artwork-actions', title: 'Delete Artworks.', text: 'Error fetching artwork files. <br>' + error.message})
          console.log('Error uploading artwork: ', error)
          resolve()
        })
      })
    },
    updateArtwork ({ commit, state }, artwork) {
      return new Promise((resolve, reject) => {
        myArtworksService.updateArtwork(artwork, function (artwork) {
          commit('addMyArtwork', artwork)
          resolve(artwork)
        },
        function (error) {
          // Vue.notify({type: 'error', group: 'artwork-actions', title: 'Delete Artworks.', text: 'Error fetching artwork files. <br>' + error.message})
          console.log('Error uploading artwork: ', error)
          resolve()
        })
      })
    },
  }
}
export default myArtworksStore
