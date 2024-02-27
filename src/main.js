import Vue from 'vue'
import '@/assets/less/init.less'
// import '/node_modules/croppr/dist/croppr.min.css'
import '/node_modules/cropperjs/dist/cropper.min.css'
import MetaInfo from 'vue-meta-info'
import * as buffer from 'buffer'
import LoginModal from '@/components/LoginModal'

if (typeof window.global === 'undefined') {
  window.global = window
}
if (typeof window.Buffer === 'undefined') {
  window.Buffer = buffer.Buffer
}

import App from './App.vue'
import router from './router'
import store from './store'

import { Popup, CountDown, Uploader, Slider, Toast, SwipeCell, Button, Image as VanImage } from 'vant'

Vue.use(MetaInfo)
Vue.use(Uploader)
Vue.use(Popup)
Vue.use(CountDown)
Vue.use(Slider)
Vue.use(Toast)
Vue.use(SwipeCell)
Vue.use(Button)
Vue.use(VanImage)
Vue.use(LoginModal, {
  store,
  router
})
router.beforeEach((to, from ,next) => {
  const isLogin= store.getters["userStore/isLogin"]
  // 未登录不能跳转到购买页
  if (to.name === 'purchase' && !isLogin) {
      next({
        path: '/m/'
      })
    return
  }
  next()

})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
