import axios from '@/axios'
import authAxios from '@/axios/authAxios'

/**
 * @description 登录
 * @param code
 * @returns {Promise<AxiosResponse<any>>}
 */
export function userLogin(code) {
  return axios.get('/api/wxlogin?code=' + code)
}
/**
 * @description 获取支付状态
 * @param {*} orderId 订单ID
 */
export function getPayStatus(orderId) {
  return authAxios.post(
    '/imageformat/getorder',
    {
      order_id: orderId
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * @description 扣除用户下载次数
 * @param count 要扣除的次数
 * @returns {Promise<AxiosResponse<any>>}
 */
export function duce(count = 1) {
  return authAxios.post(
    '/imageformat/duce',
    {
      c: count
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export function getUserInfo() {
  return authAxios.post('/imageformat/getuserinfo')
}

export function getLoginQrCode() {
  return axios.post('/api/wxgetqrcode')
}

export function getLoginStatus(union_str) {
  return axios.post('api/wechatcheck ', {
    union_str: union_str
  })
}

/**
 * 手机验证码登录
 * @param mobile_phone 手机号码
 * @param code 验证码
 * @returns {Promise<AxiosResponse<any>>}
 */
export const userMobileLogin = ({mobile_phone, code}) => {
  return axios.post('/api/smslogin', {
    mobile_phone,
    smscode: code,
    code: 'qingmiao'
  })
}
/**
 * 获取手机验证码
 * @param mobile_phone 手机号
 */
export const getMobileCode = (mobile_phone) => {
  return axios.post('/api/code', {
    mobile_phone
  })
}