import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/Home'
import About from '../pages/About'
import Artworks from '../pages/Artworks'
import Artwork from '../pages/Artwork'
import Artists from '../pages/Artists'
import Artist from '../pages/Artist'
import HowItWorks from '../pages/HowItWorks'
import Resources from '../pages/Resources'
import Search from '../pages/Search'
import MyArtworks from '../pages/MyArtworks'
import Story from '../pages/Story'
import Privacy from '../pages/Privacy'
import Profile from '../pages/Profile'
import Competition from '../pages/Competition'
import Blog from '../pages/Blog'
import BlogPost from '../pages/BlogPost'
import Admin from '../components/admin/Admin'
import AdminRegistrations from '../components/admin/AdminRegistrations'
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
import ProvenanceItem from '../components/provenance/ProvenanceItem'

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
      component: Provenance,
      children: [
        {
          path: '/provenance/register/:provenanceId',
          meta: { requiresAuth: true },
          name: 'provenanceRegister',
          component: ProvenanceRegister
        }, {
          path: '/provenance/item/:provenanceId',
          name: 'provenanceItem',
          component: ProvenanceItem
        }, {
          path: '/provenance/edit/:provenanceId',
          meta: { requiresAuth: true },
          name: 'provenanceEdit',
          component: ProvenanceEdit,
        }, {
          path: '/provenance/create',
          meta: { requiresAuth: true },
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
          path: '/admin/registrations',
          name: 'adminRegistrations',
          component: AdminRegistrations
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
      name: 'getBrowser',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/artworks',
      name: 'artworks',
      component: Artworks,
      meta: { requiresAuth: true },
    },
    {
      path: '/artworks/:artworkId',
      name: 'artworkDetails',
      component: Artwork,
      meta: { requiresAuth: true },
    },
    {
      path: '/artists',
      name: 'artists',
      component: Artists,
      meta: { requiresAuth: true },
    },
    {
      path: '/artists/:artistId',
      name: 'artistDetails',
      component: Artist,
      meta: { requiresAuth: true },
    },
    {
      path: '/how-it-works',
      name: 'HowItWorks',
      component: HowItWorks,
    },
    {
      path: '/resources',
      name: 'resources',
      component: Resources,
      meta: { requiresAuth: true },
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-artworks',
      name: 'my-artworks',
      component: MyArtworks,
      meta: { requiresAuth: true },
    },
    {
      path: '/stories/:storyId',
      name: 'storyDetails',
      component: Story,
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy,
    },
    {
      path: '/my-profile',
      name: 'my-profile',
      component: Profile,
    },
    {
      path: '/competition',
      name: 'competition',
      component: Competition,
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog,
    },
    {
      path: '/blog/:postId',
      name: 'blogPost',
      component: BlogPost,
    },
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
