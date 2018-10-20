// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import { CONSTANTS } from './constants'
import myArtworksStore from './myArtworksStore'
import myAccountStore from './myAccountStore'
import userProfilesStore from './userProfilesStore'
import artworkSearchStore from './artworkSearchStore'
import conversionStore from './conversionStore'
import ethStore from './ethStore'
import onlineAuctionsStore from './onlineAuctionsStore'
import myAuctionsStore from './myAuctionsStore'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    myArtworksStore: myArtworksStore,
    myAccountStore: myAccountStore,
    userProfilesStore: userProfilesStore,
    artworkSearchStore: artworkSearchStore,
    conversionStore: conversionStore,
    ethStore: ethStore,
    myAuctionsStore: myAuctionsStore,
    onlineAuctionsStore: onlineAuctionsStore,
  },
  state: {
    constants: {},
  },
  getters: {
    isDebugMode: (state) => {
      return state.constants['environment'] === 'development'
    }
  },
  mutations: {
    constants (state, constants) {
      state.constants = CONSTANTS
    },
  },
  actions: {
  }
})
export default store
