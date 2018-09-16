// import axios from 'axios'
import Web3 from 'web3'
import Promise from 'bluebird'

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
const ETHEREUM_CONTRACT_ADDRESS = '0x3C534b0c2b9773ee0FE9D28d906DB3a2751d798f'
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
    const self = this
    return new Promise(resolve => {
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        let $elfist = this
        for (let index = 0; index < numberOfItems; index++) {
          $elfist.index = -1
          setTimeout(function timer () {
            $elfist.index++
            ethApiService.fetchItemByIndex($elfist.index).then((item) => {
              if (item[0] === title && item[1] === username) {
                ethApiService.myContract.sell(index, self.getEth(amountInWei), function (err, res) {
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
  startAuction (title, username, saleData) {
    const self = this
    return new Promise(resolve => {
      ethApiService.fetchNumberOfItems().then((numberOfItems) => {
        let $elfist = this
        for (let index = 0; index < numberOfItems; index++) {
          $elfist.index = -1
          setTimeout(function timer () {
            $elfist.index++
            ethApiService.fetchItemByIndex($elfist.index).then((item) => {
              if (item[0] === title && item[1] === username) {
                ethApiService.myContract.startAuction(index, saleData.duration, self.getEth(saleData.reserve), self.getEth(saleData.increment), function (err, res) {
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
  getEth (num) {
    return num * 1000000000000000000
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
  bid (auctionIndex, amount) {
    const amountValue = this.getEth(amount)

    return new Promise(resolve => {
      ethApiService.myContract.buy(auctionIndex, {value: amountValue}, function (err, res) {
        if (err) {
          console.log(err)
          resolve({failed: true, reason: err})
        }
        resolve({txId: res})
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
        // ethApiService.myContract.getItemOwner(index, ownerIndex, function (err, owner) {
        //  if (err) {
        //    resolve(err)
        //  }
        //  console.log(owner)
        //  resolve(item)
        // })
      })
    })
  },
  fetchAuctionByIndex: function (index) {
    return new Promise(resolve => {
      ethApiService.myContract.auctions(index, function (err, auction) {
        if (err) {
          resolve([])
        }
        resolve(auction)
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
  /*
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
        }

        resolve([])
        // resolve({registered: false, failed: true, reason: 'No item matching hash: ' + artHash})
      })
    })
  },
  */
  fetchItemByArtHash: function (artHash) {
    return ethApiService.fetchNumberOfItems().then((numberOfItems) => {
      const promises = []
      for (let i = 0; i < numberOfItems; i++) {
        promises.push(ethApiService.fetchItemByIndex(i))
      }

      return Promise.each(promises, (item) => item)
        .then((res) => {
          const map = res.map((item) => {
            if (item[2] === artHash) {
              return item
            }

            return null
          }).filter((i) => i !== null)

          return map.length ? map[0] : []
        })
    })
  },
  fetchItemByAuction: function (artHash) {
    return ethApiService.fetchNumberOfAuctions().then((numberOfAuctions) => {
      const promises = []
      for (let i = 0; i < numberOfAuctions; i++) {
        promises.push(ethApiService.fetchAuctionByIndex(i))
      }

      return Promise.each(promises, (a) => a)
        .then((auctions) => {
          let auctionIndex = -1

          return Promise.map(auctions, (a) => {
            return ethApiService.fetchItemByIndex(a[0].toNumber())
              .then((item) => {
                if (item[2] === artHash) {
                  auctionIndex++
                  return {scData: item, auctionData: a, auctionIndex}
                }
                auctionIndex++
                return null
              })
          })
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
  fetchNumberOfAuctions () {
    return new Promise(resolve => {
      ethApiService.connectToBlockChain().then(function (result) {
        ethApiService.myContract.auctionIndex(function (err, numbAuctions) {
          if (err) {
            console.log(err)
          }
          resolve(Number(numbAuctions) + 1)
        })
      }).catch(function (e) {
        resolve({registered: false, failed: true, reason: 'failed to connect to ethereum'})
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
