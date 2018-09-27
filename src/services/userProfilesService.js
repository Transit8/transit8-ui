import {
  lookupProfile,
} from 'blockstack'

const userProfilesService = {
  fetchUserProfile: function (username, success, failure) {
    lookupProfile(username)
      .then((account) => {
        if (account) {
          let userProfile = {
            username: username,
            name: account.name,
            description: account.description,
            avatarUrl: (account.image && account.image.length > 0) ? account.image[0].contentUrl : '',
            apps: account.apps
          }
          success(userProfile)
        } else {
          failure({error: 1, message: 'Unable to find user: ' + username})
        }
      }).catch(e => {
        console.log('lookupUserProfile: e : ', e)
        failure({error: 2, message: 'Unable to lookup user: ' + username})
      })
  },
}
export default userProfilesService
