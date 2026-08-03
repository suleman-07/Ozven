import { Link } from 'react-router-dom'
import Container from '../common/Container'
import { slugify } from '../../utils/catalog'
import { getSubcategoryIcon } from '../../utils/subcategoryIcons'

/**
 * Full-width mega menu with meaningful Lucide icons per subcategory.
 */
export default function MegaMenu({ open, category, onNavigate }) {
  if (!open || !category) return null

  const categorySlug = category.slug || slugify(category.name)
  const subcategories = category.subcategories || []

  return (
    <div
      className="absolute inset-x-0 top-full z-40 border-t border-gold-hairline/20 bg-base shadow-[0_16px_48px_rgba(0,0,0,0.14)] animate-fade-in"
      role="region"
      aria-label={`${category.name} subcategories`}
    >
      <Container className="py-7 sm:py-8">
        {subcategories.length ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {subcategories.map((sub) => {
              const subSlug = sub.slug || slugify(sub.name)
              const Icon = getSubcategoryIcon(sub.name)

              return (
                <Link
                  key={sub.id || subSlug}
                  to={`/category/${categorySlug}/${subSlug}`}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 rounded-md px-2.5 py-3 transition duration-200 hover:bg-gold/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gold-hairline/30 bg-base text-gold shadow-sm transition duration-200 group-hover:border-gold group-hover:bg-gold group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-charcoal transition group-hover:text-dark">
                    {sub.name}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal/60">No subcategories in this category yet.</p>
            <Link
              to={`/category/${categorySlug}`}
              onClick={onNavigate}
              className="text-sm font-medium text-gold hover:text-gold-light"
            >
              Browse {category.name} →
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}
