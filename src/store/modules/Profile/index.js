import { generateMnemonic } from 'bip39'
import { generateColor, getGradient } from '@/utils/generators'
import { SET_LIST, UPDATE_MODEL } from '../../common/mutations.types'

export const MODULE_NAME = 'Profile'
export const SET_USERS_COLORS = 'SET_USERS_COLORS'
export const FILL_CARDS = 'FILLCARDS'

export default {
  state: {
    list: [],
    model: {
      background: '287deg, #033dff 0%, #ff7ac6 24%, #ffff00 100%',
      color: '#6144E5',
      wordList: []
    }
  },
  actions: {
    [SET_USERS_COLORS]({ commit }, params) {
      commit(UPDATE_MODEL, { name: MODULE_NAME, model: { ...params } })
    },
    [FILL_CARDS]({ commit }) {
      const list = []
      for (let i = 0; i < 4; i += 1) {
        const wordList = generateMnemonic(256).split(' ')
        const color = generateColor()
        list.splice(i, 1, {
          background: getGradient(color),
          color,
          wordList
        })
      }
      commit(SET_LIST, { name: MODULE_NAME, list })
    }
  }
}
