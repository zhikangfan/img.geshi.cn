import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getLocalUserInfo, setLocalUserInfo, getToken, removeToken, setToken } from '@/utils/token'
import {getUserInfo, userLogin} from '@/api'
import { uploadLoginData } from '../utils/baiduOCPC'
import {trackLogin} from "@/utils/track";

const store = new Vuex.Store({
  state: {
    userInfo: getLocalUserInfo() || null, // 存放用户信息
    isLoginModalVisible: false, // 用于控制登录弹窗是否显示|隐藏
    isPurchaseModalVisible: false, // 用于控制购买弹窗的显示|隐藏
    isRetentionModalVisible: false, // 控制挽留弹窗的显示｜隐藏
    onPurchaseModalHidden: () => {},
    canFreeDownloadFiles: [], // 用于存储用户已经执行过扣除下载权限的图片
    historyDownloads: [],
    allCert: {} // 用户权限信息
  },
  getters: {
    isLogin(state) {
      return state.userInfo !== null || !!getToken()
    },
    // 是不是vip
    isVip(state) {
      return state.allCert?.vip !== 0 // 0：不是vip，5:次数vip，10:时间vip，100:永久vip 7: 3天VIP
    },
    // 是不是时间VIP
    isTimeVIP(state) {
      return state.allCert?.vip === 10 || state.allCert?.vip === 7
    },
    // 是不是永久VIP
    isCfVIP(state) {
      return state.allCert?.vip === 100
    },
    // 是不是次数VIP
    isCountVIP(state) {
      return state.allCert?.vip === 5
    },
    isThreeDayVIP(state) {
      return state.allCert?.vip === 7
    },

    getUserInfo(state) {
      return state.userInfo
    },
    getAllCert(state) {
      return state.allCert
    }
  },
  mutations: {
    setOnPurchaseModalHidden(state, callback) {
      if (typeof callback === 'function') {
        state.onPurchaseModalHidden = callback
      }
    },
    showLoginModal(state) {
      state.isLoginModalVisible = true
    },
    hideLoginModal(state) {
      state.isLoginModalVisible = false
    },
    showPurchaseModal(state) {
      state.isPurchaseModalVisible = true
      state.onPurchaseModalHidden = () => {}
    },
    hidePurchaseModal(state) {
      state.isPurchaseModalVisible = false
      typeof state.onPurchaseModalHidden === 'function' && state.onPurchaseModalHidden()
    },
    showRetentionModal(state) {
      state.isRetentionModalVisible = true
    },
    hideRetentionModal(state) {
      state.isRetentionModalVisible = false
    },
    setUserInfo(state, payload) {
      state.userInfo = {...state.userInfo, ...payload}
      setToken(payload)
    },
    updateAllCert(state, payload) {
      // 更新本地的用户信息
      state.allCert = {...state.allCert, ...payload}
    },
    logout(state) {
      state.userInfo = null
      state.allCert = null
      removeToken()
    },
    setCanFreeDownloadFiles(state, payload = []) {
      state.canFreeDownloadFiles = payload
    },
    setHistoryDownloads(state, payload = []) {
      state.historyDownloads = state.historyDownloads.concat(payload)
    },
    resetHistoryDownloads(state) {
      state.historyDownloads = []
    }
  },
  actions: {
    /**
     * @description 登录
     * @param commit
     * @param payload
     * @returns {Promise<void>}
     */
    async login({ commit }, payload) {
      let { code } = payload
      if (!getToken() && code) {
        let res = await userLogin(code)
        if (res.data.status === 0) {
          setToken(res.data.data)
          await commit('setUserInfo', res.data.data)
          uploadLoginData().catch(e => {})
          trackLogin()
          Message({
            type: 'success',
            message: '登录成功',
            duration: 2000
          })
        }
      }
    },
    /**
     * @description 退出登录
     * @param commit
     */
    logout({ commit }) {
      commit('logout')
    },
    /**
     * @description 设置用户信息
     * @param commit
     * @param payload
     */
    setUserInfo({ commit }, payload) {
      commit('setUserInfo', payload)
    },
    updateAllCert({ commit }, payload) {
      commit('updateAllCert', payload)
    },
    /**
     * 更新用户信息
     */
    async updateUserInfo({commit}) {
      try {
        let res = await getUserInfo()
        if (res.data.status === 0) {
          commit('updateAllCert', res.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showLoginModal({ commit }) {
      commit('showLoginModal')
    },
    hideLoginModal({ commit }) {
      commit('hideLoginModal')
    },
    showPurchaseModal({ commit }) {
      commit('showPurchaseModal')
    },
    hidePurchaseModal({ commit, getters }) {
      commit('hidePurchaseModal')
      if (!getters.isVip || getters.isCountVIP) {
        commit('showRetentionModal')
      }
    },
    showRetentionModal({ commit }) {
      commit('showRetentionModal')
    },
    hideRetentionModal({ commit }) {
      commit('hideRetentionModal')
    },
    setOnPurchaseModalHidden({ commit }, callback) {
      commit('setOnPurchaseModalHidden', callback)
    },
    setCanFreeDownloadFiles({ commit }, payload = []) {
      commit('setCanFreeDownloadFiles', payload)
    },
    // 设置下载历史记录
    setHistoryDownloads({ commit }, payload = []) {
      commit('setHistoryDownloads', payload)
    },
    // 重置下载历史
    resetHistoryDownloads({ commit }) {
      commit('resetHistoryDownloads')
    }
  }
})

export default store
