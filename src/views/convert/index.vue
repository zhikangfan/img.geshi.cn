<template>
  <div class="convertPage">
    <div class="convertPageContainer">
      <div class="cardList">
        <div class="cardItem">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem checked">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem checked">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem checked">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
        <div class="cardItem checked">
          <div class="previewImg">
            <img src="" alt="" class="img" />
            <div class="preview"></div>
          </div>
          <div class="infoBox">
            <div class="infoItem">
              <span class="title">转换前：</span>
              <div class="infoValue">
                <span class="value">1235.jpg</span>
              </div>
            </div>
            <div class="infoItem">
              <span class="title">转换后：</span>
              <div class="infoValue">
                <span class="value">1234.png</span>
              </div>
            </div>
          </div>
          <div class="checkBox"></div>
        </div>
      </div>
    </div>
    <div class="panelContainer">
      <div class="panel">
        <div class="panelTitle">设置分辨率参数（单位dpi）</div>
        <div class="radioList">
          <div class="radioLine">
            <div class="radioItem">
              <span class="radio"></span>
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
          <div class="radioLine">
            <div class="radioItem">
              <span class="radio checked"></span>
              <span class="title">BMP</span>
            </div>
            <div class="radioItem">
              <span class="radio"></span>
              <span class="title">WEBP</span>
            </div>
            <div class="radioItem">
              <span class="radio"></span>
              <span class="title">ICO</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <button class="default btn">重新上传</button>
        <button class="btn primary">开始压缩</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Convert',
  components: {},
  props: {},
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
