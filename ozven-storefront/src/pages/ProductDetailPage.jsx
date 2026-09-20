import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BadgeCheck,
  Leaf,
  Palette,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
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
import { formatPrice, getCategoryLabel, slugify } from '../utils/catalog'

const FEATURES = [
  {
    icon: PencilRuler,
    title: 'Fully customizable',
    text: 'Size, structure, and print matched to your brand.',
  },
  {
    icon: Palette,
    title: 'Premium finishes',
    text: 'Foil, soft-touch, spot UV, emboss, and more.',
  },
  {
    icon: Leaf,
    title: 'Material options',
    text: 'Kraft, SBS, rigid, and recycled board grades.',
  },
  {
    icon: ShieldCheck,
    title: 'Production ready',
    text: 'Clear proofs, consistent quality, reliable lead times.',
  },
]

function buildShortDescription(product) {
  const raw =
    product.shortDescription ||
    product.summary ||
    (product.description ? String(product.description).replace(/\s+/g, ' ').trim() : '')
  if (!raw) {
    return 'Custom packaging crafted for shelf presence, product protection, and a refined unboxing experience.'
  }
  return raw.length > 220 ? `${raw.slice(0, 217).trim()}…` : raw
}

function buildSpecs(product) {
  const categoryName = product.subcategory?.category?.name
  const subcategoryName = product.subcategory?.name
  const rows = [
    { label: 'Product', value: product.name },
    categoryName ? { label: 'Collection', value: categoryName } : null,
    subcategoryName ? { label: 'Category', value: subcategoryName } : null,
    { label: 'Customization', value: 'Size, artwork, color & finish' },
    { label: 'Printing', value: 'CMYK / Pantone / specialty finishes' },
    { label: 'Minimums', value: 'Flexible MOQs — confirm on quote' },
    { label: 'Lead time', value: 'Typically 2–4 weeks after approval' },
    { label: 'Pricing', value: formatPrice(product) },
  ]
  return rows.filter(Boolean)
}

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
    return list.filter((item) => item.slug !== productSlug && item.id !== product?.id).slice(0, 4)
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
  const subcategoryName = product.subcategory?.name
  const subcategorySlug = product.subcategory?.slug || slugify(subcategoryName || '')
  const shortDescription = buildShortDescription(product)
  const specs = buildSpecs(product)
  const quoteTo = `/contact?productName=${encodeURIComponent(product.name)}&productId=${encodeURIComponent(product.id || '')}`

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          ...(categoryName
            ? [
                {
                  label: categoryName,
                  to: categorySlug ? `/category/${categorySlug}` : '/products',
                },
              ]
            : []),
          ...(subcategoryName && categorySlug
            ? [
                {
                  label: subcategoryName,
                  to: `/category/${categorySlug}/${subcategorySlug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      {/* Main product */}
      <section className="bg-base py-10 sm:py-14 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <ImageGallery product={product} />

          <div className="lg:pt-1">
            {categoryName ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                {getCategoryLabel(categoryName)}
              </p>
            ) : null}

            <h1 className="mt-3 font-display text-[2rem] leading-[1.15] tracking-tight text-charcoal sm:text-4xl lg:text-[2.75rem]">
              {product.name}
            </h1>

            <p className="mt-3 text-base text-charcoal/75 sm:text-lg">{formatPrice(product)}</p>

            {subcategoryName ? (
              <p className="mt-3 text-xs text-charcoal/55">
                In{' '}
                <Link
                  to={`/category/${categorySlug}/${subcategorySlug}`}
                  className="font-medium text-charcoal/70 underline-offset-2 hover:text-gold hover:underline"
                >
                  {subcategoryName}
                </Link>
              </p>
            ) : null}

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-charcoal/70 sm:text-[0.95rem] sm:leading-[1.7]">
              {shortDescription}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-charcoal/65 sm:text-[13px]">
              <li className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} />
                Custom print ready
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} />
                Made to your size
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} />
                Premium finishes
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" to={quoteTo} className="rounded-md px-8">
                Get Quote
              </Button>
              <Button
                size="lg"
                variant="secondary"
                to="/contact"
                className="rounded-md border-charcoal/20 bg-white px-8 text-charcoal hover:border-gold hover:text-gold"
              >
                Talk to us
              </Button>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-charcoal/50">
              Share quantity, dimensions, and artwork — we’ll confirm pricing and lead time.
            </p>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-charcoal/8 bg-white py-12 sm:py-14">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 sm:flex-col sm:gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-charcoal/60">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Specs + Description */}
      <section className="border-t border-charcoal/8 bg-base py-12 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-charcoal sm:text-3xl">Specifications</h2>
            <p className="mt-2 text-sm text-charcoal/55">
              Key details for quoting — final specs confirmed with your brief.
            </p>
            <dl className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {specs.map(({ label, value }) => (
                <div
                  key={label}
                  className="grid grid-cols-[7.5rem_1fr] gap-3 py-3.5 text-sm sm:grid-cols-[9rem_1fr]"
                >
                  <dt className="font-medium text-charcoal/55">{label}</dt>
                  <dd className="text-charcoal/85">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-2xl text-charcoal sm:text-3xl">Description</h2>
            {product.description ? (
              <p className="mt-5 whitespace-pre-line text-sm leading-[1.75] text-charcoal/75 sm:text-base">
                {product.description}
              </p>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-charcoal/65 sm:text-base">
                {shortDescription} Request a quote for structure, board, print, and finish options
                tailored to your product.
              </p>
            )}

            <div className="mt-8 rounded-md border border-gold/25 bg-white px-5 py-5 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                Need this customized?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Tell us your quantity, size, and brand goals — we’ll recommend the right structure
                and finish.
              </p>
              <Button to={quoteTo} className="mt-4 rounded-md">
                Request a custom quote
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="border-t border-charcoal/8 bg-white py-14 sm:py-16">
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
