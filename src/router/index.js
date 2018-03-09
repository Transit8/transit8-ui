import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home/Home.vue'
import GetBrowser from '../components/auth/GetBrowser.vue'
import Login from '../components/auth/Login.vue'
import NotesEdit from '../components/Notes.edit'
import NotesShow from '../components/Notes.show'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: Home,
      children: [
        {
          path: '/notes/create',
          component: NotesEdit
        },
        {
          path: '/notes/:notesId',
          component: NotesShow,
          props: true

        },
        {
          path: '/notes/:notesId/edit',
          component: NotesEdit,
          props: true
        }
      ]
    }, {
      path: '/getBrowser',
      name: 'getBrowser',
      component: GetBrowser
    }, {
      path: '/login',
      name: 'login',
      component: Login
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
