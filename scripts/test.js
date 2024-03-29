const shell = require('shelljs')
const path = require('path')
const originPath = path.join(__dirname, '../dist')
const wechatPayPath = path.join(__dirname, '../wechat_pay')
const magickPath = path.join(__dirname, '../dist/js/')
const inputMagickPath = path.join(__dirname, '../node_modules/wasm-imagemagick/dist/magick.wasm')
// const inputMagickJsPath = path.join(__dirname, '../node_modules/wasm-imagemagick/dist/magick.js')
const inputMagickJsPath = path.join(__dirname, '../public/magick.js')
shell.exec(`cp ${inputMagickPath} ${magickPath}`)
shell.exec(`cp ${inputMagickJsPath} ${magickPath}`)
shell.exec(`rsync -av --progress ${originPath} root@139.224.205.240:/home/imageconvert/imageconvertwww/`)
shell.exec(`rsync -av --progress ${wechatPayPath} root@139.224.205.240:/home/imageconvert/`)
