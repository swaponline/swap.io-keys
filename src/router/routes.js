export default [
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
