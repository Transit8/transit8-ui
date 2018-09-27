// ethStore.js
import ethereumService from '@/services/ethereumService'

const ethStore = {
  namespaced: true,
  state: {
    ethereum: {
      clientState: {},
    },
  },
  getters: {
  },
  mutations: {
    ethereum (state, clientState) {
      state.ethereum.clientState = clientState
    },
    ethereumNumbItems (state, numbItems) {
      state.ethereum.clientState.numbItems = numbItems
    },
  },
  actions: {
    getClientState ({ commit, state }) {
      const savedClientState = [...state.ethereum.clientState]
      commit('ethereum', {})
      ethereumService.getClientState(function (clientState) {
        commit('ethereum', clientState)
      },
      function (error) {
        commit('ethereum', savedClientState)
        alert('Error saving data: ' + error)
      })
    },
  }
}
export default ethStore
