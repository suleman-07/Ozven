import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const testimonials = [
  {
    quote:
      'Ozven turned our launch kit into something people photograph. The structure felt intentional — not decorative for its own sake.',
    name: 'Amelia Cho',
    role: 'Brand Director, Northline',
  },
  {
    quote:
      'Color matching across three SKUs was flawless. Their team treated packaging as part of the product, not an afterthought.',
    name: 'Jonah Reed',
    role: 'Founder, Atelier Form',
  },
  {
    quote:
      'We needed short runs with premium finishes. Ozven delivered samples quickly and production that matched the proof exactly.',
    name: 'Priya Nair',
    role: 'Ops Lead, Ember Goods',
  },
]

export default function TestimonialSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [])

  const active = testimonials[index]

  return (
    <section className="bg-dark py-20 text-base sm:py-24">
      <Container>
        <SectionHeading
          light
          align="center"
          eyebrow="Testimonials"
          title="What partners say"
          description="Placeholder stories from teams who ship with intention."
          className="mb-12"
        />

        <div className="relative mx-auto max-w-3xl border border-gold-hairline/30 px-8 py-12 text-center sm:px-12">
          <p className="font-display text-2xl leading-snug text-base sm:text-3xl">“{active.quote}”</p>
          <footer className="mt-8">
            <p className="text-sm font-medium text-base">{active.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">{active.role}</p>
          </footer>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() =>
                setIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
              }
              className="inline-flex h-10 w-10 items-center justify-center border border-gold-hairline/40 text-gold hover:border-gold"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((item, dotIndex) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial ${dotIndex + 1}`}
                  onClick={() => setIndex(dotIndex)}
                  className={[
                    'h-2 w-2 rounded-full transition',
                    dotIndex === index ? 'bg-gold' : 'bg-base/30 hover:bg-base/50',
                  ].join(' ')}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setIndex((current) => (current + 1) % testimonials.length)}
              className="inline-flex h-10 w-10 items-center justify-center border border-gold-hairline/40 text-gold hover:border-gold"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 hidden gap-5 lg:grid lg:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="border border-gold-hairline/20 px-5 py-6">
              <p className="text-sm leading-relaxed text-base/75">“{item.quote}”</p>
              <footer className="mt-5 text-xs uppercase tracking-[0.16em] text-gold">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
