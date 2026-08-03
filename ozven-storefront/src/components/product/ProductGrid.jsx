import { ProductGridSkeleton } from '../common/Skeleton'
import ErrorMessage from '../common/ErrorMessage'
import ProductCard from './ProductCard'

export default function ProductGrid({ products = [], loading, error, onRetry, emptyMessage }) {
  if (loading) return <ProductGridSkeleton />
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />

  if (!products.length) {
    return (
      <div className="border border-dashed border-gold-hairline/40 px-6 py-16 text-center">
        <p className="font-display text-2xl text-charcoal">Nothing here yet</p>
        <p className="mt-2 text-sm text-charcoal/60">
          {emptyMessage || 'No products found. Try adjusting your filters.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  )
}
