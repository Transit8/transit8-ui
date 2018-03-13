import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: Home
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (authorization.isLoggedIn()) {
//     // authorization.loadUserData()
//     next()
//   } else if (authorization.isSignInPending()) {
//     next()
//   } else {
//     next()
//   }
// })

export default router
