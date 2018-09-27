import axios from 'axios'
import {
  Person,
  loadUserData,
  handlePendingSignIn,
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  signUserOut
} from 'blockstack'
import store from '@/storage/store'

const myAccountService = {
  myProfile: function () {
    let myProfile = {
      loggedIn: false
    }
    let account = loadUserData()
    if (account) {
      let showAdmin = account.username === 'mike.personal.id' || account.username.indexOf('brightblock') > -1 || account.username.indexOf('antonio') > -1
      let person = new Person(account.profile)
      myProfile = {
        loggedIn: true,
        showAdmin: showAdmin,
        name: person.name(),
        description: person.description(),
        avatarUrl: person.avatarUrl(),
        username: account.username,
        hubUrl: account.hubUrl,
        apps: account.profile.apps
      }
    }
    return myProfile
  },
  handlePending: function () {
    handlePendingSignIn().then(function (myProfile) {
      store.dispatch('myAccountStore/fetchMyAccount')
    })
  },
  isPending: function () {
    return isSignInPending()
  },
  canLogIn: function () {
    return new Promise(resolve => {
      axios.get('http://localhost:6270/v1/ping')
        .then(response => {
          resolve(response.data.status === 'alive')
        })
        .catch(e => {
          console.log('No one listening on 6270?')
          resolve(true)
        })
    })
  },
  isLoggedIn: function () {
    if (isUserSignedIn()) {
      store.dispatch('myAccountStore/fetchMyAccount')
      return true
    } else if (isSignInPending()) {
      myAccountService.handlePending()
      return false
    } else {
      return false
    }
  },
  logout: function (event) {
    signUserOut(window.location.origin)
    store.dispatch('myAccountStore/fetchMyAccount')
  },
  loginMultiPlayer: function (event) {
    if (!this.isLoggedIn()) {
      const origin = window.location.origin
      redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
    }
  },
  login: function (event) {
    if (!this.isLoggedIn()) {
      redirectToSignIn()
      store.dispatch('myAccountStore/fetchMyAccount')
    }
  }
}
export default myAccountService
