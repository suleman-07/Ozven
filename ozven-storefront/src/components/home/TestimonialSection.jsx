import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Quote, Star } from 'lucide-react'
import Container from '../common/Container'
import { REVIEWS } from '../../data/reviews'

const stackImages = [
  '/testimonials/testimonial-card-1.jpg',
  '/testimonials/testimonial-card-2.jpg',
  '/testimonials/testimonial-card-3.jpg',
]

const homeTestimonials = REVIEWS.slice(0, 3).map((review) => ({
  ...review,
  initials: review.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2),
}))

export default function TestimonialSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % homeTestimonials.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [])

  const active = homeTestimonials[index]

  return (
    <section className="relative overflow-hidden border-t border-charcoal/8 bg-base py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 90% 20%, rgba(201,162,75,0.08), transparent 55%)',
        }}
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              Testimonials
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-charcoal sm:text-4xl">
              Trusted by teams who ship with intention
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal">
                  5.0 rated
                </span>
              </div>
              <span className="hidden h-4 w-px bg-charcoal/15 sm:block" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                Verified client feedback
              </span>
            </div>

            <div className="relative mt-8 rounded-sm bg-white px-6 py-7 shadow-[0_16px_44px_rgba(13,13,13,0.06)] ring-1 ring-charcoal/5 sm:px-8 sm:py-8">
              <Quote
                className="absolute right-6 top-6 h-8 w-8 text-gold/25 sm:right-8 sm:top-8"
                strokeWidth={1.4}
                fill="currentColor"
              />

              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold text-sm font-bold text-dark">
                  {active.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{active.name}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {active.role}
                    {active.company ? ` · ${active.company}` : ''}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-lg font-display text-lg leading-snug text-charcoal sm:text-xl">
                “{active.quote}”
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex text-gold">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold" strokeWidth={0} />
                  ))}
                </div>
                <div className="flex gap-2">
                  {homeTestimonials.map((item, dotIndex) => (
                    <button
                      key={item.name}
                      type="button"
                      aria-label={`Show testimonial ${dotIndex + 1}`}
                      onClick={() => setIndex(dotIndex)}
                      className={[
                        'h-2.5 rounded-full transition-all duration-300',
                        dotIndex === index ? 'w-8 bg-gold' : 'w-2.5 bg-charcoal/20 hover:bg-charcoal/35',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/reviews"
              className="mt-6 inline-flex text-sm font-semibold text-gold transition hover:text-gold-light"
            >
              Read all reviews →
            </Link>
          </div>

          <div className="relative mx-auto h-[22rem] w-full max-w-sm sm:h-[26rem] lg:mx-0 lg:max-w-md">
            {stackImages.map((src, cardIndex) => {
              const offsets = [
                'left-0 z-30 rotate-[-2deg]',
                'left-10 z-20 rotate-[3deg] sm:left-14',
                'left-20 z-10 rotate-[-5deg] sm:left-28',
              ]
              return (
                <div
                  key={src}
                  className={[
                    'absolute top-0 h-full w-[68%] overflow-hidden rounded-md border-2 border-gold bg-dark-alt shadow-soft transition duration-500',
                    offsets[cardIndex],
                    cardIndex === index % stackImages.length ? 'scale-100 opacity-100' : 'opacity-95',
                  ].join(' ')}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
