import xhrService from '@/services/xhrService'
import store from '@/storage/store'
import _ from 'lodash'
import utils from './utils'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const artworkSearchService = {
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
  remove: function (field, value) {
    xhrService.makeGetCall('/art/index/remove/' + field + '/' + value)
      .then(function (result) {
        console.log(result)
      }).catch(function (e) {
        console.log('Unable to remove ' + value + ' from search index')
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
  findArtworks: function (query, success, failure) {
    xhrService.makeGetCall('/art/search/' + query.term + '?q=' + query.query)
      .then(function (results) {
        if (!results || results.length === 0) {
          success()
        } else {
          let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
          _.forEach(results, function (indexData) {
            store.dispatch('userProfilesStore/addUserProfile', {username: indexData.uploader}, {root: true})
            store.dispatch('userProfilesStore/addUserProfile', {username: indexData.owner}, {root: true})
            let urlLastSlash = indexData.gaiaUrl.lastIndexOf('/') + 1
            let url = indexData.gaiaUrl.substring(0, urlLastSlash)
            url = url + gaiaArtworkFileName + indexData.id + '.json'
            xhrService.makeDirectCall(url)
              .then(function (provData) {
                success(utils.convertFromBlockstack({indexData: indexData, provData: provData}))
              }).catch(function (e) {
                console.log('Unable to add record: ' + indexData.id, e)
                failure({error: 1, message: 'no artworks found'})
              })
          })
        }
      }).catch(function (e) {
        failure({error: 2, message: 'no artworks found'})
      })
  },
}
export default artworkSearchService
