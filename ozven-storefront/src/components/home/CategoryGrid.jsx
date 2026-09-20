import { Link } from 'react-router-dom'
import Container from '../common/Container'
import ErrorMessage from '../common/ErrorMessage'
import { CategoryGridSkeleton } from '../common/Skeleton'
import { getCategoryImage, slugify } from '../../utils/catalog'

function flattenSubcategories(categories = []) {
  return categories.flatMap((category) => {
    const categorySlug = category.slug || slugify(category.name)
    const subs = Array.isArray(category.subcategories) ? category.subcategories : []

    return subs.map((sub) => ({
      id: sub.id,
      name: sub.name,
      image: getCategoryImage(sub),
      to: `/category/${categorySlug}/${sub.slug || slugify(sub.name)}`,
    }))
  })
}

export default function CategoryGrid({ categories = [], loading, error, onRetry }) {
  const items = flattenSubcategories(categories)

  return (
    <section className="border-t border-charcoal/8 bg-base pt-8 pb-16 sm:pt-10 sm:pb-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-tight text-charcoal sm:text-4xl lg:text-[2.75rem]">
            Your custom packaging partner
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-[1rem]">
            We provide the best packaging solutions with customized printed box service, matched to
            your industry and product needs. Get high-quality custom boxes with logo through a
            flexible and simple packaging process.
          </p>
        </div>

        {loading ? (
          <div className="mt-12">
            <CategoryGridSkeleton count={8} />
          </div>
        ) : null}
        {error ? <ErrorMessage className="mt-12" message={error} onRetry={onRetry} /> : null}

        {!loading && !error ? (
          items.length ? (
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4">
              {items.map((item) => (
                <Link key={item.id} to={item.to} className="group text-center">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-dark-alt transition duration-300 group-hover:shadow-soft">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-display text-2xl tracking-[0.12em] text-gold/50">
                          OZVEN
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition group-hover:text-gold sm:text-[13px]">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 border border-dashed border-gold-hairline/40 px-6 py-12 text-center text-sm text-charcoal/60">
              Categories will appear here once the public API is connected.
            </p>
          )
        ) : null}
      </Container>
    </section>
  )
}
