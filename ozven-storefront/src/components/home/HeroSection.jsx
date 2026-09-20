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
    <section className="relative overflow-hidden bg-[#f3efe6]">
      {/* Banner — push products to the right on small screens */}
      <img
        src="/ozven-hero-banner.jpg?v=5"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[78%_center] sm:object-[70%_center] lg:object-right"
        width={2048}
        height={682}
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />

      {/* Readable cream veil — stronger on mobile so text never sits on dark bags */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f3efe6] via-[#f3efe6]/95 to-[#f3efe6]/25 sm:via-[#f3efe6]/88 sm:to-transparent lg:w-[58%] lg:to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-b from-[#f3efe6]/80 via-transparent to-[#f3efe6]/50 sm:hidden"
        aria-hidden
      />

      <Container className="relative z-10 flex min-h-[380px] items-center py-10 sm:min-h-[480px] sm:py-16 lg:min-h-[560px] lg:py-20">
        <div className="w-full max-w-lg lg:max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-[11px] sm:tracking-[0.22em]">
            Custom packaging solutions
          </p>

          <h1 className="mt-2.5 text-[1.55rem] font-bold leading-[1.18] tracking-tight text-charcoal sm:mt-3 sm:text-[2.2rem] lg:text-[2.55rem]">
            Custom Boxes &amp; Packaging for{' '}
            <span className="text-gold">Your Brand</span>
          </h1>

          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-charcoal/75 sm:mt-4 sm:text-sm lg:text-[0.95rem]">
            Premium quality, fully customizable packaging and boxes that make your products stand
            out and leave a lasting impression.
          </p>

          <ul className="mt-4 flex flex-col gap-2 text-[12px] font-medium text-charcoal/75 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-2 sm:text-[13px]">
            {highlights.map(({ icon: Icon, label }, index) => (
              <li key={label} className="inline-flex items-center">
                {index > 0 ? (
                  <span
                    className="mx-3 hidden h-4 w-px bg-charcoal/20 sm:mx-3.5 sm:block"
                    aria-hidden
                  />
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-charcoal/55 sm:h-4 sm:w-4" strokeWidth={1.7} />
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:gap-3">
            <Button
              to="/contact"
              size="sm"
              className="h-11 w-full rounded-md px-5 text-[13px] tracking-wide shadow-sm sm:h-auto sm:w-auto sm:px-6 sm:py-3 sm:text-sm hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(201,162,75,0.28)]"
            >
              Request a Quote
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
            </Button>
            <Link
              to="/products"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-charcoal/20 bg-white/95 px-5 text-[13px] font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 hover:text-gold sm:h-auto sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
            >
              Explore Packaging Styles
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
