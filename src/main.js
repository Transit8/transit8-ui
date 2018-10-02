// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import truncate from 'lodash/truncate'
import Notifications from 'vue-notification'
import * as uiv from 'uiv'
import PrismicVue from 'prismic-vue'
import linkResolver from './prismic/linkResolver'
import Vuex from 'vuex'
import '@/assets/css/main.scss'
// import { sync } from 'vuex-router-sync'
import store from '@/storage/store'
import { CONSTANTS } from '@/storage/constants'

// import Vuelidate from 'vuelidate'
Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue() // Global event bus
Vue.filter('truncate', function (value) {
  return truncate(value, { length: 45, omission: '...' })
})
Vue.prototype.$appName = 'My App'
Vue.use(Vuex)
Vue.use(Notifications)
Vue.use(uiv, {prefix: 'uiv'})
Vue.use(PrismicVue, {
  endpoint: 'https://sybellaio.cdn.prismic.io/api/v2',
  linkResolver
})
store.commit('constants', CONSTANTS)
store.dispatch('ethStore/getClientState')
store.dispatch('conversionStore/fetchShapeShiftCryptoRate', 'eth_btc')
store.dispatch('conversionStore/fetchFiatRates', 'eth_btc')
store.dispatch('ethStore/fetchBlockchainItems').then((blockchainItems) => {
  store.dispatch('myAccountStore/fetchMyAccount')
  store.dispatch('myArtworksStore/fetchMyArtworks')
  store.dispatch('artworkSearchStore/fetchRegisteredArtworks', blockchainItems)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  components: { App },
  template: '<App/>'
})
