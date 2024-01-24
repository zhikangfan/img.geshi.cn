import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * @description 单个下载文件
 * @param blob Blob对象
 * @param filename 文件名称
 * @param suffix 后缀名
 */
export function download(blob, filename, suffix) {
  if (!(blob instanceof Blob) && typeof blob !== 'string') {
    throw new Error("参数 'blob' 应为 Blob 对象 或者 字符串")
  }

  if (typeof filename !== 'string' || filename === '') {
    throw new Error("参数 'filename' 应为非空字符串")
  }

  if (typeof suffix !== 'string' || suffix === '') {
    throw new Error("参数 'suffix' 应为非空字符串")
  }
  const fullFilename = `${filename}.${suffix}`
  saveAs(blob, fullFilename)
}

/**
 * @description 执行单张下载
 * @param files
 * @returns {Promise<void>}
 */
export async function singleDownload(files) {
  if (!Array.isArray(files) || files.length <= 0) {
    return
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (
      (!(file.raw instanceof Blob) && typeof file.raw !== 'string') ||
      typeof file.filename !== 'string' ||
      typeof file.suffix !== 'string'
    ) {
      throw new Error(`文件 #${i + 1} 参数不符合要求`)
    }

    const fullFilename = `${file.filename}.${file.suffix}`
    if (typeof file.raw === 'string') {
      // 如果是远程 URL 地址，使用 fetch 来下载文件内容
      fetch(file.raw)
        .then(response => response.blob())
        .then(blob => {
          saveAs(blob, fullFilename)
        })
    } else {
      saveAs(file.raw, fullFilename)
    }
  }
}

/**
 * @description 批量下载
 * @param files
 * @returns {Promise<void>}
 */
export async function batchDownload(files) {
  if (!Array.isArray(files) || files.length <= 0) {
    return
  }
  const zip = new JSZip()
  const fetchPromises = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (
      (!(file.raw instanceof Blob) && typeof file.raw !== 'string') ||
      typeof file.filename !== 'string' ||
      typeof file.suffix !== 'string'
    ) {
      throw new Error(`文件 #${i + 1} 参数不符合要求`)
    }

    const fullFilename = `${file.filename}.${file.suffix}`
    if (typeof file.raw === 'string') {
      // 如果是远程 URL 地址，使用 fetch 来下载文件内容
      const fetchPromise = fetch(file.raw)
        .then(response => response.blob())
        .then(blob => {
          zip.file(fullFilename, blob, { binary: true })
        })
      fetchPromises.push(fetchPromise)
    } else {
      zip.file(fullFilename, file.raw, { binary: true })
    }
  }
  await Promise.all(fetchPromises) // 等待所有远程文件下载完成

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, '轻秒格式工厂.zip')
}
