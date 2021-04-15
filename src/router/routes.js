export default [
  {
    path: '/security-info',
    name: 'SecurityInfo',
    component: () => import(/* webpackChunkName: 'SecurityInfo' */ '@/views/CreateProfile/SecurityInfo.vue')
  },
  {
    path: '/secret-phrase',
    name: 'SecretPhrase',
    component: () => import(/* webpackChunkName: 'SecretPhrase' */ '@/views/CreateProfile/SecretPhrase.vue')
  },
  {
    path: '/choose-style',
    name: 'ChooseStyle',
    component: () => import(/* webpackChunkName: 'ChooseStyle' */ '@/views/CreateProfile/ChooseStyle.vue')
  }
]
