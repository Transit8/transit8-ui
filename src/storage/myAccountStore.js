// myAccountStore.js
import myAccountService from '@/services/myAccountService'

const myAccountStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: 'anon',
      loggedIn: false,
      showAdmin: false,
    },
  },
  getters: {
    getProfile: (state) => {
      return state.myProfile
    },
  },
  mutations: {
    myProfile (state, myProfile) {
      state.myProfile = myProfile
    },
  },
  actions: {
    fetchMyAccount ({ commit, state }) {
      commit('myProfile', myAccountService.myProfile())
    },
  }
}
export default myAccountStore
