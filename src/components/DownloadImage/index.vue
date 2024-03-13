<template>
  <van-popup
      v-model="visible"
      position="bottom"
      :round="true"
      :safe-area-inset-top="true"
      :close-on-click-overlay="false"
      :close-on-popstate="true"
  >
    <div class="downloadImagePop">
      <span class="close" @click="handleClickClose"></span>
      <div class="imgBox">
        <img v-if="src" :src="src" alt="" :class="{'img': true, 'horizontal': direction === 'horizontal'}">
      </div>
      <div class="info">
        <div class="infoItem">
          <span class="title">格式：</span>
          <span class="value">{{format}}</span>
        </div>
        <div class="infoItem">
          <span class="title">内存：</span>
          <span class="value">{{formatFileSize(size)}}</span>
        </div>
        <div class="infoItem">
          <span class="title">尺寸：</span>
          <span class="value">宽={{width}}px 高={{height}}px</span>
        </div>
      </div>
      <div class="tips">请长按图片后选择保存图片</div>
    </div>
  </van-popup>
</template>
<script>
import {formatFileSize} from "../../utils";

export default {
  name: 'DownloadImage',
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    visible: {
      type: Boolean
    },
    src: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'vertical'
    },
    format: {
      type: String
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  methods: {
    formatFileSize,
    handleClickClose() {
      this.$emit('close')
    },
  }

}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>