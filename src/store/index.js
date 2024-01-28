import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import userStore from './user.store'
import imgStore from './img.store'
const store = new Vuex.Store({
  modules: {
    userStore,
    imgStore
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
})

export default store
