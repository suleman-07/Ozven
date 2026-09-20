import { ArrowRight, Pencil, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import Container from '../common/Container'

const highlights = [
  { icon: ShieldCheck, label: 'Premium Quality' },
  { icon: Pencil, label: 'Fully Customizable' },
  { icon: Truck, label: 'Fast & Reliable' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/ozven-hero-banner.jpg?v=5"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-right"
        width={2048}
        height={682}
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />

      <Container className="relative z-10 flex min-h-[460px] items-center py-16 sm:min-h-[540px] sm:py-20 lg:min-h-[620px] lg:py-24">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Custom packaging solutions
          </p>

          <h1 className="mt-3 text-[1.85rem] font-bold leading-[1.15] tracking-tight text-charcoal sm:text-[2.35rem] lg:text-[2.6rem]">
            Custom Boxes &amp; Packaging for{' '}
            <span className="text-gold">Your Brand</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/70 sm:text-[0.95rem]">
            Premium quality, fully customizable packaging and boxes that make your products stand
            out and leave a lasting impression.
          </p>

          <ul className="mt-5 flex flex-wrap items-center gap-y-2 text-xs font-medium text-charcoal/75 sm:text-[13px]">
            {highlights.map(({ icon: Icon, label }, index) => (
              <li key={label} className="inline-flex items-center">
                {index > 0 ? (
                  <span className="mx-3 hidden h-4 w-px bg-charcoal/20 sm:mx-4 sm:block" aria-hidden />
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-charcoal/55" strokeWidth={1.7} />
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              to="/contact"
              className="rounded-md px-6 py-3 text-sm tracking-wide shadow-sm hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(201,162,75,0.28)]"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-charcoal/20 bg-white/90 px-6 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              Explore Packaging Styles
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
