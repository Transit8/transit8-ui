import axios from 'axios'

let YOUR_API_KEY = '3NS7MEHKLGWSZREK71I8J50GZ' // Generated-API-Key-1520526507947
let YOUR_ORG_SECRET_KEY = 'NWE5ZmNlNjZjZWI3NWEwMDEzOTQ1MjU3'

const tipes = {
  getDetails: function (documentId) {
    return {
      method: 'get',
      url: 'https://api.tipe.io/api/v1/document/' + documentId,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': YOUR_API_KEY,
        'Tipe-Id': YOUR_ORG_SECRET_KEY
      }
    }
  },
  fetch: function () {
    // let requestDetails = this.getDetails('5aa2ad4d6c3250001374f3c2')
    let requestDetails = this.getDetails('5b4f22f0c77a3c0013d6ab7d')
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
  },
  fetchNavLinks: function () {
    let requestDetails = this.getDetails('5aabbfe320e9dc00135dfdc3')
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
