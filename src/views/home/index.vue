<template>
  <div class="homePage">
    <div class="funcArea">
      <div class="funcList">
        <div :class="{ funcItem: true, checked: selectFunc === 'edit' }" @click="onSelectFunc('edit')">
          <span class="icon size_icon"></span>
          <span class="title">修改尺寸</span>
        </div>
        <div :class="{ funcItem: true, checked: selectFunc === 'compress' }" @click="onSelectFunc('compress')">
          <span class="icon compress_icon"></span>
          <span class="title">图片压缩</span>
        </div>
        <div
          :class="{ funcItem: true, checked: selectFunc === 'convert' }"
          @click="onSelectFunc('convert')"
        >
          <span class="icon format_icon"></span>
          <span class="title">格式转换</span>
        </div>
        <div :class="{ funcItem: true, checked: selectFunc === 'edit-dpi' }" @click="onSelectFunc('edit-dpi')">
          <span class="icon dpi_icon"></span>
          <span class="title">修改DPI</span>
        </div>
      </div>
      <Uploader :on-success="onUploadSuccess" class="uploader" :multiple="isAllowMultiple" :accept="accept">
        <div class="uploadContainer">
          <span class="icon"></span>
          <div class="tips">{{ uploadTips }}</div>
        </div>
      </Uploader>
    </div>
    <div class="featureArea">
      <div class="areaTitle">我们的优势</div>
      <div class="featureList">
        <div class="featureItem">
          <div class="featureItemTop">
            <span class="icon icon1"></span>
            <span class="title">实时处理</span>
          </div>
          <div class="featureItemBottom">在线实时处理，无需等待或排队，方便快捷；</div>
        </div>
        <div class="featureItem">
          <div class="featureItemTop">
            <span class="icon icon2"></span>
            <span class="title">隐私安全</span>
          </div>
          <div class="featureItemBottom">所有处理均在手机本地完成，您的照片不会被泄漏；</div>
        </div>
        <div class="featureItem">
          <div class="featureItemTop">
            <span class="icon icon3"></span>
            <span class="title">功能丰富</span>
          </div>
          <div class="featureItemBottom">web端提供批量图片压缩、格式转换、PDF转换等功能；</div>
        </div>
        <div class="featureItem">
          <div class="featureItemTop">
            <span class="icon icon4"></span>
            <span class="title">多端通用</span>
          </div>
          <div class="featureItemBottom">无需安装，移动端与网页权益互通，PC端支持更多功能；</div>
        </div>
        <div class="featureItem">
          <div class="featureItemTop">
            <span class="icon icon5"></span>
            <span class="title">资质实力</span>
          </div>
          <div class="featureItemBottom">
            <p>网址：img.geshi.cn &nbsp;&nbsp;&nbsp; 软著登记号：2023SR1075944</p>
            <p><a href="https://res.yunkun.cn/pdf_geshicn/ykyyzz.png" target="_blank" class="link">查看营业执照</a></p>
          </div>
        </div>
      </div>
    </div>
    <MyTabBar />
  </div>
</template>
<script>
import MyTabBar from '@/components/TabBar/index.vue'
import Uploader from '@/components/Uploader/index.vue'

export default {
  name: 'Home',
  components: { Uploader, MyTabBar },
  props: {},
  data() {
    return {
      // config: [
      //   {
      //     function: 'compress',
      //     uploadConfig: {
      //       tips: '证件照压缩、保持清晰度、压缩指定大小',
      //       accept: '.jpg,.jpeg,.png,.bmp,.webp,image/jpeg,image/jpg,image/png,image/bmp,image/webp'
      //     }
      //   },
      //   {
      //     function: 'convert',
      //     uploadConfig: {
      //       tips: '批量转换图片格式为JPG、PNG、WEBP等',
      //       accept: '.jpg,.jpeg,.png,.bmp,.webp,.heic,.tiff,image/jpeg,image/jpg,image/png,image/bmp,image/webp,image/tiff,image/heic'
      //     }
      //   },
      //   {
      //     function: 'edit',
      //     uploadConfig: {
      //       tips: '同时处理证件照尺寸、格式、指定大小',
      //       accept: '.jpg,.jpeg,.png,.bmp,image/jpeg,image/jpg,image/png,image/bmp'
      //     }
      //   },
      //   {
      //     function: 'edit-dpi',
      //     uploadConfig: {
      //       tips: '批量处理图片分辨率DPI',
      //       accept: '.jpg,.jpeg,.png,image/jpeg,image/jpg,image/png'
      //     }
      //   }
      // ],
      config: [
        {
          function: 'compress',
          uploadConfig: {
            tips: '证件照压缩、保持清晰度、压缩指定大小',
            accept: 'image/*'
          }
        },
        {
          function: 'convert',
          uploadConfig: {
            tips: '批量转换图片格式为JPG、PNG、WEBP等',
            accept: 'image/*'
          }
        },
        {
          function: 'edit',
          uploadConfig: {
            tips: '同时处理证件照尺寸、格式、指定大小',
            accept: 'image/*'
          }
        },
        {
          function: 'edit-dpi',
          uploadConfig: {
            tips: '批量处理图片分辨率DPI',
            accept: 'image/*'
          }
        }
      ],
      isAllowMultiple: true, //是否允许多张上传
      selectFunc: '', // 当前选中的方法
      uploadTips: '',
      accept: 'image/*'
    }
  },
  methods: {
    onUploadSuccess(params) {
      this.$router.push({
        name: this.selectFunc,
        params: {
          fileList: [...params]
        }
      })
    },
    onSelectFunc(func) {
      this.selectFunc = func
      this.isAllowMultiple = !(this.selectFunc === 'edit')

      let {
        uploadConfig: { tips,accept }
      } = this.config.find(item => item.function === func)
      this.uploadTips = tips
      this.accept = accept
    }
  },
  created() {
    this.onSelectFunc('edit')
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
