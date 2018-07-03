// import axios from 'axios'
import Web3 from 'web3'

const Eth = require('ethjs')
// const eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io'));
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/
const ethereumUri = 'http://localhost:8545'
// const ethereumUri = 'https://api.blockcypher.com/v1/eth/main'

const ethApiService = {
  getWeb3: function () {
    let web3
    if (typeof window.web3 !== 'undefined') {
      web3 = new Web3(window.web3.currentProvider)
    } else {
      // set the  provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider(ethereumUri))
    }
    if (web3.isConnected()) {
      return web3
    }
    throw new Error('No connection!')
  },
  getEthAccounts: function () {
    return eth.accounts()
  },
  getAccounts: function () {
    let web3 = this.getWeb3()
    return new Promise(resolve => {
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve(false)
          console.log(error)
        }
        resolve(result)
      })
    })
  },
  getBalance: function (account0) {
    let web3 = this.getWeb3()
    return new Promise(resolve => {
      web3.eth.getBalance(account0, function (error, result) {
        if (error) {
          console.log(error)
          resolve(0)
        } else {
          // console.log(result)
          resolve(web3.fromWei(result.toNumber(), 'ether'))
        }
      })
    })
  },
  getDefaultAccount: function () {
    return this.getWeb3().eth.defaultAccount
  },
}

export default ethApiService
