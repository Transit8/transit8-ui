import {
  getFile,
  putFile,
} from 'blockstack'
import store from '@/storage/store'
import _ from 'lodash'
import utils from './utils'
import artworkSearchService from '@/services/artworkSearchService'
import moment from 'moment'
import notify from '@/services/notify'

const myArtworksService = {
  initBlockstackRootFile: function () {
    const blockstackRootFileName = store.state.constants.blockstackRootFileName
    var now = moment({}).valueOf()
    let newRootFile = {
      created: now,
      profile: {},
      records: []
    }
    return putFile(blockstackRootFileName, JSON.stringify(newRootFile), {encrypt: false})
  },

  getMyArtworks: function (success, failure) {
    const blockstackRootFileName = store.state.constants.blockstackRootFileName
    getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        myArtworksService.initBlockstackRootFile()
      } else {
        let blockstackRootFile = JSON.parse(file)
        store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
        _.forEach(blockstackRootFile.records, function (indexData) {
          if (!indexData.uploader) {
            let userProfile = store.getters['myAccountStore/getMyProfile']
            indexData.uploader = userProfile.username
          }
          store.dispatch('userProfilesStore/addUserProfile', {username: indexData.uploader}, {root: true})
          store.dispatch('userProfilesStore/addUserProfile', {username: indexData.owner}, {root: true})
          myArtworksService.fetchMyProvenanceFile(indexData, success, failure)
        })
      }
    }).catch(function (e) {
      failure({ERR_CODE: 101, message: 'Error fetching blockstack root file!'})
    })
  },

  getMyArtwork: function (artworkId, success, failure) {
    const blockstackRootFileName = store.state.constants.blockstackRootFileName
    getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        myArtworksService.initBlockstackRootFile()
      } else {
        let blockstackRootFile = JSON.parse(file)
        store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
        _.forEach(blockstackRootFile.records, function (indexData) {
          if (indexData.id === artworkId) {
            store.dispatch('userProfilesStore/addUserProfile', {username: indexData.uploader}, {root: true})
            store.dispatch('userProfilesStore/addUserProfile', {username: indexData.owner}, {root: true})
            myArtworksService.fetchMyProvenanceFile(indexData, success, failure)
          }
        })
      }
    }).catch(function (e) {
      failure({ERR_CODE: 101, message: 'Error fetching blockstack root file!'})
    })
  },

  transferArtwork: function (artwork, success, failure) {
    artworkSearchService.remove('id', artwork.id).then(function (message) {
      notify.info({title: 'Transfer Artwork.', text: 'Removed from search index <br>' + message})
      myArtworksService.uploadOrTransferArtwork(artwork, success, failure)
    })
  },

  uploadArtwork: function (artwork, success, failure) {
    artwork.id = moment({}).valueOf()
    artwork.bcitem = {
      status: 'new'
    }
    myArtworksService.uploadOrTransferArtwork(artwork, success, failure)
  },

  uploadOrTransferArtwork: function (artwork, success, failure) {
    let blockstackRootFileName = store.state.constants.blockstackRootFileName
    getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        myArtworksService.initBlockstackRootFile().then(function (file) {
          myArtworksService.uploadProvenanceFile(blockstackRootFileName, file, artwork, success, failure)
        })
      } else {
        myArtworksService.uploadProvenanceFile(blockstackRootFileName, file, artwork, success, failure)
      }
    }).catch(function (e) {
      failure({ERR_CODE: 2, message: 'no root blockstack fole found.'})
    })
  },

  uploadProvenanceFile: function (blockstackRootFileName, file, artwork, success, failure) {
    let blockstackRootFile = file
    if (typeof file === 'string') {
      blockstackRootFile = JSON.parse(file)
    }
    let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    let provFile = gaiaArtworkFileName + artwork.id + '.json'
    let record = utils.convertToBlockstack(artwork)
    blockstackRootFile.records.splice(0, 0, record.indexData)
    putFile(blockstackRootFileName, JSON.stringify(blockstackRootFile), {encrypt: false})
      .then(function (message) {
        putFile(provFile, JSON.stringify(record.provData), {encrypt: false}).then(function (message) {
          store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
          artworkSearchService.addRecordToIndex(record.indexData)
          success(utils.convertFromBlockstack(record))
        }).catch(function (e) {
          failure({ERR_CODE: 2, message: 'Error saving provenance file: ' + artwork.id})
        })
      }).catch(function (e) {
        failure({ERR_CODE: 3, message: 'Error uploading artwork: ' + artwork.id})
      })
  },

  updateArtwork: function (artwork, success, failure) {
    let blockstackRootFileName = store.state.constants.blockstackRootFileName
    let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    let provFile = gaiaArtworkFileName + artwork.id + '.json'
    if (!artwork.bcitem) {
      // for backwards compat with items created before this object was added.
      artwork.bcitem = {
        status: 'new'
      }
    }
    artworkSearchService.remove('id', artwork.id).then(function (message) {
      notify.info({title: 'Transfer Artwork.', text: 'Removed from search index <br>' + message})
      let record = utils.convertToBlockstack(artwork)
      getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
        if (!file) {
          failure({ERR_CODE: 1, message: 'no artworks found'})
        } else {
          let blockstackRootFile = JSON.parse(file)
          let index = _.findIndex(blockstackRootFile.records, function (o) {
            return o.id === artwork.id
          })
          if (index < 0 || index >= blockstackRootFile.records.length) {
            failure({ERR_CODE: 2, message: 'Unable to find index data in record.'})
          } else {
            blockstackRootFile.records[index] = record.indexData
            putFile(blockstackRootFileName, JSON.stringify(blockstackRootFile), {encrypt: false})
              .then(function (message) {
                putFile(provFile, JSON.stringify(record.provData), {encrypt: false}).then(function (message) {
                  store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
                  success(utils.convertFromBlockstack(record))
                  artworkSearchService.addRecordToIndex(record.indexData)
                }).catch(function (e) {
                  failure({ERR_CODE: 3, message: 'Error saving provenance file: ' + artwork.id})
                })
              }).catch(function (e) {
                failure({ERR_CODE: 4, message: 'Error uploading artwork: ' + artwork.id})
              })
          }
        }
      }).catch(function (e) {
        failure({ERR_CODE: 5, message: 'no artworks found'})
      })
    })
  },

  fetchMyProvenanceFile: function (indexData, success, failure) {
    let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    let fileToFetch = gaiaArtworkFileName + indexData.id + '.json'
    getFile(fileToFetch, {decrypt: false}).then(function (file) {
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

  deleteMyArtwork: function (id, success, failure) {
    const blockstackRootFileName = store.state.constants.blockstackRootFileName
    const gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        failure({ERR_CODE: 1, message: 'No artworks found to delete from: ' + id})
      } else {
        let blockstackRootFile = JSON.parse(file)
        console.log('blockstackRootFile length before: ' + blockstackRootFile.records.length)
        let index = _.findIndex(blockstackRootFile.records, function (o) {
          return o.id === id
        })
        if (index < 0) {
          failure({ERR_CODE: 2, message: 'no artwork in blockstack root file: ' + id})
        }
        let deletedRecord = blockstackRootFile.records.splice(index, 1)
        console.log('blockstackRootFile length after: ' + blockstackRootFile.records.length + ' index=' + index)
        let fileToDelete = gaiaArtworkFileName + id + '.json'
        putFile(fileToDelete, JSON.stringify({ deleted: true, reason: 'deleted by user' }), {encrypt: false}).then(function (file) {
          putFile(blockstackRootFileName, JSON.stringify(blockstackRootFile), {encrypt: false})
            .then(function (message) {
              artworkSearchService.remove('id', id)
              store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
              success({id: id, title: deletedRecord.title, message: 'Removed from user storage and the search index.'})
            }).catch(function (e) {
              console.log('Unable to create provenance record in user gaia storage: ', e)
              failure({ERR_CODE: 3, message: 'Error saving updated blockstack root file: ' + id})
            })
        }).catch(function (e) {
          failure({ERR_CODE: 4, message: 'Error trying to delete: ' + id})
        })
      }
    }).catch(function (e) {
      failure({ERR_CODE: 5, message: 'no artworks found'})
    })
  },
}
export default myArtworksService
