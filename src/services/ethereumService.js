import axios from 'axios'
import store from '@/storage/store'
import xhrService from '@/services/xhrService'
import Web3 from 'web3'

const API_SERVER_URL = '/api/ethereum'

const ethereumService = {
  ETHEREUM_ABI: process.env.ETHEREUM_ABI,
  ETHEREUM_CONTRACT_ADDRESS: process.env.ETHEREUM_CONTRACT_ADDRESS,
  getWeb3: function () {
    if (typeof window.web3 !== 'undefined') {
      ethereumService.web3 = new Web3(window.web3.currentProvider)
    } else {
      // set the  provider you want from Web3.providers
      ethereumService.web3 = new Web3(new Web3.providers.HttpProvider(ethereumService.ETHEREUM_URI))
    }
    if (ethereumService.web3.isConnected()) {
      return ethereumService.web3
    }
    console.log('No connection to ethereum!')
  },
  connectToBlockChain: function () {
    let web3 = ethereumService.getWeb3()
    return new Promise(resolve => {
      if (ethereumService.accounts && ethereumService.artmarketContract && ethereumService.myContract) {
        resolve(ethereumService.accounts)
      }
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve({failed: true, reason: error})
        }
        web3.eth.defaultAccount = result[0]
        ethereumService.accounts = result
        ethereumService.artmarketContract = web3.eth.contract(ethereumService.ETHEREUM_ABI)
        ethereumService.myContract = ethereumService.artmarketContract.at(ethereumService.ETHEREUM_CONTRACT_ADDRESS)
        resolve({failed: false, accounts: ethereumService.accounts})
      })
    })
  },
  getNetworkType: function () {
    let networkId = this.getWeb3().version.network
    let networkName = ''
    switch (networkId) {
      case '1':
        networkName = 'Main'
        break
      case '2':
        networkName = 'Morden'
        break
      case '3':
        networkName = 'Ropsten'
        break
      case '4':
        networkName = 'Rinkeby'
        break
      case '42':
        networkName = 'Kovan'
        break
      default:
        networkName = 'Unknown'
    }
    return {
      networkId: networkId,
      networkName: networkName
    }
  },
  registerOnChain: function (title, artHash, blockstackId) {
    return new Promise(resolve => {
      ethereumService.myContract.addItem(title, artHash, blockstackId, function (err, txId) {
        if (err) {
          resolve({failed: true, reason: err})
        }
        resolve({txId: txId})
      })
    })
  },
  setPriceOnChain: function (itemIndex, title, username, amountInWei) {
    return new Promise(resolve => {
      ethereumService.myContract.sell(itemIndex, amountInWei, function (err, txId) {
        if (err) {
          console.log(err)
          resolve({failed: true, reason: err})
        }
        resolve({txId: txId})
      })
    })
  },
  getClientState: function (success, failure) {
    let callInfo = {
      method: 'get',
      url: store.state.constants.searchUrl + API_SERVER_URL + '/client',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios.get(callInfo.url, { headers: callInfo.headers })
      .then(response => {
        let clientState = response.data.details
        clientState.metaMaskNetwork = ethereumService.getNetworkType()
        success(response.data.details)
      })
      .catch(e => {
        failure(e)
      })
  },
  fetchBlockchainItems: function (success, failure) {
    xhrService.makeGetCall(API_SERVER_URL + '/fetch')
      .then(function (result) {
        success(result)
      }).catch(function (e) {
        failure(e)
      })
  },
  fetchBlockchainItem: function (data, success, failure) {
    xhrService.makeGetCall(API_SERVER_URL + '/fetch/' + data.timestamp)
      .then(function (result) {
        success(result)
      })
  },
}
export default ethereumService
