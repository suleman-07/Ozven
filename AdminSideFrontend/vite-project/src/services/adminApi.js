import api from './api'

export const PAGE_SIZE = 5

const responseKeys = {
  '/categories': 'categories',
  '/dashboard': 'dashboard',
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

export function buildProductFormData(product) {
  const formData = new FormData()

  formData.append('name', product.name.trim())
  formData.append('description', product.description || '')
  formData.append('status', product.status)
  formData.append('subcategoryId', product.subcategoryId)

  if (Array.isArray(product.imageFiles)) {
    product.imageFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file)
      }
    })
  }

  if (Array.isArray(product.removeImageIds) && product.removeImageIds.length) {
    formData.append('removeImageIds', JSON.stringify(product.removeImageIds))
  }

  return formData
}

export function getDashboardData() {
  return api.get('/dashboard').then((response) => response?.data || {})
}

export async function getLookupResources() {
  const result = await listResource('/categories', { page: 1, limit: 100 })
  const categories = result.items
  const subcategories = categories.flatMap((category) =>
    (category.subcategories || []).map((subcategory) => ({
      ...subcategory,
      categoryId: category.id,
      categoryName: category.name,
      label: `${category.name} / ${subcategory.name}`,
    })),
  )

  return {
    categories,
    subcategories,
  }
}

function singularize(value) {
  return value.endsWith('ies') ? `${value.slice(0, -3)}y` : value.slice(0, -1)
}
