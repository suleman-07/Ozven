import api from './api'

export const PAGE_SIZE = 5

const responseKeys = {
  '/box-styles': 'boxStyles',
  '/categories': 'categories',
  '/dashboard': 'dashboard',
  '/finishes': 'finishes',
  '/industries': 'industries',
  '/materials': 'materials',
  '/products': 'products',
  '/quotes': 'quotes',
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback
}

export function getResourceKey(endpoint) {
  return responseKeys[endpoint] || 'items'
}

export function getPagination(payload, fallback) {
  return (
    payload?.pagination || {
      page: fallback.page,
      limit: fallback.limit,
      total: fallback.total,
      totalPages: fallback.totalPages || 1,
    }
  )
}

export async function listResource(endpoint, { page = 1, limit = PAGE_SIZE, search = '', params = {}, responseKey } = {}) {
  const response = await api.get(endpoint, {
    params: {
      page,
      limit,
      search: search.trim(),
      ...params,
    },
  })

  const payload = response?.data || {}
  const key = responseKey || getResourceKey(endpoint)
  const items = Array.isArray(payload[key]) ? payload[key] : []

  return {
    items,
    pagination: getPagination(payload, {
      page,
      limit,
      total: items.length,
      totalPages: 1,
    }),
    payload,
  }
}

export async function getResource(endpoint, id, responseKey) {
  const response = await api.get(`${endpoint}/${id}`)
  const payload = response?.data || {}

  return payload[responseKey || singularize(getResourceKey(endpoint))] || payload
}

export function createResource(endpoint, data) {
  return api.post(endpoint, data)
}

export function updateResource(endpoint, id, data) {
  return api.put(`${endpoint}/${id}`, data)
}

export function deleteResource(endpoint, id) {
  return api.delete(`${endpoint}/${id}`)
}

export function getDashboardData() {
  return api.get('/dashboard').then((response) => response?.data || {})
}

export async function getLookupResources() {
  const lookupParams = { page: 1, limit: 100 }
  const [categories, industries, materials, finishes, boxStyles] = await Promise.all([
    listResource('/categories', lookupParams),
    listResource('/industries', lookupParams),
    listResource('/materials', lookupParams),
    listResource('/finishes', lookupParams),
    listResource('/box-styles', lookupParams),
  ])

  return {
    categories: categories.items,
    industries: industries.items,
    materials: materials.items,
    finishes: finishes.items,
    boxStyles: boxStyles.items,
  }
}

function singularize(value) {
  if (value === 'boxStyles') {
    return 'boxStyle'
  }

  return value.endsWith('ies') ? `${value.slice(0, -3)}y` : value.slice(0, -1)
}
