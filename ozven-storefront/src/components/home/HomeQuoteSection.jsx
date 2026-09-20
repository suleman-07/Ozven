import { Truck } from 'lucide-react'
import Container from '../common/Container'
import QuoteForm from '../common/QuoteForm'

export default function HomeQuoteSection() {
  return (
    <section className="border-t border-charcoal/8 bg-white py-16 sm:py-20">
      <Container>
        <div className="rounded-md border border-charcoal/10 bg-base p-6 shadow-soft sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-3xl leading-tight text-charcoal sm:text-4xl">
              Get custom quote
            </h2>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal">
              <Truck className="h-5 w-5 text-gold" strokeWidth={1.7} />
              Free Shipping
            </div>
          </div>

          <QuoteForm submitLabel="Submit" />
        </div>
      </Container>
    </section>
  )
}
