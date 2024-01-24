import cookie from 'js-cookie'

/**
 * @description 获取存储在本地的用户信息
 * @returns {*}
 */
export function getLocalUserInfo() {
  let data
  try {
    data = JSON.parse(cookie.get('UID'))
  } catch (e) {
    data = void 0
  }
  return data
}
export function setLocalUserInfo(userInfo) {
  cookie.set('UID', JSON.stringify(userInfo), {
    expires: 2 * 24 * 60 * 60 * 1000
  })
}

/**
 * @description 移除token
 */
export function removeToken() {
  cookie.remove('SID')
  cookie.remove('UID')
}
export function getToken() {
  return cookie.get('SID')
}
/**
 * @description 设置本地token与用户信息
 * @param user
 */
export function setToken(user) {
  const { token } = user
  cookie.set('SID', token, {
    expires: 2 * 24 * 60 * 60 * 1000
  })
  if (getLocalUserInfo()) {
    cookie.set('UID', getLocalUserInfo(), {
      expires: 2 * 24 * 60 * 60 * 1000
    })
  }
  if (user) {
    if (Object.keys(user).includes('money_info')) {
      delete user.money_info
    }
    if (Object.keys(user).includes('privilege')) {
      delete user.privilege
    }
    setLocalUserInfo(user)

  }
}
