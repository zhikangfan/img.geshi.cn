import Vue from 'vue';
import Main from './main.vue';

let LoginModalConstructor = Vue.extend(Main);

const LoginModal = function(options, params) {
  let instance = new LoginModalConstructor({
    ...options,
    data: {
      onClose: params?.onClose || null,
      onHandleClose: params?.onHandleClose || null
    }
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.visible = true;
  return instance
}

export default LoginModal