export const isWechat = () => {
  if (window) {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger'
  }
  return false

}