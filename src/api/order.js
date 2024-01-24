import authAxios from '@/axios/authAxios'

/**
 * @description 创建订单
 * @param productId 商品ID
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function createOrder(productId) {
  return await authAxios.post('/imageformat/createorder', { product_id: productId })
}
