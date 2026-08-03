export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatPrice(product) {
  const price = product?.price ?? product?.salePrice ?? product?.basePrice
  if (price === null || price === undefined || price === '') {
    return 'Contact for price'
  }
  const amount = Number(price)
  if (Number.isNaN(amount)) return String(price)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product?.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getProductImage(product) {
  return (
    product?.featuredImage ||
    product?.images?.[0]?.imageUrl ||
    product?.images?.[0]?.url ||
    product?.image ||
    null
  )
}

export function getCategoryImage(category) {
  return category?.image || category?.imageUrl || category?.featuredImage || null
}
