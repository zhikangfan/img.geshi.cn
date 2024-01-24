import axios from '@/axios'
import { SOFT_CODE, SUB_CODE } from '@/config'

/**
 * @description 获取与商品列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getGoodsList() {
  return await axios.post(
    '/api/shop',
    { soft_code: SOFT_CODE, sub_code: SUB_CODE },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
