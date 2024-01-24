import authAxios from '../axios/authAxios'
export async function uploadLoginData() {
  await authAxios.post(
    '/imageformat/login_baidu',
    {
      bdVID: localStorage.getItem('bd_vid')
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export async function uploadPayData(amount) {
  await authAxios.post(
    '/imageformat/order_baidu',
    {
      bdVID: localStorage.getItem('bd_vid'),
      amount: amount
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
