import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import Container from '../components/common/Container'
import ErrorMessage from '../components/common/ErrorMessage'
import { CategoryGridSkeleton, ProductGridSkeleton } from '../components/common/Skeleton'
import ProductGrid from '../components/product/ProductGrid'
import { getCategories, getProducts } from '../api'
import useFetch from '../hooks/useFetch'
import { getCategoryImage, slugify } from '../utils/catalog'

export default function CategoryPage() {
  const { categorySlug } = useParams()

  const {
    data: categories = [],
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(() => getCategories(), [])

  const category = useMemo(() => {
    const list = Array.isArray(categories) ? categories : []
    return list.find((item) => (item.slug || slugify(item.name)) === categorySlug) || null
  }, [categories, categorySlug])

  const subcategories = category?.subcategories || []
  const hasSubcategories = subcategories.length > 0

  const {
    data: productPayload,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useFetch(
    () =>
      category?.id
        ? getProducts({ page: 1, limit: 24, categoryId: category.id, status: 'ACTIVE' })
        : Promise.resolve({ products: [] }),
    [category?.id]
  )

  if (categoriesLoading) {
    return (
      <Container className="py-16">
        <CategoryGridSkeleton count={3} />
      </Container>
    )
  }

  if (categoriesError) {
    return (
      <Container className="py-16">
        <ErrorMessage message={categoriesError} onRetry={refetchCategories} />
      </Container>
    )
  }

  if (!category) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-charcoal">Category not found</h1>
        <p className="mt-3 text-sm text-charcoal/65">This collection may have moved.</p>
        <Link to="/products" className="mt-6 inline-flex text-gold hover:text-gold-light">
          Browse products →
        </Link>
      </Container>
    )
  }

  const products = productPayload?.products || []

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: category.name }]} />

      <section className="bg-dark py-14 text-base sm:py-16">
        <Container>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Category</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">{category.name}</h1>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          {hasSubcategories ? (
            <>
              <h2 className="font-display text-3xl text-charcoal">Subcategories</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {subcategories.map((sub) => {
                  const image = getCategoryImage(sub)
                  return (
                    <Link
                      key={sub.id}
                      to={`/category/${category.slug || categorySlug}/${sub.slug || slugify(sub.name)}`}
                      className="group overflow-hidden border border-gold-hairline/25 transition hover:border-gold hover:shadow-soft"
                    >
                      <div className="aspect-[16/10] bg-dark-alt">
                        {image ? (
                          <img
                            src={image}
                            alt={sub.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-display text-2xl text-gold/60">
                            OZVEN
                          </div>
                        )}
                      </div>
                      <div className="px-5 py-4">
                        <h3 className="font-display text-xl text-charcoal group-hover:text-gold">
                          {sub.name}
                        </h3>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-16">
                <h2 className="mb-8 font-display text-3xl text-charcoal">Products in this category</h2>
                {productsLoading ? (
                  <ProductGridSkeleton />
                ) : (
                  <ProductGrid
                    products={products}
                    loading={false}
                    error={productsError}
                    onRetry={refetchProducts}
                    emptyMessage="No products in this category yet."
                  />
                )}
              </div>
            </>
          ) : productsLoading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid
              products={products}
              loading={false}
              error={productsError}
              onRetry={refetchProducts}
              emptyMessage="No products in this category yet. Check back soon."
            />
          )}
        </Container>
      </section>
    </>
  )
}
