import {
  BadgeCheck,
  Leaf,
  Package,
  Palette,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const reasons = [
  {
    icon: Package,
    title: 'Structural expertise',
    copy: 'Boxes engineered for protection, presentation, and efficient packing.',
  },
  {
    icon: Palette,
    title: 'Brand-true finishes',
    copy: 'Color-managed print and premium finishes that stay consistent at scale.',
  },
  {
    icon: Leaf,
    title: 'Responsible materials',
    copy: 'Recycled and FSC-ready stocks available without compromising feel.',
  },
  {
    icon: Truck,
    title: 'Reliable timelines',
    copy: 'Clear production windows from sample approval through delivery.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality control',
    copy: 'Checks at proofing and production so every unit ships with confidence.',
  },
  {
    icon: BadgeCheck,
    title: 'Dedicated support',
    copy: 'Design guidance and quoting support from brief to first shipment.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-base py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why Choose Us"
          title="Six reasons brands choose Ozven"
          description="From structure to finishing — every detail is built to protect the product and elevate the brand."
          className="mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="border border-gold-hairline/25 bg-base px-6 py-8 transition hover:border-gold"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center border border-gold-hairline/40 text-gold">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 font-display text-xl text-charcoal">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{copy}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
