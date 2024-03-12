<template>
  <div class="purchasePage">
    <div class="userInfoArea">
      <div class="userInfo">
        <img src="@/assets/img/avatar.svg" alt="" class="avatar" />
        <div class="infoRight">
          <div class="nickname">轻秒{{ userInfo?.uid }}</div>
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
            v-if="item.level.includes(allCert?.vip)"
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
      <dd>按张付费购买下载张数 <span class="strong">永久有效</span></dd>
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
    <van-dialog v-model="visible"  :show-confirm-button="false">
      <div class="retentionDialog">
        <div class="closeBtn" @click="handleClose"></div>
        <div class="titleBox">
          新人福利送达！
        </div>
        <div class="retentionContainer">
          <div class="priceArea">
            <div class="price">¥19.9</div>
            <div class="packageDesc">3天体验VIP</div>
          </div>
          <div class="funcList">
            <div class="funcItem">
              <img src="@/assets/img/pi_liang_chu_li.svg" alt="" class="icon">
              <span class="txt">批量处理</span>
            </div>
            <div class="funcItem">
              <img src="@/assets/img/bu_xian_ci_shu.svg" alt="" class="icon">
              <span class="txt">不限次数</span>
            </div>
            <div class="funcItem">
              <img src="@/assets/img/quan_zhan_tong_yong.svg" alt="" class="icon">
              <span class="txt">全站通用</span>
            </div>
          </div>
          <button class="btn" @click="retentionPay">立即开通</button>
          <p class="tips">没有自动续费，请放心购买！</p>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="visible2"  :show-confirm-button="false">
      <div class="retentionDialog">
        <div class="closeBtn" @click="handleClose2"></div>
        <div class="titleBox">
          限时升级福利！
        </div>
        <div class="retentionContainer">
          <div class="priceArea">
            <div class="price">¥39.9</div>
            <div class="packageDesc packageDesc2">终身会员</div>
          </div>
          <div class="funcList">
            <div class="funcItem">
              <img src="@/assets/img/pi_liang_chu_li.svg" alt="" class="icon">
              <span class="txt">批量处理</span>
            </div>
            <div class="funcItem">
              <img src="@/assets/img/bu_xian_ci_shu.svg" alt="" class="icon">
              <span class="txt">不限次数</span>
            </div>
            <div class="funcItem">
              <img src="@/assets/img/quan_zhan_tong_yong.svg" alt="" class="icon">
              <span class="txt">全站通用</span>
            </div>
          </div>
          <button class="btn" @click="retentionPay2">立即开通</button>
          <p class="tips">没有自动续费，请放心购买！</p>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { packageList } from '@/config'
import { createOrder, getPayStatus } from '@/api'
import { Toast } from 'vant'
import {VIP_LEVEL} from "@/store/user.store";
import { mapState } from 'vuex'
import {uploadPayData} from "@/utils/baiduOCPC";

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
      currentPackage: {},
      visible: false,
    visible2: false
    }
  },
  computed: {
    ...mapState('userStore', {
      allCert: state => state.allCert,
      userInfo: state => state.userInfo
    }),
    info() {
      let {vip, vip_expiration_date, has_image_count} = this.allCert
      switch (vip) {
        case VIP_LEVEL.PERMANENT_VIP:
          return `到期时间：永久`
        case VIP_LEVEL.TIME_VIP:
          return `到期时间：${vip_expiration_date}`
        case VIP_LEVEL.COUNT_VIP:
          return `剩余张数：${has_image_count}`
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
    handleClose() {
      this.visible = false
    },

    handleClose2() {
      this.visible2 = false
    },
    async retentionPay() {
      const id = 11 // 3天vip
      let res = await createOrder(id)
      if (res.data.status == 0) {
        let { wechat_url, order_id } = res.data.data
        const wechatUrl = `${wechat_url}&redirect_url=${window.encodeURIComponent('https://img.geshi.cn/purchase?order_id=' + order_id + '&retention=1')}`
        await window.location.replace(wechatUrl)
      }
      this.visible = false
    },
    async retentionPay2() {
      const id = 5 // 3天vip
      let res = await createOrder(id)
      if (res.data.status == 0) {
        let { wechat_url, order_id } = res.data.data
        const wechatUrl = `${wechat_url}&redirect_url=${window.encodeURIComponent('https://img.geshi.cn/purchase?order_id=' + order_id + '&retention=1')}`
        await window.location.replace(wechatUrl)
      }
      this.visible2 = false
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
    let { order_id, retention } = this.$route.query
    if (order_id) {
      let r = await getPayStatus(order_id)
      if (r.data.status === 0 && r.data.data.order.status === 1) {
        // 查询成功 并且 状态为1 或者支付超时
        // 更新用户权益
        await this.$store.dispatch('userStore/updateAllCert')
        Toast.success({
          message: '支付成功'
        })
        uploadPayData(r.data.data.order.amount).catch(e => {})
      }
      if (!retention && this.allCert?.vip === VIP_LEVEL.NON_VIP) {
        this.visible = true
        this.visible2 = false
      }
      if (!retention && this.allCert?.vip === VIP_LEVEL.COUNT_VIP) {
        this.visible = false
        this.visible2 = true
      }
    }
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
