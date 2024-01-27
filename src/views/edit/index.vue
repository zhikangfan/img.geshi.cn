<template>
  <div class="editPage">
    <div class="imgBox"></div>
    <div class="panelContainer">
      <div class="imgInfo">
        <div class="infoItem">
          <span class="key">格式：</span>
          <span class="value">jpg</span>
        </div>
        <div class="infoItem">
          <span class="key">内存：</span>
          <span class="value">113kb</span>
        </div>
        <div class="infoItem">
          <span class="key">尺寸：</span>
          <span class="value">宽=4999px 高=4999px</span>
        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">
          自由调整 <span class="red">*</span><span class="tips">填写宽与高或直接在图片上调整</span>
        </div>
        <div class="panelItemContent">
          <div class="changeSizeBox">
            <div class="changeSizeBoxLeft">
              <div class="inputBox">
                <span>宽</span>
                <input type="text">
                <span>px</span>
              </div>
              <div class="inputBox">
                <span>高</span>
                <input type="text">
                <span>px</span>
              </div>
            </div>
            <button class="btn">确认</button>
          </div>
        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">自定义尺寸参数调整</div>
        <div class="panelItemContent">
          <div class="sizeLine">
            <div class="sizeItem checked">
              <span class="txt">自定义</span>
              <span class="value">任意尺寸</span>
            </div>
            <div class="sizeItem">
              <span class="txt">一寸照</span>
              <span class="value">195*598</span>
            </div>
            <div class="sizeItem">
              <span class="txt">大一寸照</span>
              <span class="value">390*567</span>
            </div>
          </div>
          <div class="sizeLine">
            <div class="sizeItem">
              <span class="txt">自定义</span>
              <span class="value">任意尺寸</span>
            </div>
            <div class="sizeItem">
              <span class="txt">一寸照</span>
              <span class="value">195*598</span>
            </div>
            <div class="sizeItem">
              <span class="txt">大一寸照</span>
              <span class="value">390*567</span>
            </div>
          </div>
          <div class="sizeLine">
            <div class="sizeItem">
              <span class="txt">大一寸照</span>
              <span class="value">390*567</span>
            </div>
            <div class="sizeItem">
              <span class="txt">自定义</span>
              <span class="value">任意尺寸</span>
            </div>
            <div class="sizeItem" @click="handleMore">
              <span class="txt">更多<span class="moreIcon"></span></span>
              <span class="value">热门尺寸</span>
            </div>
          </div>

        </div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">压缩至</div>
        <div class="panelItemContent"></div>
      </div>
      <div class="panelItem">
        <div class="panelTitleBox">导出格式为</div>
        <div class="panelItemContent">
          <div class="radioLine">
            <div class="radioItem">
              <span class="radio checked"></span>
              <span class="title">JPG</span>
            </div>
            <div class="radioItem">
              <span class="radio"></span>
              <span class="title">JPEG</span>
            </div>
            <div class="radioItem">
              <span class="radio"></span>
              <span class="title">PNG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnGroup">
      <button class="default btn">重新上传</button>
      <button class="btn primary">导出</button>
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
          <div class="checkSizeBox">
            <div class="title">常用</div>
            <div class="checkSizeContent">
              <div class="checkSizeLine">
                <div class="checkSizeItem checked">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
              </div>
              <div class="checkSizeLine">
                <div class="checkSizeItem checked">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
              </div>
            </div>
          </div>
          <div class="checkSizeBox">
            <div class="title">常用</div>
            <div class="checkSizeContent">
              <div class="checkSizeLine">
                <div class="checkSizeItem checked">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
              </div>
              <div class="checkSizeLine">
                <div class="checkSizeItem checked">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
              </div>
            </div>
          </div>
          <div class="checkSizeBox">
            <div class="title">常用</div>
            <div class="checkSizeContent">
              <div class="checkSizeLine">
                <div class="checkSizeItem checked">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
              </div>
              <div class="checkSizeLine">
                <div class="checkSizeItem checked">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
                </div>
                <div class="checkSizeItem">
                  <div class="txt">一寸照</div>
                  <div class="size">296*413</div>
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
export default {
  name: 'Edit',
  components: {},
  props: {},
  data() {
    return {
      isShowCheckSizeModal: true
    }
  },
  methods: {
    onConfirm() {
      this.isShowCheckSizeModal = false
    },
    onCancel() {
      this.isShowCheckSizeModal = false
    },
    handleMore() {
      this.isShowCheckSizeModal = true
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
