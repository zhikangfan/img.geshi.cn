import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'

Vue.use(VueRouter)
const BASE_KD = {
  keywords: '图片压缩,压缩图片,图片压缩工具,图片压缩软件',
  description:
    '轻秒格式工厂工具是一个在线图片压缩网站，支持JPG压缩、PNG压缩、GIF压缩、BMP压缩等在线压缩功能，并且能够选择压缩大小的范围。支持各类图片格式互转。'
}
const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      tdk: {
        title: '轻秒格式工厂_图片压缩_在线压缩图片大小_轻秒图片转换器在线',
        ...BASE_KD
      }
    },
    component: Home
  },
  {
    path: '/compress',
    name: 'compress',
    component: () => import('@/views/compress/index.vue'),
    meta: {
      tdk: {
        title: '轻秒格式工厂_图片压缩_在线压缩图片大小_轻秒图片转换器在线',
        ...BASE_KD
      }
    }
  },
  {
    path: '/edit',
    name: 'edit',
    meta: {
      tdk: {
        title: '轻秒格式工厂_图片压缩_在线压缩图片大小_轻秒图片转换器在线',
        ...BASE_KD
      }
    },
    component: () => import('@/views/edit/index.vue'),
  },
  {
    path: '/convert',
    name: 'convert',
    meta: {
      tdk: {
        title: '轻秒格式工厂_图片压缩_在线压缩图片大小_轻秒图片转换器在线',
        ...BASE_KD
      }
    },
    component: () => import('@/views/convert/index.vue'),
  },
  {
    path: '/redeem-code',
    name: 'redeem-code',
    meta: {
      tdk: {
        title: '轻秒格式工厂_图片压缩_在线压缩图片大小_轻秒图片转换器在线',
        ...BASE_KD
      }
    },
    component: () => import('@/views/redeemCode/index.vue'),
  },
  {
    path: '/purchase',
    name: 'purchase',
    meta: {
      tdk: {
        title: '轻秒格式工厂_图片压缩_在线压缩图片大小_轻秒图片转换器在线',
        ...BASE_KD
      }
    },
    component: () => import('@/views/purchase/index.vue'),
  },
  {
    path: '*',
    name: 'NotFound',
    redirect: () => '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
      behavior: 'smooth'
    }
  }
})

export default router
