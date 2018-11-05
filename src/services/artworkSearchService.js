import xhrService from '@/services/xhrService'
import store from '@/storage/store'
import _ from 'lodash'
import utils from './utils'
import {
  getFile,
} from 'blockstack'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const artworkSearchService = {
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
  addRecordToIndex: function (indexData) {
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
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/art/index/remove/' + field + '/' + value)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to remove ' + value + ' from search index'})
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

  findArtworks: function (query, success, failure) {
    xhrService.makeGetCall('/art/search/' + query.term + '?q=' + query.query)
      .then(function (results) {
        if (!results || results.length === 0) {
          success()
        } else {
          _.forEach(results, function (indexData) {
            store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.owner}, {root: true})
            store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.uploader}, {root: true})
            artworkSearchService.fetchProvenanceFile(indexData, indexData.owner, success, failure)
            /**
             * let blockstack do the work of reading from the users gaia storage.
             *
            let provGaiaUrl = utils.buildGaiaUrl(indexData.gaiaUrl, indexData.id)
            xhrService.makeDirectCall(provGaiaUrl)
              .then(function (provData) {
                provData.gaiaUrl = provGaiaUrl
                success(utils.convertFromBlockstack({indexData: indexData, provData: provData}))
              }).catch(function (e) {
                console.log('Unable to add record: ' + indexData.id, e)
                failure({error: 1, message: 'no artworks found'})
              })
              */
          })
        }
      }).catch(function (e) {
        failure({error: 2, message: 'no artworks found'})
      })
  },

  userArtworks: function (username, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName
    getFile(artworkRootFileName, {decrypt: false, username: username}).then(function (file) {
      if (!file) {
        success()
      } else {
        let userRootFile = JSON.parse(file)
        _.forEach(userRootFile.records, function (indexData) {
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.uploader}, {root: true})
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.owner}, {root: true})
          artworkSearchService.fetchProvenanceFile(indexData, username, success, failure)
        })
      }
    }).catch(function (e) {
      failure({ERR_CODE: 101, message: 'Error fetching blockstack root file!'})
    })
  },

  userArtwork: function (username, artworkId, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName
    getFile(artworkRootFileName, {decrypt: false, username: username}).then(function (file) {
      if (!file) {
        success()
      } else {
        let userRootFile = JSON.parse(file)
        let index = _.findIndex(userRootFile.records, function (o) { return o.id === artworkId })
        let indexData = userRootFile.records[index]
        store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.uploader}, {root: true})
        store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.owner}, {root: true})
        artworkSearchService.fetchProvenanceFile(indexData, username, success, failure)
      }
    }).catch(function (e) {
      failure({ERR_CODE: 101, message: 'Error fetching blockstack root file!'})
    })
  },

  fetchProvenanceFile: function (indexData, username, success, failure) {
    let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    let fileToFetch = gaiaArtworkFileName + indexData.id + '.json'
    getFile(fileToFetch, {decrypt: false, username: username}).then(function (file) {
      if (file) {
        try {
          let provData = JSON.parse(file)
          provData.id = indexData.id
          success(utils.convertFromBlockstack({indexData: indexData, provData: provData}))
        } catch (err) {
          console.error('Corrupt json file - skipping! file: ' + file, err)
        }
      } else {
        failure({ERR_CODE: 1, message: 'no provenance file found'})
      }
    }).catch(function (e) {
      failure({ERR_CODE: 2, message: 'Error fetching provenance file found: ', exception: e})
    })
  },

  findArtwork: function (artworkId, success, failure) {
    xhrService.makeGetCall('/art/search/id?q=' + artworkId)
      .then(function (results) {
        if (!results || results.length === 0 || results.length > 1) {
          failure({ERR_CODE: 400, message: 'Failed to find in search index: ' + artworkId})
        } else {
          let indexData = results[0]
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.owner}, {root: true})
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.uploader}, {root: true})
          artworkSearchService.fetchProvenanceFile(indexData, indexData.owner, success, failure)
          /**
           * let blockstack do the work of reading from the users gaia storage.
           *
          xhrService.makeDirectCall(utils.buildGaiaUrl(indexData.gaiaUrl, indexData.id))
            .then(function (provData) {
              if (provData && provData.artwork && provData.artwork[0] && provData.artwork[0].dataUrl.length > 0) {
                let timestamp = utils.buildArtworkHash(provData.artwork[0].dataUrl)
                let blockchainItem = store.getters['ethStore/getBlockchainItem'](timestamp)
                if (blockchainItem) {
                  provData.bcitem = _.merge(provData.bcitem, blockchainItem)
                }
              }
              success(utils.convertFromBlockstack({indexData: indexData, provData: provData}))
            }).catch(function (e) {
              console.log('Unable to add record: ' + indexData.id, e)
              failure({error: 1, message: 'no artworks found'})
            })
            */
        }
      }).catch(function (e) {
        failure({error: 2, message: 'no artworks found'})
      })
  },
}
export default artworkSearchService
