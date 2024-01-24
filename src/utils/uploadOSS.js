import { getOSSToken } from '@/api'

const OSS = require('ali-oss')
import axios from 'axios'

export async function uploadOSS(filename, file, bucket) {
  let result = await getOSSToken()
  if (result.data.status !== 0) {
    // TODO: 上传失败

    return
  }

  const { AccessKeyId, SecurityToken, AccessKeySecret } = result.data.data

  let clientOSS = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: AccessKeyId,
    accessKeySecret: AccessKeySecret,
    stsToken: SecurityToken,
    refreshSTSToken: async () => {
      let info = await getOSSToken()
      if (result.data.status === 0) {
        const { AccessKeyId, SecurityToken, AccessKeySecret } = info.data.data
        return {
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken
        }
      }
    },
    refreshSTSTokenInterval: 300000,
    secure: true,
    bucket: bucket
  })
  return clientOSS.put(filename, file, {
    mime: file.type
  })
}

export function getFileConvertStatus(token) {
  let timer = null
  let pollCount = 0

  return new Promise((resolve, reject) => {
    function lookup(token) {
      clearTimeout(timer)
      if (pollCount > 600) {
        reject('转换超时')
        return
      }
      timer = setTimeout(async () => {
        let res = await axios.get(`https://api.duhuitech.com/q?token=${token}`)
        if (res.data.result.status === 'Done') {
          resolve({
            source: res.data.result.pdfurl || res.data.result.fileurl || res.data.result.imageurls
          })
          clearTimeout(timer)
        } else if (res.data.result.status === 'Failed') {
          reject(res.data)
          clearTimeout(timer)
        } else {
          lookup(token)
        }
      }, 1000)
      pollCount++ // 增加轮询次数
    }

    lookup(token)
  })
}
