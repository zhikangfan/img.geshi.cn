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
            <input type="text" class="input" placeholder="请输入你的手机号" />
          </div>
          <div class="inputBox codeInputBox">
            <input type="text" class="inputCode" placeholder="请输入验证码" />
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
      isCountDownFinish: true
    }
  },
  methods: {
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
    getCode() {
      // 预防多次点击
      if (!this.isCountDownFinish) {
        return
      }
      this.isCountDownFinish = false
    },
    onSubmit(e) {
      console.log(e)
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
@import url('./main.less');
</style>
