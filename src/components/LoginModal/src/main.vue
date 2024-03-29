<template>
  <div>
    <van-popup
      v-model="visible"
      position="bottom"
      :round="true"
      :safe-area-inset-top="true"
      :close-on-click-overlay="false"
      :close-on-popstate="true"
      @closed="onClosed"
    >
      <div class="loginModal">
        <span class="close" @click="handleClickClose"></span>
        <div class="phoneLoginBox" v-if="loginMode === LoginMode.Phone">
          <div class="titleBox">验证码登录</div>
          <form class="formBox" @submit.prevent="onSubmit">
            <div class="inputBox">
              <input
                type="text"
                class="input"
                name="mobile_phone"
                v-model="params.mobile_phone"
                placeholder="请输入你的手机号"
              />
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
          </form>
        </div>
        <div class="wxLoginBox" v-if="loginMode === LoginMode.Wechat">
          <div class="titleBox">微信扫码登录</div>
          <div class="codeBox">
            <img
              :src="loginQrCodeUrl"
              v-if="!isLoading && qrCodeStatus === QR_CODE_STATUS.SUCCESS"
              alt=""
              class="qrcode"
            />
            <div class="loadingBox" v-if="isLoading">
              <span class="icon"></span>
            </div>
            <div
              class="refreshBox"
              @click="onRefreshQrCode"
              v-if="!isLoading && qrCodeStatus === QR_CODE_STATUS.EXPIRE"
            >
              <span class="icon"></span>
              <span class="text">刷新</span>
            </div>
          </div>
          <div class="wxTips">（长按二维码保存图片或截屏->微信扫描识别二维码）</div>
        </div>
        <div class="visitorLoginBox" v-if="loginMode === LoginMode.Visitor">
          <div class="titleBox">游客登录</div>
          <div class="contentBox">
            <button class="visitorLoginBtn" @click="onClickVisitorLogin">游客一键登录</button>
          </div>
        </div>
        <div class="orderLoginBox" v-if="loginMode === LoginMode.Order">
          <div class="titleBox">订单号登录</div>
          <form class="formBox" @submit.prevent="handleOrderLogin">

            <div class="inputBox">
              <input
                      type="text"
                      class="input"
                      name="orderId"
                      v-model="orderId"
                      placeholder="请输入交易订单号（长）"
              />
            </div>
            <div class="tips">*只适合已购买用户（如何<a href="/help" class="link">获取订单号</a>）</div>
            <button class="loginBtn" type="submit">登录</button>
          </form>
        </div>
        <div class="switchLogin">
          <div class="switchText">
            <span>其它登录方式</span>
          </div>
          <div class="switchBox">
            <div class="modeBox" v-if="loginMode !== LoginMode.Visitor" @click="switchLogin(LoginMode.Visitor)">
              <img src="@/assets/img/visitor.svg" alt="" class="loginIcon" style="width: 42px; height: 42px;"/>
              <span class="txt">游客登录</span>
            </div>
            <div class="modeBox" v-if="loginMode !== LoginMode.Phone" @click="switchLogin(LoginMode.Phone)">
              <img src="@/assets/img/log_in_way_icon_phone.svg" alt="" class="loginIcon" />
              <span class="txt">手机登录</span>
            </div>
            <div class="modeBox" v-if="loginMode !== LoginMode.Wechat" @click="switchLogin(LoginMode.Wechat)">
              <img src="@/assets/img/log_in_way_icon_weixin.svg" alt="" class="loginIcon" />
              <span class="txt">微信登录</span>
            </div>
            <div class="modeBox" v-if="loginMode !== LoginMode.Order" @click="switchLogin(LoginMode.Order)">
              <img src="@/assets/img/order_login.svg" alt="" class="loginIcon" />
              <span class="txt">订单号登录</span>
            </div>
          </div>
        </div>
        <div class="tips">
          登录即代表同意 <a href="/agreement.html" target="_blank">用户协议</a> 和
          <a href="/privacy.html" target="_blank">隐私政策</a>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant'
import { getLoginQrCode, getLoginStatus, getMobileCode, userMobileLogin, userOrderLogin, userVisitorLogin } from '@/api'
import { setToken } from '@/utils/token'
import { mapActions } from 'vuex'
import { uploadLoginData } from '@/utils/baiduOCPC'

