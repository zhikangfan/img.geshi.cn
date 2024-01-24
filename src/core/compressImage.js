import { compressAccurately } from 'image-conversion'
import FileType from 'file-type/browser'
// import * as Magick from './magickApi'
// import {call} from 'wasm-imagemagick'

/**
 * @description 根据
 * @param blob
 * @param quality
 * @returns {Promise<*|Blob>}
 */
export async function compressImage(blob, { quality }) {
  /**
   * 当传递的清晰度小于 0.01 或者
   */
  if (quality >= 1) {
    return blob
  }
  if (quality < 0.01) {
    quality = 0.01
  }

  let outputBlob = await compressAccurately(blob, {
    accuracy: 0.95,
    size: (blob.size / 1024) * quality
  })
  /**
   * 如果转换后的格式发生了变化，则重新创建一个blob将原type传入
   */
  if (outputBlob.type !== blob.type) {
    return new Blob([outputBlob], { type: blob.type })
  }
  return outputBlob
}

/**
 * 压缩PNG
 * @param params
 * @returns {Promise<*>}
 */
export async function compressPng(params) {
  if (!(params instanceof Blob) && typeof params !== 'string') {
    throw Error('不是一个文件或者文件路径')
  }
  let src = params

  if (params instanceof Blob) {
    src =  URL.createObjectURL(params)
  }

  let fetchedSourceImage = await fetch(src);
  let arrayBuffer = await fetchedSourceImage.arrayBuffer();
  let sourceBytes = new Uint8Array(arrayBuffer);
  const files = [{ 'name': 'srcFile.png', 'content': sourceBytes }];
  const command = ["convert", "srcFile.png", "-define", "png:compression-level=9", "-strip", "-depth", "8", "-colors", "255", "out.png"];
  let result = await call(files, command);
  if(result.exitCode !== 0) {
    console.log('error', result)
    return
  }
  const outputImage = result.outputFiles[0]

  return outputImage.blob
}
/**
 * @description 自定义压缩大小，github地址：https://github.com/WangYuLue/image-conversion
 * @param {Blob} blob - blob文件
 * @param {Object} config - 配置
 * @param {number} config.maxSize - 指定压缩尺寸，单位：kb
 * @returns {Promise<Blob>}
 */
export async function outputTheSpecifiedSize(blob, { maxSize }) {
  if (maxSize * 1024 > blob.size) {
    // return await increasePictureMemory(blob, maxSize * 1024)
    return blob
  }
  let outputBlob = await compressAccurately(blob, {
    size: maxSize // 单位：KB
  })
  /**
   * 如果转换后的格式发生了变化，则重新创建一个blob将原type传入
   */
  if (outputBlob.type !== blob.type) {
    return new Blob([outputBlob], { type: blob.type })
  }
  return outputBlob
}
function changeBufferSize(buffer, size) {
  const dataArray = new Uint8Array(buffer)
  let newDataArray = new Uint8Array(dataArray.length + size)
  newDataArray.set(dataArray, 0)
  for (let i = dataArray.length; i < newDataArray.length; i++) {
    newDataArray[i] = 0
  }

  return newDataArray
}
export async function increasePictureMemory(file, size) {
  if (!(file instanceof Blob)) {
    throw Error('参数不是Blob类型')
  }
  if (file.size >= size) {
    return file
  }
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = async function (event) {
      let arrayBuffer = event.target.result

      let newDataArrayBuffer = changeBufferSize(arrayBuffer, size - file.size)

      let { mime } = await FileType.fromBlob(file)
      let blob = new Blob([newDataArrayBuffer.buffer], { type: mime })
      resolve(blob)
    }
    reader.onerror = function (e) {
      reject(e)
    }

    reader.readAsArrayBuffer(file)
  })
}
