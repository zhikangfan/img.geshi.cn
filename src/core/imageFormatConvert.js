import { ImageMagick, initializeImageMagick, MagickFormat } from '@imagemagick/magick-wasm'
/**
 * @description 获取文件类型
 * @param ext
 * @returns {*|string}
 */
export function getTypeByExt(ext) {
  const type = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    avif: 'avif.avif',
    orf: 'image/ORF',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    //
    'image/png': 'image/png',
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpg',
    'image/gif': 'image/gif',
    'image/bmp': 'image/bmp',
    'image/webp': 'image/webp',
    'image/tiff': 'image/tiff',
    'avif.avif': 'avif.avif',
    'image/ORF': 'image/ORF',
    'image/svg+xml' : 'image/svg+xml',
    'image/x-icon': 'image/x-icon'
  }
  return type[ext] || 'image/png'
}
export function getFormatTypeByExt(ext) {
  let typeObj = {
    png: MagickFormat.Png,
    jpeg: MagickFormat.Jpeg,
    jpg: MagickFormat.Jpg,
    bmp: MagickFormat.Bmp,
    webp: MagickFormat.Webp,
    gif: MagickFormat.Gif,
    tif: MagickFormat.Tiff,
    tiff: MagickFormat.Tiff,
    avif: MagickFormat.Avif,
    orf: MagickFormat.Orf,
    svg: MagickFormat.Svg,
    heic: MagickFormat.Heic,
    ico: MagickFormat.Ico
  }
  return typeObj[ext]
}
export function imageFormatConvert(file, { to }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result // reader.result 是文件内容
      const uint8Array = new Uint8Array(arrayBuffer)
      // const wasmLocation = new URL('@imagemagick/magick-wasm/magick.wasm', import.meta.url).href
      const wasmLocation = 'https://res.yunkun.cn/magick.wasm'
      initializeImageMagick(wasmLocation).then(() => {
        ImageMagick.read(uint8Array, function (image) {
          image.write(getFormatTypeByExt(to) || image.format, data => {
            let blob = new Blob([data], {
              type: getTypeByExt(to)
            })
            resolve(blob)
          })
        })
      })
    }
    reader.readAsArrayBuffer(file)
  })
}
