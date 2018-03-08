import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/fragments/Home.vue'
import Signup from '../components/auth/Signup.vue'
import NotesEdit from '../components/Notes.edit'
import NotesShow from '../components/Notes.show'
import authorization from '../services/authorization'

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
      path: '/signup',
      name: 'signup',
      component: Signup
    }, {
      path: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (authorization.isSignedIn()) {
    // authorization.loadUserData()
    next()
  } else if (authorization.isSignInPending()) {
    next()
  } else {
    next()
  }
})

export default router
