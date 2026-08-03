import { Leaf, Palette, Zap } from 'lucide-react'
import Container from '../common/Container'

const badges = [
  { icon: Leaf, label: 'Eco-Friendly', detail: 'Sustainable material options' },
  { icon: Palette, label: 'Free Design Support', detail: 'Guidance from concept to proof' },
  { icon: Zap, label: 'Fast Turnaround', detail: 'Production built around your launch' },
]

export default function TrustBadges() {
  return (
    <section className="border-y border-gold-hairline/20 bg-base py-10">
      <Container>
        <div className="grid gap-4 sm:grid-cols-3">
          {badges.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="flex items-start gap-4 border border-emerald/25 bg-emerald/[0.04] px-5 py-5"
            >
              <span className="mt-0.5 inline-flex text-emerald">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-medium text-emerald">{label}</p>
                <p className="mt-1 text-xs text-charcoal/65">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
