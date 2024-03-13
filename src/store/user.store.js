import { getLocalUserInfo, getToken, removeToken, setToken } from '@/utils/token'
import { getUserInfo, userLogin } from '@/api'

export const VIP_LEVEL = {
  NON_VIP: 0, // 非vip
  COUNT_VIP: 5, // 次数vip
  TIME_VIP: 10, // 时间vip
  THREE_DAY_VIP: 7, // 3天会员
  PERMANENT_VIP: 100 // 永久会员
}
export default {
  namespaced: true,
  state: () => ({
    userInfo: getLocalUserInfo() || null, // 存放用户信息
    allCert: {}, // 用户权限
    downloadToken: '' // 用户转换过后的token
  }),
  getters: {
    hasCount: state => {
      return state.allCert?.image_count_total
    },
    isLogin: state => {
      return state.userInfo !== null || !!getToken()
    }
  },
  mutations: {
    updateDownloadToken(state, payload) {
      state.downloadToken = payload
    },
    updateUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },
    updateAllCert: (state, payload) => {
      state.allCert = {
        ...state.allCert,
        ...payload
      }
    },
    logout(state) {
      state.userInfo = null
      state.allCert = {}
      removeToken()
    }
  },
  actions: {
    /**
     * @description 登录
     * @param commit
     * @param payload
     * @returns {Promise<void>}
     */
    async wxLogin({ commit, dispatch }, payload) {
      let { code } = payload
      if (!getToken() && code) {
        let res = await userLogin(code)
        if (res.data.status === 0) {
          setToken(res.data.data)
          await commit('setUserInfo', res.data.data)
          await dispatch('updateAllCert')
        }
      }
    },
    setUserInfo: ({ commit }, payload) => {
      commit('updateUserInfo', payload)
    },
    updateAllCert: async ({ commit }) => {
      try {
        let res = await getUserInfo()
        commit('updateAllCert', res.data.data)
      } catch (e) {
        commit('updateAllCert', {})
      }
    },
    updateDownloadToken({ commit }, token) {
      commit('updateDownloadToken', token)
    },
    logout({ commit }) {
      commit('logout')
    }
  }
}
