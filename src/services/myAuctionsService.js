import {
  getFile,
  putFile,
} from 'blockstack'
import moment from 'moment'
import store from '@/storage/store'
import _ from 'lodash'
import auctionSearchService from '@/services/auctionSearchService'

const myAuctionsService = {

  setAuctionsRootFile: function (rootFile) {
    const auctionsRootFileName = store.state.constants.auctionsRootFileName
    return putFile(auctionsRootFileName, JSON.stringify(rootFile), {encrypt: false})
  },

  getAuctionsRootFile: function (success, failure) {
    const auctionsRootFileName = store.state.constants.auctionsRootFileName
    getFile(auctionsRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        var now = moment({}).valueOf()
        let newRootFile = {
          created: now,
          auctions: []
        }
        putFile(auctionsRootFileName, JSON.stringify(newRootFile), {encrypt: false}).then(function (message) {
          success(newRootFile)
        })
      } else {
        let rootFile = JSON.parse(file)
        success(rootFile)
      }
    }).catch(function (e) {
      failure({ERR_CODE: 'AUCTIONS_1', message: 'Error fetching auctions root file!'})
    })
  },

  getMyAuctions: function (success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        success(rootFile.auctions)
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_2', message: 'Error fetching auctions root file!'})
      })
  },

  getMyAuction: function (auctionId, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.auctions, function (o) { return o.auctionId === auctionId })
        success(rootFile.auctions[index])
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_3', message: 'Error fetching auctions root file!'})
      })
  },

  updateAuction: function (auction, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.auctions, function (o) { return o.auctionId === auction.auctionId })
        if (index > -1) {
          rootFile.auctions.splice(index, 1, auction)
          myAuctionsService.setAuctionsRootFile(rootFile).then(function (message) {
            auctionSearchService.reindexOne(auction).then((message) => {
              success(auction)
            })
          })
        } else {
          failure({ERR_CODE: 'AUCTIONS_2', message: 'Not found: ' + auction.auctionId})
        }
      },
      function (error) {
        failure(error)
      })
  },

  deleteMyAuction: function (auctionId, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.auctions, function (o) {
          return o.auctionId === auctionId
        })
        if (index > -1) {
          rootFile.auctions.splice(index, 1)
          myAuctionsService.setAuctionsRootFile(rootFile).then(function (message) {
            auctionSearchService.removeOne(auctionId).then((message) => {
              success(auctionId)
            })
          })
        } else {
          failure({ERR_CODE: 'AUCTIONS_2', message: 'Not found: ' + auctionId})
        }
      },
      function (error) {
        failure(error)
      })
  },

  uploadAuction: function (auction, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        rootFile.auctions.splice(0, 0, auction)
        myAuctionsService.setAuctionsRootFile(rootFile).then(function (message) {
          auctionSearchService.reindexOne(auction).then((message) => {
            success(auction)
          })
        })
      },
      function (error) {
        failure(error)
      })
  },

  reindex: function (success, failure) {
    myAuctionsService.getAuctionsRootFile(function (rootFile) {
      auctionSearchService.reindex(rootFile).then((message) => {
        console.log(message)
        success(message)
      })
    },
    function () {
      failure({ERR_CODE: 'AUCTIONS_10', message: 'Error adding the auction to the public index!'})
    })
  },

  makePublic: function (auction, success, failure) {
    auction.privacy = 'public'
    myAuctionsService.updateAuction(auction,
      function (auction) {
        auctionSearchService.reindexOne(auction).then((message) => {
          success(message)
        })
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_10', message: 'Error adding the auction to the public index!'})
      })
  },

  makePrivate: function (auction, success, failure) {
    auction.privacy = 'private'
    myAuctionsService.updateAuction(auction,
      function (auction) {
        auctionSearchService.removeOne(auction.auctionId).then((message) => {
          success(message)
        })
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_11', message: 'Error removing the auction from the public index!'})
      })
  },
}
export default myAuctionsService
