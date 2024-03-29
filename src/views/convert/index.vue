<template>
  <div class="convertPage">
    <div class="convertPageContainer">
      <div class="cardList">
        <van-swipe-cell v-for="(file, idx) in fileList" :key="file.id">
          <div :class="{ cardItem: true }">
            <div class="previewImg">
              <van-image
                fit="contain"
                :src="file.init.content"
              />
              <div
                class="preview"
                v-if="isExecuted && !isLoading && file.status"
                @click.stop="handlePreview(file)"
              ></div>
            </div>
            <div class="errorBox" v-if="isExecuted && !isLoading && !file.status">处理失败</div>
            <div v-else class="infoBox">
              <div class="infoBoxLeft">
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
              <div class="infoBoxRight">
                <div class="infoBoxRight" v-if="isExecuted && !isLoading && file.status">
                  <div class="downloadBtn" @click="handleDownload(file)"></div>
                </div>
              </div>
            </div>
<!--            <div class="checkBox" v-if="isExecuted && !isLoading && file.status"></div>-->
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
        <button class="default btn" @click="goBack">上一步</button>
        <button class="btn primary" @click="jumpTo('/')">返回首页</button>
      </div>
      <div v-else class="btnGroup">
        <Uploader :on-success="onUploadSuccess" :accept="'image/*'">
          <button class="default btn">重新上传</button>
        </Uploader>
        <button class="btn primary" @click="onStart">开始转换</button>
      </div>
    </div>
    <DownloadImage v-model="visible" :src="currentFile?.src" :direction="direction" :width="currentFile?.width" :height="currentFile?.height" :size="currentFile?.raw?.size" :format="options.to" @close="handleClose" />
  </div>
</template>
<script>
import { Dialog, ImagePreview, Toast } from 'vant'
import Uploader from '@/components/Uploader/index.vue'
import { imageFormatConvert } from '@/core'
import getImageFileInfo from '@/utils/getImageFileInfo'
import { saveAs } from 'file-saver'
import { VIP_LEVEL } from '@/store/user.store'
import {duce, userVisitorLogin} from '@/api'
import { mapActions, mapGetters, mapState } from 'vuex'
import { BUCKET } from '@/config'
import { uploadOSS } from '@/utils/uploadOSS'
import DownloadImage from '@/components/DownloadImage/index.vue'
import {v4 as uuidV4} from 'uuid'
import {setToken} from "@/utils/token";
import {uploadLoginData} from "@/utils/baiduOCPC";
export default {
  name: 'Convert',
  components: { DownloadImage, Uploader },
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
      visible: false,
      direction: 'horizontal',
      currentFile: {}, // 当前要下载的图片
    }
  },
  computed: {
    ...mapState('userStore', {
      allCert: state => state.allCert
    }),
    ...mapGetters('userStore', {
      isLogin: 'isLogin'
    })
  },
  methods: {
    ...mapActions('userStore', ['updateAllCert', 'setUserInfo']),
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
    /**
     * 游客登录
     * @returns {Promise<void>}
     */
    async onClickVisitorLogin() {
      let res = await userVisitorLogin()
      if (res.data.status === 0) {
        setToken(res.data.data)
        await this.setUserInfo(res.data.data)
        await this.updateAllCert()
        uploadLoginData().catch(e => {})
        // Toast('登录成功！')
      } else {
        // Toast('登录失败！')
        this.handleLogin()
      }
    },
    // 检查用户
    async checkUser(needCount = 0) {
      // 判断用户是否登录
      let isLogin = this.isLogin
      if (!isLogin) {
        await this.onClickVisitorLogin()
        if (!this.isLogin) {
          return false
        }
      }
      let { vip, has_image_count } = this.allCert
      // 判断用户等级
      if (vip === VIP_LEVEL.NON_VIP) {
        // 没有VIP
        // Dialog.confirm({
        //   title: '温馨提示',
        //   message: '请开通VIP后下载！'
        // })
        //         .then(() => {
        //           this.isBuyVip = true
        //           this.$router.push({
        //             name: 'purchase'
        //           })
        //         })
        //         .catch(() => {
        //           // TODO: 点击取消
        //         })
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
          // Dialog.confirm({
          //   title: '温馨提示',
          //   message: '剩余张数不足！',
          //   confirmButtonText: '去购买'
          // })
          //         .then(() => {
          //           this.isBuyVip = true
          //           this.$router.push({
          //             name: 'purchase'
          //           })
          //         })
          //         .catch(() => {
          //           // TODO: 点击取消
          //         })
          this.isBuyVip = true
          await this.$router.push({
            name: 'purchase'
          })
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
    // 下载选中的图片
    async onClickDownload() {
      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '下载中...'
      })
      let downloadList = this.fileList.filter((item, idx) => {
        // 标记一下是否被下载过

        return item.checked
      })
      if (downloadList.length === 0) {
        Toast('未选择要下载的图片！')
        return
      }
      let allowAction = await this.checkUser()
      if (allowAction) {
        downloadList.forEach(item => {
          // FIXME: 怎么区别JPG、 JPEG ？？

          // 标记一下是否被下载过
          this.fileList.forEach((file, idx) => {
            if (item.id === file.id) {
              file['download'] = true
              this.fileList.splice(idx, 1, file)
            }
          })
          saveAs(item.result.raw, `${item.filename}.${this.options.to}`)
        })
        await this.updateAllCert()
      }
      toast.clear()
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
              let result = { ...item, result: resultInfo, status: true, checked: true }
              this.fileList.splice(idx, 1, result)
              resolve(result)
            } catch (e) {
              console.log(e)
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
      if (!this.isExecuted) {
        Toast('未执行修改')
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
          let fileName = `${uuidV4()}_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}_${currentFile.filename}.${this.options.to}`

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
