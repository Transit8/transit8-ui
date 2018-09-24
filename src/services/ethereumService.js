import xhrService from '@/services/xhrService'

const API_SERVER_URL = '/api/ethereum'

const ethereumService = {
  getNodeInfo: function () {
    return new Promise(function (resolve) {
      xhrService.makeGetCall(API_SERVER_URL + '/client')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({failed: true, message: 'Unable to connect to ethereum node'})
        })
    })
  },
  loadContract: function () {
    return new Promise(function (resolve) {
      xhrService.makeGetCall(API_SERVER_URL + '/load')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({failed: true, message: 'Unable to connect to ethereum node'})
        })
    })
  },
  getNumberOfItems: function () {
    return new Promise(function (resolve) {
      xhrService.makeGetCall(API_SERVER_URL + '/numberOfItems')
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({failed: true, message: 'Unable to connect to ethereum node'})
        })
    })
  },
}
export default ethereumService
