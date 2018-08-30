import _ from 'lodash'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const cacheService = {
  SEARCH_INDEX_CACHE_STORAGE_PATH: 'searchIndexRecords',
  handleError: function (e) {
    console.error('xhr error: ', e)
  },
  updateIndexDataInCache: function (indexData) {
    let localRecords = JSON.parse(localStorage.getItem(cacheService.SEARCH_INDEX_CACHE_STORAGE_PATH))
    if (!localRecords) {
      localRecords = []
    }
    let fullRecord = cacheService.getFromCache(indexData.id)
    let idToFind = indexData.id
    if (typeof idToFind === 'number') {
      idToFind = idToFind.toString()
    }
    // let index = _.findIndex(localRecords, {id: idToFind})
    let index = _.findIndex(localRecords, function (o) {
      return o.indexData.id === idToFind
    })
    if (index > -1 && fullRecord) {
      fullRecord.indexData = indexData
      localRecords.splice(index, 1, fullRecord)
      localStorage.setItem(cacheService.SEARCH_INDEX_CACHE_STORAGE_PATH, JSON.stringify(localRecords))
    }
  },
  addToCache: function (record) {
    try {
      let localRecords = JSON.parse(localStorage.getItem(cacheService.SEARCH_INDEX_CACHE_STORAGE_PATH))
      if (!localRecords) {
        localRecords = []
      }
      let index = _.findIndex(localRecords, {id: record.indexData.id})
      if (index > -1) {
        localRecords.splice(index, 1, record)
      } else {
        localRecords.push(record)
      }
      localStorage.setItem(cacheService.SEARCH_INDEX_CACHE_STORAGE_PATH, JSON.stringify(localRecords))
    } catch (err) {
      console.log('Unable to cache record: ', err)
    }
  },
  getFromCache: function (id) {
    let localRecords = JSON.parse(localStorage.getItem(cacheService.SEARCH_INDEX_CACHE_STORAGE_PATH))
    if (!localRecords) {
      localRecords = []
    }
    let record
    if (id) {
      if (typeof id === 'number') {
        id = id.toString()
      }
      _.forEach(localRecords, function (theRecord) {
        if (theRecord.indexData.id === id) {
          record = theRecord
        }
      })
    }
    return record
  },
}
export default cacheService
