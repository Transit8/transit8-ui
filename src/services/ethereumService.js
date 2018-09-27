import axios from 'axios'
import store from '@/storage/store'
import xhrService from '@/services/xhrService'

const API_SERVER_URL = '/api/ethereum'

const ethereumService = {
  getClientState: function (success, failure) {
    let callInfo = {
      method: 'get',
      url: store.state.constants.searchUrl + API_SERVER_URL + '/client',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios.get(callInfo.url, { headers: callInfo.headers })
      .then(response => {
        success(response.data.details)
      })
      .catch(e => {
        failure(e)
      })
  },
  getNumberOfItems: function () {
    xhrService.makeGetCall(API_SERVER_URL + '/numberOfItems')
      .then(function (result) {
        store.commit('ethStore/ethereumNumbItems', result)
      }).catch(function (e) {
        console.log('Unable to connect to ethereum node')
      })
  },
}
export default ethereumService
