import axios from 'axios'
import {
  Person,
  lookupProfile,
  getFile,
  putFile,
  loadUserData
} from 'blockstack'
import _ from 'lodash'
import searchIndexService from '@/services/searchindex/searchIndexService'
import moment from 'moment'
import xhrService from '@/services/xhrService'
import cacheService from '@/services/cacheService'
import SHA256 from 'crypto-js/sha256'
import ethService from '@/services/experimental/ethApiService'
import utils from '../utils'

/**
 *  Service manages a file structure which has a root file and a set of provenance records.
 *  The root file contains an identifier to the individual provenance records and a minimal
 *  amount of information required to build a search index. The provenance records contains
 *  all the information about that particular record; ownership info, meta data, images, the
 *  digital artwork if one exists and documenatry evidence.
**/
const provenanceService = {
  state: 'UN_INIT',
  rootFile: null,
  localRecords: [],
  storage: {},
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
    let rootFileStringy = provenanceService.rootFile
    // let rootFileStringy = localStorage.getItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH)
    if (!rootFileStringy) {
      provenanceService.initRootFile()
    } else {
      return JSON.parse(rootFileStringy)
      // return JSON.parse(rootFileStringy)
    }
  },
  addProvenanceRecordInLS: function (provData) {
    let localRecords = provenanceService.localRecords
    // let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
    // if (!localRecords) {
    //   localRecords = []
    // }
    let index = _.findIndex(localRecords, {id: provData.id})
    if (index > -1) {
      localRecords.splice(index, 1, provData)
    } else {
      localRecords.push(provData)
    }
    try {
      provenanceService.localRecords = localRecords
      // localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH, JSON.stringify(localRecords))
    } catch (e) {
      console.log('No room in local storage for record: ' + provData.id)
    }
  },
  setProvenanceRecordInLS: function (o) {
    try {
      provenanceService.localRecords.push(o)
      // localStorage.setItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH, JSON.stringify(o))
    } catch (e) {
      console.log('No room in local storage for record: ' + o)
    }
  },
  setRootFileInLS: function (file) {
    try {
      if (typeof file !== 'string') {
        provenanceService.rootFile = JSON.stringify(file)
        // localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH, JSON.stringify(file))
      } else {
        provenanceService.rootFile = file
        // localStorage.setItem(provenanceService.ROOT_FILE_LOCAL_STORAGE_PATH, file)
      }
    } catch (e) {
      console.log('No room in local storage for record: ' + file)
    }
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
              console.log('root file **********', JSON.parse(file))
              provenanceService.rootFile = JSON.parse(file)
              provenanceService.state = 'ROOT_INIT'
              resolve({failed: false, message: 'Made new root file in user storage and saved it in local storage: ' + file})
            }).catch(function (e) {
              resolve({failed: true, message: 'Failed fetch new new root file after making it: ' + file})
            })
          })
        } else {
          console.log('root file 2 **********', JSON.parse(file))
          provenanceService.rootFile = JSON.parse(file)
          let newData = provenanceService.rootFile.records
          newData = _.unionBy(provenanceService.rootFile.records, newData, 'id')
          provenanceService.rootFile.records = newData
          resolve({failed: false, message: 'Found existing root file and stored it in local storage: ' + file})
        }
      }).catch(function (e) {
        console.log('Unable to make root file: ', e)
      })
    })
  },
  initProvenanceRecords: function () {
    let rootFile = provenanceService.rootFile
    if (rootFile && rootFile.records) {
      let total = rootFile.records.length
      let counter = 0
      _.forEach(rootFile.records, function (indexData) {
        if (indexData && indexData.id) {
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            counter++
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              if (!indexData.saleData) {
                indexData.saleData = {
                  soid: 0,
                  amount: 0,
                  reserve: 0,
                  increment: 0
                }
              }
              provData.blockchainOwner = indexData.uploader
              if (provData && provData.artwork && provData.artwork[0] && provData.artwork[0].dataUrl.length > 0) {
                let timestamp = utils.buildArtworkHash(provData.artwork[0].dataUrl)
                indexData.timestamp = timestamp
                ethService.fetchItemByArtHash(timestamp).then((item) => {
                  let myIndexData = _.find(rootFile.records, {timestamp: indexData.timestamp})
                  if (item[1] && item[1].length > 0) {
                    if (item[1] === myIndexData.uploader) {
                      myIndexData.regData = {
                        state: 120,
                        owner: item[1]
                      }
                      provData.blockchainOwner = item[1]
                    } else {
                      myIndexData.regData = {
                        state: 130,
                        owner: item[1]
                      }
                      provData.blockchainOwner = item[1]
                      console.log('Found a sold item!!!', indexData, provData)
                    }
                  }
                })
              }
              provenanceService.addProvenanceRecordInLS(provData)
              // indexData.regData = provenanceService.setRegData({indexData: indexData, provData: provData})
            }
            if (counter === (total - 1)) {
              provenanceService.state = 'ROOT_PROV_STARTED'
            }
          }).catch(function (e) {
            console.log('Unable to initialise provenance record: ' + total, e)
          })
        }
      })
    } else {
      provenanceService.state = 'ROOT_PROV_INIT_EMPTY'
    }
  },
  getProvenanceRecordsInLS: function (recordId) {
    return new Promise(function (resolve) {
      let myTimer = setInterval(function () {
        let rootFile = provenanceService.rootFile
        if (rootFile) {
          let results = []
          if (recordId) {
            resolve(provenanceService.getProvenanceRecord(recordId, rootFile))
          } else {
            _.forEach(rootFile.records, function (theRecord) {
              results.push(provenanceService.getProvenanceRecord(theRecord.id, rootFile))
            })
            resolve(results)
          }
          clearInterval(myTimer)
        } else {
          var now = moment({}).valueOf()
          let newRootFile = {
            created: now,
            records: []
          }
          provenanceService.rootFile = newRootFile
          clearInterval(myTimer)
        }
      }, 100)
    })
  },
  getProvenanceRecord: function (id, rootFile) {
    if (!rootFile) {
      rootFile = provenanceService.rootFile
    }
    let indexData = {}
    _.forEach(rootFile.records, function (theRecord) {
      if (theRecord.id === id) {
        indexData = theRecord
      }
    })
    // let localRecords = JSON.parse(localStorage.getItem(provenanceService.PROVENANCE_FILE_LOCAL_STORAGE_PATH))
    let localRecords = provenanceService.localRecords
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
    if (!record.provData) {

    }
    // provenanceService.setRegData(record)
    return record
  },
  getProvenanceRecordFromSearchIndex: function (id) {
    return new Promise(function (resolve) {
      getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
        if (!file) {
          resolve({failed: true, message: 'Failed to fetch root file in user storage and to save it in local storage: ' + file})
        } else {
          let rootFile = JSON.parse(file)
          let index = _.findIndex(rootFile.records, {id: id})
          if (index === -1) {
            index = _.findIndex(rootFile.records, {id: String(id)})
          }
          let indexData = rootFile.records[index]
          indexData.id = Number(id)
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              // provenanceService.setRegData({indexData: indexData, provData: provData})
              resolve({indexData: indexData, provData: provData})
            } else {
              resolve({failed: true, message: 'File not found: ' + indexData.id})
            }
          }).catch(function (e) {
            resolve({failed: true, message: 'Unable to initialise provenance record: ' + indexData.id})
          })
        }
      }).catch(function (e) {
        console.log('Unable to make root file: ', e)
      })
    })
  },
  getProvenanceRecordsFromUserStorage: function (id) {
    return new Promise(function (resolve) {
      getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
        if (!file) {
          resolve({failed: true, message: 'Failed to fetch root file in user storage and to save it in local storage: ' + file})
        } else {
          let rootFile = JSON.parse(file)
          let index = _.findIndex(rootFile.records, {id: id})
          if (index === -1) {
            index = _.findIndex(rootFile.records, {id: String(id)})
          }
          let indexData = rootFile.records[index]
          indexData.id = Number(id)
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              resolve({indexData: indexData, provData: provData})
            } else {
              resolve({failed: true, message: 'File not found: ' + indexData.id})
            }
          }).catch(function (e) {
            resolve({failed: true, message: 'Unable to initialise provenance record: ' + indexData.id})
          })
        }
      }).catch(function (e) {
        console.log('Unable to make root file: ', e)
      })
    })
  },
  getUserData: function () {
    return loadUserData()
  },
  getUserProfile: function () {
    let profile
    let blockstackUser = loadUserData()
    if (!blockstackUser) {
      profile = {
        admin: false,
        username: 'unknown',
        name: 'Anon',
        description: 'unknown person',
        image: '/static/images/artist_preview.png',
      }
    }
    profile = {
      // TODO need a way to identify who should be.. admin: (blockstackUser.username === 'mike.personal.id' || blockstackUser.username === 'brightblock.id' || blockstackUser.username === 'antoniomeic.id.blockstack')
      admin: true,
      username: blockstackUser.username,
      name: blockstackUser.profile.name,
      description: blockstackUser.profile.description,
      image: (blockstackUser.profile.avatarUrl) ? blockstackUser.profile.avatarUrl : '/static/images/artist_preview.png',
    }
    return profile
  },
  getArtistProfile: function (record) {
    return new Promise(function (resolve) {
      let profile = {}
      if (record) {
        lookupProfile(record.indexData.uploader).then((profile) => {
          let person = new Person(profile.person)
          profile.person = person
          // console.log('lookupUserProfile: profile : ', profile)
          profile = {
            username: record.indexData.uploader,
            description: profile.description,
            name: profile.name,
            image: (profile.image && profile.image[0]) ? profile.image[0].contentUrl : '/static/images/artist_preview.png',
          }
          resolve(profile)
        })
      } else {
        profile = {
          username: 'unknown artist',
          name: 'unknown artist',
          description: 'unknown artist',
          image: '/static/images/artist_preview.png',
        }
        resolve(profile)
      }
    })
  },
  /**
   *  Fetch the users zone file - the blockstack zone which contains the loaction
   *  of the users storage url.
  **/
  fetchZonefile: function (username) {
    if (!username) {
      username = loadUserData().username
    }
    return new Promise(function (resolve) {
      axios.get('https://core.brightblock.org/v1/names/' + username)
        .then(function (response) {
          resolve(response)
        }).catch(function (e) {
          console.log('Unable to fetch zone file: ', e)
          resolve({error: 'Unable to fetch zone file: ' + e})
        })
    })
  },
  fetchRootfile: function (gaiaUrl) {
    return new Promise(function (resolve) {
      let url = gaiaUrl + provenanceService.ROOT_FILE_GAIA_NAME
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
      throw new Error('Provenance data is corrupt: ', provData)
    }
    if (provData.id !== indexData.id) {
      throw new Error('Index data is out of step with provenance data.')
    }
  },
  createOrUpdateRecord: function (indexData, provData) {
    return new Promise(function (resolve) {
      provenanceService.checkData(indexData, provData)
      // let rootFile = provenanceService.rootFile
      let idNumber = Number(indexData.id)
      indexData.id = idNumber
      var index = _.findIndex(provenanceService.rootFile.records, {id: indexData.id})
      if (!indexData.saleData) {
        indexData.saleData = {
          soid: 0,
          amount: 0,
          reserve: 0,
          increment: 0
        }
      }
      if (!provData.owners) {
        provData.owners = [{
          owner: indexData.uploader,
          saleData: indexData.saleData,
        }]
      } else {
        provData.owners[provData.owners.length - 1] = indexData.saleData
      }
      // provenanceService.setRegData({indexData: indexData, provData: provData})
      if (index > -1) {
        provenanceService.rootFile.records.splice(index, 1, indexData)
      } else {
        provenanceService.rootFile.records.push(indexData)
      }
      putFile(provenanceService.ROOT_FILE_GAIA_NAME, JSON.stringify(provenanceService.rootFile), {encrypt: false}).then(function (message) {
        let fileName = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
        putFile(fileName, JSON.stringify(provData), {encrypt: false})
          .then(function (message) {
            provenanceService.addProvenanceRecordInLS(provData)
            indexData.gaiaUrl = message
            indexData.appUrl = window.location.host
            searchIndexService.reindexRecord(indexData).then(function (message) {
              cacheService.updateIndexDataInCache(indexData)
            }).catch(function (e) {
              console.log('Unable to index new record - it should be picked up in next sweep. ', e)
            })
            resolve(provData)
          }).catch(function (e) {
            console.log('Unable to create provenance record in user gaia storage: ', e)
            resolve({error: 'Unable to create provenance record in user gaia storage: ' + e, rootFile: provenanceService.rootFile})
          })
      }).catch(function (e) {
        console.log('Unable to update root file: ', e)
        resolve({error: 'Unable to update root file: ' + e, rootFile: provenanceService.getRootFileInLS()})
      })
    })
  },
  getRecordFromSearchIndexById: function (id) {
    return searchIndexService.searchIndex('art', 'id', id).then((records) => {
      return provenanceService.getRecordForSearch(records[0]).then((record) => {
        let hash = utils.buildArtworkHash(record.provData.artwork[0].dataUrl)
        record.indexData.timestamp = hash
        return record
        // console.log('hash****', hash)

        // return ethService.fetchItemByArtHash(hash).then((data) => {
        //  record.scData = data

        // console.log('record*********', record)
        //  return record
        // })
      })
    })
  },
  findArtworkFromBlockChainData: function (blockchainItem, callback) {
    let $self = this
    $self.callback = callback
    let index = blockchainItem.index
    let title = blockchainItem.item[0]
    console.log('Searching for item with title: ' + title + ' index: ' + index)
    searchIndexService.searchIndex('art', 'title', '"' + title + '"').then((results) => {
      let indexData = results[0]
      provenanceService.getRecordForSearch(indexData).then((record) => {
        if (record && record.indexData && record.indexData.id) {
          let dataUrl = ''
          if (record.provData.artwork && record.provData.artwork && record.provData.artwork.length > 0) {
            dataUrl = record.provData.artwork[ 0 ].dataUrl
          }
          if (dataUrl && dataUrl.length > 0) {
            provenanceService.getArtistProfile(record).then((profile) => {
              record.profile = profile
              record.image = dataUrl
              $self.callback(record)
            })
          }
        }
      }).catch(e => {
        console.log('Unable to get from: ', indexData)
      })
    }).catch(e => {
      console.log('Unable to contact search index.', e)
    })
  },
  loadMyArtworks: function (callback) {
    let $self = this
    $self.callback = callback
    getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
      if (!file) {
        if (!callback) {
          provenanceService.makeRootFile().then(function (message) {
            getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
              provenanceService.rootFile = JSON.parse(file)
              console.log('root file **********', JSON.parse(file))
            }).catch(function (e) {
              console.log('Failed fetch new new root file after making it: ')
            })
          })
        }
      } else {
        console.log('root file 2 **********', JSON.parse(file))
        provenanceService.rootFile = JSON.parse(file)
        let newData = provenanceService.rootFile.records
        newData = _.unionBy(provenanceService.rootFile.records, newData, 'id')
        provenanceService.rootFile.records = newData
        provenanceService.provDataList = []
        _.forEach(provenanceService.rootFile.records, function (indexData) {
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              provenanceService.provDataList.push(provData)
              if (provData && provData.artwork && provData.artwork[0] && provData.artwork[0].dataUrl.length > 0) {
                let timestamp = utils.buildArtworkHash(provData.artwork[0].dataUrl)
                indexData.timestamp = timestamp
                $self.callback({indexData: indexData, provData: provData})
              } else {
                $self.callback({indexData: indexData, provData: provData})
              }
            } else {
              console.log('Failed fetch new new root file after making it: ')
            }
          }).catch(function (e) {
            console.log('Failed fetch new new root file after making it: ', e)
          })
        })
      }
    }).catch(function (e) {
      console.log('Unable to make root file: ', e)
    })
  },
  loadMyArtwork: function (artworkId, callback) {
    let $self = this
    $self.callback = callback
    if (typeof artworkId === 'string') {
      artworkId = Number(artworkId)
    }
    getFile(provenanceService.ROOT_FILE_GAIA_NAME, {decrypt: false}).then(function (file) {
      if (file) {
        console.log('root file 2 **********', JSON.parse(file))
        provenanceService.rootFile = JSON.parse(file)
        let index = _.findIndex(provenanceService.rootFile.records, {id: artworkId})
        if (index === -1) {
          $self.callback({failed: true, message: 'No match for artwork: ' + artworkId})
        } else {
          let indexData = provenanceService.rootFile.records[index]
          let fileToFetch = provenanceService.PROVENANCE_FILE_GAIA_SUBPATH + indexData.id + '.json'
          getFile(fileToFetch, {decrypt: false}).then(function (file) {
            if (file) {
              let provData = JSON.parse(file)
              provData.id = indexData.id
              if (provData && provData.artwork && provData.artwork[0] && provData.artwork[0].dataUrl.length > 0) {
                let timestamp = utils.buildArtworkHash(provData.artwork[0].dataUrl)
                indexData.timestamp = timestamp
                $self.callback({indexData: indexData, provData: provData})
              } else {
                $self.callback({indexData: indexData, provData: provData})
              }
            } else {
              $self.callback({failed: true, message: 'No match for artwork: ' + artworkId})
            }
          }).catch(function (e) {
            $self.callback({failed: true, message: 'No match for artwork: ' + artworkId})
          })
        }
      }
    }).catch(function (e) {
      $self.callback({failed: true, message: 'No match for artwork: ' + artworkId})
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
            // provenanceService.setRegData(record)
            resolve(record)
          }).catch(function (e) {
            console.log('Unable to add record: ' + record.indexData.id, e)
            resolve(record)
          })
      }
    })
  },
  setRegData: function (record) {
    let tempRegData = {
      timestamp: '',
      state: 100,
      label: 'not registerable'
    }
    record.indexData.regData = tempRegData
    return new Promise(function (resolve) {
      try {
        if (record.indexData.itemType === 'digiart') {
          if (record.provData && record.provData.artwork && record.provData.artwork[0] && record.provData.artwork[0].dataUrl.length > 0) {
            tempRegData.timestamp = '0x' + SHA256(record.provData.artwork[0].dataUrl).toString()
            tempRegData.state = 110
            tempRegData.label = 'registerable'
            record.indexData.regData = tempRegData
            // ethService.fetchItemByArtHash(tempRegData.timestamp).then((result) => {
            ethService.isRegistered(tempRegData.timestamp).then((result) => {
              if (result.failed || !result.registered) {
                record.indexData.regData = tempRegData
                resolve(tempRegData)
              } else {
                // tempRegData.currentOwner = result[1]
                tempRegData.state = 120
                tempRegData.label = 'registered'
                record.indexData.regData = tempRegData
                resolve(tempRegData)
              }
            }).catch(function (e) {
              console.log('MetaMask: are you logged in? ', e)
            })
          } else {
            record.indexData.regData = tempRegData
            resolve(tempRegData)
          }
        } else {
          record.indexData.regData = tempRegData
          resolve(tempRegData)
        }
      } catch (e) {
        console.log('Error reading registration data from ethereum. ', e)
        record.indexData.regData = tempRegData
        resolve(tempRegData)
      }
    })
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
  convertToArtwork: function (record) {
    let dataUrl = '/static/images/artwork1.jpg'
    if (record.provData.artwork && record.provData.artwork.length > 0) {
      dataUrl = record.provData.artwork[0].dataUrl
    }
    let owner = record.indexData.uploader
    try {
      owner = record.provData.owners[record.provData.owners.length - 1].owner
    } catch (err) {
      owner = record.indexData.uploader
    }
    let artwork = {
      id: record.indexData.id.toString(),
      caption: record.indexData.uploader,
      state: (record.indexData.regData) ? record.indexData.regData.state : -1,
      owner: owner,
      image: dataUrl,
      title: record.indexData.title,
      showRegistration: true,
      // forSale: record.indexData.saleData.soid === 1,
      // forAuction: record.indexData.saleData.soid === 2,
    }
    return artwork
  },
}
export default provenanceService
