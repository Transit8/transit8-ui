import axios from 'axios'

const iotaApiService = {
  getDetails: function (command) {
    return {
      method: 'post',
      url: 'https://iota.brightblock.org/',
      data: command,
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      }
    }
  },
  getJson: function (command) {
    // let requestDetails = this.getDetails(command)
    return new Promise(resolve => {
      axios({
        method: 'post',
        url: 'https://iota.brightblock.org/',
        data: {
          command: command
        },
        headers: {
          'Content-Type': 'application/json',
          'X-IOTA-API-Version': '1'
        }
      })
        .then(response => {
          resolve(response.data)
        })
        .catch(e => {
          console.log(e.response.data)
          resolve('unable to fetch content')
        })
    })
  }
}
export default iotaApiService
