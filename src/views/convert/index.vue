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
              <div class="preview" @click.stop="handlePreview(file)"></div>
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
                    >.{{ file.result?.suffix }}</span
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
      <div class="panel">
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
import { ImagePreview, Toast } from 'vant'
import Uploader from '@/components/Uploader/index.vue'
import { imageFormatConvert } from '@/core'
import getImageFileInfo from '@/utils/getImageFileInfo'

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
      }
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
      // Dialog.confirm({
      //   message: '确定返回',
      //   confirmButtonText: '返回',
      //   overlay: false
      // })
      this.jumpTo('/')
    },
    // 下载选中的图片
    onClickDownload() {
      let downloadList = this.fileList.filter(item => item.checked)
    },
    onStart() {
      this.isLoading = true // 开启loading
      this.isExecuted = true
      let { to } = this.options
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
        console.log(this.fileList, '---')
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
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
