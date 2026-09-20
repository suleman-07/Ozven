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
  const direct = category?.image || category?.imageUrl || category?.featuredImage
  if (direct) return direct

  const subs = Array.isArray(category?.subcategories) ? category.subcategories : []
  for (const sub of subs) {
    const image = sub?.image || sub?.imageUrl || sub?.featuredImage
    if (image) return image
  }

  return null
}

/** 1-based catalog index → "01", "02", … */
export function formatCatalogNumber(index) {
  const n = Number(index)
  if (!Number.isFinite(n) || n < 0) return '01'
  return String(Math.floor(n) + 1).padStart(2, '0')
}

/** Uppercase editorial eyebrow from a parent/group name. */
export function getCategoryLabel(name = '') {
  const value = String(name).trim()
  if (!value) return 'COLLECTION'
  return value.toUpperCase()
}

/**
 * Short editorial description (reference tone), e.g.
 * "Packaging designed for bakeries, pastry shops & confectionery brands."
 */
export function getCategoryDescription(name = '', parentName = '') {
  const title = String(name).trim()
  if (!title) {
    return 'Packaging designed for brands that need a refined, production-ready finish.'
  }

  const key = title.toLowerCase()
  const group = String(parentName || title).toLowerCase()

  if (/boxes by industry/i.test(title) && !parentName) {
    return 'Packaging designed for industry leaders across food, beauty, retail & specialty brands.'
  }
  if (/boxes by style/i.test(title) && !parentName) {
    return 'Packaging designed for display, unboxing moments & everyday retail structures.'
  }
  if (/boxes by material/i.test(title) && !parentName) {
    return 'Packaging designed around board grades, finishes & materials that match your brand.'
  }

  // Industry / product-specific lines (reference style)
  const industryLines = [
    [/baker|pastry|cake|dessert/, 'Packaging designed for bakeries, pastry shops & confectionery brands.'],
    [/cosmetic|beauty|makeup|skincare/, 'Packaging designed for beauty, skincare & cosmetics brands.'],
    [/soap|bath/, 'Packaging designed for soap, bath & personal-care brands.'],
    [/candle/, 'Packaging designed for candle makers & home-fragrance brands.'],
    [/bottle|wine|beverage|drink/, 'Packaging designed for bottles, beverages & specialty pours.'],
    [/gift/, 'Packaging designed for gifting, launches & memorable unboxing.'],
    [/electronic|gadget|tech|phone/, 'Packaging designed for electronics, devices & tech accessories.'],
    [/auto|car|vehicle|parts/, 'Packaging designed for auto parts, aftermarket & parts retail.'],
    [/health|pharma|medical|care/, 'Packaging designed for health-care, wellness & specialty products.'],
    [/kitchen/, 'Packaging designed for kitchenware, housewares & tabletop brands.'],
    [/sport|fitness/, 'Packaging designed for sports, fitness & active lifestyle brands.'],
    [/vape|cbd|hemp|cannabis/, 'Packaging designed for vape, CBD & regulated specialty brands.'],
    [/apparel|cloth|fashion|shirt/, 'Packaging designed for apparel, fashion & lifestyle labels.'],
    [/jewelry|jewellery|watch/, 'Packaging designed for jewelry, watches & fine accessories.'],
    [/food|snack|grocery/, 'Packaging designed for food brands, snacks & specialty groceries.'],
    [/coffee|tea/, 'Packaging designed for coffee, tea & specialty beverage brands.'],
    [/shoe|footwear/, 'Packaging designed for footwear & lifestyle retail brands.'],
  ]

  for (const [test, line] of industryLines) {
    if (test.test(key)) return line
  }

  if (group.includes('style')) {
    return `Packaging designed around ${title.toLowerCase()} — refined structure, clear branding & shelf presence.`
  }
  if (group.includes('material')) {
    const material = title.replace(/\s+boxes?\b/gi, '').trim().toLowerCase() || title.toLowerCase()
    return `Packaging designed in ${material} — balanced for print quality, protection & brand feel.`
  }

  const subject =
    title.replace(/\s+boxes?\b/gi, '').replace(/\s+packing\b/gi, '').trim().toLowerCase() ||
    title.toLowerCase()
  return `Packaging designed for ${subject} brands that need a refined, production-ready finish.`
}
