// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import { CONSTANTS } from './constants'
import myArtworksStore from './myArtworksStore'
import ethStore from './ethStore'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    myArtworksStore: myArtworksStore,
    ethStore: ethStore,
  },
  state: {
    constants: {},
    count: 0,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
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
    constants (state, constants) {
      state.constants = CONSTANTS
    },
    slides (state, constants) {
      state.constants = CONSTANTS
    },
    increment (state) {
      state.count++
    }
  },
  actions: {
  }
})
export default store
