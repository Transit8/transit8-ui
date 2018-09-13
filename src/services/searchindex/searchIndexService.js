import xhrService from '@/services/xhrService'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const searchIndexService = {
  reindexRecord: function (indexData) {
    return new Promise(function (resolve) {
      xhrService.makePostCall('/art/index/indexData', indexData)
        .then(function (result) {
          if (result.error) {
            throw new Error({message: 'Unable to index file: ', indexData: indexData})
          }
          resolve(result)
        }).catch(function (e) {
          throw e
        })
    })
  },
  indexUser: function (username) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/art/index/user/' + username)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to index user: ' + username})
        })
    })
  },
  buildArtIndex: function () {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/art/index/build')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  buildIndexByNames: function (names) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/names/index/build', [names])
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  buildIndexByPages: function (from, to) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/names/index/build', [from, to])
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  fetchAll: function () {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/art/fetch')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to fetch index'})
        })
    })
  },
  clearAll: function () {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/art/index/clear')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to clear index'})
        })
    })
  },
  sizeOfIndex: function (index) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/' + index + '/index/size')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  searchIndex: function (index, term, query) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/' + index + '/search/' + term + '?q=' + query)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Error searching index for query: ' + query})
        })
    })
  },
}
export default searchIndexService
