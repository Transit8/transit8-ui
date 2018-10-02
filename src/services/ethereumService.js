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
  loggedIn: function (success, failure) {
    let web3 = ethereumService.getWeb3()
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        failure({failed: true, reason: error})
      } else if (!accounts || accounts.length === 0) {
        failure({failed: true, reason: 'No accounts - not logged in to wallet'})
      } else {
        web3.eth.defaultAccount = accounts[0]
        success({failed: false, accounts: accounts})
      }
    })
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
  registerOnChain: function (regData, success, failure) {
    let web3 = ethereumService.getWeb3()
    web3.eth.getAccounts(function (error, result) {
      if (error || !result | result.length === 0) {
        failure({failed: true, message: 'Please check you are logged in to meta mask - then try again?'})
      } else {
        web3.eth.defaultAccount = result[0]
        ethereumService.myContract.addItem(regData.title, regData.timestamp, regData.uploader, function (err, txId) {
          if (err) {
            failure({failed: true, message: err})
          } else {
            success({txId: txId})
          }
        })
      }
    })
  },
  setPriceOnChain: function (priceData, success, failure) {
    let web3 = ethereumService.getWeb3()
    web3.eth.getAccounts(function (error, result) {
      if (error || !result | result.length === 0) {
        failure({failed: true, message: 'Please check you are logged in to meta mask - then try again?'})
      } else {
        web3.eth.defaultAccount = result[0]
        ethereumService.myContract.sell(priceData.itemIndex, priceData.amountInWei, function (err, txId) {
          if (err) {
            console.log(err)
            failure({failed: true, message: err})
          } else {
            success({txId: txId})
          }
        })
      }
    })
  },
  purchase: function (priceData, success, failure) {
    ethereumService.myContract.buy(priceData.itemIndex, priceData.buyer, {value: priceData.price}, function (err, txId) {
      if (err) {
        console.log(err)
        failure({failed: true, message: err})
      } else {
        success({txId: txId})
      }
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
