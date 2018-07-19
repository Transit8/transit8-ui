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
  state: 'UN_INIT',
  ROOT_FILE_GAIA_NAME: 'records_v01.json',
  ROOT_FILE_LOCAL_STORAGE_PATH: 'rootFile',
  PROVENANCE_FILE_GAIA_SUBPATH: 'record_',
  PROVENANCE_FILE_LOCAL_STORAGE_PATH: 'provenanceRecords',
  getRootFileInLS: function () {
    let rootFileStringy = localStorage.getItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH)
    return JSON.parse(rootFileStringy)
  },
  addProvenanceRecordInLS: function (provenanceRecord) {
    let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
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
    localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH, JSON.stringify(localRecords))
  },
  setProvenanceRecordInLS: function (o) {
    localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH, JSON.stringify(o))
  },
  setRootFileInLS: function (file, isStringy) {
    if (!isStringy) {
      localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH, JSON.stringify(file))
    } else {
      localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH, file)
    }
  },
  makeRootFile: function () {
    var now = new Date().getTime()
    let newRootFile = {
      created: now,
      records: []
    }
    return putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(newRootFile))
  },
  initRootFile: function () {
    return new Promise(function (resolve) {
      getFile(provenanceService.ROOT_FILE_GAIA_NAME).then(function (file) {
        if (!file) {
          provenanceService.makeRootFile().then(function (message) {
            getFile(provenanceService.ROOT_FILE_GAIA_NAME).then(function (file) {
              provenanceService.setRootFileInLS(file, true)
              provenanceService.state = 'ROOT_INIT'
              resolve({failed: false, message: 'Made new root file in user storage and saved it in local storage: ' + file})
            }).catch(function (e) {
              resolve({failed: true, message: 'Failed fetch new new root file after making it: ' + file})
            })
          }).catch(function (e) {
            resolve({failed: true, message: 'Failed to make new root file in user storage and to save it in local storage: ' + file})
          })
        } else {
          provenanceService.setRootFileInLS(file, true)
          provenanceService.state = 'ROOT_INIT'
          resolve({failed: false, message: 'Found existing root file and stored it in local storage: ' + file})
        }
      }).catch(function (e) {
        console.log('Unable to make root file: ', e)
      })
    })
  },
  initProvenanceRecords: function () {
    let rootFile = provenanceService.getRootFileInLS()
    provenanceService.setProvenanceRecordInLS([])
    if (rootFile && rootFile.records) {
      let count = 0
      let total = rootFile.records.length
      _.forEach(rootFile.records, function (record) {
        count++
        if (record && record.id) {
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + record.id + '.json'
          getFile(fileToFetch).then(function (file) {
            if (file) {
              provenanceService.addProvenanceRecordInLS(JSON.parse(file))
            }
            if (count === total) {
              provenanceService.state = 'ROOT_PROV_FINISHED'
            }
          }).catch(function (e) {
            console.log('Unable to provenance record: ', e)
          })
        }
      })
      provenanceService.state = 'ROOT_PROV_STARTED'
    } else {
      provenanceService.state = 'ROOT_PROV_INIT_EMPTY'
    }
  },
  getProvenanceRecordsInLS: function () {
    return JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
  },
  getProvenanceRecord: function (id) {
    let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
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
          resolve({error: 'Unable to fetch zone file: ' + e, rootFile: provenanceService.getRootFileInLS()})
        })
    })
  },
  createRecord: function (provenanceRecord) {
    if (provenanceRecord.id) {
      throw new Error('z update existing record on this path.')
    }
    provenanceRecord.id = new Date().getTime()
    provenanceRecord.updated = new Date().getTime()
    provenanceRecord.registered = false
    return new Promise(function (resolve) {
      let rootFile = provenanceService.getRootFileInLS()
      rootFile.records.push({id: provenanceRecord.id, title: provenanceRecord.title, registered: false})
      putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(rootFile)).then(function (message) {
        provenanceService.setRootFileInLS(rootFile, true)
        console.log('Updated root file in user and local storage: ' + message)
        let fileName = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + provenanceRecord.id + '.json'
        putFile(fileName, JSON.stringify(provenanceRecord))
          .then(function (message) {
            provenanceService.addProvenanceRecordInLS(provenanceRecord)
            console.log('Updated provenance file in user and local storage: ' + message)
            resolve(provenanceRecord)
          }).catch(function (e) {
            console.log('Unable to create provenance record in user gaia storage: ', e)
            resolve({error: 'Unable to create provenance record in user gaia storage: ' + e, rootFile: provenanceService.getRootFileInLS()})
          })
      }).catch(function (e) {
        console.log('Unable to update root file: ', e)
        resolve({error: 'Unable to update root file: ' + e, rootFile: provenanceService.getRootFileInLS()})
      })
    })
  }
}
export default provenanceService
