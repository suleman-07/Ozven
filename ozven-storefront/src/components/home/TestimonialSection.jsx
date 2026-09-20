import { useEffect, useState } from 'react'
import { Quote, Star } from 'lucide-react'
import Container from '../common/Container'

const testimonials = [
  {
    quote:
      'Ozven turned our launch kit into something people photograph. The structure felt intentional — not decorative for its own sake.',
    name: 'Amelia Cho',
    company: 'Northline',
    initials: 'AC',
    rating: 5,
  },
  {
    quote:
      'Color matching across three SKUs was flawless. Their team treated packaging as part of the product, not an afterthought.',
    name: 'Jonah Reed',
    company: 'Atelier Form',
    initials: 'JR',
    rating: 5,
  },
  {
    quote:
      'We needed short runs with premium finishes. Ozven delivered samples quickly and production that matched the proof exactly.',
    name: 'Priya Nair',
    company: 'Ember Goods',
    initials: 'PN',
    rating: 5,
  },
]

const stackImages = [
  '/testimonials/testimonial-card-1.jpg',
  '/testimonials/testimonial-card-2.jpg',
  '/testimonials/testimonial-card-3.jpg',
]

export default function TestimonialSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [])

  const active = testimonials[index]

  return (
    <section className="border-t border-charcoal/8 bg-base py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/70">
                Verified client feedback
              </span>
              <span className="hidden h-4 w-px bg-charcoal/15 sm:block" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/70">
                Brand partners
              </span>
            </div>

            <h2 className="mt-6 font-display text-3xl leading-tight text-charcoal sm:text-4xl">
              Client testimonial
            </h2>
            <p className="mt-3 max-w-md text-xs font-medium uppercase tracking-[0.16em] text-charcoal/65">
              Get to know our service through brands we package with
            </p>

            <Quote className="mt-8 h-10 w-10 text-gold/80" strokeWidth={1.4} fill="currentColor" />

            <div className="mt-5 flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-gold text-sm font-bold text-dark">
                {active.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-charcoal">{active.name}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                  {active.company}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-lg text-sm italic leading-relaxed text-charcoal sm:text-[0.95rem]">
              “{active.quote}”
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex text-gold">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" strokeWidth={0} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              {testimonials.map((item, dotIndex) => (
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
                    cardIndex === index % stackImages.length
                      ? 'scale-100 opacity-100'
                      : 'opacity-95',
                  ].join(' ')}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
