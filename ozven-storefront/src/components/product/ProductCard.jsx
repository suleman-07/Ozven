import { Link } from 'react-router-dom'
import { formatPrice, getProductImage } from '../../utils/catalog'

export default function ProductCard({ product }) {
  if (!product) return null

  const image = getProductImage(product)
  const slug = product.slug
  const priceLabel = formatPrice(product)

  return (
    <article className="group flex h-full flex-col border border-gold-hairline/25 bg-base transition duration-300 hover:border-gold hover:shadow-soft">
      <Link to={`/product/${slug}`} className="relative block aspect-[4/5] overflow-hidden bg-dark-alt">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl tracking-[0.12em] text-gold/50">
            OZVEN
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-dark/55 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="border border-gold px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-gold">
            View Details
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="font-display text-xl text-charcoal">
          <Link to={`/product/${slug}`} className="transition hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-charcoal/70">{priceLabel}</p>
      </div>
    </article>
  )
}
