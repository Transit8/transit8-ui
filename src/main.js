// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import truncate from 'lodash/truncate'
import Notifications from 'vue-notification'
import * as uiv from 'uiv'

import '@/assets/css/main.scss'

// import Vuelidate from 'vuelidate'
Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue() // Global event bus
Vue.filter('truncate', function (value) {
  return truncate(value, { length: 45, omission: '...' })
})
Vue.prototype.$appName = 'My App'
Vue.use(Notifications)
// Vue.use(Vuelidate)

Vue.use(uiv, {prefix: 'uiv'})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
