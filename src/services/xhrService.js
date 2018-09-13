import axios from 'axios'

const SERVER_URL = process.env.SEARCH_INDEX_URL

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const xhrService = {
  handleError: function (e) {
    console.error('xhr error: ', e)
    // if (e.response && e.response.data) {
    //   throw e.response.data.details
    // } else {
    //   throw e.message
    // }
  },
  makeDirectCall: function (url) {
    return new Promise(resolve => {
      axios.get(url)
        .then(response => {
          if (response.failed) {
            Promise.reject(new Error(response.details))
          }
          resolve(response.data)
        })
        .catch(e => {
          xhrService.handleError(e)
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
          xhrService.handleError(e)
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
      axios.post(callInfo.url, data)
        .then(response => {
          if (response.failed) {
            Promise.reject(new Error(response.details))
          }
          resolve(response.data.details)
        })
        .catch(e => {
          xhrService.handleError(e)
        })
    })
  },
}
export default xhrService
