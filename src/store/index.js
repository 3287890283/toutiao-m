import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，储存当前登录用户信息
    user: getItem(TOKEN_KEY)
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // 为了防止刷新丢失，把数据进行备份到本地储存
      setItem(TOKEN_KEY, payload)
    }
  },
  actions: {},
  modules: {}
})
