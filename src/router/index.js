import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home/Home'
import Content from '../components/home/Content'
import authorization from 'bright-block-auth'
import Login from 'bright-block-auth/src/components/auth/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/content',
      name: 'content',
      meta: { requiresAuth: true },
      component: Content
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/getBrowser',
      name: 'login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!authorization.isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
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
