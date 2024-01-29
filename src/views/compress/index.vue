<template>
  <div class="compressPage">
    <div class="cardList">
      <van-swipe-cell v-for="(file, idx) in fileList" :key="file.id">
        <div :class="{ cardItem: true, checked: file.checked }" @click="onSelectCard(idx)">
          <div class="previewImg" @click.stop="handlePreview(file)">
            <van-image
              fit="contain"
              :src="isExecuted && !isLoading && file.status ? file.result.src : file.init.content"
            />
            <div class="preview" v-if="isExecuted && !isLoading && file.status"></div>
          </div>
          <div class="errorBox" v-if="isExecuted && !isLoading && !file.status">处理失败</div>
          <div v-else class="infoBox">
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
    <div class="panelContainer">
      <div class="panel" v-if="!isExecuted || isLoading">
        <div class="panelItem">
          <span class="title">压缩比例：</span>
          <div class="panelItemRight">
            <van-slider
              v-model="options.quality"
              @change="onQualityChange"
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
        <div class="panelItem margin">
          <span class="title">指定大小：</span>
          <div class="panelItemRight">
            <div class="inputBox">
              <input type="number" v-model="options.size" />
              <span class="unit">KB</span>
            </div>
          </div>
        </div>
        <div class="panelItem">
          <span class="title"></span>
          <div class="otherSize">
            <div class="size" @click="onChangeSize(size)" v-for="size in otherSizes" :key="size">{{ size }}</div>
          </div>
        </div>
      </div>

      <div class="btnGroup" v-if="isExecuted && !isLoading">
        <button class="default btn" @click="goBack">返回</button>
        <button class="btn primary" @click="onClickDownload">下载选中的图片</button>
      </div>
      <div class="btnGroup" v-else>
        <Uploader :on-success="onUploadSuccess">
          <button class="default btn">重新上传</button>
        </Uploader>
        <button class="btn primary" @click="onStart">开始压缩</button>
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview, Toast } from 'vant'
import { compressImage } from '@/core'
import getImageFileInfo from '@/utils/getImageFileInfo'
import Uploader from '@/components/Uploader/index.vue'
import {saveAs} from 'file-saver'
export default {
  name: 'Compress',
  components: {
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
      isLoading: false // 图片是否处理中
    }
  },
  methods: {
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
    onQualityChange(value) {
      this.options.quality = value
    },
    // 监听用户尺寸发生变化
    onChangeSize(value) {
      this.options.size = value
    },
    // 压缩前校验
    checkCondition() {
      // TODO: 校验用户

      let { size, quality } = this.options
      if (size === 0) {
        Toast('指定大小数值需大于0')
        return false
      }
      if (size && size <= 0) {
        Toast('指定大小数值需大于0')
        return false
      }
      let flag = Number.isNaN(Number(size))
      if (flag) {
        Toast('请输入数字')
        return false
      }

      return true
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
    // 开始压缩
    onStart() {
      let checkResult = this.checkCondition()
      if (!checkResult) {
        return
      }
      this.isLoading = true // 开启loading
      this.isExecuted = true
      let { size, quality } = this.options
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
              let options = size ? { quality: quality / 100, size: size * 1024 } : { quality: quality / 100 }
              let resultBlob = await compressImage(item.raw, options)
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

    // 下载选中的图片
    onClickDownload() {
      let downloadList = this.fileList.filter((item,idx) => {
        // 标记一下是否被下载过
        if (item.checked) {
          this.fileList.splice(idx, 1, {...item, download: true})
        }
        return item.checked
      })
      downloadList.forEach(item => {
        saveAs(item.result.raw, item.name)
      })
    },
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
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
