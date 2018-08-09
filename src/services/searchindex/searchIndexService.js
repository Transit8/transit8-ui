import axios from 'axios'

const SERVER_URL = process.env.SEARCH_INDEX_URL

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const searchIndexService = {
  makeDirectCall: function (url) {
    return new Promise(resolve => {
      axios.get(url)
        .then(response => {
          resolve(response.data)
        })
        .catch(e => {
          console.log('Unable to fulfil request', e)
          if (e.response && e.response.data) {
            resolve(e.response.data)
          } else {
            resolve(e.message)
          }
        })
    })
  },
  makeGetCall: function (command, args) {
    let callInfo = {
      method: 'get',
      url: SERVER_URL + command,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    for (var key in args) {
      callInfo.url += '/' + args[key]
    }
    return new Promise(resolve => {
      axios.get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          resolve(response.data.details)
        })
        .catch(e => {
          console.log('Unable to fulfil request' + command, e)
          if (e.response && e.response.data) {
            resolve(e.response.data)
          } else {
            resolve(e.message)
          }
        })
    })
  },
  makePostCall: function (command, data) {
    let callInfo = {
      method: 'post',
      url: SERVER_URL + command,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return new Promise(resolve => {
      //      axios.post(callInfo.url, { headers: callInfo.headers, body: data })
      axios.post(callInfo.url, data)
        .then(response => {
          resolve(response.data.details)
        })
        .catch(e => {
          console.log('Unable to fulfil request' + command, e)
          throw e
          // if (e.response && e.response.data) {
          //  resolve(e.response.data)
          // } else {
          //  resolve(e.message)
          // }
        })
    })
  },
  reindexRecord: function (record) {
    return new Promise(function (resolve) {
      searchIndexService.makePostCall('/art/index/record', record)
        .then(function (result) {
          if (result.error) {
            throw new Error({message: 'Unable to index file: ', record: record})
          }
          resolve(result)
        }).catch(function (e) {
          throw e
        })
    })
  },
  indexUser: function (username) {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/art/index/user/' + username)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to index user: ' + username})
        })
    })
  },
  buildArtIndex: function () {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/art/index/build')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  buildIndexByNames: function (names) {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/names/index/build', [names])
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  buildIndexByPages: function (from, to) {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/names/index/build', [from, to])
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  fetchAll: function () {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/art/fetch')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to fetch index'})
        })
    })
  },
  clearAll: function () {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/art/index/clear')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to clear index'})
        })
    })
  },
  sizeOfIndex: function (index) {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/' + index + '/index/size')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  searchIndex: function (index, term, query) {
    return new Promise(function (resolve) {
      searchIndexService.makeGetCall('/' + index + '/search/' + term + '?q=' + query)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  getByGaiaUrl: function (url) {
    return new Promise(function (resolve) {
      searchIndexService.makeDirectCall(url)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to create root file'})
        })
    })
  },
}
export default searchIndexService
