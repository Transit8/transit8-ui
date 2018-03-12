import axios from 'axios'
// var _ = require('lodash')

let DOCUMENT_ID = '5aa2ad4d6c3250001374f3c2'
let YOUR_ORG_SECRET_KEY = 'NWE5ZmNlNjZjZWI3NWEwMDEzOTQ1MjU3'
let YOUR_API_KEY = '3NS7MEHKLGWSZREK71I8J50GZ' // Generated-API-Key-1520526507947

let requestDetails = {
  method: 'get',
  url: 'https://api.tipe.io/api/v1/document/' + DOCUMENT_ID,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': YOUR_API_KEY,
    'Tipe-Id': YOUR_ORG_SECRET_KEY
  }
}

const tipes = {
  fetch: function () {
    return new Promise(resolve => {
      axios.get(requestDetails.url, { headers: requestDetails.headers })
        .then(response => {
          resolve(response)
        })
        .catch(e => {
          console.log(e.response.data)
          resolve('unable to fetch content')
        })
    })
  }
}
export default tipes
