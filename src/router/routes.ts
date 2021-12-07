import { RouteConfig } from 'vue-router'

const routes: Array<RouteConfig> = [
  {
    path: '/recover-profile',
    name: 'RecoverProfile',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: 'Recover' */ '@/views/Profile/Recover.vue')
  },
  {
    path: '/create-profile',
    name: 'CreateProfile',
    component: () => import(/* webpackChunkName: 'Create' */ '@/views/Profile/Create.vue')
  },
  {
    path: '/get-profiles',
    name: 'GetProfiles',
    component: () => import(/* webpackChunkName: 'GetProfiles' */ '@/views/GetProfiles.vue')
  },
  {
    path: '/get-networks',
    name: 'GetNetworks',
    component: () => import(/* webpackChunkName: 'GetNetworks' */ '@/views/GetNetworks.vue')
  },
  {
    path: '/create-wallet',
    name: 'CreateWallet',
    component: () => import(/* webpackChunkName: 'CreateWallet' */ '@/views/CreateWallet.vue')
  },
  {
    path: '/create-wallets',
    name: 'CreateWallets',
    component: () => import(/* webpackChunkName: 'CreateWallets' */ '@/views/CreateWallets.vue')
  },
  {
    path: '/sign-message',
    name: 'SignMessage',
    component: () => import(/* webpackChunkName: 'SignMessage' */ '@/views/SignMessage.vue')
  },
  {
    path: '/validate-message',
    name: 'ValidateMessage',
    component: () => import(/* webpackChunkName: 'ValidateMessage' */ '@/views/ValidateMessage.vue')
  }
]

export default routes
