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
// ropstein const contractAddress = '0xD224A5487F6FD3B62DACf3f31B110a3eCA6BCdC2'
// ganache 0x73b5657373dfc685ed8a2a4bebdd39d7b3677def

// process.env.ETHEREUM_CONTRACT_ADDRESS

// const ETHEREUM_URI = 'https://api.blockcypher.com/v1/eth/main'

const ethApiService = {
  ETHEREUM_URI: 'http://localhost:8545',
  ETHEREUM_ABI: process.env.ETHEREUM_ABI,
  ETHEREUM_CONTRACT_ADDRESS: process.env.ETHEREUM_CONTRACT_ADDRESS,
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
  getWeb3: function () {
    if (typeof window.web3 !== 'undefined') {
      ethApiService.web3 = new Web3(window.web3.currentProvider)
    } else {
      // set the  provider you want from Web3.providers
      ethApiService.web3 = new Web3(new Web3.providers.HttpProvider(ethApiService.ETHEREUM_URI))
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
        ethApiService.artmarketContract = web3.eth.contract(ethApiService.ETHEREUM_ABI)
        ethApiService.myContract = ethApiService.artmarketContract.at(ethApiService.ETHEREUM_CONTRACT_ADDRESS)
        resolve({failed: false, accounts: ethApiService.accounts})
      })
    })
  },
  isRegistered: function (artHash) {
    return new Promise(resolve => {
      ethApiService.connectToBlockChain().then(function (result) {
        ethApiService.myContract.itemExists(artHash, function (err, res) {
          if (err) {
            resolve({registered: false, failed: true, reason: err})
          }
          if (res) {
            resolve({registered: true})
          } else {
            resolve({registered: false})
          }
        })
      }).catch(function (e) {
        resolve({registered: false, failed: true, reason: 'failed to connect to ethereum'})
      })
    })
  },
  register: function (title, artHash, blockstackId) {
    return new Promise(resolve => {
      ethApiService.myContract.addItem(title, artHash, blockstackId, function (err, res) {
        if (err) {
          resolve({registered: false, failed: true, reason: err})
        }
        resolve({txId: res})
      }).catch(function (e) {
        resolve({registered: false, failed: true, reason: 'failed to connect to ethereum'})
      })
    })
  },
  /*
  sell: function (index, price) {
    return new Promise(resolve => {
      ethApiService.myContract.sell(index, price, function (err, res) {
        if (err) {
          console.log(err)
          resolve({failed: true, reason: err})
        }
        resolve({txId: res})
      })
    })
  },
  */
  sell: function (title, username, amountInWei) {
    return new Promise(resolve => {
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        let $elfist = this
        for (let index = 0; index < numberOfItems; index++) {
          $elfist.index = -1
          setTimeout(function timer () {
            $elfist.index++
            ethApiService.fetchItemByIndex($elfist.index).then((item) => {
              if (item[0] === title && item[1] === username) {
                ethApiService.myContract.sell(index, amountInWei, function (err, res) {
                  if (err) {
                    console.log(err)
                    resolve({failed: true, reason: err})
                  }
                  resolve({txId: res})
                })
              }
            })
          }, 500)
        }
      }).catch(function (e) {
        resolve({registered: false, failed: true, reason: 'failded to fetch transactions'})
      })
    })
  },
  buy: function (title, seller, buyer) {
    return new Promise(resolve => {
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        let $elfist = this
        for (let index = 0; index < numberOfItems; index++) {
          $elfist.index = -1
          setTimeout(function timer () {
            $elfist.index++
            ethApiService.fetchItemByIndex($elfist.index).then((item) => {
              if (item[0] === title && item[1] === seller) {
                let value = item[4].toString()
                console.log('index: ' + $elfist.index + ' item: ', item + ' value=' + value)
                ethApiService.myContract.buy(index, buyer, {value: value}, function (err, res) {
                  if (err) {
                    console.log(err)
                    resolve({failed: true, reason: err})
                  }
                  resolve({txId: res})
                })
              }
            })
          }, 500)
        }
      })
    })
  },
  fetchItemByIndex: function (index, ownerIndex) {
    return new Promise(resolve => {
      ethApiService.myContract.items(index, function (err, item) {
        if (err) {
          resolve({registered: false, failed: true, reason: err})
        }
        resolve(item)
      })
    })
  },
  fetchItemByData: function (title, username) {
    return new Promise(resolve => {
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        let $elfist = this
        for (let index = 0; index < numberOfItems; index++) {
          $elfist.index = -1
          setTimeout(function timer () {
            $elfist.index++
            ethApiService.fetchItemByIndex($elfist.index).then((item) => {
              console.log('index: ' + $elfist.index + ' item: ', item)
              if (item[0] === title && item[1] === username) {
                resolve(item)
              }
            })
          }, 500)
        }
      })
    })
  },
  fetchItemByArtHash: function (artHash) {
    return new Promise(resolve => {
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        let $elfist = this
        for (let index = 0; index < numberOfItems; index++) {
          $elfist.index = -1
          setTimeout(function timer () {
            $elfist.index++
            ethApiService.fetchItemByIndex($elfist.index).then((item) => {
              if (item[2] === artHash) {
                resolve(item)
              }
            })
          }, 50)
          if ($elfist.index === numberOfItems - 1) {
            resolve({})
          }
        }
        // resolve({registered: false, failed: true, reason: 'No item matching hash: ' + artHash})
      })
    })
  },
  fetchNumberOfItems: function () {
    return new Promise(resolve => {
      ethApiService.connectToBlockChain().then(function (result) {
        ethApiService.myContract.itemIndex(function (err, numbItems) {
          if (err) {
            console.log(err)
          }
          resolve(Number(numbItems) + 1)
        })
      }).catch(function (e) {
        resolve({registered: false, failed: true, reason: 'failed to connect to ethereum'})
      })
    })
  },
  fetchArtworkByHash: function (artHash, callback) {
    let $elfist = this
    $elfist.callback = callback
    ethApiService.fetchNumberOfItems().then((numberOfItems) => {
      // let found = false
      for (let index = numberOfItems; index >= 0; index--) {
        ethApiService.fetchItemByIndex(index, 0).then((item) => {
          let bcHash = item[2]
          if (bcHash === artHash) {
            // found = true
            $elfist.callback(item)
          }
          // if (numberOfItems === index && !found) {
          //  $elfist.callback({failed: true, message: 'Record not found.'})
          // }
        }).catch(function (e) {
          $elfist.callback({failed: true, message: 'Record not found.'})
        })
      }
    })
  },
  loadArtworks: function (numberOfArtworks, callback) {
    let $elfist = this
    $elfist.callback = callback
    $elfist.numberOfArtworks = numberOfArtworks
    $elfist.counter = 0
    if (!callback && ethApiService.blockchainResults && ethApiService.blockchainResults.length >= numberOfArtworks) {
      for (let index = ethApiService.blockchainResults.length - 1; index >= 0; index--) {
        if ($elfist.counter < numberOfArtworks) {
          if (ethApiService.blockchainResults[index]) {
            $elfist.callback(ethApiService.blockchainResults[index])
            $elfist.counter++
          }
        }
      }
    } else {
      ethApiService.blockchainResults = []
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        for (let index = numberOfItems; index >= numberOfItems - numberOfArtworks; index--) {
          ethApiService.fetchItemByIndex(index, 0).then((item) => {
            let title = item[0]
            if (title && title.length > 0) {
              console.log('Blockchain result: ' + title + ' index: ' + index)
              ethApiService.blockchainResults.push({index0: index, item: item})
              if (ethApiService.blockchainResults.length <= numberOfArtworks) {
                $elfist.callback({index: index, item: item})
              }
              // $elfist.fetchArtwork(index, item[0])
            }
          }).catch(function (e) {
            console.log({registered: false, failed: true, reason: 'failded to fetch transactions'})
          })
        }
      })
    }
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
