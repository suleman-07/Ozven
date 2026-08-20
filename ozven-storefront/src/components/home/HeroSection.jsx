import { ArrowRight, Package, Sparkles, Truck } from 'lucide-react'
import Button from '../common/Button'
import Container from '../common/Container'

const trustItems = [
  { icon: Package, label: 'Custom Packaging' },
  { icon: Sparkles, label: 'Premium Materials' },
  { icon: Truck, label: 'Fast Delivery' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-dark">
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png?v=2"
          alt=""
          className="h-full w-full origin-right object-cover object-[72%_center] motion-safe:animate-hero-pulse"
          fetchPriority="high"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/88 to-dark/25 sm:via-dark/80 sm:to-dark/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/35" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[42%] top-16 hidden h-px w-28 bg-gradient-to-r from-transparent via-gold/50 to-transparent lg:block motion-safe:animate-float"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-[18%] hidden h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block motion-safe:animate-float [animation-delay:1.6s]"
      />

      <Container className="relative flex min-h-[34rem] items-center py-20 sm:min-h-[38rem] sm:py-24 lg:min-h-[42rem]">
        <div className="relative z-10 max-w-xl">
          <p className="motion-safe:animate-fade-up text-xs font-medium uppercase tracking-[0.28em] text-gold">
            Packaging products &amp; solutions
          </p>

          <h1 className="motion-safe:animate-fade-up mt-4 font-display text-[2.35rem] leading-[1.12] text-base delay-100 sm:text-5xl lg:text-[3.35rem]">
            Custom Boxes for{' '}
            <span className="italic text-gold-light">Your Brand</span>
          </h1>

          <p className="motion-safe:animate-fade-up mt-5 max-w-md text-sm leading-relaxed text-base/70 delay-200 sm:text-base">
            Shop packaging materials and custom solutions for boxes, bags, food, retail, and
            shipping — built to protect products and present your brand with precision.
          </p>

          <div className="motion-safe:animate-fade-up mt-8 flex flex-col gap-3 delay-300 sm:flex-row sm:items-center">
            <Button
              to="/products"
              size="lg"
              className="hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(201,162,75,0.28)]"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Button
              to="/contact"
              variant="secondary"
              size="lg"
              className="hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
            >
              Get Custom Packaging
            </Button>
          </div>

          <div className="motion-safe:animate-fade-up mt-10 delay-500">
            <div className="h-px w-full max-w-md bg-gradient-to-r from-gold-hairline/70 via-gold/25 to-transparent" />
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-base/80">
                  <span className="inline-flex h-8 w-8 items-center justify-center border border-gold-hairline/40 text-gold">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
