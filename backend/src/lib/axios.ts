import axios from 'axios'

export const axiosInstance = axios.create({
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
  },
})
