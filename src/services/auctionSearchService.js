import xhrService from '@/services/xhrService'

const auctionSearchService = {

  buildIndex: function () {
    return new Promise((resolve, reject) => {
      xhrService.makeGetCall('/auction/index/build')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },

  sizeOfIndex: function () {
    return new Promise((resolve, reject) => {
      xhrService.makeGetCall('/auction/index/size')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },

  removeAll: function () {
    return new Promise((resolve, reject) => {
      xhrService.makeGetCall('/auction/index/clear')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },

  removeOne: function (auctionId, success, failure) {
    return new Promise((resolve, reject) => {
      xhrService.makeGetCall('/auction/index/remove/auctionId/' + auctionId).then(function (result) {
        resolve(result)
      }).catch(function (e) {
        reject(new Error({failed: true, message: e.message}))
      })
    })
  },

  searchIndex: function (term, query) {
    return new Promise((resolve, reject) => {
      xhrService.makeGetCall('/auction/search/' + term + '?q=' + query).then(function (results) {
        resolve(results)
      }).catch(function (e) {
        reject(new Error({failed: true, message: e.message}))
      })
    })
  },

  reindex: function (auctions, success, failure) {
    return new Promise((resolve, reject) => {
      xhrService.makePostCall('/auction/index', auctions)
        .then(function (result) {
          if (result.error) {
            reject(new Error({failed: true, message: 'Unable to index auctions: ', auctions: auctions}))
          }
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },

  reindexOne: function (auction, success, failure) {
    return new Promise((resolve, reject) => {
      xhrService.makePostCall('/auction/reindexOne', auction)
        .then(function (result) {
          if (result.error) {
            reject(new Error({failed: true, message: 'Unable to index auctions: ', auction: auction}))
          }
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },

  getOnlineAuction: function (auction, success, failure) {
    return new Promise((resolve, reject) => {
      xhrService.makePostCall('/auction/reindexOne', auction)
        .then(function (result) {
          if (result.error) {
            reject(new Error({failed: true, message: 'Unable to index auctions: ', auction: auction}))
          }
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },

  getOnlineAuctions: function (auction, success, failure) {
    return new Promise((resolve, reject) => {
      xhrService.makePostCall('/auction/reindexOne', auction)
        .then(function (result) {
          if (result.error) {
            reject(new Error({failed: true, message: 'Unable to index auctions: ', auction: auction}))
          }
          resolve(result)
        }).catch(function (e) {
          reject(new Error({failed: true, message: e.message}))
        })
    })
  },
}
export default auctionSearchService
