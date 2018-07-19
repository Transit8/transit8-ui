import axios from 'axios'
import {
  getFile,
  putFile,
  loadUserData
} from 'blockstack'
import _ from 'lodash'

/**
 *  Service manages a file structure which has a root file and a set of provenance records.
 *  The root file contains an identifier to the individual provenance records and a minimal
 *  amount of information required to build a search index. The provenance records contains
 *  all the information about that particular record; ownership info, meta data, images, the
 *  digital artwork if one exists and documenatry evidence.
**/
const provenanceService = {
  ROOT_FILE_GAIA_NAME: 'records_v02.json',
  ROOT_FILE_LOCAL_STORAGE_NAME: 'rootFile',
  PROVENANCE_FILE_GAIA_SUBPATH: 'record_',
  PROVENANCE_FILE_LOCAL_STORAGE_SUBPATH: 'provenanceRecords',
  getRootFile: function () {
    let rootFileStringy = localStorage.getItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_NAME)
    return JSON.parse(rootFileStringy)
  },
  setRootFile: function (file, isStringy) {
    if (!isStringy) {
      localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_NAME, JSON.stringify(file))
    } else {
      localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_NAME, file)
    }
  },
  addProvenanceRecord: function (provenanceRecord) {
    let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_SUBPATH))
    if (!localRecords) {
      localRecords = []
    }
    var match = _.find(localRecords, function (item) {
      if (item.id === provenanceRecord.id) {
        item = provenanceRecord
        return true
      }
    })
    if (!match) {
      localRecords.push(provenanceRecord)
    }
    localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_SUBPATH, JSON.stringify(localRecords))
  },
  getProvenanceRecords: function () {
    return JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_SUBPATH))
  },
  getProvenanceRecord: function (id) {
    let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_SUBPATH))
    let myRecord
    if (id) {
      _.forEach(localRecords, function (theRecord) {
        if (theRecord.id === id) {
          myRecord = theRecord
        }
      })
    }
    return myRecord
  },
  getUserData: function () {
    return loadUserData()
  },
  makeRootFile: function (id) {
    var now = new Date().getTime()
    let newRootFile = {
      created: now,
      records: []
    }
    return new Promise(function (resolve) {
      putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(newRootFile))
        .then(function (file) {
          provenanceService.setRootFile(file)
          console.log('Updated root file in user and local storage: ' + file)
          resolve('success')
        }).catch(function (e) {
          console.log('putFile: e : ', e)
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  addNewRecordToRootFile: function (provenanceRecord) {
    let rootFile = provenanceService.getRootFile()
    rootFile.records.push({id: provenanceRecord.id, title: provenanceRecord.title, registered: false})
    return new Promise(function (resolve) {
      putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(rootFile))
        .then(function (file) {
          provenanceService.setRootFile(file, true)
          console.log('Updated root file in user and local storage: ' + file)
          resolve(provenanceService.getRootFile())
        }).catch(function (e) {
          console.log('Unable to update root file: ', e)
          resolve({error: 'Unable to update root file: ' + e, rootFile: provenanceService.getRootFile()})
        })
    })
  },
  getRootFileName: function () {
    return provenanceService.ROOT_FILE_GAIA_NAME
  },
  /**
   *  Fetch the users zone file - the blockstack zone which contains the loaction
   *  of the users storage url.
  **/
  fetchZonefile: function () {
    var username = loadUserData().username
    return new Promise(function (resolve) {
      axios.get('https://core.brightblock.org/v1/names/' + username)
        .then(function (response) {
          resolve(response)
        }).catch(function (e) {
          console.log('Unable to fetch zone file: ', e)
          resolve({error: 'Unable to fetch zone file: ' + e, rootFile: provenanceService.getRootFile()})
        })
    })
  },
  /**
   *  Fetch the root file and then iterate over the record id's contained
   *  pulling each individual record down. Needs to be reimplemented to stream
   *  each file back to the vue component as its pulled down.
  **/
  fetchRootFile: function () {
    return new Promise(function (resolve) {
      getFile(provenanceService.ROOT_FILE_GAIA_NAME)
        .then(function (file) {
          if (!file) {
            provenanceService.makeRootFile().then(function (message) {
              console.log('Created root file: ' + message)
            })
          } else {
            provenanceService.setRootFile(file, true)
          }
          let rootFile = provenanceService.getRootFile()
          _.forEach(rootFile.records, function (recordHeader) {
            let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + recordHeader.id + '.json'
            getFile(fileToFetch).then(function (file) {
              provenanceService.addProvenanceRecord(JSON.parse(file))
            }).catch(function (e) {
              console.log('Unable to provenance record: ', e)
            })
          })
          resolve(provenanceService.getRootFile())
        }).catch(function (e) {
          console.log('Unable to fetch root file: ', e)
        })
    })
  },
  createRecord: function (provenanceRecord) {
    var existingRecord = this.getProvenanceRecord(provenanceRecord.id)
    if (existingRecord) {
      throw new Error('z update existing record on this path.')
    }
    provenanceRecord.id = new Date().getTime()
    provenanceRecord.updated = new Date().getTime()
    provenanceRecord.registered = false
    return new Promise(function (resolve) {
      provenanceService.addNewRecordToRootFile(provenanceRecord).then(function (rootFile) {
        putFile(provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + provenanceRecord.id + '.json', JSON.stringify(provenanceRecord))
          .then(function () {
            provenanceService.addProvenanceRecord(provenanceRecord)
            resolve(provenanceRecord)
          }).catch(function (e) {
            console.log('Unable to create provenance record in user gaia storage: ', e)
            resolve({error: 'Unable to create provenance record in user gaia storage: ' + e, rootFile: provenanceService.getRootFile()})
          })
      }).catch(function (e) {
        console.log('Unable to add new record to root file: ', e)
        resolve({error: 'Unable to add new record to root file: ' + e, rootFile: provenanceService.getRootFile()})
      })
    })
  }
}
export default provenanceService
