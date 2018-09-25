// ethStore.js
import ethereumService from '@/services/ethereumService'

const ethStore = {
  state: {
    ethereum: {
      clientState: {},
    },
  },
  getters: {
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    },
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
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
      // save the items currently in the cart
      const savedClientState = [...state.ethereum.clientState]
      // send out checkout request, and optimistically
      // clear the cart
      commit('ethereum', {})
      // the shop API accepts a success callback and a failure callback
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
