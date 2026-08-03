import { Link } from 'react-router-dom'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'
import ErrorMessage from '../common/ErrorMessage'
import { CategoryGridSkeleton } from '../common/Skeleton'
import { getCategoryImage, slugify } from '../../utils/catalog'

export default function CategoryGrid({ categories = [], loading, error, onRetry }) {
  return (
    <section className="bg-base py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Collections"
          title="Shop by category"
          description="Explore packaging families crafted for retail, subscription, gifting, and specialty use."
        />

        {loading ? <div className="mt-12"><CategoryGridSkeleton /></div> : null}
        {error ? <ErrorMessage className="mt-12" message={error} onRetry={onRetry} /> : null}

        {!loading && !error ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.length ? (
              categories.map((category) => {
                const slug = category.slug || slugify(category.name)
                const image = getCategoryImage(category)

                return (
                  <Link
                    key={category.id || slug}
                    to={`/category/${slug}`}
                    className="group overflow-hidden border border-gold-hairline/25 bg-base transition duration-300 hover:border-gold hover:shadow-soft"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-dark-alt">
                      {image ? (
                        <img
                          src={image}
                          alt={category.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-dark to-dark-alt">
                          <span className="font-display text-3xl tracking-[0.12em] text-gold/70">
                            OZVEN
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <h3 className="font-display text-xl text-charcoal transition group-hover:text-gold">
                        {category.name}
                      </h3>
                      <span className="text-sm text-gold opacity-0 transition group-hover:opacity-100">
                        →
                      </span>
                    </div>
                  </Link>
                )
              })
            ) : (
              <p className="col-span-full border border-dashed border-gold-hairline/40 px-6 py-12 text-center text-sm text-charcoal/60">
                Categories will appear here once the public API is connected.
              </p>
            )}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
