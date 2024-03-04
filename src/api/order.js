import authAxios from '@/axios/authAxios'

/**
 * @description 创建订单
 * @param productId 商品ID
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function createOrder(productId) {
  return await authAxios.post('/imageformat/createwxorderh5', { product_id: productId })
}
/**
 * @description 获取支付状态
 * @param {*} orderId 订单ID
 */
export function getPayStatus(orderId) {
  return authAxios.post(
          '/imageformat/getorder',
          {
            order_id: orderId
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
  )
}
