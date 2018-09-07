// import axios from 'axios'
import Web3 from 'web3'

// const Eth = require('ethjs')
// const eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io'));
// Ganache (7545)
// const eth = new Eth(new Eth.HttpProvider('http://localhost:7545'))
// Truffle develop (9545)
// const eth = new Eth(new Eth.HttpProvider('http://localhost:9545'))

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/
const ethereumUri = 'http://localhost:8545'
// ropstein const contractAddress = '0xD224A5487F6FD3B62DACf3f31B110a3eCA6BCdC2'
// ganache 0x73b5657373dfc685ed8a2a4bebdd39d7b3677def

const ETHEREUM_ABI = process.env.ETHEREUM_ABI
const ETHEREUM_CONTRACT_ADDRESS = '0x48C41e8Ecfb9fb8AB599056115ba977d5CD77fA0'
// process.env.ETHEREUM_CONTRACT_ADDRESS

// const ethereumUri = 'https://api.blockcypher.com/v1/eth/main'

const ethApiService = {
  getWeb3: function () {
    if (typeof window.web3 !== 'undefined') {
      ethApiService.web3 = new Web3(window.web3.currentProvider)
    } else {
      // set the  provider you want from Web3.providers
      ethApiService.web3 = new Web3(new Web3.providers.HttpProvider(ethereumUri))
    }
    if (ethApiService.web3.isConnected()) {
      return ethApiService.web3
    }
    console.log('No connection to ethereum!')
  },
  connectToBlockChain: function () {
    let web3 = ethApiService.getWeb3()
    return new Promise(resolve => {
      if (ethApiService.accounts && ethApiService.artmarketContract && ethApiService.myContract) {
        resolve(ethApiService.accounts)
      }
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve({failed: true, reason: error})
        }
        web3.eth.defaultAccount = result[0]
        ethApiService.accounts = result
        ethApiService.artmarketContract = web3.eth.contract(ETHEREUM_ABI)
        ethApiService.myContract = ethApiService.artmarketContract.at(ETHEREUM_CONTRACT_ADDRESS)
        resolve({failed: false, accounts: ethApiService.accounts})
      })
    })
  },
  isRegistered: function (artHash) {
    return new Promise(resolve => {
      ethApiService.connectToBlockChain().then(function (result) {
        ethApiService.myContract.itemExists(artHash, function (err, res) {
          if (err) {
            console.log(err)
            resolve({registered: false, failed: true, reason: err})
          }
          if (res) {
            resolve({registered: true})
          } else {
            resolve({registered: false})
          }
        })
      }).catch(function (e) {
        console.log('Unable to provenance record: ', e)
      })
    })
  },
  register: function (title, artHash, blockstackId) {
    return new Promise(resolve => {
      ethApiService.myContract.addItem(title, artHash, blockstackId, function (err, res) {
        if (err) {
          console.log(err)
          resolve({failed: true, reason: err})
        }
        resolve({txId: res})
      })
    })
  },
  sell: function (price) {
    return new Promise(resolve => {
      ethApiService.myContract.itemIndex(function (err, numbItems) {
        if (err) {
          console.log(err)
        }
        let currentHeight = numbItems.c[0] - 1
        ethApiService.myContract.sell(currentHeight, price, function (err, res) {
          if (err) {
            console.log(err)
            resolve({failed: true, reason: err})
          }
          resolve({txId: res})
        })
      })
    })
  },
  fetchRegistration: function (index) {
    return new Promise(resolve => {
      ethApiService.myContract.items(index, function (err, res) {
        if (err) {
          console.log(err)
        }
        resolve(res)
      })
    })
  },
  fetchNumbRegistrations: function () {
    return new Promise(resolve => {
      ethApiService.myContract.itemIndex(function (err, numbItems) {
        if (err) {
          console.log(err)
        }
        resolve(numbItems.c[0])
      })
    })
  },
  getBalance: function (account0) {
    return new Promise(resolve => {
      ethApiService.web3.eth.getBalance(account0, function (error, result) {
        if (error) {
          console.log(error)
          resolve(0)
        } else {
          // console.log(result)
          resolve(ethApiService.web3.fromWei(result.toNumber(), 'ether'))
        }
      })
    })
  },
  getDefaultAccount: function () {
    return this.getWeb3().eth.defaultAccount
  },
}

export default ethApiService
