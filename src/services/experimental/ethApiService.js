// import axios from 'axios'
import Web3 from 'web3'

const Eth = require('ethjs')
// const eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io'));
// Ganache (7545)
const eth = new Eth(new Eth.HttpProvider('http://localhost:7545'))
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
const ETHEREUM_CONTRACT_ADDRESS = '0x73b5657373dfc685ed8a2a4bebdd39d7b3677def' //process.env.ETHEREUM_CONTRACT_ADDRESS

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
  register: function (title, artHash, blockstackId) {
    let web3 = this.getWeb3()
    return new Promise(resolve => {
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve(false)
        }
        console.log(result)
        web3.eth.defaultAccount = result[0]
        var artmarketContract = web3.eth.contract(ETHEREUM_ABI)
        let myContract = artmarketContract.at(ETHEREUM_CONTRACT_ADDRESS)
        artHash = '0x' + artHash
        console.log('title: ' + title)
        console.log('artHash: ' + artHash)
        console.log('blockstackId: ' + blockstackId)
        myContract.addItem(title, artHash, blockstackId, function (err, res) {
          if (err) {
            console.log(err)
          }
          resolve(res)
        })
      })
    })
  },
  fetchRegistration: function (index) {
    let web3 = this.getWeb3()
    return new Promise(resolve => {
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve(error)
        }
        console.log(result)
        web3.eth.defaultAccount = result[0]
        var artmarketContract = web3.eth.contract(ETHEREUM_ABI)
        let myContract = artmarketContract.at(ETHEREUM_CONTRACT_ADDRESS)
        myContract.items(index, function (err, res) {
          if (err) {
            console.log(err)
          }
          resolve(res)
        })
      })
    })
  },
  fetchNumbRegistrations: function () {
    let web3 = this.getWeb3()
    return new Promise(resolve => {
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve(false)
        }
        console.log(result)
        web3.eth.defaultAccount = result[0]
        var artmarketContract = web3.eth.contract(ETHEREUM_ABI)
        let myContract = artmarketContract.at(ETHEREUM_CONTRACT_ADDRESS)
        myContract.itemIndex(function (err, numbItems) {
          if (err) {
            console.log(err)
          }
          resolve(numbItems.c[0])
        })
      })
      // var myContract = new web3.eth.Contract(0xf89d7325a62e981e58397745c6289dbe52f4ac3bbb49be64715d2c3c55af5c4e)
      // myContract.methods.addItem('new artwork', artHash, blockstackId)
      // suppose you want to call a function named myFunction of myContract
      // var getData = myContract.myFunction.getData(function parameters);
      // finally paas this data parameter to send Transaction
      // web3.eth.sendTransaction({to:ETHEREUM_CONTRACT_ADDRESS, from:Accountaddress, data: getData});
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
