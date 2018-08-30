import xhrService from '@/services/xhrService'
import cacheService from '@/services/cacheService'
https://cors.shapeshift.io/rate/' + documentId
/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const biddingService = {
  biddingState: {},
  placeBid: function (indexData) {
    return new Promise(function (resolve) {
      xhrService.makePostCall('/art/index/indexData', indexData)
        .then(function (result) {
          if (result.error) {
            throw new Error({message: 'Unable to index file: ', indexData: indexData})
          }
          resolve(result)
        }).catch(function (e) {
          throw e
        })
    })
  },
  receiveBid: function (username) {
    return new Promise(function (resolve) {
      xhrService.makeGetCall('/art/index/user/' + username)
        .then(function (result) {
          resolve(result)
        }).catch(function (e) {
          resolve({error: 'Unable to index user: ' + username})
        })
    })
  },
}
export default biddingService
