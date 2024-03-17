<template>
  <div class="compressPage">
    <div class="cardList">
      <van-swipe-cell v-for="(file, idx) in fileList" :key="file.id">
        <div :class="{ cardItem: true }">
          <div class="previewImg" @click.stop="handlePreview(file)">
            <van-image
              fit="contain"
              :src="file.init.content"
            />
            <div class="preview" v-if="isExecuted && !isLoading && file.status"></div>
          </div>
          <div class="errorBox" v-if="isExecuted && !isLoading && !file.status">处理失败</div>
          <div v-else class="infoBox">
            <div class="infoBoxLeft">
              <div class="infoItem">
                <span class="title">内存：</span>
                <div class="infoValue">
                  <span :class="{ value: true, strong: isExecuted && !isLoading }">{{
                    isExecuted && !isLoading ? file.result?.formatSize : file.formatSize
                  }}</span>
                  <span class="originValue" v-if="isExecuted && !isLoading">（原{{ file.formatSize }}）</span>
                </div>
              </div>
              <div class="infoItem">
                <span class="title">格式：</span>
                <div class="infoValue">
                  <span class="value">{{ file.suffix }}</span>
                </div>
              </div>
              <div class="infoItem">
                <span class="title">尺寸：</span>
                <div class="infoValue">
                  <span class="value">宽{{ file.width }}px*高{{ file.height }}px</span>
                </div>
              </div>
            </div>
            <div class="infoBoxRight" v-if="isExecuted && !isLoading && file.status">
              <div class="downloadBtn" @click="handleDownload(file)"></div>
            </div>
          </div>
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
    <div class="panelContainer">
      <div class="panel" v-if="!isExecuted || isLoading">
        <van-radio-group v-model="checkFunc">
          <van-radio name="quality" icon-size="18px">
            <div class="panelItem">
              <span class="title">清晰度：</span>
              <div class="panelItemRight">
                <van-slider
                  v-model="options.quality"
                  @change="onRatioChange"
                  :min="1"
                  :max="100"
                  bar-height="4px"
                  active-color="#165DFF"
                >
                  <template #button>
                    <div class="custom-button"></div>
                  </template>
                </van-slider>
                <span class="txt">{{ options.quality }}%</span>
              </div>
            </div>
          </van-radio>
          <van-radio name="size" icon-size="18px">
            <div class="panelItem margin">
              <span class="title">指定大小：</span>
              <div class="panelItemRight">
                <div class="inputBox">
                  <input type="number" v-model="options.size" />
                  <span class="unit">KB<span class="s">（可手动输入数值）</span></span>
                </div>
              </div>
            </div>
          </van-radio>
          <div class="panelItem">
            <span class="title"></span>
            <div class="otherSize">
              <div class="size" @click="onChangeSize(size)" v-for="size in otherSizes" :key="size">{{ size }}</div>
            </div>
          </div>
        </van-radio-group>
      </div>

      <div class="btnGroup" v-if="isExecuted && !isLoading">
        <button class="default btn" @click="goBack">上一步</button>
        <button class="btn primary" @click="jumpTo('/')">返回首页</button>
      </div>
      <div class="btnGroup" v-else>
        <Uploader :on-success="onUploadSuccess" :accept="'image/*'">
          <button class="default btn">重新上传</button>
        </Uploader>
        <button class="btn primary" @click="onStart">开始压缩</button>
      </div>
    </div>
    <DownloadImage v-model="visible" :src="currentFile?.src" :direction="direction" :width="currentFile?.width" :height="currentFile?.height" :size="currentFile?.raw?.size" :format="currentFile?.suffix" @close="handleClose" />
  </div>
