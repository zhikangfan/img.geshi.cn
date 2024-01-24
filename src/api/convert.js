import authAxios from '@/axios/authAxios'
/**
 * @description 格式转换
 * @param blob 要转换的图片
 * @param to 转换的格式
 * @returns {Promise<AxiosResponse<any>>}
 */
export function formatConversion(blob, options = {}) {
  const formData = new FormData()
  formData.append('uploadfile', blob)
  for (const key in options) {
    formData.append(key, options[key])
  }

  return authAxios.post('/imageformat/uploadimage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * @description pdf转其他格式
 * @param source 文件oss地址
 * @param to 要转换的格式
 * @returns {Promise<AxiosResponse<any>>}
 */
export function fileFormatConversion(source, to) {
  return authAxios.post(
    '/imageformat/pdf2doc',
    {
      file_addr: source,
      to: to
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * @description PDF压缩
 * @param source 文件OSS地址
 * @param quality 压缩等级，0:不压缩，1，2，3（等级最高）
 * @param to 要转换的格式，默认pdf
 * @returns {Promise<AxiosResponse<any>>}
 */
export function pdfCompressFn(source, quality = 3) {
  return authAxios.post(
    '/imageformat/doc2pdf',
    {
      file_addr: source,
      to: 'pdf',
      compress: quality
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * @description PDF转图片
 * @param source 文件OSS地址
 * @param outType 输出类型，1: 每页一图，2: 长图
 * @param to 输出的图片格式
 * @returns {Promise<AxiosResponse<any>>}
 */
export function pdfToImgFn(source, outType, to = 'jpg') {
  return authAxios.post(
    '/imageformat/doc2img',
    {
      file_addr: source,
      to: to,
      outtype: outType
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * @description 文件转Pdf
 * @param source 文件OSS地址
 * @returns {Promise<AxiosResponse<any>>}
 */
export function fileToPdfFn(source, to) {
  return authAxios.post(
    '/imageformat/doc2pdf',
    {
      file_addr: source,
      to: to
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export const METHODS = {
  FILE_FORMAT_CONVERSION: 'fileFormatConversion', // pdf转其他
  PDF_COMPRESS: 'pdfCompress', // pdf压缩
  PDF_TO_IMG: 'pdf2img', // pdf转图片
  FILE_TO_PDF: 'file2pdf' // 文件转pdf
}
