import {v4 as uuid} from "uuid";
import {VIP_LEVEL} from "@/store/user.store";

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
    payTips: '直降500元 可开发票',
    level: [VIP_LEVEL.NON_VIP, VIP_LEVEL.COUNT_VIP, VIP_LEVEL.PERMANENT_VIP]
  },
  {
    id: 10,
    title: '终身会员',
    price: '39',
    corner: '直降530元',
    desc: '原价¥569',
    txt: '终身免费使用',
    has_icon: true, // 是否有闪电符号
    has_del: true, // 是否有删除线
    unit: '终身',
    payTips: '直降530元 可开发票',
    level: [ VIP_LEVEL.TIME_VIP, VIP_LEVEL.THREE_DAY_VIP]
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
    payTips: '立减130元 可开发票',
    level: [VIP_LEVEL.NON_VIP, VIP_LEVEL.COUNT_VIP, VIP_LEVEL.PERMANENT_VIP]
  },
  {
    id: 4,
    title: '按张付费*10张',
    price: '19.9',
    corner: '',
    desc: '1.99元/张',
    txt: '张数永久有效',
    has_icon: false,
    has_del: false,
    unit: '10张',
    payTips: '张数永久有效',
    level: [VIP_LEVEL.NON_VIP, VIP_LEVEL.COUNT_VIP, VIP_LEVEL.TIME_VIP, VIP_LEVEL.THREE_DAY_VIP, VIP_LEVEL.PERMANENT_VIP]
  },
  {
    id: 3,
    title: '按张付费*1张',
    price: '9.9',
    corner: '',
    desc: '9.9元/张',
    txt: '张数永久有效',
    has_icon: false,
    has_del: false,
    unit: '张',
    payTips: '张数永久有效',
    level: [VIP_LEVEL.NON_VIP, VIP_LEVEL.COUNT_VIP, VIP_LEVEL.TIME_VIP, VIP_LEVEL.THREE_DAY_VIP, VIP_LEVEL.PERMANENT_VIP]
  }
]


/**
 * 修改的尺寸列表
 * */
export const editSizeList = [
  {
    category: '常用',
    sizes: [
      [
        {
          id: uuid(),
          title: '一寸照',
          width: 295,
          height: 413,
          recommend: true
        },
        {
          id: uuid(),
          title: '大一寸照',
          width: 390,
          height: 567,
          recommend: true
        },
        {
          id: uuid(),
          title: '二寸照',
          width: 413,
          height: 579,
          recommend: true
        }
      ],
      [
        {
          id: uuid(),
          title: '大二寸照',
          width: 413,
          height: 626
        },
        {
          id: uuid(),
          title: '五寸照',
          width: 1050,
          height: 1499
        },
        {
          id: uuid(),
          title: '头像',
          width: 500,
          height: 500
        }
      ]
    ]
  },
  {
    category: '考试报名',
    sizes: [
      [
        {
          id: uuid(),
          title: '公务员考试',
          width: 413,
          height: 531,
          recommend: true
        },
        {
          id: uuid(),
          title: '司法考试',
          width: 413,
          height: 626
        },
        {
          id: uuid(),
          title: '四六级考试',
          width: 240,
          height: 320,
          recommend: true
        }
      ],
      [
        {
          id: uuid(),
          title: '教师资格证',
          width: 360,
          height: 480,
          recommend: true
        },
        {
          id: uuid(),
          title: '注册会计师',
          width: 178,
          height: 220
        },
        {
          id: uuid(),
          title: '护士资格证',
          width: 295,
          height: 413
        }
      ],
      [
        {
          id: uuid(),
          title: '普通话等级',
          width: 390,
          height: 567
        }
      ]
    ]
  },
  {
    category: '证件',
    sizes: [
      [
        {
          id: uuid(),
          title: '身份证',
          width: 358,
          height: 441
        },
        {
          id: uuid(),
          title: '社保证',
          width: 358,
          height: 441
        },
        {
          id: uuid(),
          title: '毕业证',
          width: 480,
          height: 640
        }
      ],
      [
        {
          id: uuid(),
          title: '护照',
          width: 354,
          height: 472
        },
        {
          id: uuid(),
          title: '交管驾驶证',
          width: 520,
          height: 756
        }
      ]
    ]
  }
]

export const FILE_TYPE = [
  {
    type: 'image/png',
    ext: 'png',
    alias: 'PNG'
  },
  {
    type: 'image/jpeg',
    ext: 'jpg',
    alias: 'JPG'
  },
  {
    type: 'image/jpeg',
    ext: 'jpeg',
    alias: 'JPEG'
  },
  {
    type: 'image/gif',
    ext: 'gif',
    alias: 'GIF'
  },
  {
    type: 'image/bmp',
    ext: 'bmp',
    alias: 'BMP'
  },
  {
    type: 'image/webp',
    ext: 'webp',
    alias: 'WEBP'
  },
  {
    type: 'image/tiff',
    ext: 'tif',
    alias: 'TIF'
  },
  {
    type: 'image/tiff',
    ext: 'tiff',
    alias: 'TIFF'
  },
  {
    type: 'avif.avif',
    ext: 'avif',
    alias: 'AVIF'
  },
  {
    type: 'image/heic',
    ext: 'heic',
    alias: 'HEIC'
  },
  {
    type: 'image/svg+xml',
    ext: 'svg',
    alias: 'SVG'
  },
  {
    type: 'application/pdf',
    ext: 'pdf',
    alias: 'PDF'
  },
  {
    type: 'application/msword',
    ext: 'doc',
    alias: 'Word'
  },
  {
    type: 'application/wps-writer',
    ext: 'doc',
    alias: 'Word'
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ext: 'docx',
    alias: 'Word'
  },
  {
    type: 'application/vnd.ms-excel',
    ext: 'xls',
    alias: 'Excel'
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ext: 'xlsx',
    alias: 'Excel'
  },
  {
    type: 'application/vnd.ms-powerpoint',
    ext: 'ppt',
    alias: 'PPT'
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ext: 'pptx',
    alias: 'PPT'
  },
  {
    type: 'application/acad',
    ext: 'dwg',
    alias: 'CAD'
  },
  {
    type: 'application/x-acad',
    ext: 'dwg',
    alias: 'CAD'
  },
  {
    type: 'application/dxf',
    ext: 'dxf',
    alias: 'CAD'
  },
  {
    type: 'application/x-dxf',
    ext: 'dxf',
    alias: 'CAD'
  },
  {
    type: 'application/x-dwt',
    ext: 'dwt',
    alias: 'CAD'
  },
  {
    type: 'application/x-dws',
    ext: 'dws',
    alias: 'CAD'
  },
  {
    type: 'application/octet-stream',
    ext: 'dwt',
    alias: 'CAD'
  }
]
export const SUB_CODE = 'default'
/**
 * 软件CODE
 */
export const SOFT_CODE = 'qingmiao'
// export const SOFT_CODE = 'image_convert_h5'

export const BUCKET = 'pdfgeshi'
