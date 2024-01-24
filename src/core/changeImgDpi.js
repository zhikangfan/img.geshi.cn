import { Density, DensityUnit, ImageMagick, initializeImageMagick } from '@imagemagick/magick-wasm'

export async function changeImgDpi(file, { dpi }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result // reader.result 是文件内容
      const uint8Array = new Uint8Array(arrayBuffer)
      // const wasmLocation = new URL('@imagemagick/magick-wasm/magick.wasm', import.meta.url).href
      const wasmLocation = 'https://res.yunkun.cn/magick.wasm'
      initializeImageMagick(wasmLocation).then(() => {
        ImageMagick.read(uint8Array, function (image) {
          image.density = new Density(dpi, dpi, DensityUnit.PixelsPerInch)
          image.write(image.format, data => {
            let blob = new Blob([data], {
              type: image.format
            })
            resolve(blob)
          })
        })
      })
    }
    reader.readAsArrayBuffer(file)
  })
}
