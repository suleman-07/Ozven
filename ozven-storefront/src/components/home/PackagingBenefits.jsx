import {
  Boxes,
  CreditCard,
  Ruler,
  Stamp,
  Timer,
  Truck,
} from 'lucide-react'
import Container from '../common/Container'

const benefits = [
  { icon: Stamp, title: 'No die & plate charges' },
  { icon: Timer, title: 'Quick turnaround time' },
  { icon: Truck, title: 'Free shipping' },
  { icon: Boxes, title: 'Starting from 50 boxes' },
  { icon: Ruler, title: 'Customize size & style' },
  { icon: CreditCard, title: 'Free graphic designing' },
]

export default function PackagingBenefits() {
  return (
    <section className="border-t border-charcoal/8 bg-white py-14 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-tight text-charcoal sm:text-4xl">
            One place for custom packaging
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-[0.95rem]">
            Ozven offers custom packaging solutions and project support with pricing and service
            built for brands that care how they show up.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
          {benefits.map(({ icon: Icon, title }) => (
            <li key={title} className="group flex flex-col items-center text-center">
              <span className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-[1.5px] border-emerald/55 bg-white text-charcoal transition duration-300 group-hover:border-gold group-hover:text-gold group-hover:shadow-soft sm:h-[5.25rem] sm:w-[5.25rem]">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.4} />
              </span>
              <p className="mt-4 max-w-[9.5rem] text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-charcoal sm:text-[12px]">
                {title}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
