import api from './api'

export const PAGE_SIZE = 5

const responseKeys = {
  '/categories': 'categories',
  '/dashboard': 'dashboard',
  '/products': 'products',
  '/quotes': 'quotes',
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const status = error?.response?.status
  if (status === 413) {
    return 'Images are too large for one request. Try fewer or smaller images, or save again — uploads are sent one at a time.'
  }
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

/**
 * Compress an image in the browser so each upload stays under Vercel's 4.5MB body limit.
 */
export async function compressProductImage(file, { maxWidth = 1600, maxBytes = 900_000, quality = 0.82 } = {}) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return file
  }

  if (file.size <= maxBytes) {
    return file
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  let currentQuality = quality
  let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', currentQuality))

  while (blob && blob.size > maxBytes && currentQuality > 0.45) {
    currentQuality -= 0.1
    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', currentQuality))
  }

  if (!blob) {
    return file
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'product-image'
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
}

export async function uploadProductImage(file) {
  const compressed = await compressProductImage(file)
  const formData = new FormData()
  formData.append('image', compressed)
  const response = await api.post('/products/upload-image', formData)
  const imageUrl = response?.data?.imageUrl

  if (!imageUrl) {
    throw new Error(response?.data?.message || 'Image upload failed')
  }

  return imageUrl
}

export async function uploadProductImages(files = []) {
  const urls = []

  for (const file of files) {
    if (file instanceof File) {
      urls.push(await uploadProductImage(file))
    }
  }

  return urls
}

export function buildProductFormData(product) {
  const formData = new FormData()

  formData.append('name', product.name.trim())
  formData.append('description', product.description || '')
  formData.append('status', product.status)
  formData.append('subcategoryId', product.subcategoryId)

  // Prefer pre-uploaded Cloudinary URLs (avoids Vercel 413 on multi-image saves)
  if (Array.isArray(product.imageUrls) && product.imageUrls.length) {
    formData.append('imageUrls', JSON.stringify(product.imageUrls))
  } else if (Array.isArray(product.imageFiles)) {
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
