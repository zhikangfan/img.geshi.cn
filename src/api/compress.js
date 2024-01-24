import authAxios from '@/axios/authAxios'

/**
 * @description 压缩gif
 * @param options 参数，w: 宽度，h：高度，q： 压缩率
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function compressGif({ blob, options = {} }) {
  const formData = new FormData()
  formData.append('uploadfile', blob)

  for (const key in options) {
    formData.append(key, options[key])
  }

  return await authAxios.post('/imageformat/uploadimagegif', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
