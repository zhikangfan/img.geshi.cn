<template>
  <div class="convertPage">
    <div class="convertPageContainer">
      <div class="cardList">
        <van-swipe-cell v-for="(file, idx) in fileList" :key="file.id">
          <div :class="{ cardItem: true, checked: file.checked }" @click="onSelectCard(idx)">
            <div class="previewImg">
              <van-image
                fit="contain"
                :src="isExecuted && !isLoading && file.status ? file.result.src : file.init.content"
              />
              <div class="preview" v-if="isExecuted && !isLoading && file.status" @click.stop="handlePreview(file)"></div>
            </div>
            <div class="errorBox" v-if="isExecuted && !isLoading && !file.status">处理失败</div>
            <div v-else class="infoBox">
              <div class="infoItem">
                <span class="title">转换前：</span>
                <div class="infoValue">
                  <span class="value"
                    ><span class="filename">{{ file.filename }}</span
                    >.{{ file.suffix }}</span
                  >
                </div>
              </div>
              <div class="infoItem" v-if="isExecuted && !isLoading && file.status">
                <span class="title">转换后：</span>
                <div class="infoValue">
                  <span class="value"
                    ><span class="filename">{{ file.filename }}</span
                    >.{{ options.to }}</span
                  >
                </div>
              </div>
            </div>
            <div class="checkBox" v-if="isExecuted && !isLoading && file.status"></div>
          </div>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              :style="{ height: '100%', borderRadius: '8px' }"
              @click="onDeleteCard(idx)"
            />
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <div class="panelContainer">
      <div class="panel" v-if="!isExecuted || isLoading">
        <div class="panelTitle">设置图片导出格式</div>
        <div class="radioList">
          <div class="radioLine" v-for="(group, idx) in radioGroup" :key="idx">
            <div
              :class="{ radioItem: true, checked: item.value === options.to }"
              v-for="(item, index) in group"
              :key="item.value"
              @click="onSelectFormat(item.value)"
            >
              <span class="radio"></span>
              <span class="title">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btnGroup" v-if="isExecuted && !isLoading">
        <button class="default btn" @click="goBack">返回</button>
        <button class="btn primary" @click="onClickDownload">下载选中的图片</button>
      </div>
      <div v-else class="btnGroup">
        <Uploader :on-success="onUploadSuccess">
          <button class="default btn">重新上传</button>
        </Uploader>
        <button class="btn primary" @click="onStart">立即修改</button>
      </div>
    </div>
  </div>
