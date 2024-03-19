<template>
  <div class="helpPage">
    <div class="title">微信支付用户</div>
    <div class="content">
      <p>1、在微信的[账单]里面找到您的订单；</p>
      <p>2、按照如下截图，复制第一个长的交易单号到输入框即可。</p>
      <img src="@/assets/img/wxorder.png" alt="" />
    </div>
    <div class="title">支付宝用户</div>
    <div class="content">
      <p>1、在支付宝的[账单]里面找到您的订单；</p>
      <p>2、按照如下截图，复制第一个长的订单号到输入框即可。</p>
      <img src="@/assets/img/zfborder.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Help',
  components: {},
  props: {},
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>
<style scoped lang="less">
.helpPage {
  padding: 16px;
  background: #fff;
  box-sizing: border-box;
  .title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }
  .content {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 26px;
  }
  img {
    width: 100%;
    height: auto;
  }
}
</style>
