import authAxios from '@/axios/authAxios'

export function uploadFile() {}

export function getOSSToken() {
  return authAxios.post('/imageformat/getosstoken')
}
