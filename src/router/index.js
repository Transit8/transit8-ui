import Vue from 'vue'
import Router from 'vue-router'
import myAccountService from '@/services/myAccountService'

import Home from '../pages/Home'
import About from '../pages/About'
import Artworks from '../pages/Artworks'
import Artwork from '../pages/Artwork'
import Artists from '../pages/Artists'
import Artist from '../pages/Artist'
import HowItWorks from '../pages/HowItWorks'
import Resources from '../pages/Resources'
import Search from '../pages/Search'
import MyArtworkSetPrice from '../pages/MyArtworkSetPrice'
import MyArtworkRegister from '../pages/MyArtworkRegister'
import MyArtworks from '../pages/MyArtworks'
import MyArtworkUpload from '../pages/MyArtworkUpload'
import MyArtworkUpdate from '../pages/MyArtworkUpdate'
import MyAuctions from '../pages/MyAuctions'
import MyAuctionList from '../components/auctions/MyAuctionList'
import MyAuctionManage from '../pages/MyAuctionManage'
import MyAuctionUpload from '../pages/MyAuctionUpload'
import MyAuctionUpdate from '../pages/MyAuctionUpdate'
import OnlineAuction from '../pages/OnlineAuction'
import OnlineAuctions from '../pages/OnlineAuctions'
import Story from '../pages/Story'
import Privacy from '../pages/Privacy'
import Profile from '../pages/Profile'
import Competition from '../pages/Competition'
import Blog from '../pages/Blog'
import BlogPost from '../pages/BlogPost'
import Admin from '../components/admin/Admin'
import AdminSettings from '../components/admin/AdminSettings'
import AdminRegistrations from '../components/admin/AdminRegistrations'
import AdminIndexAuctions from '../components/admin/AdminIndexAuctions'
import AdminIndexNames from '../components/admin/AdminIndexNames'
import AdminIndexArt from '../components/admin/AdminIndexArt'
import AdminUserRecords from '../components/admin/AdminUserRecords'
import Account from '../components/account/Account'
import AccountUserData from '../components/account/AccountUserData'
import AccountLookup from '../components/account/AccountLookup'
import AccountDisplay from '../components/account/AccountDisplay'
import AccountFiles from '../components/account/AccountFiles'

import Lightning from '@/components/lightning/Lightning'
// import LightningNodes from '@/components/lightning/LightningNodes'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true },
      component: Admin,
      children: [
        {
          path: '/admin/index/names',
          name: 'adminIndexNames',
          component: AdminIndexNames
        }, {
          path: '/admin/index/auctions',
          name: 'adminIndexAuctions',
          component: AdminIndexAuctions
        }, {
          path: '/admin/index/art',
          name: 'adminSearchArt',
          component: AdminIndexArt
        }, {
          path: '/admin/settings',
          name: 'adminSettings',
          component: AdminSettings
        }, {
          path: '/admin/registrations',
          name: 'adminRegistrations',
          component: AdminRegistrations
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
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/artworks',
      name: 'artworks',
      component: Artworks,
    },
    {
      path: '/artworks/:artworkId',
      name: 'artworkDetails',
      component: Artwork,
    },
    {
      path: '/artists',
      name: 'artists',
      component: Artists,
    },
    {
      path: '/artists/:artistId',
      name: 'artistDetails',
      component: Artist,
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
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/online-auction/:auctionId',
      name: 'onlineAuction',
      component: OnlineAuction,
    },
    {
      path: '/online-auctions',
      name: 'onlineAuctions',
      component: OnlineAuctions,
    },
    {
      path: '/my-auctions',
      component: MyAuctions,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: MyAuctionList,
        }, {
          path: '/my-auctions/update/:auctionId',
          component: MyAuctionUpdate,
        }, {
          path: '/my-auctions/upload',
          component: MyAuctionUpload,
        }, {
          path: '/my-auctions/manage/:auctionId',
          component: MyAuctionManage,
        }
      ]
    },
    {
      path: '/my-artwork/update/:artworkId',
      name: 'myArtworkUpdate',
      component: MyArtworkUpdate,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-artwork/upload',
      name: 'myArtworkUpload',
      component: MyArtworkUpload,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-artworks',
      name: 'my-artworks',
      component: MyArtworks,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-artworks/register/:artworkId',
      name: 'myArtworkRegister',
      component: MyArtworkRegister,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-artworks/set-price/:artworkId',
      name: 'myArtworkSetPrice',
      component: MyArtworkSetPrice,
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
    if (!myAccountService.myProfile().loggedIn) {
      next({
        path: '/',
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
