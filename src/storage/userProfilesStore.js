// myAccountStore.js
import userProfilesService from '@/services/userProfilesService'
import _ from 'lodash'
import store from '@/storage/store'

const userProfilesStore = {
  namespaced: true,
  state: {
    userProfiles: [],
  },
  getters: {
    getProfile: (state) => (username) => {
      let matches = state.userProfiles.filter(profile => profile.username === username)
      if (matches.length > 0) {
        return matches[0]
      } else {
        store.dispatch('userProfilesStore/addUserProfile', {username: username}, {root: true})
        return {}
      }
    },
  },
  mutations: {
    addUser (state, userProfile) {
      let index = _.findIndex(state.userProfiles, function (o) {
        return o.username === userProfile.username
      })
      if (index === -1) {
        state.userProfiles.push(userProfile)
      }
    },
  },
  actions: {
    addUserProfile ({ commit, state }, user) {
      let userProfiles = state.userProfiles
      let index = _.findIndex(userProfiles, function (o) {
        return o.username === user.username
      })
      if (index === -1) {
        userProfilesService.fetchUserProfile(user.username, function (userProfile) {
          commit('addUser', userProfile)
          // Vue.notify({group: 'artwork-actions', title: 'User Profiles', text: 'Fetched profile for: <br>' + user.username})
        },
        function (error) {
          // Vue.notify({type: 'error', group: 'artwork-actions', title: 'User Profiles ' + user.username, text: 'Error deleting your file: <br>' + error.message})
          console.log('Error deleting artwork.', error)
        })
      } else {
        // Vue.notify({type: 'warn', group: 'artwork-actions', title: 'User Profiles ', text: 'Already Fetched User ' + user.username})
      }
    },
  }
}
export default userProfilesStore