</template>
<script>
import { Dialog, ImagePreview, Toast } from 'vant'
import { compressImage, outputTheSpecifiedSize } from '@/core'
import getImageFileInfo from '@/utils/getImageFileInfo'
import Uploader from '@/components/Uploader/index.vue'
import { VIP_LEVEL } from '@/store/user.store'
import { duce } from '@/api'
import { mapActions, mapGetters, mapState } from 'vuex'
import DownloadImage from '@/components/DownloadImage/index.vue'
import { uploadOSS } from '@/utils/uploadOSS'
import { v4 as uuidV4 } from 'uuid'
import { BUCKET } from '@/config'

export default {
  name: 'Compress',
  components: {
    DownloadImage,
    Uploader
  },
  props: {},
  data() {
    return {
      otherSizes: [10, 30, 50, 100, 200],
      isExecuted: false, // 是否执行过压缩
      options: {
        //执行的压缩参数
        quality: 70, // 透明度
        size: '' // 单位kb
      },
      fileList: [],
      checkFunc: 'quality', // 选择的压缩方式quality: 清晰度，size: 指定大小
      isLoading: false, // 图片是否处理中
      isBuyVip: false, // 是否去购买vip
      visible: false,
      direction: 'horizontal',
      currentFile: {} // 当前下载的文件
    }
  },
  computed: {
    ...mapState('userStore', {
      allCert: state => state.allCert
    }),
    ...mapGetters('userStore', ['isLogin'])
  },
  methods: {
    ...mapActions('userStore', ['updateAllCert']),
    onLeave(e) {
      e.preventDefault()
      return '图片还未处理或下载，是否要离开？'
    },
    onReset() {
      this.isLoading = false
      this.isExecuted = false
      this.fileList = []
    },
    // 点击预览
    handlePreview(file) {
      ImagePreview({
        images: [file.init.content],
        closeable: true
      })
    },
    // 监听透明度发生变化
    onRatioChange(value) {
      this.options.quality = value
      this.checkFunc = 'quality'
    },
    // 监听用户尺寸发生变化
    onChangeSize(value) {
      this.options.size = value
      this.checkFunc = 'size'
    },
    handleLogin() {
      this.$loginModal({
        onHandleClose: () => {
        }
      })
    },
    // 检查用户
    async checkUser(needCount = 0) {
      // 判断用户是否登录
      let isLogin = this.isLogin
      if (!isLogin) {
        this.handleLogin()
        return false
      }
      let { vip, has_image_count } = this.allCert
      // 判断用户等级
      if (vip === VIP_LEVEL.NON_VIP) {
        // 没有VIP
        // Dialog.confirm({
        //   title: '温馨提示',
        //   message: '请开通VIP后下载！'
        // })
        //   .then(() => {
        //     this.isBuyVip = true
        //     this.$router.push({
        //       name: 'purchase'
        //     })
        //   })
        //   .catch(() => {
        //     // TODO: 点击取消
        //   })
        this.isBuyVip = true
        await this.$router.push({
          name: 'purchase'
        })
        return false
      }
      // 判断用户是否有券
      if (vip === VIP_LEVEL.COUNT_VIP) {
        // 当用户为次数vip的时候
        if (needCount > has_image_count) {
          this.isBuyVip = true
          await this.$router.push({
            name: 'purchase'
          })
          // Dialog.confirm({
          //   title: '温馨提示',
          //   message: '剩余张数不足！',
          //   confirmButtonText: '去购买'
          // })
          //   .then(() => {
          //     this.isBuyVip = true
          //     this.$router.push({
          //       name: 'purchase'
          //     })
          //   })
          //   .catch(() => {
          //     // TODO: 点击取消
          //   })

          return false
        }
        return needCount <= has_image_count

        // else {
        // 扣除相应次数
        // let res = await duce(needCount)
        // if (res.data.status !== 0) {
        //   Toast.fail({
        //     message: '下载失败！'
        //   })
        // }
        //   return res.data.status === 0
        // }
      }
      if (vip === VIP_LEVEL.TIME_VIP || vip === VIP_LEVEL.PERMANENT_VIP || vip === VIP_LEVEL.THREE_DAY_VIP) {
        // 当用户vip类型为时间vip 永久vip 3天vip的时候
        return true
      }
    },
    // 压缩前校验
    checkCondition() {
      let { size } = this.options
      let number = Number(size)

      let flag = Number.isNaN(number)
      if (flag) {
        Toast('请输入数字')
        return false
      }
      if (number === 0) {
        Toast('指定大小数值需大于0')
        return false
      }
      if (number && number <= 0) {
        Toast('指定大小数值需大于0')
        return false
      }
      return true
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
    // 开始压缩
    onStart() {
      if (this.checkFunc === 'size') {
        let checkResult = this.checkCondition()
        if (!checkResult) {
          return
        }
      }

      this.isLoading = true // 开启loading
      this.isExecuted = true
      let taskList = []

      const toast = Toast({
        type: 'loading',
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '图片压缩中...'
      })
      this.fileList.forEach((item, idx) => {
        let taskFn = new Promise(resolve => {
          ;(async (resolve, item, idx) => {
            try {
              let options =
                this.checkFunc === 'quality' ? { quality: this.options.quality / 100 } : { maxSize: this.options.size }
              let resultBlob = await compressImage(item.raw, options)
              if (this.checkFunc !== 'quality') {
                resultBlob = await outputTheSpecifiedSize(item.raw, options)
              }

              let resultInfo = await getImageFileInfo(resultBlob)
              let result = { ...item, result: resultInfo, status: true, checked: true }
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
    // 打开下载弹窗
    openDownloadWindow(currentFile) {
      let index = this.fileList.findIndex(item => item.id === currentFile.id)
      currentFile.download = true
      this.fileList.splice(index, 1, currentFile)
      this.direction = currentFile?.result?.width < currentFile?.result?.height ? 'horizontal' : 'vertical'
      this.currentFile = currentFile?.result
      this.visible = true
    },
    async handleDownload(currentFile) {
      // 没点击过压缩，不能执行
      if (!this.isExecuted) {
        Toast('未执行压缩')
        return
      }
      // 处理失败的图片不要被选
      if (!currentFile.status) {
        Toast('该图片处理失败！')
        return
      }
      let needCount = currentFile.download ? 0 : 1 // 需要使用的下载张数
      let allowAction = await this.checkUser(needCount)
      if (allowAction) {
        // 判读是否下载过
        if (!currentFile.download) {
          let fileName = `${uuidV4()}_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}_${currentFile.name}`
          if (this.allCert?.vip === VIP_LEVEL.COUNT_VIP) {
            let tips = `当前剩余张数：${this.allCert?.has_image_count}  本次需扣除：1`
            Dialog.confirm({
              title: '下载图片',
              message: tips
            })
              .then(() => {
                let toast = Toast.loading({
                  duration: 0,
                  forbidClick: true,
                  message: '下载中...'
                })
                // 将内容上传到oss
                uploadOSS(fileName, currentFile.result?.raw, BUCKET)
                  .then(res => {
                    toast.clear()
                    currentFile.result.src = res.url
                    this.openDownloadWindow(currentFile)

                    duce(needCount)
                      .catch(() => {})
                      .finally(() => {
                        this.updateAllCert()
                      })
                  })
                  .catch(() => {
                    toast.clear()
                  })
              })
              .catch(() => {})
          } else {
            let toast = Toast.loading({
              duration: 0,
              forbidClick: true,
              message: '下载中...'
            })
            let res = await uploadOSS(fileName, currentFile.result?.raw, BUCKET)
            currentFile.result.src = res.url
            toast.clear()
            this.openDownloadWindow(currentFile)
          }
        } else {
          this.openDownloadWindow(currentFile)
        }
      }
    },
    handleClose() {
      this.visible = false
      this.currentFile = {}
      this.direction = 'horizontal'
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
        })
          .then(() => {
            next()
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
