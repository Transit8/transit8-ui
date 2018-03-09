import * as blockstack from 'blockstack'
import axios from 'axios'

const authorization = {
  loadUserData: function () {
    var userData = blockstack.loadUserData()
    if (userData && userData.profile) {
      this.person = new blockstack.Person(userData.profile)
      console.log('loadUserData=true: ' + this.person)
    }
  },
  handlePending: function () {
    return new Promise(resolve => {
      blockstack.handlePendingSignIn().then(function (userData) {
        console.log('handlePendingSignIn=true: ' + authorization)
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
          // console.log('auth: can sign in: ' + response.data.status)
          resolve(response.data.status === 'alive')
        })
        .catch(e => {
          // console.log('auth: cant sign in')
          resolve(false)
        })
    })
  },
  isLoggedIn: function () {
    if (blockstack.isUserSignedIn()) {
      authorization.loadUserData()
      console.log('isLoggedIn.isUserSignedIn=true: ' + authorization)
      return true
    } else if (blockstack.isSignInPending()) {
      console.log('isLoggedIn.isSignInPending=true: ' + authorization)
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
      console.log('login.isLoggedIn=false: ' + authorization)
      blockstack.redirectToSignIn()
    }
  }
}
export default authorization
