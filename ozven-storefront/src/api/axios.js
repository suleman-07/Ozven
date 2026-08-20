import axios from 'axios'
import { getPublicApiBaseUrl } from './config'

const api = axios.create({
  baseURL: getPublicApiBaseUrl(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

export default api
