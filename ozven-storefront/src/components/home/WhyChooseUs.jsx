import {
  BadgeCheck,
  Leaf,
  Palette,
  Printer,
  Ruler,
  Sparkles,
  Tag,
  Truck,
} from 'lucide-react'
import Container from '../common/Container'

const features = [
  {
    icon: Ruler,
    title: 'Custom size & shape',
    copy: 'Structures built around your product, shelf, and packing line.',
  },
  {
    icon: Leaf,
    title: 'Responsible materials',
    copy: 'Board and kraft options that feel premium without excess waste.',
  },
  {
    icon: Printer,
    title: 'Color-true printing',
    copy: 'Managed print so brand artwork stays sharp from proof to run.',
  },
  {
    icon: Sparkles,
    title: 'Premium finishes',
    copy: 'Foil, emboss, spot UV, and soft-touch for a stronger unboxing.',
  },
  {
    icon: Truck,
    title: 'Reliable delivery',
    copy: 'Clear production windows timed to your launch schedule.',
  },
  {
    icon: Palette,
    title: 'Design support',
    copy: 'Artwork guidance and proofing from brief to final approval.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality control',
    copy: 'Checks at proof and production before anything ships.',
  },
  {
    icon: Tag,
    title: 'Transparent pricing',
    copy: 'Straightforward quotes with minimums that fit growing brands.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="border-t border-charcoal/8 bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
            Why Ozven
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-charcoal sm:text-4xl">
            Packaging support that protects the product and the brand
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-[0.95rem]">
            From structure to finishing, every detail is built for a clean launch and a lasting
            first impression.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="group rounded-md border border-charcoal/10 bg-base px-5 py-6 transition duration-300 hover:border-gold/45 hover:bg-white hover:shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold transition duration-300 group-hover:bg-gold group-hover:text-dark">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-sm font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-charcoal/70 sm:text-[0.8rem]">
                {copy}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
