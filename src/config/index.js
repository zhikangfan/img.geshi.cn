/**
 * 购买页套餐配置
 * */
export const packageList = [
  {
    id: 1,
    title: '终身会员',
    price: '69',
    corner: '直降500元',
    desc: '原价¥569',
    txt: '终身免费使用',
    has_icon: true, // 是否有闪电符号
    has_del: true, // 是否有删除线
    unit: '终身',
    payTips: '直降500元 可开发票'
  },
  {
    id: 2,
    title: '年会员',
    price: '49',
    corner: '立减130',
    desc: '原价¥179',
    txt: '低至0.13元/天',
    has_icon: false,
    has_del: true,
    unit: '一年',
    payTips: '立减500元 可开发票'
  },
  {
    id: 3,
    title: '按张付费*10张',
    price: '19.9',
    corner: '',
    desc: '1.9/张',
    txt: '张数永久有效',
    has_icon: false,
    has_del: false,
    unit: '10张',
    payTips: '张数永久有效'
  },
  {
    id: 4,
    title: '按张付费*1张',
    price: '9.9',
    corner: '',
    desc: '9.9/张',
    txt: '张数永久有效',
    has_icon: false,
    has_del: false,
    unit: '张',
    payTips: '张数永久有效'
  }
]

/**
 * 压缩配置
 */
export const compressConfig = {
  accept: ['image/jpg', 'image/jpeg', 'image/webp', 'image/png', 'image/bmp'], // 支持的文件类型
  maxSize: 100 * 1024 * 1024, // 支持最大的单个文件
  maxWidth: -1, // 支持最大宽度，-1: 不限制宽度
  maxHeight: -1, // 支持最大高度 -1: 不限制高度
  multiple: 12, // 一次最多处理多少张
}