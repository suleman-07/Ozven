import axios from 'axios'

const TOKEN_KEY = 'oxo_admin_token'
const ADMIN_KEY = 'oxo_admin_user'

/**
 * Ensure VITE_API_BASE_URL is always an absolute URL.
 * Values like "ozven-production.up.railway.app/api" are treated as relative
 * by the browser and get the Vercel origin prepended — which breaks login.
 */
function resolveApiBaseUrl(rawValue) {
  const fallback = 'http://localhost:5000/api'
  const value = (rawValue || fallback).trim().replace(/\/+$/, '')

  if (!value) {
    return fallback
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  // Protocol-relative URL: //host/api
  if (value.startsWith('//')) {
    return `https:${value}`
  }

  return `https://${value}`
}

const apiBaseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL)

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(ADMIN_KEY)

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default api
