import Axios from 'axios'

Axios.defaults.baseURL = process.env.VUE_APP_REQUEST_BASE_URL

export default Axios
