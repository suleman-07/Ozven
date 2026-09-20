import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import CategoryHero from '../components/common/CategoryHero'
import Container from '../components/common/Container'
import ErrorMessage from '../components/common/ErrorMessage'
import { ProductGridSkeleton } from '../components/common/Skeleton'
import ProductGrid from '../components/product/ProductGrid'
import { getCategories, getProducts } from '../api'
import useFetch from '../hooks/useFetch'
import {
  getCategoryDescription,
  getCategoryLabel,
  slugify,
} from '../utils/catalog'

export default function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams()

  const {
    data: categories = [],
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(() => getCategories(), [])

  const { category, subcategory } = useMemo(() => {
    const list = Array.isArray(categories) ? categories : []
    const matchedCategory =
      list.find((item) => (item.slug || slugify(item.name)) === categorySlug) || null
    const matchedSub =
      matchedCategory?.subcategories?.find(
        (item) => (item.slug || slugify(item.name)) === subcategorySlug
      ) || null
    return { category: matchedCategory, subcategory: matchedSub }
  }, [categories, categorySlug, subcategorySlug])

  const {
    data: productPayload,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useFetch(
    () =>
      subcategory?.id
        ? getProducts({
            page: 1,
            limit: 24,
            subcategoryId: subcategory.id,
            status: 'ACTIVE',
          })
        : Promise.resolve({ products: [] }),
    [subcategory?.id]
  )

  if (categoriesLoading) {
    return (
      <Container className="py-16">
        <ProductGridSkeleton />
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

  if (!category || !subcategory) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-charcoal">Subcategory not found</h1>
        <Link to="/products" className="mt-6 inline-flex text-gold">
          Browse products →
        </Link>
      </Container>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: category.name, to: `/category/${category.slug || categorySlug}` },
          { label: subcategory.name },
        ]}
      />

      <CategoryHero
        label={getCategoryLabel(category.name)}
        title={subcategory.name}
        description={getCategoryDescription(subcategory.name, category.name)}
      />

      <section className="py-14 sm:py-16">
        <Container>
          <ProductGrid
            products={productPayload?.products || []}
            loading={productsLoading}
            error={productsError}
            onRetry={refetchProducts}
            emptyMessage="No products in this subcategory yet."
          />
        </Container>
      </section>
    </>
  )
}
