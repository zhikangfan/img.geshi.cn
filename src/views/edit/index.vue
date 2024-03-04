<template>
  <div class="editPage">
    <div class="imgBox" ref="imgBoxRef">
      <img :src="file.src" alt="" ref="cropperRef" class="img" />
    </div>
    <div class="panelContainer">
      <div class="imgInfo">
        <div class="infoItem">
          <span class="key">格式：</span>
          <span class="value">{{ file.suffix }}</span>
        </div>
        <div class="infoItem">
          <span class="key">内存：</span>
          <span class="value">{{ file.formatSize }}</span>
        </div>
        <div class="infoItem">
          <span class="key">尺寸：</span>
          <span class="value">宽={{ file.width }}px 高={{ file.height }}px</span>
        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">
          自由调整 <span class="red">*</span><span class="tips">填写宽与高或直接在图片上调整</span>
        </div>
        <div class="panelItemContent">
          <div class="changeSizeBox">
            <div class="changeSizeBoxLeft">
              <div :class="{ inputBox: true }">
                <span>宽</span>
                <input type="number" :disabled="!isShowConfirmBtn" v-model="options.width" />
                <span>px</span>
              </div>
              <div :class="{ inputBox: true }">
                <span>高</span>
                <input type="number" :disabled="!isShowConfirmBtn" v-model="options.height" />
                <span>px</span>
              </div>
            </div>
            <button class="btn" v-if="isShowConfirmBtn" @click="onClickConfirmBtn">确认</button>
          </div>
        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">自定义尺寸参数调整</div>
        <div class="panelItemContent">
          <div class="sizeLine" v-for="(group, idx) in customSizes" :key="idx">
            <div
                    :class="{ sizeItem: true, checked: selectSizeId === size.id }"
                    v-for="(size, index) in group"
                    :key="index"
                    @click="onSelectSize(size.id, size.width, size.height)"
            >
              <span class="txt">{{ size.title }}</span>
              <span class="value"
              >{{ size.id === 'custom' || size.id === 'more' ? size.subTitle : `${size.width}*${size.height}` }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">压缩至</div>
        <div class="panelItemContent">
          <div class="panelItemContentRight">
            <span class="title">最小压缩</span>
            <div class="sliderBox">
              <van-slider
                      v-model="options.compressSize"
                      @change="onCompressSizeChange"
                      :min="1"
                      :max="file.raw.size || 0"
                      bar-height="4px"
                      active-color="#165DFF"
              >
                <template #button>
                  <div class="custom-button"></div>
                </template>
              </van-slider>
              <span class="value">约{{ formatFileSize(options.compressSize) }}</span>
            </div>
            <span class="txt">{{ file.formatSize }}</span>
          </div>
        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">导出格式为</div>
        <div class="panelItemContent">
          <div class="radioLine">
            <div
                    class="radioItem"
                    v-for="format in formatList"
                    :key="format.value"
                    @click="onSelectFormat(format.value)"
            >
              <span :class="{ radio: true, checked: format.value === options.format }"></span>
              <span class="title">{{ format.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnGroup">
      <Uploader :on-success="onUploadSuccess">
        <button class="default btn">重新上传</button>
      </Uploader>
      <button class="btn primary" @click="handleDownload">导出</button>
    </div>
    <van-popup
            v-model="isShowCheckSizeModal"
            :round="true"
            :close-on-click-overlay="true"
            :close-on-popstate="true"
            :safe-area-inset-bottom="true"
    >
      <div class="checkSizeModal">
        <div class="checkSizeModalContainer">
          <div class="checkSizeBox" v-for="(sizeCategory, idx) in sizeList" :key="idx">
            <div class="title">{{ sizeCategory.category }}</div>
            <div class="checkSizeContent">
              <div class="checkSizeLine" v-for="(sizeGroup, id) in sizeCategory.sizes" :key="id">
                <div
                        :class="{ checkSizeItem: true, checked: selectModalSizeId === size.id }"
                        v-for="(size, index) in sizeGroup"
                        :key="size.with + '_' + index"
                        @click="onSelectModalSize(size.id, size.width, size.height)"
                >
                  <div class="txt">{{ size.title }}</div>
                  <div class="size">{{ size.width }}*{{ size.height }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="checkSizeModalBtnGroup">
          <button class="btn" @click="onCancel">取消</button>
          <button class="btn primary" @click="onConfirm">确认</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { editSizeList } from '@/config'
import { formatFileSize } from '../../utils'
import Cropper from 'cropperjs'
import { saveAs } from 'file-saver'
import Uploader from '@/components/Uploader/index.vue'
import { Dialog, Toast } from 'vant'
import { VIP_LEVEL } from '@/store/user.store'
import { compressImage } from '@/core'

export default {
  name: 'Edit',
  components: { Uploader },
  props: {},
  data() {
    return {
      formatList: [
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
      sizeList: editSizeList,
      isShowCheckSizeModal: false,
      selectSizeId: '', // 选中的当前尺寸
      selectModalSizeId: '', // 选中的弹窗里的ID
      selectModalSize: {
        // 选中的弹窗里的尺寸
        width: 0,
        height: 0
      },
      options: {
        compressSize: 0,
        format: 'jpg',
        width: 0,
        height: 0
      },
      file: {}, // 待处理文件
      isShowConfirmBtn: false // 是否显示确定
    }
  },
  computed: {
    customSizes() {
      let list = []
      this.sizeList.forEach(category => {
        category.sizes.forEach(group => {
          let filterList = group.filter(item => item.recommend)
          list = list.concat(filterList)
        })
      })

      let middleArray = [
        {
          id: 'custom',
          title: '自定义',
          width: 0,
          height: 0,
          subTitle: '任意尺寸'
        },
        ...list,
        {
          id: 'more',
          title: '更多',
          width: 0,
          height: 0,
          subTitle: '热门尺寸'
        }
      ]
      return this.splitIntoChunks(middleArray, 3)
    }
  },
  methods: {
    formatFileSize,
    splitIntoChunks(arr, chunkSize) {
      const result = []
      for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize))
      }
      return result
    },
    // 确认
    onConfirm() {
      this.isShowCheckSizeModal = false
      this.selectSizeId = this.selectModalSizeId
      this.options.width = this.selectModalSize.width
      this.options.height = this.selectModalSize.height
      this.cropper.setAspectRatio(this.options.width / this.options.height)
    },
    // 取消选择
    onCancel() {
      this.isShowCheckSizeModal = false
      this.selectModalSizeId = this.selectSizeId
      this.selectModalSize = {
        width: 0,
        height: 0
      }
    },
    onCompressSizeChange() {
    },
    // 选择格式
    onSelectFormat(format) {
      this.options.format = format
    },
    // 选择尺寸
    onSelectSize(id, width, height) {
      if (id === 'more') { // 点击更多
        this.isShowCheckSizeModal = true
      } else {
        this.selectSizeId = id
        this.selectModalSizeId = id
        this.isShowConfirmBtn = id === 'custom' // 是否展示确认按钮，只有选择了自定义才展示
        if (id !== 'custom') {
          this.options.width = width
          this.options.height = height
        }
        // const aspectRatio = id === 'custom' ? Number(undefined) : width / height
        // this.cropper?.setAspectRatio(aspectRatio)
        let that = this
        let cropFunc = () => {
        }
        if (id === 'custom') {
          cropFunc = (e) => {
            that.options.width = Math.floor(e.detail.width)
            that.options.height = Math.floor(e.detail.height)
          }
        }
        this.cropper = this.createCropper({
          // cropBoxResizable: id === 'custom', // 允许改变尺寸
          aspectRatio: id === 'custom' ? Number(undefined) : width / height,
          // zoomable: id === 'custom', // 禁止用户缩放
          // zoomOnTouch: id === 'custom',
          // zoomOnWheel: id === 'custom',
          crop: cropFunc
        })


      }

    },
    // 选择弹窗里的尺寸
    onSelectModalSize(id, width, height) {
      this.selectModalSizeId = id
      this.selectModalSize = {
        width,
        height
      }
    },
    onLeave(e) {
      e.preventDefault()
      return '图片还未处理或下载，是否要离开？'
    },
    // 重新上传
    onUploadSuccess(fileList) {
      let file = fileList[0]
      this.reset(file)
      // this.cropper?.destroy()
      let that = this;
      this.$nextTick(() => {
        this.cropper = this.createCropper({
          crop(e) {
            that.options.width = Math.floor(e.detail.width)
            that.options.height = Math.floor(e.detail.height)
          }
        })
      })

    },
    // 点击确认， 设置宽度
    onClickConfirmBtn() {
      if (this.options.width <= 0) {
        Toast('宽度必须大于等于1！')
        return
      }
      if (this.options.height <= 0) {
        Toast('高度必须大于等于1！')
        return
      }
      this.cropper = this.createCropper({
        // cropBoxResizable: false, // 允许改变尺寸
        aspectRatio: this.options.width / this.options.height,
        // zoomable: false, // 禁止用户缩放
        // zoomOnTouch: false,
        // zoomOnWheel: false,
        crop: () => {
        }
      })
      this.isShowConfirmBtn = false
    },
    handleLogin() {
      this.$loginModal({
        onHandleClose: () => {
          console.log('close')
        }
      })
    },
    // 检查用户
    checkUser() {
      // 判断用户是否登录
      let isLogin = this.$store.getters['userStore/isLogin']
      if (!isLogin) {
        this.handleLogin()
        return false
      }
      let { vip, has_image_count } = this.$store.state.userStore.allCert
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
        // 判断当前图片是否下载过
        let needDownloadList = this.file.download ? 0 : 1
        return needDownloadList <= has_image_count
      }
      if (vip === VIP_LEVEL.TIME_VIP || vip === VIP_LEVEL.PERMANENT_VIP || vip === VIP_LEVEL.THREE_DAY_VIP) { // 当用户vip类型为时间vip 永久vip 3天vip的时候
        return true
      }
    },
    handleDownload() {
      if (this.cropper) {
        let allowAction = this.checkUser()
        if (allowAction) {
          const toast = Toast({
            type: 'loading',
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '正在导出...'
          })
          this.cropper.getCroppedCanvas().toBlob(async blob => {
            try {
              let blobData = await this.createImg({
                src: URL.createObjectURL(blob),
                width: this.options.width,
                height: this.options.height,
                dx: 0,
                dy: 0,
                type: this.options.format === 'png' ? 'image/png' : 'image/jpeg'
              })
              let finalBlob = blobData
              if (this.options.compressSize !== this.file.raw.size) {
                finalBlob = await compressImage(blobData, {size: this.options.compressSize})
              }
              saveAs(finalBlob, `${this.file.filename}.${this.options.format}`)

            } catch (e) {
              console.log(e)
              Toast.fail({
                message: '导出失败!',
                duration: 1500
              })
            } finally {
              toast?.clear()
            }

          })
        }

      }
    },
    createImg(options) {
      return new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = options.width
        canvas.height = options.height

        let img = new Image()
        img.src = options.src
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          ctx.drawImage(img, options.dx, options.dy, options.width, options.height)
          canvas.toBlob((blob) => {
            resolve(blob)
          }, options.type || 'image/jpeg', 1)
        }
        img.onerror = () => {
          reject()
        }
      })
    },
    createCropper(options = {}) {
      this.cropper?.destroy()
      if (this.$refs.cropperRef) {
        return new Cropper(this.$refs.cropperRef, {
          viewMode: 1,
          dragMode: 'move',
          center: false,
          zoomable: true, // 禁止用户缩放
          zoomOnTouch: true,
          zoomOnWheel: true,
          cropBoxResizable: true, // 允许改变尺寸
          autoCropArea: 1,
          minCropBoxWidth: 1,
          minCropBoxHeight: 1,
          crop(e) {
          },
          ...options
        })
      }
    },
    reset(file) {
      this.isShowCheckSizeModal = false
      this.selectSizeId = '' // 选中的当前尺寸
      this.selectModalSizeId = '' // 选中的弹窗里的ID
      this.selectModalSize = {
        // 选中的弹窗里的尺寸
        width: 0,
        height: 0
      }
      this.options = {
        compressSize: 0,
        format: 'jpg',
        width: 0,
        height: 0
      }
      this.isShowConfirmBtn = false // 是否显示确定
      this.init(file)
    },
    init(file) {
      this.file = file
      this.options.width = this.file.width
      this.options.height = this.file.height
      this.options.compressSize = this.file.raw.size
      this.customSizes.forEach(group => {
        group.forEach(item => {
          if (item.id === 'custom') {
            let { id, width, height } = item
            this.onSelectSize(id, width, height)
          }
        })
      })
      let { value } = this.formatList.find(item => item.value === this.file.suffix)
      this.onSelectFormat(value)
    }
  },

  async created() {
    this.init(this.$route.params.fileList[0])
  },
  async mounted() {
    let that = this;
    this.cropper = this.createCropper({
      crop(e) {
        that.options.width = Math.floor(e.detail.width)
        that.options.height = Math.floor(e.detail.height)
      }
    })

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
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
