const { defineConfig } = require('@vue/cli-service')
const postcssPxToViewPort = require('postcss-px-to-viewport')
const { resolve } = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')['BundleAnalyzerPlugin']

const config = {
  publicPath: '/m',
  transpileDependencies: true,
  lintOnSave: true,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '图片压缩_在线压缩图片大小_轻秒图片转换器在线_轻秒格式工厂'
      return args
    })
  },
  configureWebpack: {
    plugins: []
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve(__dirname, './src/assets/less/theme.less')]
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            new postcssPxToViewPort({
              unitToConvert: 'px',
              viewportWidth: 375,
              unitPrecision: 5,
              propList: ['*'],
              viewportUnit: 'vmin',
              fontViewportUnit: 'vmin',
              minPixelValue: 1,
              mediaQuery: false,
              replace: true,
              exclude: [/node_modules/]
            })
          ]
        }
      }
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  // 只有在生产环境下才添加依赖分析插件
  config.configureWebpack.plugins.push(new BundleAnalyzerPlugin())
  config.configureWebpack.externals = {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'ali-oss': 'OSS'
  }
}
module.exports = defineConfig(config)
