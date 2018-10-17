import {
  getFile,
  putFile,
} from 'blockstack'
import moment from 'moment'
import store from '@/storage/store'
import _ from 'lodash'

const auctionsService = {

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
    auctionsService.getAuctionsRootFile(
      function (rootFile) {
        success(rootFile.auctions)
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_1', message: 'Error fetching auctions root file!'})
      })
  },

  getMyAuction: function (auctionId, success, failure) {
    auctionsService.getAuctionsRootFile(
      function (rootFile) {
        let auction = rootFile.auctions[auctionId]
        success(auction)
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_1', message: 'Error fetching auctions root file!'})
      })
  },

  updateAuction: function (auction, success, failure) {
    auctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.auctions, function (o) {
          return o.auctionId === auction.auctionId
        })
        if (index > -1) {
          rootFile.auctions.splice(index, 1, auction)
          auctionsService.setAuctionsRootFile(rootFile).then(function (message) {
            success(auction)
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
    auctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.auctions, function (o) {
          return o.auctionId === auctionId
        })
        if (index > -1) {
          rootFile.auctions.splice(index, 1)
          auctionsService.setAuctionsRootFile(rootFile).then(function (message) {
            success(auctionId)
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
    auctionsService.getAuctionsRootFile(
      function (rootFile) {
        rootFile.auctions.splice(0, 0, auction)
        auctionsService.setAuctionsRootFile(rootFile).then(function (message) {
          success(auction)
        })
      },
      function (error) {
        failure(error)
      })
  },
}
export default auctionsService
