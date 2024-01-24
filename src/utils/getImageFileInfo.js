import FileType from 'file-type/browser'
import { v4 as uuidV4 } from 'uuid'
/**
 * @description 获取文件名称与后缀
 * @param fullFilename -文件名
 * @returns {{ext: string, filename: string}}
 */
export function parseFullFilename(fullFilename) {
  if (typeof fullFilename !== 'string' || fullFilename.trim().length === 0) {
    return {
      filename: 'unknown',
      ext: ''
    }
  }
  let matches = fullFilename.match(/^(.+)\.([^.]+)$/)
  if (matches) {
    let filename = matches[1] // 提取文件名部分
    let ext = matches[2] // 提取后缀名部分
    return {
      filename: filename,
      ext: ext
    }
  }
  return {
    filename: fullFilename,
    ext: ''
  }
}

export const supportImageType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/gif']
/**
 * @description 获取图片文件尺寸
 * @param param 图片src|blob对象
 * @returns {Promise<unknown>}
 */
export const getImageFileSize = async param => {
  if (typeof param !== 'string' && !(param instanceof Blob)) {
    throw Error('Invalid parameter type. Expected string or Blob.')
  }
  let src = param
  if (param instanceof Blob) {
    let { mime } = await FileType.fromBlob(param)
    if (!supportImageType.includes(mime)) {
      return { width: 0, height: 0 }
    }
    src = URL.createObjectURL(param)
  }
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = src
    image.onload = function () {
      URL.revokeObjectURL(image.src)
      resolve({ width: image.width, height: image.height })
    }
    image.onerror = function (err) {
      // 释放 Blob 对象的 URL
      URL.revokeObjectURL(image.src)
      reject(err)
    }
  })
}

const suffixMap = {
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/heic': 'heic'
}

/**
 * @description 获取文件基础信息
 * @param file File对象
 * @returns {Promise<{filename: string, size: string, name, raw: Blob, mimeType: (*|"image/jpeg"|"image/png"|"image/gif"|"image/webp"|"image/flif"|"image/x-xcf"|"image/x-canon-cr2"|"image/x-canon-cr3"|"image/tiff"|"image/bmp"|"image/icns"|"image/vnd.ms-photo"|"image/vnd.adobe.photoshop"|"application/x-indesign"|"application/epub+zip"|"application/x-xpinstall"|"application/vnd.oasis.opendocument.text"|"application/vnd.oasis.opendocument.spreadsheet"|"application/vnd.oasis.opendocument.presentation"|"application/vnd.openxmlformats-officedocument.wordprocessingml.document"|"application/vnd.openxmlformats-officedocument.presentationml.presentation"|"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"|"application/zip"|"application/x-tar"|"application/x-rar-compressed"|"application/gzip"|"application/x-bzip2"|"application/x-7z-compressed"|"application/x-apple-diskimage"|"video/mp4"|"audio/midi"|"video/x-matroska"|"video/webm"|"video/quicktime"|"video/vnd.avi"|"audio/vnd.wave"|"audio/qcelp"|"audio/x-ms-asf"|"video/x-ms-asf"|"application/vnd.ms-asf"|"video/mpeg"|"video/3gpp"|"audio/mpeg"|"audio/mp4"|"audio/opus"|"video/ogg"|"audio/ogg"|"application/ogg"|"audio/x-flac"|"audio/ape"|"audio/wavpack"|"audio/amr"|"application/pdf"|"application/x-msdownload"|"application/x-shockwave-flash"|"application/rtf"|"application/wasm"|"font/woff"|"font/woff2"|"application/vnd.ms-fontobject"|"font/ttf"|"font/otf"|"image/x-icon"|"video/x-flv"|"application/postscript"|"application/eps"|"application/x-xz"|"application/x-sqlite3"|"application/x-nintendo-nes-rom"|"application/x-google-chrome-extension"|"application/vnd.ms-cab-compressed"|"application/x-deb"|"application/x-unix-archive"|"application/x-rpm"|"application/x-compress"|"application/x-lzip"|"application/x-cfb"|"application/x-mie"|"application/x-apache-arrow"|"application/mxf"|"video/mp2t"|"application/x-blender"|"image/bpg"|"image/jp2"|"image/jpx"|"image/jpm"|"image/mj2"|"audio/aiff"|"application/xml"|"application/x-mobipocket-ebook"|"image/heif"|"image/heif-sequence"|"image/heic"|"image/heic-sequence"|"image/ktx"|"application/dicom"|"audio/x-musepack"|"text/calendar"|"text/vcard"|"model/gltf-binary"|"application/vnd.tcpdump.pcap"|"audio/x-dsf"|"application/x.ms.shortcut"|"application/x.apple.alias"|"audio/x-voc"|"audio/vnd.dolby.dd-raw"|"audio/x-m4a"|"image/apng"|"image/x-olympus-orf"|"image/x-sony-arw"|"image/x-adobe-dng"|"image/x-nikon-nef"|"image/x-panasonic-rw2"|"image/x-fujifilm-raf"|"video/x-m4v"|"video/3gpp2"|"application/x-esri-shape"|"audio/aac"|"audio/x-it"|"audio/x-s3m"|"audio/x-xm"|"video/MP1S"|"video/MP2P"|"application/vnd.sketchup.skp"|"image/avif"|"application/x-lzh-compressed"|"application/pgp-encrypted"|"application/x-asar"|"model/stl"|"application/vnd.ms-htmlhelp"|"model/3mf"|"image/jxl"|"application/zstd"), suffix: core.FileExtension, fileExt: string}>}
 */
export async function getBaseFileInfo(file) {
  if (!(file instanceof Blob)) {
    throw Error('The parameter is not a Blob object')
  }
  let { mime, ext } = await FileType.fromBlob(file)
  let { filename, ext: fileExt } = parseFullFilename(file.name)
  // TIPS: mimeType 还有 suffix 这么做是因为图片压缩会把格式改掉
  return {
    fid: uuidV4(),
    name: file.name,
    suffix: suffixMap[file?.type] || suffixMap[mime] || ext,
    mimeType: file?.type || mime,
    size: (file.size / 1024).toFixed(1),
    raw: file,
    fileExt: fileExt,
    filename: filename
  }
}

export default async function getImageFileInfo(file) {
  if (!(file instanceof Blob)) {
    throw Error('The parameter is not a Blob object')
  }
  let baseInfo = await getBaseFileInfo(file)
  let imageSize = await getImageFileSize(file)
  return {
    ...baseInfo,
    ...imageSize,
    src: URL.createObjectURL(file)
  }
}

// const getImageFileInfo2 = async blob => {
//   // let width = 0,
//   //   height = 0
//   let { mime } = await FileType.fromBlob(blob)
//   // if (mime !== 'application/pdf') {
//   //   let { width: fileWidth, height: fileHeight } = await getImageFileSize(blob)
//   //   width = fileWidth
//   //   height = fileHeight
//   // }
//   let { width, height } = await getImageFileSize(blob)
//   // width = fileWidth
//   // height = fileHeight
//   let { filename } = parseFullFilename(blob.name)
//   let size = (blob.size / 1024).toFixed(1)
//   let src = URL.createObjectURL(blob)
//   let mimeType = mime
//   let suffix = suffixMap[mimeType]
//
//   console.log(await getImageFileInfo2(blob), 'getImageFileInfo2')
//   console.log({width,
//     height,
//     suffix,
//     mimeType,
//     filename,
//     size,
//     src,})
//
//   return {
//     width,
//     height,
//     suffix,
//     mimeType,
//     filename,
//     size,
//     src,
//     raw: blob
//   }
// }
// export default getImageFileInfo
