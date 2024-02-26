<template>
  <div>
    <van-popup
      v-model="visible"
      position="bottom"
      :round="true"
      :safe-area-inset-top="true"
      :close-on-click-overlay="false"
      :close-on-popstate="true"
    >
      <div class="loginModal">
        <span class="close" @click="handleClickClose" @closed="onClosed"></span>
        <div class="titleBox">验证码登录</div>
        <form class="formBox" @submit.prevent="onSubmit">
          <div class="inputBox">
            <input type="text" class="input" name="mobile_phone" v-model="params.mobile_phone" placeholder="请输入你的手机号" />
          </div>
          <div class="inputBox codeInputBox">
            <input type="text" class="inputCode" name="code" v-model="params.code" placeholder="请输入验证码" />
            <div class="getCodeBtn" @click="getCode">
              <span v-if="isCountDownFinish">获取验证码</span>
              <van-count-down v-else :time="time" @finish="onCountDownFinish" ref="countDown">
                <template #default="timeData">
                  <span>{{ timeData.seconds }} S</span>
                </template>
              </van-count-down>
            </div>
          </div>
          <button class="loginBtn" type="submit">登录</button>
          <div class="tips">
            登录即代表同意 <a href="/" target="_blank">用户协议</a> 和 <a href="/" target="_blank">隐私政策</a>
          </div>
        </form>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {Toast} from "vant";
import {getMobileCode, userMobileLogin} from "@/api";
import {setToken} from "@/utils/token";
import {mapActions} from "vuex";

export default {
  name: 'LoginModal',
  components: {},
  props: {},
  data() {
    return {
      time: 60 * 1000,
      visible: false,
      onClose: () => {},
      onHandleClose: () => {},
      isCountDownFinish: true,
      params: {
        mobile_phone: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapActions({
      setUserInfo: 'userStore/setUserInfo'
    }),
    handleClickClose() {
      if (typeof this.onHandleClose === 'function') {
        this.onHandleClose()
      }
      this.handleClose()
    },
    handleClose() {
      this.visible = false
    },

    onClosed() {
      this.isCountDownFinish = true
      this.reset()
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
      this.$destroy()
    },
    start() {
      this.$refs.countDown.start()
    },
    pause() {
      this.$refs.countDown.pause()
    },
    reset() {
      this.$refs.countDown.reset()
    },
    // 倒计时完毕
    onCountDownFinish() {
      this.isCountDownFinish = true
    },
    // 获取验证码
    async getCode() {
      // 预防多次点击
      if (!this.isCountDownFinish) {
        return
      }

      const {mobile_phone} = this.params
      const flag = this.validatePhoneNumber();
      if (flag) {
        this.isCountDownFinish = false
        let res = await getMobileCode(mobile_phone)
        if (res.data.status !== 0) {
          Toast('验证发送失败！')
          this.isCountDownFinish = true
        }
      }

    },
    validatePhoneNumber() {
      const {mobile_phone} = this.params
      let isPhoneNumberReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!mobile_phone || !isPhoneNumberReg.test(mobile_phone)) {
        const msg = !mobile_phone ? '请输入手机号码！' : '手机号码格式不正确！'
        Toast(msg)
        return false
      }
      return true
    },
    validateCode() {
      const {code} = this.params
      if (!code || code.trim().length === 0) {
        Toast('请输入验证码！')
        return false
      }
      return true
    },
    validateForm() {
      return this.validatePhoneNumber() && this.validateCode()
    },
    async onSubmit(e) {
      let flag = this.validateForm()
      if (!flag) {
        return
      }
      const {mobile_phone, code} = this.params;
      let res  = await userMobileLogin({mobile_phone, code})
      if (res.data.status === 0) {
        setToken(res.data.data)
        await this.setUserInfo(res.data.data)
        Toast('登录成功！')
      } else {
        Toast('登录失败！')
      }
      this.handleClose()
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
@import url('./main.less');
</style>
