import { Link } from 'react-router-dom'
import { Quote, Star } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import { REVIEWS } from '../data/reviews'

const STATS = [
  { value: '5.0', label: 'Average rating' },
  { value: '120+', label: 'Brand partners' },
  { value: '98%', label: 'Would reorder' },
]

function Stars({ count = 5, className = '' }) {
  return (
    <div className={`flex text-gold ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-gold" strokeWidth={0} />
      ))}
    </div>
  )
}

function ReviewCard({ review, featured = false }) {
  return (
    <blockquote
      className={[
        'group relative flex h-full flex-col overflow-hidden bg-white px-7 py-8 transition duration-300 sm:px-8 sm:py-9',
        featured
          ? 'shadow-[0_20px_50px_rgba(13,13,13,0.08)] ring-1 ring-gold/25'
          : 'shadow-[0_14px_40px_rgba(13,13,13,0.06)] ring-1 ring-charcoal/5 hover:shadow-[0_20px_50px_rgba(13,13,13,0.09)] hover:ring-gold/20',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute -right-3 -top-4 font-display text-7xl leading-none text-gold/10 transition group-hover:text-gold/15">
        ”
      </div>

      <div className="flex items-center justify-between gap-3">
        <Stars count={review.rating} />
        <Quote className="h-5 w-5 text-gold/70" strokeWidth={1.5} />
      </div>

      <p className="relative mt-5 font-display text-[1.15rem] leading-snug text-charcoal sm:text-xl sm:leading-[1.45]">
        “{review.quote}”
      </p>

      <footer className="mt-auto pt-8">
        <div className="h-px w-10 bg-gold/60" aria-hidden />
        <p className="mt-4 text-sm font-semibold text-charcoal">{review.name}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {review.role}
          {review.company ? ` · ${review.company}` : ''}
        </p>
      </footer>
    </blockquote>
  )
}

export default function ReviewsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Reviews' }]} />

      <section className="relative overflow-hidden bg-base py-14 sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 12% 0%, rgba(201,162,75,0.1), transparent 55%), radial-gradient(ellipse 40% 40% at 100% 20%, rgba(31,77,58,0.06), transparent 50%)',
          }}
          aria-hidden
        />

        <Container className="relative">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              Testimonials
            </p>
            <h1 className="mt-4 font-display text-[2.15rem] leading-tight text-charcoal sm:text-4xl lg:text-[2.85rem]">
              Trusted by teams who ship with intention
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/65 sm:text-[0.95rem]">
              Real feedback from brand and operations partners who chose Ozven for packaging that
              feels like part of the product.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 border-y border-charcoal/8 py-6 sm:mt-12 sm:gap-12">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-charcoal sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {REVIEWS.map((review, index) => (
              <ReviewCard key={review.name} review={review} featured={index === 0} />
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 border border-charcoal/8 bg-white px-6 py-8 shadow-[0_14px_40px_rgba(13,13,13,0.04)] sm:mt-16 sm:flex-row sm:items-center sm:px-10 sm:py-9">
            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Share your experience
              </p>
              <h2 className="mt-2 font-display text-2xl text-charcoal sm:text-[1.75rem]">
                Building packaging with Ozven?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                Tell us about your project — or leave a note after your next run. We read every
                message.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/contact" className="rounded-md px-7">
                Get a Quote
              </Button>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md border border-charcoal/15 bg-base px-7 py-3 text-sm font-semibold text-charcoal transition hover:border-gold hover:text-gold"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
