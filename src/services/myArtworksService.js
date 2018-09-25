import {
  getFile,
} from 'blockstack'
import store from '@/storage/store'
import _ from 'lodash'

const myArtworksService = {
  getMyArtworks: function (success, failure) {
    const gaiaRootFileName = store.state.constants.gaiaRootFileName
    const gaiaArtworkFileName = store.state.constants.gaiaArtworkFileName
    let results = []
    getFile(gaiaRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        failure({error: 1, message: 'no artworks found'})
      } else {
        let gaiaRootFile = JSON.parse(file)
        let records = gaiaRootFile.records
        _.forEach(records, function (indexData) {
          let fileToFetch = gaiaArtworkFileName + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              results.push({indexData: indexData, provData: provData})
            } else {
              results.push({indexData: indexData, provData: null})
            }
          }).catch(function (e) {
            results.push({indexData: indexData, provData: null})
          })
        })
        success(results)
      }
    }).catch(function (e) {
      failure({error: 2, message: 'no artworks found'})
    })
  },
}
export default myArtworksService