const QR_CODE_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  PENDING: 'pending',
  EXPIRE: 'expire'
}
const LoginMode = {
  Wechat: 'wechat',
  Phone: 'phone',
  Visitor: 'visitor',
  Order: 'order'
}
export default {
  name: 'LoginModal',
  components: {},
  props: {},
  data() {
    return {
      QR_CODE_STATUS,
      LoginMode,
      qrCodeStatus: QR_CODE_STATUS.PENDING,
      loginQrCodeUrl: '',
      isLoading: false,
      checkLoginStatusTimer: null,
      time: 60 * 1000,
      visible: false,
      onClose: () => {},
      onHandleClose: () => {},
      isCountDownFinish: true,
      loginMode: LoginMode.Visitor, // 登录模式，true：手机登录 false：微信扫码登录
      params: {
        mobile_phone: '',
        code: ''
      },
      orderId: '', // 订单号
      isAllowOpen: true
    }
  },
  methods: {
    ...mapActions('userStore', ['setUserInfo', 'updateAllCert']),

    handleClickClose() {
      if (this.isAllowOpen) {
        Dialog.confirm({
          title: '真的要放弃登录吗？',
          message: '您可能错过限时促销活动！',
          cancelButtonText: '游客登录',
          confirmButtonText: '继续登录'
        }).catch(() => {
          this.onClickVisitorLogin()
          // if (typeof this.onHandleClose === 'function') {
          //   this.onHandleClose()
          // }
          // this.handleClose()
        })
      }
    },
    handleClose() {
      clearTimeout(this.checkLoginStatusTimer)
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
      this.$refs.countDown?.start()
    },
    pause() {
      this.$refs.countDown?.pause()
    },
    reset() {
      this.$refs.countDown?.reset()
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

      const { mobile_phone } = this.params
      const flag = this.validatePhoneNumber()
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
      const { mobile_phone } = this.params
      let isPhoneNumberReg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!mobile_phone || !isPhoneNumberReg.test(mobile_phone)) {
        const msg = !mobile_phone ? '请输入手机号码！' : '手机号码格式不正确！'
        Toast(msg)
        return false
      }
      return true
    },
    validateCode() {
      const { code } = this.params
      if (!code || code.trim().length === 0) {
        Toast('请输入验证码！')
        return false
      }
      return true
    },
    validateForm() {
      return this.validatePhoneNumber() && this.validateCode()
    },
    /**
     * 手机号登录
     * @param e
     * @returns {Promise<void>}
     */
    async onSubmit(e) {
      let flag = this.validateForm()
      if (!flag) {
        return
      }
      const { mobile_phone, code } = this.params
      let res = await userMobileLogin({ mobile_phone, code })
      if (res.data.status === 0) {
        this.isAllowOpen = false
        setToken(res.data.data)
        await this.setUserInfo(res.data.data)
        await this.updateAllCert()
        uploadLoginData().catch(e => {})
        Toast('登录成功！')
      } else {
        Toast('登录失败！')
      }
      this.handleClose()
    },
    /**
     * 轮询用户是否登录（二维码）
     * @param ticket
     * @param expire_seconds
     * @param startTime
     */
    loopCheckLoginStatus(ticket, expire_seconds, startTime) {
      clearTimeout(this.checkLoginStatusTimer)
      let currentTime = new Date().getTime()
      if ((currentTime - startTime) / 1000 > expire_seconds) {
        // TODO: 二维码已过期
        this.qrCodeStatus = QR_CODE_STATUS.EXPIRE
        return
      }
      this.checkLoginStatusTimer = setTimeout(async () => {
        let r = await getLoginStatus(ticket)
        if (r.data.status === 0) {
          this.isAllowOpen = false
          // TODO: 更新token，更新用户信息
          setToken(r.data.data)
          await this.setUserInfo(r.data.data)
          await this.updateAllCert()
          uploadLoginData().catch(e => {})
          // trackLogin()
          this.handleClose()
          Toast('登录成功！')

          clearTimeout(this.checkLoginStatusTimer)
        } else {
          this.loopCheckLoginStatus(ticket, expire_seconds, startTime)
        }
      }, 1500)
    },
    /**
     * 获取登录二维码
     * @returns {Promise<void>}
     */
    async handleGetLoginQrCode() {
      this.isLoading = true
      try {
        let res = await getLoginQrCode()
        if (res.data.status === 0) {
          let { ticket, expire_seconds } = res.data.data
          if (ticket) {
            // let src = await this.toQRCode(url)
            let src = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`
            let startTime = new Date().getTime()
            // 二维码获取成功
            this.qrCodeStatus = QR_CODE_STATUS.SUCCESS
            this.loginQrCodeUrl = src
            this.loopCheckLoginStatus(ticket, expire_seconds, startTime)
          } else {
            // 获取二维码失败
            this.qrCodeStatus = QR_CODE_STATUS.FAIL
          }
        } else {
          // 获取二维码失败
          this.qrCodeStatus = QR_CODE_STATUS.FAIL
        }
      } catch (e) {
        this.qrCodeStatus = QR_CODE_STATUS.FAIL
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 刷新二维码
     * @returns {Promise<void>}
     */
    async onRefreshQrCode() {
      await this.handleGetLoginQrCode()
    },
    /**
     * 切换登录
     * @param mode
     */
    switchLogin(mode) {
      clearTimeout(this.checkLoginStatusTimer)
      this.loginMode = mode
      if (mode === this.LoginMode.Wechat) {
        this.handleGetLoginQrCode()
      }
    },
    /**
     * 游客登录
     * @returns {Promise<void>}
     */
    async onClickVisitorLogin() {
      let res = await userVisitorLogin()
      if (res.data.status === 0) {
        this.isAllowOpen = false
        setToken(res.data.data)
        await this.setUserInfo(res.data.data)
        await this.updateAllCert()
        uploadLoginData().catch(e => {})
        Toast('登录成功！')
      } else {
        Toast('登录失败！')
      }
      this.handleClose()
    },
    /**
     * 订单号登录
     * @returns {Promise<void>}
     */
    async handleOrderLogin() {
      if (!this.orderId || this.orderId?.trim().length === 0) {
        Toast('请输入订单号！')
        return
      }
      let res = await userOrderLogin(this.orderId)
      if (res.data.status === 0) {
        this.isAllowOpen = false
        setToken(res.data.data)
        await this.setUserInfo(res.data.data)
        await this.updateAllCert()
        uploadLoginData().catch(e => {})
        Toast('登录成功！')
      } else {
        Toast('订单号错误！')
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
