import { RouteConfig } from 'vue-router'

const routes: Array<RouteConfig> = [
  {
    path: '/secret-phrase',
    name: 'SecretPhrase',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: 'SecretPhrase' */ '@/front/views/CreateProfile/SecretPhrase.vue')
  },
  {
    path: '/choose-style',
    name: 'ChooseStyle',
    component: () => import(/* webpackChunkName: 'ChooseStyle' */ '@/front/views/CreateProfile/ChooseStyle.vue')
  }
]

export default routes
