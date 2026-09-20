import { useMemo, useState } from 'react'
import { getProductImage } from '../../utils/catalog'

function collectImages(product) {
  const urls = []
  const featured = getProductImage(product)
  if (featured) urls.push(featured)
  ;(product?.images || [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .forEach((image) => {
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
      <div className="flex aspect-square items-center justify-center border border-charcoal/15 bg-[#F3EFE6] font-display text-3xl tracking-[0.12em] text-gold/50">
        OZVEN
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden border border-charcoal/20 bg-[#F3EFE6] sm:aspect-[5/5.2]">
        <img
          src={current}
          alt={product?.name || 'Product image'}
          className="h-full w-full object-contain object-center p-2 animate-fade-in sm:p-3"
          key={current}
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 sm:mt-4 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              className={[
                'aspect-square w-[4.5rem] shrink-0 overflow-hidden border bg-[#F3EFE6] transition sm:w-auto',
                index === active
                  ? 'border-gold'
                  : 'border-charcoal/15 hover:border-gold/70',
              ].join(' ')}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
            >
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
