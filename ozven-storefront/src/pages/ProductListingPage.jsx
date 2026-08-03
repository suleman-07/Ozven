import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import Container from '../components/common/Container'
import SectionHeading from '../components/common/SectionHeading'
import ProductFilters from '../components/product/ProductFilters'
import ProductGrid from '../components/product/ProductGrid'
import { getCategories, getProducts } from '../api'
import useFetch from '../hooks/useFetch'

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filters = useMemo(
    () => ({
      categoryId: searchParams.get('categoryId') || '',
      subcategoryId: searchParams.get('subcategoryId') || '',
      sort: searchParams.get('sort') || 'desc',
      page: Number(searchParams.get('page') || 1),
    }),
    [searchParams]
  )

  const { data: categories = [] } = useFetch(() => getCategories(), [])

  const {
    data: productPayload,
    loading,
    error,
    refetch,
  } = useFetch(
    () =>
      getProducts({
        page: filters.page,
        limit: 12,
        categoryId: filters.categoryId || undefined,
        subcategoryId: filters.subcategoryId || undefined,
        sort: filters.sort,
        status: 'ACTIVE',
      }),
    [filters.page, filters.categoryId, filters.subcategoryId, filters.sort]
  )

  const products = productPayload?.products || []
  const pagination = productPayload?.pagination || {
    page: filters.page,
    totalPages: 1,
    total: products.length,
  }

  const applyFilters = (next) => {
    const params = new URLSearchParams()
    if (next.categoryId) params.set('categoryId', next.categoryId)
    if (next.subcategoryId) params.set('subcategoryId', next.subcategoryId)
    if (next.sort && next.sort !== 'desc') params.set('sort', next.sort)
    params.set('page', '1')
    setSearchParams(params)
  }

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />

      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Catalogue"
            title="All products"
            description="Filter by category or subcategory to find the right packaging structure."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <ProductFilters
                categories={Array.isArray(categories) ? categories : []}
                categoryId={filters.categoryId}
                subcategoryId={filters.subcategoryId}
                onChange={applyFilters}
              />
            </div>

            <div>
              <div className="mb-6 lg:hidden">
                <ProductFilters
                  collapsible
                  open={mobileFiltersOpen}
                  onToggle={() => setMobileFiltersOpen((value) => !value)}
                  categories={Array.isArray(categories) ? categories : []}
                  categoryId={filters.categoryId}
                  subcategoryId={filters.subcategoryId}
                  onChange={applyFilters}
                />
              </div>

              <ProductGrid
                products={products}
                loading={loading}
                error={error}
                onRetry={refetch}
                emptyMessage="No products match these filters."
              />

              {pagination.totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={filters.page <= 1}
                    onClick={() => goToPage(filters.page - 1)}
                    className="border border-gold-hairline/40 px-4 py-2 text-sm text-charcoal disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-charcoal/70">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={filters.page >= pagination.totalPages}
                    onClick={() => goToPage(filters.page + 1)}
                    className="border border-gold-hairline/40 px-4 py-2 text-sm text-charcoal disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
