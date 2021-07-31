import { RouteConfig } from 'vue-router'

const routes: Array<RouteConfig> = [
  {
    path: '/secret-phrase',
    name: 'SecretPhrase',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: 'SecretPhrase' */ '@/views/CreateProfile/SecretPhrase.vue')
  },
  {
    path: '/choose-style',
    name: 'ChooseStyle',
    component: () => import(/* webpackChunkName: 'ChooseStyle' */ '@/views/CreateProfile/ChooseStyle.vue')
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
  }
]

export default routes
