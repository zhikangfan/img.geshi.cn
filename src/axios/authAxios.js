import axios from 'axios'
import {getToken, removeToken} from '@/utils/token'
const authAxios = axios.create({
  baseURL: process.env.VUE_APP_REQUEST_BASE_URL,
  timeout: 0
})

authAxios.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['token'] = getToken()
  }
  return config
})

authAxios.interceptors.response.use(response => {
  /**
   * TODO token失效处理
   */
  if (response.data.status === 401) {
    removeToken()
    window.location.reload()
  }
  return response
})

export default authAxios
