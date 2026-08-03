import { ArrowRight, BadgeCheck, Leaf, Package, ShieldCheck } from 'lucide-react'
import Button from '../common/Button'
import Container from '../common/Container'

const highlights = [
  { icon: ShieldCheck, label: 'Premium Quality' },
  { icon: Package, label: 'Custom Solutions' },
  { icon: Leaf, label: 'Sustainable Materials' },
  { icon: BadgeCheck, label: 'Brand Focused' },
]

export default function HeroSection() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-dark text-base sm:-mt-20">
      {/* Shared atmosphere — ties text and products into one field */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_18%_35%,rgba(201,162,75,0.12),transparent_55%),radial-gradient(ellipse_55%_50%_at_78%_48%,rgba(201,162,75,0.16),transparent_58%),radial-gradient(ellipse_40%_35%_at_85%_80%,rgba(31,77,58,0.14),transparent_50%)]" />

      <Container className="relative grid min-h-[88vh] items-center gap-8 py-28 sm:gap-10 sm:py-32 lg:grid-cols-[0.45fr_0.55fr] lg:gap-6 lg:py-24 xl:gap-4">
        {/* Left — keep content, refine balance only */}
        <div className="relative z-10 max-w-xl animate-fade-up lg:max-w-none">
          <h1 className="font-display text-4xl leading-[1.08] sm:text-5xl lg:text-[3.15rem] xl:text-[3.5rem]">
            Packaging that feels as considered as the{' '}
            <span className="text-gold">product</span> inside.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-base/65 sm:text-base">
            Custom boxes, mailers, and specialty structures engineered for brands that care about
            every first impression.
          </p>

          <div className="mt-9">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              className="uppercase tracking-[0.12em] shadow-[0_0_0_0_rgba(201,162,75,0)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(201,162,75,0.55)]"
            >
              Get a Custom Quote
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>

          <ul className="mt-12 flex flex-wrap items-center gap-x-0 gap-y-4 border-t border-white/10 pt-8 sm:mt-14">
            {highlights.map(({ icon: Icon, label }, index) => (
              <li
                key={label}
                className={[
                  'flex items-center gap-2.5 pr-4 sm:pr-5',
                  index > 0 ? 'border-l border-white/15 pl-4 sm:pl-5' : '',
                ].join(' ')}
              >
                <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-base/80 sm:text-[11px]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — cutout products floating in the same dark field */}
        <div className="relative z-0 flex min-h-[320px] items-center justify-center animate-fade-in sm:min-h-[400px] lg:min-h-[520px] lg:justify-end xl:min-h-[560px]">
          {/* Soft golden depth behind products */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.22)_0%,rgba(201,162,75,0.06)_42%,transparent_70%)] blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-[8%] left-1/2 h-16 w-[60%] -translate-x-1/2 rounded-full bg-black/50 blur-2xl"
            aria-hidden
          />

          <img
            src="/hero-packaging.png?v=4"
            alt="Ozven premium matte black packaging boxes with gold branding"
            className="relative w-[118%] max-w-none origin-center animate-float drop-shadow-[0_28px_50px_rgba(0,0,0,0.65)] sm:w-[112%] lg:w-[125%] xl:w-[130%]"
            fetchPriority="high"
            draggable={false}
          />
        </div>
      </Container>
    </section>
  )
}
