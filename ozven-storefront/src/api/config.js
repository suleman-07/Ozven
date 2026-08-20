/**
 * Resolve the storefront public API base URL.
 * Supports full URLs, protocol-relative URLs, and bare host paths
 * (e.g. your-api-host.up.railway.app/api/public).
 */
export function resolvePublicApiBaseUrl(rawValue) {
  const fallback = 'http://localhost:5000/api/public'
  const value = (rawValue || fallback).trim().replace(/\/+$/, '')

  if (!value) {
    return fallback
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
  return resolvePublicApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
}

export function getApiRoot() {
  return getPublicApiBaseUrl().replace(/\/api\/public\/?$/, '').replace(/\/+$/, '')
}

export function getChatApiBaseUrl() {
  return `${getApiRoot()}/api/public/chat`
}
