import { FILE_TYPE } from '@/config'
import find from 'lodash-es/find'

export function getExtByMimeType(mimeType) {
  let target = find(FILE_TYPE, { type: mimeType })
  return target?.ext ? target.ext : ''
}

export function getMimeTypeByExt(ext) {
  let target = find(FILE_TYPE, { ext: ext })
  return target?.type ? target?.type : ''
}

export function getNamePrefix(fullFilename) {
  let matches = fullFilename.match(/^(.+)\.([^.]+)$/)
  if (matches) {
    return matches[1]
  }
  return 'unknown'
}
export function getFileInfo(file) {
  const isFile = file instanceof Blob
  if (!isFile) {
    throw new Error("It's not a Blob type!")
  }

  return {
    name: file.name ? file.name : `unknown.${getExtByMimeType(file.type)}`,
    namePrefix: file.name ? getNamePrefix(file.name) : 'unknown',
    type: file.type,
    size: file.size,
    ext: getExtByMimeType(file.type),
    raw: file
  }
}
