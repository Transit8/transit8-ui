import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home/Home'
import Admin from '../components/admin/Admin'
import AdminSearchNames from '../components/admin/AdminSearchNames'
import AdminSearchArt from '../components/admin/AdminSearchArt'
import AdminUserRecords from '../components/admin/AdminUserRecords'
import Account from 'bright-block-auth/src/components/account/Account'
import AccountUserData from 'bright-block-auth/src/components/account/AccountUserData'
import AccountLookup from 'bright-block-auth/src/components/account/AccountLookup'
import AccountDisplay from 'bright-block-auth/src/components/account/AccountDisplay'
import AccountFiles from 'bright-block-auth/src/components/account/AccountFiles'

import Market from '../components/market/Market'
import MarketSearch from '../components/market/MarketSearch'

import Iota from '../components/experimental/iota/Iota'
import Eth from '../components/experimental/eth/Eth'
import DataTypes from '../components/experimental/eth/DataTypes'

import Provenance from '../components/provenance/Provenance'
import ProvenanceEdit from '../components/provenance/ProvenanceEdit'
import ProvenanceCreate from '../components/provenance/ProvenanceCreate'
import ProvenanceRegister from '../components/provenance/ProvenanceRegister'
import ProvenanceList from '../components/provenance/ProvenanceList'

import Lightning from '@/components/lightning/Lightning'
// import LightningNodes from '@/components/lightning/LightningNodes'

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
      path: '/provenance',
      name: 'provenance',
      meta: { requiresAuth: true },
      component: Provenance,
      children: [
        {
          path: '/provenance/register/:provenanceId',
          name: 'provenanceRegister',
          component: ProvenanceRegister
        }, {
          path: '/provenance/edit/:provenanceId',
          name: 'provenanceEdit',
          component: ProvenanceEdit,
        }, {
          path: '/provenance/create',
          name: 'provenanceCreate',
          component: ProvenanceCreate,
        }, {
          path: '/provenance/list',
          name: 'provenanceList',
          component: ProvenanceList,
        }
      ]
    }, {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true },
      component: Admin,
      children: [
        {
          path: '/admin/search/names',
          name: 'adminSearchNames',
          component: AdminSearchNames
        }, {
          path: '/admin/search/art',
          name: 'adminSearchArt',
          component: AdminSearchArt
        }, {
          path: '/admin/user/records',
          name: 'adminUserRecords',
          component: AdminUserRecords
        }
      ]
    }, {
      path: '/lightning',
      name: 'lightning',
      meta: { requiresAuth: true },
      props: true,
      component: Lightning,
      // children: [
      //  {
      //    path: '/lightning/nodes/:node/:action',
      //    name: 'lightningNodes',
      //    component: LightningNodes
      //  }
      // ]
    }, {
      path: '/market',
      name: 'market',
      meta: { requiresAuth: false },
      component: Market,
      children: [
        {
          path: '/market/search',
          name: 'marketSearch',
          component: MarketSearch
        }
      ]
    }, {
      path: '/iota',
      name: 'iota',
      meta: { requiresAuth: false },
      component: Iota,
    }, {
      path: '/types',
      name: 'types',
      meta: { requiresAuth: false },
      component: DataTypes,
    }, {
      path: '/eth',
      name: 'eth',
      meta: { requiresAuth: false },
      component: Eth,
    }, {
      path: '/account',
      name: 'account',
      meta: { requiresAuth: true },
      component: Account,
      children: [
        {
          path: '/account/userData',
          name: 'userData',
          component: AccountUserData
        }, {
          path: '/account/lookup',
          component: AccountLookup
        }, {
          path: '/account/display/:username',
          name: 'display',
          props: true,
          component: AccountDisplay
        }, {
          path: '/account/files/:username/:appUrl/:gaiaUrl',
          name: 'files',
          props: true,
          component: AccountFiles
        }
      ]
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

export default router
