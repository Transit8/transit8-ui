import {
  getFile,
  putFile,
} from 'blockstack'
import store from '@/storage/store'
import _ from 'lodash'
import utils from './utils'
import searchIndexService from '@/services/searchindex/searchIndexService'

const myArtworksService = {
  getMyArtworks: function (success, failure) {
    const blockstackRootFileName = store.state.constants.blockstackRootFileName
    getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        failure({error: 1, message: 'no artworks found'})
      } else {
        let blockstackRootFile = JSON.parse(file)
        store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
        _.forEach(blockstackRootFile.records, function (indexData) {
          store.dispatch('userProfilesStore/addUserProfile', {username: indexData.uploader}, {root: true})
          store.dispatch('userProfilesStore/addUserProfile', {username: indexData.owner}, {root: true})
          myArtworksService.fetchMyProvenanceFile(indexData, success, failure)
        })
      }
    }).catch(function (e) {
      failure({error: 2, message: 'no artworks found'})
    })
  },

  fetchMyProvenanceFile: function (indexData, success, failure) {
    let gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    let fileToFetch = gaiaArtworkFileName + indexData.id + '.json'
    getFile(fileToFetch, {decrypt: false}).then(function (file) {
      if (file) {
        let provData = JSON.parse(file)
        provData.id = indexData.id
        success(utils.convertFromBlockstack({indexData: indexData, provData: provData}))
      } else {
        success(utils.convertFromBlockstack({indexData: indexData, provData: null}))
      }
    }).catch(function (e) {
      success(utils.convertFromBlockstack({indexData: indexData, provData: null}))
    })
  },

  deleteMyArtwork: function (id, success, failure) {
    const blockstackRootFileName = store.state.constants.blockstackRootFileName
    const gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    getFile(blockstackRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        failure({error: 1, message: 'no artworks found to delete from: ' + id})
      } else {
        let blockstackRootFile = JSON.parse(file)
        console.log('blockstackRootFile length before: ' + blockstackRootFile.records.length)
        let index = _.findIndex(blockstackRootFile.records, function (o) {
          return o.id === id
        })
        if (index < 0) {
          failure({error: 2, message: 'no artwork in blockstack root file: ' + id})
        }
        let deletedRecord = blockstackRootFile.records.splice(index, 1)
        console.log('blockstackRootFile length after: ' + blockstackRootFile.records.length + ' index=' + index)
        let fileToDelete = gaiaArtworkFileName + id + '.json'
        putFile(fileToDelete, JSON.stringify({ deleted: true, reason: 'deleted by user' }), {encrypt: false}).then(function (file) {
          putFile(blockstackRootFileName, JSON.stringify(blockstackRootFile), {encrypt: false})
            .then(function (message) {
              searchIndexService.remove('id', id)
              store.commit('myArtworksStore/blockstackRootFile', blockstackRootFile)
              success({id: id, title: deletedRecord.title, message: 'Removed from user storage and the search index.'})
            }).catch(function (e) {
              console.log('Unable to create provenance record in user gaia storage: ', e)
              failure({error: 3, message: 'Error saving updated blockstack root file: ' + id})
            })
        }).catch(function (e) {
          failure({error: 4, message: 'Error trying to delete: ' + id})
        })
      }
    }).catch(function (e) {
      failure({error: 5, message: 'no artworks found'})
    })
  },
}
export default myArtworksService
