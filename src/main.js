// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import _ from 'lodash'
import '@/styles/main.scss'
// import Vuelidate from 'vuelidate'

Vue.config.productionTip = false

Vue.filter('truncate', function (value) {
  return _.truncate(value, { length: 45, omission: '...' })
})
Vue.prototype.$appName = 'My App'

// Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
