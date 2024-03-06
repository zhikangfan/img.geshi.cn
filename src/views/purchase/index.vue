<template>
  <div class="purchasePage">
    <div class="userInfoArea">
      <div class="userInfo">
        <img src="@/assets/img/avatar.svg" alt="" class="avatar" />
        <div class="infoRight">
          <div class="nickname">轻秒{{ this.$store.state.userStore.userInfo?.uid }}</div>
          <div class="desc">{{info}}</div>
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
          <div class="desc">与网页权益互通，PC端更多功能</div>
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
          <div class="price">
            ¥{{ currentPackage.price }}<span class="info">/{{ currentPackage.unit }}</span>
          </div>
          <div class="desc">{{ currentPackage.payTips }}</div>
        </div>
        <button class="payBtn" @click="handlePay">立即开通</button>
      </div>
      <div class="tips">没有自动续费，请放心购买</div>
    </div>
  </div>
</template>
<script>
import { packageList } from '@/config'
import { createOrder, getPayStatus } from '@/api'
import { Toast } from 'vant'
import {VIP_LEVEL} from "@/store/user.store";

export default {
  name: 'Purchase',
  components: {},
  props: {},
  data() {
    return {
      packageList,
      checkId: -1, // 默认选中
      pollCount: 0, // 轮询次数
      payResultTimer: null,
      currentPackage: {}
    }
  },
  computed: {
    info() {
      let {vip, vip_expiration_date, has_image_count} = this.$store.state.userStore.allCert
      switch (vip) {
        case VIP_LEVEL.PERMANENT_VIP:
          return `到期时间：永久`
        case VIP_LEVEL.TIME_VIP:
          return `到期时间：${vip_expiration_date}`
        case VIP_LEVEL.COUNT_VIP:
          return `剩余次数：${has_image_count}`
        default :
          return `开通VIP会员 尊享更多特权`
      }
    }
  },
  methods: {
    // 选择套餐
    onCheckPackage(id) {
      this.checkId = id
      this.currentPackage = this.packageList.find(item => item.id === id)
    },
    /**
     * @description 轮询，获取支付状态
     * @param orderId 订单ID
     */
    lookup(orderId) {
      clearTimeout(this.payResultTimer)

      if (this.pollCount > 5000) {
        // TODO: 支付超时

        return
      }

      this.payResultTimer = setTimeout(async () => {
        let r = await getPayStatus(orderId)
        if (r.data.status === 0 && r.data.data.order.status === 1) {
          // 查询成功 并且 状态为1 或者支付超时
          // await this.updateAllCert(r.data.data.money) // 更新用户权益

          await this.$store.dispatch('updateUserInfo')
          Toast.success({
            message: '支付成功'
          })

          // Message({
          //   type: 'success',
          //   message: '支付成功'
          // })
          clearTimeout(this.payResultTimer)

          // FIXME: 浮点数精度丢失，可以采用第三方库处理，也可以后端处理
          // uploadPayData(Math.ceil(this.price * 100)).catch(e => {})
          // trackOrder(this.checkID, orderId, r.data.data.money.cash_total)
          // this.hidePurchaseModal()
        } else {
          Toast.fail({
            message: '支付失败'
          })
          // this.lookup(orderId)
        }
      }, 1500)

      this.pollCount++ // 增加轮询次数
    },

    async handlePay() {
      const { id } = this.currentPackage
      let res = await createOrder(id)
      if (res.data.status == 0) {
        let { wechat_url, order_id } = res.data.data
        const wechatUrl = `${wechat_url}&redirect_url=${window.encodeURIComponent('https://img.geshi.cn/purchase?order_id=' + order_id)}`
        await window.location.replace(wechatUrl)
      }
    }
  },
  async created() {
    this.onCheckPackage(1)
  },
  async mounted() {
    let { order_id } = this.$route.query
    console.log(order_id, '---orderId')
    if (order_id) {
      let r = await getPayStatus(order_id)
      console.log(r, '---payStatus')
      if (r.data.status === 0 && r.data.data.order.status === 1) {
        // 查询成功 并且 状态为1 或者支付超时
        // 更新用户权益
        await this.$store.dispatch('userStore/updateAllCert')
        // Toast.success({
        //   message: '支付成功'
        // })

        // FIXME: 浮点数精度丢失，可以采用第三方库处理，也可以后端处理
        // uploadPayData(Math.ceil(this.price * 100)).catch(e => {})
        // trackOrder(this.checkID, orderId, r.data.data.money.cash_total)
        // this.hidePurchaseModal()
      }
    }
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
