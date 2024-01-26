<template>
  <div class="personalCenterPage">
    <div class="loginBox">
      <img src="@/assets/img/avatar.svg" alt="" class="avatar" />
      <div class="loginBtn">登录/注册</div>
    </div>
    <div class="section">
      <div class="card">
        <div class="cardLeft">
          <div class="cardTop">
            <span class="icon"></span>
            <span class="title">VIP会员</span>
          </div>
          <div class="desc">解锁更多功能，尊享所有权益</div>
        </div>
        <button class="buyBtn" @click="jumpTo('/purchase')">立即开通</button>
      </div>
    </div>
    <div class="section">
      <div class="navList">
        <div class="navItem">
          <div class="navItemLeft">
            <span class="icon"></span>
            <span class="title">意见反馈</span>
          </div>
          <span class="right_icon"></span>
        </div>
        <div class="navItem">
          <div class="navItemLeft">
            <span class="icon"></span>
            <span class="title">客服中心</span>
          </div>
          <span class="right_icon"></span>
        </div>
        <div class="navItem" @click="onOpenExchangeModal">
          <div class="navItemLeft">
            <span class="icon"></span>
            <span class="title">兑换码激活</span>
          </div>
          <span class="right_icon"></span>
        </div>
        <div class="navItem" @click="jumpTo('/redeem-code')">
          <div class="navItemLeft">
            <span class="icon"></span>
            <span class="title">兑换码</span>
          </div>
          <span class="right_icon"></span>
        </div>
      </div>
    </div>
    <div class="tabBar">
      <div class="tabItem homeTab">
        <span class="icon"></span>
        <span class="txt">轻秒</span>
      </div>
      <div class="tabItem personTab active">
        <span class="icon"></span>
        <span class="txt">我的</span>
      </div>
    </div>
    <van-popup v-model="isShowExchange" :round="true">
      <div class="exchangeBox">
        <span class="close" @click="onCloseExchangeModal"></span>
        <div class="titleBox">
          兑换码激活

        </div>
        <div class="exchangeContent">
          <input type="text" class="input">
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
export default {
  name: 'PersonalCenter',
  components: {},
  props: {},
  data() {
    return {
      isShowExchange: false
    }
  },
  methods: {
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
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
