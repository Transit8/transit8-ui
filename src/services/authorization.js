import * as blockstack from 'blockstack'
import axios from 'axios'

const authorization = {
  loadUserData: function () {
    this.userData = blockstack.loadUserData()
    let person = new blockstack.Person(this.userData.profile)
    if (this.userData.profile && this.userData.profile.givenName && this.userData.profile.givenName.length > 0) {
      this.name = person.name()
      this.avatarUrl = person.avatarUrl()
    } else {
      this.name = this.userData.username
    }
  },
  handlePending: function () {
    return new Promise(resolve => {
      blockstack.handlePendingSignIn().then(function (userData) {
        authorization.loadUserData()
        resolve(userData)
      })
    })
  },
  isPending: function () {
    return blockstack.isSignInPending()
  },
  canLogIn: function () {
    return new Promise(resolve => {
      axios.get('http://localhost:6270/v1/ping')
        .then(response => {
          resolve(response.data.status === 'alive')
        })
        .catch(e => {
          resolve(false)
        })
    })
  },
  isLoggedIn: function () {
    if (blockstack.isUserSignedIn()) {
      authorization.loadUserData()
      return true
    } else if (blockstack.isSignInPending()) {
      authorization.handlePending()
      return false
    } else {
      return false
    }
  },
  logout: function (event) {
    blockstack.signUserOut(window.location.origin)
  },
  login: function (event) {
    if (!this.isLoggedIn()) {
      blockstack.redirectToSignIn()
    }
  }
}
export default authorization
