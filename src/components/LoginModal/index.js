import LoginModal from '@/components/LoginModal/src/main'


export default {
  install(Vue, options) {
    Vue.prototype.$loginModal = (params) => {
      LoginModal(options, params)
    }
  }
}