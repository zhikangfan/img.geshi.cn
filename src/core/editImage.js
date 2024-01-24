import Compressor from 'compressorjs'
// import {compressAccurately, compress} from 'image-conversion'
// import FileType from 'file-type/browser'
export function editImage(blob, options = {}) {
  return new Promise((resolve, reject) => {
    new Compressor(blob, {
      ...options,
      convertSize: Infinity,
      retainExif: true,
      quality: 0.6,
      success(result) {
        if (result.type !== blob.type) {
          resolve(new Blob([result], { type: blob.type }))
        } else {
          resolve(result)
        }
      },
      error(err) {
        reject(err)
      }
    })
  })
}

// export async function editImage(blob, { width, height }) {
//   let {mime} = FileType.fromBlob(blob)
//   let outputBlob = await compressAccurately(blob, {
//     accuracy: 0.95,
//     height: height,
//     width: width,
//     type: blob?.type || mime
//   })
//   console.log(blob, outputBlob, '---outputblob')
//   /**
//    * 如果转换后的格式发生了变化，则重新创建一个blob将原type传入
//    */
//   if (outputBlob.type !== blob.type || outputBlob.type !== mime) {
//     return new Blob([outputBlob], { type: blob.type || mime })
//   }
//   return outputBlob
// }

// export async function editImage(blob, { width, height }) {
//   let {mime} = FileType.fromBlob(blob)
//   console.log(width, height)
//   let outputBlob = await compress(blob, {
//     quality: 0.7,
//     height: height,
//     width: width,
//     type: blob?.type || mime
//   })
//   /**
//    * 如果转换后的格式发生了变化，则重新创建一个blob将原type传入
//    */
//   if (outputBlob.type !== blob.type || outputBlob.type !== mime) {
//     return new Blob([outputBlob], { type: blob.type || mime })
//   }
//   return outputBlob
// }