</template>
<script>
import {Dialog, ImagePreview, Toast} from 'vant'
import Uploader from '@/components/Uploader/index.vue'
import { imageFormatConvert } from '@/core'
import getImageFileInfo from '@/utils/getImageFileInfo'
import {saveAs} from 'file-saver'
import {VIP_LEVEL} from "@/store/user.store";
export default {
  name: 'Convert',
  components: { Uploader },
  props: {},
  data() {
    return {
      fileList: [],
      radioGroup: [
        [
          {
            title: 'JPG',
            value: 'jpg'
          },
          {
            title: 'JPEG',
            value: 'jpeg'
          },
          {
            title: 'PNG',
            value: 'png'
          }
        ],
        [
          {
            title: 'BMP',
            value: 'bmp'
          },
          {
            title: 'WEBP',
            value: 'webp'
          }
        ]
      ],
      isLoading: false, // 图片是否处理中
      isExecuted: false, // 是否执行过修改
      options: {
        to: 'jpg'
      },
      isBuyVip: false, // 是否去购买vip
    }
  },
  methods: {
    // 点击预览
    handlePreview(file) {
      ImagePreview({
        images: [file.init.content],
        closeable: true
      })
    },
    onLeave(e) {
      e.preventDefault()
      return '图片还未处理或下载，是否要离开？'
    },
    // 选择格式
    onSelectFormat(format) {
      this.options.to = format
    },
    onReset() {
      this.isLoading = false
      this.isExecuted = false
      this.fileList = []
    },
    onSelectCard(idx) {
      // 没点击过压缩，不能执行
      if (!this.isExecuted) {
        return
      }
      // 处理失败的图片不要被选
      if (!this.fileList[idx].status) {
        Toast('该图片处理失败！')
      } else {
        this.fileList.splice(idx, 1, { ...this.fileList[idx], checked: !this.fileList[idx].checked })
      }
    },
    onDeleteCard(idx) {
      if (this.fileList.length === 1) {
        this.jumpTo('/')
      } else {
        this.fileList.splice(idx, 1)
      }
    },
    onUploadSuccess(files) {
      this.onReset()
      this.fileList = files
    },
    jumpTo(path) {
      this.$router.replace(path)
    },
    goBack() {
      this.isLoading = false
      this.isExecuted = false
      const fields = ['checked', 'download', 'status', 'result']
      this.fileList.map(item => {
        let keys = Object.keys(item)
        fields.forEach(field => {
          if (keys.includes(field)) {
            delete item[field]
          }
        })
      })
    },
    // 检查用户
    checkUser() {
      // 判断用户是否登录
      let isLogin = this.$store.getters["userStore/isLogin"]
      if (!isLogin) {
        this.handleLogin()
        return false
      }
      let {vip, has_image_count} = this.$store.state.userStore.allCert
      // 判断用户等级
      if (vip === VIP_LEVEL.NON_VIP) { // 没有VIP
        Dialog.confirm({
          title: '温馨提示',
          message: '请开通VIP后下载！'
        }).then(() => {
          this.isBuyVip = true
          this.$router.push({
            name: 'purchase'
          })
        }).catch(() => {
          // TODO: 点击取消
        })
        return false
      }
      // 判断用户是否有券
      if (vip === VIP_LEVEL.COUNT_VIP) { // 当用户为次数vip的时候
        // has_image_count
        // 过滤出来用户选中的 但未下载的
        let needDownloadList = this.fileList.filter((item, idx) => {
          return item.checked && !item.download
        })
        return needDownloadList <= has_image_count
      }
      if (vip === VIP_LEVEL.TIME_VIP || vip === VIP_LEVEL.PERMANENT_VIP || vip === VIP_LEVEL.THREE_DAY_VIP) { // 当用户vip类型为时间vip 永久vip 3天vip的时候
        return true
      }
    },
    // 下载选中的图片
    onClickDownload() {
      let downloadList = this.fileList.filter((item,idx) => {
        // 标记一下是否被下载过
        if (item.checked) {
          this.fileList.splice(idx, 1, {...item, download: true})
        }
        return item.checked
      })
      if (downloadList.length === 0) {
        Toast('未选择要下载的图片！')
        return
      }
      let allowAction = this.checkUser()
      if (allowAction) {
        downloadList.forEach(item => {
          // FIXME: 怎么区别JPG、 JPEG ？？
          saveAs(item.result.raw, `${item.filename}.${this.options.to}`)
        })
      }

    },
    onStart() {
      this.isLoading = true // 开启loading
      this.isExecuted = true
      let taskList = []
      const toast = Toast({
        type: 'loading',
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '格式转换中...'
      })
      this.fileList.forEach((item, idx) => {
        let taskFn = new Promise(resolve => {
          ;(async (resolve, item, idx) => {
            try {
              let resultBlob = await imageFormatConvert(item.raw, { to: this.options.to })
              let resultInfo = await getImageFileInfo(resultBlob)
              let result = { ...item, result: resultInfo, status: true, checked: false }
              this.fileList.splice(idx, 1, result)
              resolve(result)
            } catch (e) {
              let result = { ...item, status: false, checked: false }
              this.fileList.splice(idx, 1, result)
              resolve(result)
            }
          })(resolve, item, idx)
        })

        taskList.push(
          new Promise(resolve => {
            resolve(taskFn)
          })
        )
      })
      Promise.all(taskList).then(d => {
        this.isLoading = false
        toast.clear()
      })
    }
  },
  created() {
    this.fileList = this.$route.params.fileList
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.onLeave(e))
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', e => this.onLeave(e))
  },
  beforeRouteEnter(to, from, next) {
    if (to.params?.fileList) {
      next()
    } else {
      if (from.name !== 'home') {
        next({
          replace: true,
          name: 'home'
        })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 如果有处理好的图片，离开之前给出提示
    let filterData = this.fileList.filter(item => item.status)
    let isAllowLeave = filterData.length == 0
    if (isAllowLeave) {
      next()
    } else {
      // 如果用户因为去开通vip跳走的可以直接通过
      if (this.isBuyVip) {
        next()
      } else {
        Dialog.confirm({
          title: '温馨提示',
          message: '您的文件已处理成功，离开文件将丢失确认要放弃吗？'
        }).then(() => {
          next()
        }).catch(() => {

        })
      }

    }
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
