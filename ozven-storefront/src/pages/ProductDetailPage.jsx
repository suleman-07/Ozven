import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import ErrorMessage from '../components/common/ErrorMessage'
import Loader from '../components/common/Loader'
import SectionHeading from '../components/common/SectionHeading'
import ImageGallery from '../components/product/ImageGallery'
import ProductGrid from '../components/product/ProductGrid'
import { getProductBySlug, getProducts } from '../api'
import useFetch from '../hooks/useFetch'
import { formatPrice, slugify } from '../utils/catalog'

export default function ProductDetailPage() {
  const { productSlug } = useParams()
  const { data: product, loading, error, refetch } = useFetch(
    () => getProductBySlug(productSlug),
    [productSlug]
  )

  const categoryId = product?.subcategory?.categoryId || product?.subcategory?.category?.id || ''
  const subcategoryId = product?.subcategoryId || product?.subcategory?.id || ''

  const { data: relatedPayload, loading: relatedLoading } = useFetch(
    () =>
      categoryId || subcategoryId
        ? getProducts({
            page: 1,
            limit: 8,
            categoryId: categoryId || undefined,
            subcategoryId: subcategoryId || undefined,
            status: 'ACTIVE',
          })
        : Promise.resolve({ products: [] }),
    [categoryId, subcategoryId]
  )

  const relatedProducts = useMemo(() => {
    const list = relatedPayload?.products || []
    return list.filter((item) => item.slug !== productSlug && item.id !== product?.id).slice(0, 3)
  }, [relatedPayload, productSlug, product?.id])

  if (loading) return <Loader className="min-h-[50vh]" label="Loading product…" />

  if (error) {
    return (
      <Container className="py-16">
        <ErrorMessage message={error} onRetry={refetch} />
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-charcoal">Product not found</h1>
        <Link to="/products" className="mt-6 inline-flex text-gold">
          Back to products →
        </Link>
      </Container>
    )
  }

  const categoryName = product.subcategory?.category?.name
  const categorySlug = product.subcategory?.category?.slug || slugify(categoryName || '')
  const shortDescription =
    product.shortDescription ||
    product.summary ||
    (product.description ? String(product.description).slice(0, 180) : '')

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          ...(categoryName
            ? [{ label: categoryName, to: categorySlug ? `/category/${categorySlug}` : '/products' }]
            : []),
          { label: product.name },
        ]}
      />

      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ImageGallery product={product} />

          <div>
            {categoryName ? (
              <p className="text-xs uppercase tracking-[0.22em] text-gold">{categoryName}</p>
            ) : null}
            <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-charcoal/80">{formatPrice(product)}</p>
            {shortDescription ? (
              <p className="mt-5 text-base leading-relaxed text-charcoal/70">{shortDescription}</p>
            ) : null}

            <div className="mt-8">
              <Button
                size="lg"
                to={`/contact?productName=${encodeURIComponent(product.name)}&productId=${encodeURIComponent(product.id || '')}`}
              >
                Get Quote
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {product.description ? (
        <section className="border-t border-gold-hairline/20 py-12">
          <Container className="max-w-3xl">
            <h2 className="font-display text-3xl text-charcoal">Description</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-charcoal/75">
              {product.description}
            </p>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-gold-hairline/20 py-16">
        <Container>
          <SectionHeading
            eyebrow="Related"
            title="You may also like"
            description="More packaging from the same collection."
            className="mb-10"
          />
          <ProductGrid
            products={relatedProducts}
            loading={relatedLoading}
            emptyMessage="Related products will appear here when more items share this category."
          />
        </Container>
      </section>
    </>
  )
}
