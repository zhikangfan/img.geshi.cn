<template>
  <div class="personalCenterPage">
    <div class="noLoginBox" v-if="!isLogin" @click="handleLogin">
      <img src="@/assets/img/avatar.svg" alt="" class="avatar" />
      <div class="loginBtn">登录/注册</div>
    </div>
    <div class="loginBox" v-else>
      <div class="avatarBox">
        <img src="@/assets/img/avatar.svg" alt="" class="avatar" />
        <img v-if="allCert?.vip === VIP_LEVEL.PERMANENT_VIP || allCert?.vip === VIP_LEVEL.TIME_VIP || allCert?.vip === VIP_LEVEL.THREE_DAY_VIP" src="@/assets/img/vip_icon.svg" alt="" class="vip_icon">
      </div>
      <div class="userInfo">
        <div class="nickname">轻秒{{ userInfo?.uid }}</div>
        <div class="info">
<!--          <div class="tag" v-if="this.$store.state.userStore.allCert?.vip === VIP_LEVEL.NON_VIP">免费用户</div>-->
          <div class="userIdBox">
            ID:<span class="userId">{{ userInfo?.uid }}</span>
            <span class="copyBtn" :data-clipboard-text="userInfo?.uid"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="card">
        <div class="cardLeft">
          <div class="cardTop">
            <span class="icon"></span>
            <span class="title">{{allCert?.vip === VIP_LEVEL.PERMANENT_VIP ? '终身会员' : allCert?.vip === VIP_LEVEL.TIME_VIP ? '年会员' : 'VIP会员'}}</span>
          </div>
          <div class="desc">{{allCert?.vip === VIP_LEVEL.PERMANENT_VIP ? '无限制' : (allCert?.vip === VIP_LEVEL.TIME_VIP || allCert?.vip === VIP_LEVEL.THREE_DAY_VIP) ? `到期时间：${allCert?.vip_expiration_date}` : allCert?.vip === VIP_LEVEL.COUNT_VIP ? `剩余张数：${allCert?.has_image_count}` : '解锁更多功能，尊享所有权益'}}</div>
        </div>
        <button class="buyBtn" v-if="allCert?.vip === VIP_LEVEL.PERMANENT_VIP">永久</button>
        <button class="buyBtn" v-else @click="handleOpen">{{(allCert?.vip === VIP_LEVEL.TIME_VIP || allCert?.vip === VIP_LEVEL.COUNT_VIP || allCert?.vip === VIP_LEVEL.THREE_DAY_VIP) ? '限时升级' : `立即开通`}}</button>
      </div>
    </div>
    <div class="section">
      <div class="navList">
        <div class="navItem" @click="openWindow('https://work.weixin.qq.com/kfid/kfc34ae1a91908f3348')">
          <div class="navItemLeft">
            <span class="icon feedback"></span>
            <span class="title">意见反馈</span>
          </div>
          <span class="right_icon"></span>
        </div>
        <div class="navItem" @click="openWindow('https://work.weixin.qq.com/kfid/kfc34ae1a91908f3348')">
          <div class="navItemLeft">
            <span class="icon customer"></span>
            <span class="title">客服中心</span>
          </div>
          <span class="right_icon"></span>
        </div>
        <!--        <div class="navItem" @click="onOpenExchangeModal">-->
        <!--          <div class="navItemLeft">-->
        <!--            <span class="icon activationCodeJiHuo"></span>-->
        <!--            <span class="title">兑换码激活</span>-->
        <!--          </div>-->
        <!--          <span class="right_icon"></span>-->
        <!--        </div>-->
        <!--        <div class="navItem" @click="jumpTo('/redeem-code')">-->
        <!--          <div class="navItemLeft">-->
        <!--            <span class="icon activationCode"></span>-->
        <!--            <span class="title">兑换码</span>-->
        <!--          </div>-->
        <!--          <span class="right_icon"></span>-->
        <!--        </div>-->
        <div class="navItem" @click="handleLogout" v-if="isLogin">
          <div class="navItemLeft">
            <span class="icon logout"></span>
            <span class="title">退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <MyTabBar />
    <van-popup v-model="isShowExchange" :round="true" :close-on-popstate="true" :safe-area-inset-bottom="true">
      <div class="exchangeBox">
        <span class="close" @click="onCloseExchangeModal"></span>
        <div class="titleBox">兑换码激活</div>
        <div class="exchangeContent">
          <input type="text" class="input" placeholder="请输入PC端兑换码" />
          <button class="activeBtn">立即激活</button>
        </div>
        <dl class="tipsList">
          <dt class="title">使用须知</dt>
          <dd>1. 登录账号后，输入兑换码即可完成激活</dd>
          <dd>2. 激活成功后，可享受对应权益与服务</dd>
          <dd>3. 请在兑换码有效期内使用，过期作废，不可退款</dd>
          <dd>4. 此兑换码严禁倒卖、转让，不可兑换现金，请妥善保管， 遗失泄露等不补</dd>
          <dd>5. 兑换网址：<a href="https://img.geshi.cn" target="_blank" class="link">img.geshi.cn</a></dd>
        </dl>
      </div>
    </van-popup>
  </div>
</template>
<script>
import MyTabBar from '@/components/TabBar/index.vue'
import {mapActions, mapGetters, mapState} from 'vuex'
import { VIP_LEVEL } from '@/store/user.store'
import ClipboardJS from 'clipboard'
import {Toast} from "vant";

export default {
  name: 'PersonalCenter',
  components: { MyTabBar },
  props: {},
  data() {
    return {
      VIP_LEVEL,
      isShowExchange: false,
      clipboard: null
    }
  },
  computed: {
    ...mapState('userStore', {
      allCert: state => state.allCert,
      userInfo: state => state.userInfo
    }),
    ...mapGetters('userStore', {
      isLogin: 'isLogin'
    })
  },
  methods: {
    ...mapActions('userStore', ['logout']),
    // 打开兑换窗口
    onOpenExchangeModal() {
      this.isShowExchange = true
    },
    // 关闭兑换窗口
    onCloseExchangeModal() {
      this.isShowExchange = false
    },
    //打开跳转到兑换码
    jumpTo(path) {
      this.$router.push(path)
    },
    handleOpen() {
      if (this.isLogin) {
        this.jumpTo('/purchase')
      } else {
        this.handleLogin()
      }
    },
    handleLogin() {
      this.$loginModal({
        onHandleClose: () => {
        }
      })
    },
    openWindow(url) {
      window.open(url)
    },
    handleLogout() {
      this.logout()
    }
  },
  created() {
  },
  mounted() {
    this.clipboard?.destroy()
    this.clipboard = new ClipboardJS('.copyBtn')
    this.clipboard.on('success', () => {
      Toast('复制成功')
    })
  },
  beforeDestroy() {
    this.clipboard?.destroy()
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
