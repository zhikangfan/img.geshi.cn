<template>
  <van-uploader
    :multiple="multiple"
    :max-count="maxCount"
    :before-read="beforeRead"
    :after-read="afterRead"
    :max-size="maxSize"
    :accept="accept"
  >
    <slot></slot>
  </van-uploader>
</template>
<script>
import getImageFileInfo from '@/utils/getImageFileInfo'

export default {
  name: 'Uploader',
  components: {},
  props: {
    // accept: {
    //   type: Array,
    //   default: () => ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/bmp']
    // },
    accept: {
      type: String,
      default: '.jpg,.jpeg,.png,.bmp,.webp,image/jpeg,image/jpg,image/png,image/bmp,image/webp'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    maxSize: {
      type: Number,
      default: 100 * 1024 * 1024
    },
    maxCount: {
      type: Number,
      default: 12
    },
    onSuccess: Function
  },
  data() {
    return {}
  },
  methods: {
    checkFile(file) {
      // 判断用户文件类型 和 文件大小 和 TODO: 是否还可以处理图片
      // return compressConfig.accept.includes(file.type) && file.size < compressConfig.maxSize
      return true
    },
    beforeRead(file) {
      return new Promise((resolve, reject) => {
        let files = Array.isArray(file) ? file : [file]
        let flag = files.every(item => this.checkFile(item))
        if (flag) {
          resolve(files)
        } else {
          reject()
        }
      })
    },
    afterRead(files) {
      let getInfoTask = files.map(item => {
        return (async function () {
          let res = await getImageFileInfo(item.file)
          return {
            init: item,
            ...res
          }
        })()
      })
      Promise.all(getInfoTask).then(params => {
        typeof this.onSuccess === 'function' && this.onSuccess(params)
      })
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
@import url('index.less');
</style>
