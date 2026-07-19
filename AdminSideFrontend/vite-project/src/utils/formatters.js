export function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatDate(value, fallback = 'N/A') {
  if (!value) {
    return fallback
  }

  const dateValue = new Date(value)

  if (Number.isNaN(dateValue.getTime())) {
    return fallback
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(dateValue)
}
