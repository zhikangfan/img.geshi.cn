import Vue from 'vue'
import '@/assets/less/init.less'
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

import { Popup, CountDown, Uploader, Slider, Toast, SwipeCell, Button } from 'vant'

Vue.use(MetaInfo)
Vue.use(Uploader)
Vue.use(Popup)
Vue.use(CountDown)
Vue.use(Slider)
Vue.use(Toast)
Vue.use(SwipeCell)
Vue.use(Button)
Vue.use(LoginModal, {
  store,
  router
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
