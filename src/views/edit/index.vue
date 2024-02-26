<template>
  <div class="editPage">
    <div class="imgBox" ref="imgBoxRef">
      <img :src="file.src" alt="" ref="cropperRef" class="img"/>
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
                <input type="number" v-model="options.width" />
                <span>px</span>
              </div>
              <div :class="{ inputBox: true }">
                <span>高</span>
                <input type="number" v-model="options.height"/>
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
import {saveAs} from 'file-saver'
import Uploader from "@/components/Uploader/index.vue";
import {Toast} from "vant";
export default {
  name: 'Edit',
  components: {Uploader},
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
      isShowConfirmBtn: false, // 是否显示确定
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
    calculateScale(origin, target) {
      const originWidth = origin.width
      const originHeight = origin.height
      const targetWidth = target.width
      const targetHeight = target.height
      // 如果target的width和height都没有超过origin的width和height，则直接返回1
      if (targetWidth <= originWidth && targetHeight <= originHeight) {
        return 1
      }
      // 按照宽度
      if (originWidth / originHeight < targetWidth / targetHeight) {
        return originWidth / targetWidth
      } // 按照宽度缩放
      return originHeight / targetHeight
    },
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
    onCompressSizeChange() {},
    // 选择格式
    onSelectFormat(format) {
      this.options.format = format
    },
    // 选择尺寸
    onSelectSize(id, width, height) {
      if (id === 'custom') {
        // 点击自定义
        this.selectSizeId = id
        this.selectModalSizeId = id
        this.isShowConfirmBtn = true
        this.createCropper({
          cropBoxResizable: true,
          aspectRatio: width / height
        })
      } else if (id === 'more') {
        // 点击更多
        this.isShowCheckSizeModal = true
      } else {
        // 选择的尺寸
        this.selectSizeId = id
        this.selectModalSizeId = id
        this.isShowConfirmBtn = false
        this.options.width = width
        this.options.height = height


        // this.createCropper({
        //   cropBoxResizable: false,
        //   aspectRatio: width / height
        // })



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
    onUploadSuccess() {
      Toast('nonono!')
    },
    // 点击确认， 设置宽度
    onClickConfirmBtn() {


      // this.isShowConfirmBtn = false
      // if (this.options.width > this.file.width || this.options.height > this.file.height) {
      //   this.createCropper({
      //     aspectRatio: this.options.width / this.options.height
      //   })
      // } else {
      //   this.createCropper({
      //     cropBoxResizable: false,
      //     data: {
      //       width: this.options.width,
      //       height: this.options.height
      //     }
      //   })
      // }

    },
    handleDownload() {
      if (this.cropper) {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          // saveAs(blob, )
          let type = 'image/jpeg'
          if (this.options.format === 'jpg') {
            type = 'image/jpg'
          } else if (this.options.format === 'png') {
            type = 'image/png'
          }
          saveAs(new Blob([blob], {type}),`${this.file.filename}.${this.options.format}`)
        })
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
          let src = canvas.toDataURL(options.type || 'image/jpeg', 1)
          resolve(src)
        }
        img.onerror = () => {
          reject()
        }
      })
    },
    createCropper(options={}) {
      if (this.cropper) {
        this.cropper.destroy()
      }
      let that = this;
      this.cropper =new Cropper(this.$refs.cropperRef, {
        viewMode: 1,
        dragMode: 'none',
        center: false,
        zoomable: false,
        cropBoxResizable: true,
        autoCropArea: 1,
        crop(e) {
          // console.log(e)
          that.options.width = Math.ceil(e.detail.width)
          that.options.height = Math.ceil(e.detail.height)
        },
        ...options
      })
    }
  },
  async created() {
    this.file = this.$route.params.fileList[0]

    this.sliderMaxValue = this.file.size
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
  },
  async mounted() {
    // let scale = this.calculateScale(
    //   {
    //     width: this.$refs.imgBoxRef.getBoundingClientRect().width,
    //     height: this.$refs.imgBoxRef.getBoundingClientRect().height
    //   },
    //   { width: this.file.width, height: this.file.height }
    // )
    // this.file.scaleImgSrc = await this.createImg({
    //   src: this.file.src,
    //   width: this.file.width * scale,
    //   height: this.file.height * scale,
    //   dy: 0,
    //   dx: 0
    // })
    // this.$forceUpdate()
    this.$nextTick(() => {
      let that = this;
      that.cropper = new Cropper(this.$refs.cropperRef, {
        viewMode: 1,
        dragMode: 'none',
        center: false,
        crop(e) {
          that.options.width = Math.ceil(e.detail.width)
          that.options.height = Math.ceil(e.detail.height)
        }
      })
    })

    // this.createCropper()

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
