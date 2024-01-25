<template>
  <div class="purchasePage">
    <div class="userInfoArea">
      <div class="userInfo">
        <img src="@/assets/img/avatar.svg" alt="" class="avatar" />
        <div class="infoRight">
          <div class="nickname">轻秒用户21234</div>
          <div class="desc">开通VIP会员 尊享更多特权</div>
        </div>
      </div>
    </div>
    <div class="packageArea">
      <div class="title">会员套餐</div>
      <div class="packageListWrap">
        <div class="packageList">
          <div
            :class="{ packageItem: true, checked: checkId === item.id }"
            v-for="item in packageList"
            :key="item.id"
            @click="onCheckPackage(item.id)"
          >
            <div class="corner" v-if="item.corner">
              <span class="icon" v-if="item.has_icon"></span>
              <span>{{ item.corner }}</span>
            </div>
            <div class="packageItemContainer">
              <div class="packageItemContent">
                <div class="packageTitle">{{ item.title }}</div>
                <div class="priceBox">¥{{ item.price }}</div>
                <div :class="{ originPrice: true, del: item.has_del }">{{ item.desc }}</div>
              </div>
              <div class="desc">{{ item.txt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="payChannel">
      <div class="title">支付方式</div>
      <div class="payChannelItem">
        <div class="payChannelItemLeft">
          <span class="icon wechat_icon"></span>
          <span class="txt">微信支付</span>
        </div>
        <div class="checkBox">
          <span class="checked"></span>
        </div>
      </div>
    </div>
    <div class="descList">
      <div class="title">轻秒优势</div>
      <div class="descItem">
        <img src="@/assets/img/devices.svg" alt="" class="icon" />
        <div class="descContent">
          <div class="descTitle">多端通用</div>
          <div class="desc">微信小程序与网页权益互通，PC端更多功能</div>
        </div>
      </div>
      <div class="descItem">
        <img src="@/assets/img/wigets.svg" alt="" class="icon" />
        <div class="descContent">
          <div class="descTitle">功能丰富</div>
          <div class="desc">网页端提供批量图片压缩、图片格式转换、PDF转换等功能</div>
        </div>
      </div>
      <div class="descItem">
        <img src="@/assets/img/security.svg" alt="" class="icon" />
        <div class="descContent">
          <div class="descTitle">隐私安全</div>
          <div class="desc">图片压缩在微信本地完成，您的照片不会被泄露</div>
        </div>
      </div>
    </div>
    <dl class="buyTips">
      <dt>购买须知</dt>
      <dd>按张付费购买下载次数 <span class="strong">永久有效</span></dd>
      <dd>开通任一会员，会员有效期内所有功能 <span class="strong">不限使用，不限张数</span></dd>
    </dl>
    <div class="payArea">
      <div class="payContainer">
        <div class="payInfo">
          <div class="price">¥{{currentPackage.price}}<span class="info">/{{currentPackage.unit}}</span></div>
          <div class="desc">{{currentPackage.payTips}}</div>
        </div>
        <button class="payBtn">立即开通</button>
      </div>
      <div class="tips">开通会员即代表同意<a href="/" target="_blank">《会员服务协议》</a></div>
    </div>
  </div>
</template>
<script>
import { packageList } from '@/config'

export default {
  name: 'Purchase',
  components: {},
  props: {},
  data() {
    return {
      packageList,
      checkId: -1, // 默认选中
      currentPackage: {}
    }
  },
  methods: {
    // 选择套餐
    onCheckPackage(id) {
      this.checkId = id
      this.currentPackage = this.packageList.find(item => item.id === id)
    }
  },
  created() {
    this.onCheckPackage(1)
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
