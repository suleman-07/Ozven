import api from './axios'

/**
 * GET /api/public/categories
 * Returns categories with slug + subcategories[{ id, name, slug, image }]
 */
export async function getCategories() {
  const { data } = await api.get('/categories')
  return data?.categories || []
}

/**
 * GET /api/public/products
 */
export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return {
    products: data?.products || [],
    pagination: data?.pagination || {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 12,
      total: 0,
      totalPages: 1,
    },
  }
}

/**
 * GET /api/public/products/slug/:slug
 */
export async function getProductBySlug(slug) {
  const { data } = await api.get(`/products/slug/${encodeURIComponent(slug)}`)
  return data?.product || null
}

/**
 * POST /api/public/quotes
 */
export async function createQuote(payload) {
  const { data } = await api.post('/quotes', payload)
  return data
}
