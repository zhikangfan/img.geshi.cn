import Vue from 'vue'
import '@/assets/less/init.less'
import MetaInfo from 'vue-meta-info'
import * as buffer from 'buffer'

if (typeof window.global === 'undefined') {
  window.global = window
}
if (typeof window.Buffer === 'undefined') {
  window.Buffer = buffer.Buffer
}

import App from './App.vue'
import router from './router'
import store from './store'


import { Button, Popup } from 'vant';

Vue.use(MetaInfo)
Vue.use(Button)
Vue.use(Popup)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
