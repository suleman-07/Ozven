import { useMemo, useState } from 'react'
import { getProductImage } from '../../utils/catalog'

function collectImages(product) {
  const urls = []
  const featured = getProductImage(product)
  if (featured) urls.push(featured)
  ;(product?.images || []).forEach((image) => {
    const url = image?.imageUrl || image?.url
    if (url) urls.push(url)
  })
  return [...new Set(urls)]
}

export default function ImageGallery({ product }) {
  const images = useMemo(() => collectImages(product), [product])
  const [active, setActive] = useState(0)
  const current = images[active] || null

  if (!images.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center border border-gold-hairline/25 bg-dark-alt font-display text-3xl tracking-[0.12em] text-gold/50">
        OZVEN
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-[4/5] overflow-hidden border border-gold-hairline/25 bg-dark-alt">
        <img
          src={current}
          alt={product?.name || 'Product image'}
          className="h-full w-full object-cover animate-fade-in"
          key={current}
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              className={[
                'aspect-square overflow-hidden border transition',
                index === active ? 'border-gold' : 'border-gold-hairline/30 hover:border-gold/70',
              ].join(' ')}
              aria-label={`View image ${index + 1}`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
