import * as blockstack from 'blockstack'
import axios from 'axios'

const authorization = {
  loadUserData: function () {
    var userData = blockstack.loadUserData()
    if (userData && userData.profile) {
      this.person = new blockstack.Person(userData.profile)
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
