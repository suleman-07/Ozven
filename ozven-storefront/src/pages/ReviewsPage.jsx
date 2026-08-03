import Breadcrumb from '../components/common/Breadcrumb'
import Container from '../components/common/Container'
import SectionHeading from '../components/common/SectionHeading'

const placeholderReviews = [
  {
    name: 'Amelia Cho',
    role: 'Brand Director',
    quote: 'Ozven made our unboxing feel like part of the product — structured, calm, and premium.',
  },
  {
    name: 'Jonah Reed',
    role: 'Founder',
    quote: 'Color matching across SKUs was exact. The team treats packaging as brand architecture.',
  },
  {
    name: 'Priya Nair',
    role: 'Operations Lead',
    quote: 'Clear timelines, strong proofs, and finishes that held up from sample to production.',
  },
]

export default function ReviewsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Reviews' }]} />

      <section className="bg-dark py-16 text-base sm:py-20">
        <Container>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Reviews</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">What partners say</h1>
          <p className="mt-4 max-w-2xl text-base/70">
            Placeholder reviews for now — replace with real testimonials or a CMS feed later.
          </p>
        </Container>
      </section>

      <section className="bg-base py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by teams who ship with intention"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {placeholderReviews.map((review) => (
              <blockquote
                key={review.name}
                className="border border-gold-hairline/30 bg-base px-6 py-8 shadow-soft"
              >
                <p className="font-display text-xl leading-snug text-charcoal">“{review.quote}”</p>
                <footer className="mt-6">
                  <p className="text-sm font-medium text-charcoal">{review.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold">{review.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
