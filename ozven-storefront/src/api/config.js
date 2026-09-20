/**
 * Resolve the storefront public API base URL.
 * Supports full URLs, protocol-relative URLs, and bare host paths
 * (e.g. ozven.vercel.app/api/public).
 *
 * Local UI talks to the live backend (admin/API on broadband).
 * In Vite DEV we use same-origin `/api/public` so the Vite proxy
 * forwards to the remote host without CORS issues.
 */
const LIVE_PUBLIC_API = 'https://ozven.vercel.app/api/public'

export function resolvePublicApiBaseUrl(rawValue) {
  const fallback = LIVE_PUBLIC_API
  const value = (rawValue || '').trim().replace(/\/+$/, '')

  if (!value) {
    return fallback
  }

  if (value.startsWith('/')) {
    return value
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (value.startsWith('//')) {
    return `https:${value}`
  }

  return `https://${value}`
}

export function getPublicApiBaseUrl() {
  // Local storefront + remote API: always go through Vite proxy in DEV.
  if (import.meta.env.DEV) {
    return '/api/public'
  }

  return resolvePublicApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
}

export function getApiRoot() {
  const base = getPublicApiBaseUrl()
  if (base.startsWith('/')) {
    return ''
  }
  return base.replace(/\/api\/public\/?$/, '').replace(/\/+$/, '')
}

export function getChatApiBaseUrl() {
  const root = getApiRoot()
  return root ? `${root}/api/public/chat` : '/api/public/chat'
}
