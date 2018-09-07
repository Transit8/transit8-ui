import axios from 'axios'
import {
  getFile,
  putFile,
  loadUserData
} from 'blockstack'
import _ from 'lodash'
import searchIndexService from '@/services/searchindex/SearchIndexService'
import moment from 'moment'
import xhrService from '@/services/xhrService'
import cacheService from '@/services/cacheService'
import SHA256 from 'crypto-js/sha256'
import ethService from '@/services/experimental/ethApiService'

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
  saleOptions: [
    {soid: 0, label: 'Listing'},
    {soid: 1, label: 'Buy Now'},
    {soid: 2, label: 'Bidding'},
  ],
  getRootFileInLS: function () {
    let rootFileStringy = localStorage.getItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH)
    if (!rootFileStringy) {
      provenanceService.initRootFile()
    } else {
      return JSON.parse(rootFileStringy)
    }
  },
  addProvenanceRecordInLS: function (provData) {
    let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
    if (!localRecords) {
      localRecords = []
    }
    let index = _.findIndex(localRecords, {id: provData.id})
    if (index > -1) {
      localRecords.splice(index, 1, provData)
    } else {
      localRecords.push(provData)
    }
    try {
      localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH, JSON.stringify(localRecords))
    } catch (e) {
      console.log('No room in local storage for record: ' + provData.id)
    }
  },
  setProvenanceRecordInLS: function (o) {
    try {
      localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH, JSON.stringify(o))
    } catch (e) {
      console.log('No room in local storage for record: ' + o)
    }
  },
  setRootFileInLS: function (file) {
    try {
      if (typeof file !== 'string') {
        localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH, JSON.stringify(file))
      } else {
        localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH, file)
      }
    } catch (e) {
      console.log('No room in local storage for record: ' + file)
    }
  },
  parseAppUrl: function (appUrl) {
    if (!appUrl || appUrl.length === 0) {
      return ''
    }
    let showUrl = 'App Url: '
    if (appUrl.startsWith(':')) {
      showUrl += appUrl.substring(3)
    } else if (appUrl.startsWith('http:')) {
      showUrl += appUrl.substring(7)
    } else if (appUrl.startsWith('https:')) {
      showUrl += appUrl.substring(8)
    } else if (appUrl.startsWith('s:')) {
      showUrl += appUrl.substring(4)
    } else if (appUrl.startsWith('p:')) {
      showUrl += appUrl.substring(4)
    } else {
      showUrl += appUrl
    }
    return showUrl
  },
  makeRootFile: function () {
    var now = moment({}).valueOf()
    let newRootFile = {
      created: now,
      records: []
    }
    return putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(newRootFile), {encrypt: false})
  },
  initRootFile: function () {
    return new Promise(function (resolve) {
      getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
        if (!file) {
          provenanceService.makeRootFile().then(function (message) {
            getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
              provenanceService.setRootFileInLS(file)
              provenanceService.state = 'ROOT_INIT'
              resolve({failed: false, message: 'Made new root file in user storage and saved it in local storage: ' + file})
            }).catch(function (e) {
              resolve({failed: true, message: 'Failed fetch new new root file after making it: ' + file})
            })
          }).catch(function (e) {
            resolve({failed: true, message: 'Failed to make new root file in user storage and to save it in local storage: ' + file})
          })
        } else {
          let rootFile = JSON.parse(file)
          let newData = rootFile.records
          newData = _.unionBy(rootFile.records, newData, 'id')
          rootFile.records = newData

          provenanceService.setRootFileInLS(JSON.stringify(rootFile))
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
      _.forEach(rootFile.records, function (indexData) {
        if (indexData && indexData.id) {
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            count++
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              let record = {
                indexData: indexData,
                provData: provData,
              }
              provenanceService.setRegData(record)
              provenanceService.addProvenanceRecordInLS(provData)
            }
            if (count === total) {
              provenanceService.state = 'ROOT_PROV_FINISHED'
            }
          }).catch(function (e) {
            console.log('Unable to initialise provenance record: ', e)
          })
        }
      })
      provenanceService.state = 'ROOT_PROV_STARTED'
    } else {
      provenanceService.state = 'ROOT_PROV_INIT_EMPTY'
    }
  },
  getProvenanceRecordsInLS: function () {
    let rootFile = provenanceService.getRootFileInLS()
    if (!rootFile) {
      provenanceService.initRootFile()
      return []
    }
    let results = []
    _.forEach(rootFile.records, function (theRecord) {
      results.push(provenanceService.getProvenanceRecord(theRecord.id, rootFile))
    })
    return results
  },
  getProvenanceRecord: function (id, rootFile) {
    if (!rootFile) {
      rootFile = provenanceService.getRootFileInLS()
    }
    let indexData = {}
    _.forEach(rootFile.records, function (theRecord) {
      if (theRecord.id === id) {
        indexData = theRecord
      }
    })
    let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
    let provData
    if (id) {
      _.forEach(localRecords, function (theRecord) {
        if (theRecord.id === id) {
          provData = theRecord
        }
      })
    }
    let record = {
      indexData: indexData,
      provData: provData,
    }
    provenanceService.setRegData(record)
    return record
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
  fetchRootfile: function (gaiaUrl) {
    return new Promise(function (resolve) {
      let url = gaiaUrl + provenanceService.getRootFileName()
      axios.get(url)
        .then(function (response) {
          resolve(response)
        }).catch(function (e) {
          console.log('Unable to fetch zone file: ', e)
          throw e
        })
    })
  },
  checkData: function (indexData, provData) {
    if (!indexData || !indexData.id) {
      throw new Error('Index data is corrupt: ', indexData)
    }
    if (!provData || !provData.id) {
      throw new Error('Provenance data is corrupt: ', indexData)
    }
    if (!provData.id === indexData.id) {
      throw new Error('Index data is out of step with provenance data.')
    }
  },
  createOrUpdateRecord: function (indexData, provData) {
    return new Promise(function (resolve) {
      provenanceService.checkData(indexData, provData)
      let rootFile = provenanceService.getRootFileInLS()
      var index = _.findIndex(rootFile.records, {id: indexData.id})
      if (!indexData.saleData) {
        indexData.saleData = {
          soid: 0,
          amount: 0,
          reserve: 0,
          increment: 0
        }
      }
      let record = {
        indexData: indexData,
        provData: provData,
      }
      provenanceService.setRegData(record)
      if (index > -1) {
        rootFile.records.splice(index, 1, indexData)
      } else {
        rootFile.records.push(indexData)
      }
      putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(rootFile), {encrypt: false}).then(function (message) {
        provenanceService.setRootFileInLS(rootFile)
        console.log('Updated root file in user and local storage: ' + message)
        let fileName = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
        putFile(fileName, JSON.stringify(provData), {encrypt: false})
          .then(function (message) {
            provenanceService.addProvenanceRecordInLS(provData)
            console.log('Updated provenance file in user and local storage: ' + message)
            indexData.gaiaUrl = message
            indexData.appUrl = window.location.host
            searchIndexService.reindexRecord(indexData).then(function (message) {
              cacheService.updateIndexDataInCache(indexData)
              console.log('Indexed new record.')
            }).catch(function (e) {
              console.log('Unable to index new record - it should be picked up in next sweep. ', e)
            })
            resolve(provData)
          }).catch(function (e) {
            console.log('Unable to create provenance record in user gaia storage: ', e)
            resolve({error: 'Unable to create provenance record in user gaia storage: ' + e, rootFile: provenanceService.getRootFileInLS()})
          })
      }).catch(function (e) {
        console.log('Unable to update root file: ', e)
        resolve({error: 'Unable to update root file: ' + e, rootFile: provenanceService.getRootFileInLS()})
      })
    })
  },
  getRecordForSearch: function (indexData) {
    return new Promise(function (resolve) {
      let useCache = false
      let record = cacheService.getFromCache(indexData.id)
      if (useCache && record && record.title === indexData.title && record.description === indexData.description) {
        resolve(record)
      } else {
        let urlLastSlash = indexData.gaiaUrl.lastIndexOf('/') + 1
        let url = indexData.gaiaUrl.substring(0, urlLastSlash)
        url = url + provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
        xhrService.makeDirectCall(url)
          .then(function (provData) {
            let record = {
              indexData: indexData,
              provData: provData
            }
            provenanceService.setRegData(record)
            cacheService.addToCache(record)
            resolve(record)
          }).catch(function (e) {
            console.log('Unable to add record: ' + record.indexData.id, e)
          })
      }
    })
  },
  setRegData: function (record) {
    // if (record.indexData.regData && record.indexData.regData.result) {
    //  return
    // }
    let tempRegData = {
      timestamp: '',
      state: 100,
      label: 'not registerable'
    }
    try {
      if (record.indexData.itemType === 'digiart') {
        if (record.provData && record.provData.artwork && record.provData.artwork[0] && record.provData.artwork[0].dataUrl.length > 0) {
          tempRegData.timestamp = '0x' + SHA256(record.indexData.uploader + '::' + record.provData.artwork[0].dataUrl).toString()
          tempRegData.state = 110
          tempRegData.label = 'registerable'
          ethService.isRegistered(tempRegData.timestamp).then((result) => {
            if (result.registered) {
              tempRegData.state = 120
              tempRegData.label = 'registered'
              record.indexData.regData = tempRegData
            }
          })
        }
      }
    } catch (e) {
      console.log('Error reading registration data from ethereum. ', e)
    }
    record.indexData.regData = tempRegData
  },
}
export default provenanceService
