import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const faqs = [
  {
    question: 'What is the typical minimum order quantity?',
    answer:
      'MOQs depend on structure and finish. Many custom box styles start in the low hundreds; short-run options are available for launches and sampling. Share your brief and we will confirm a realistic quantity band.',
  },
  {
    question: 'How long does production take?',
    answer:
      'After artwork and structural approval, standard production often runs 2–4 weeks depending on complexity, materials, and finishing. Rush windows can be discussed when capacity allows.',
  },
  {
    question: 'Can Ozven help with dielines and design?',
    answer:
      'Yes. We provide structural guidance, dielines, and free design support to refine artwork for print. You keep brand control — we make sure it manufactures cleanly.',
  },
  {
    question: 'Which materials and finishes can I specify?',
    answer:
      'We work with kraft, SBS, rigid board, recycled stocks, soft-touch, foil, emboss/deboss, spot UV, and protective laminates. Material choices are matched to protection needs and brand feel.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'We support domestic and international fulfillment. Freight options and lead times are confirmed with your quote based on destination and carton volume.',
  },
]

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="border-t border-charcoal/8 bg-base py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title="Answers before you brief us"
              description="Common questions from brands starting custom packaging with Ozven."
            />
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-gold-hairline/25 border-y border-gold-hairline/25">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-gold"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    >
                      <span className="font-display text-lg text-charcoal sm:text-xl">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={[
                          'mt-1 h-5 w-5 shrink-0 text-gold transition duration-300',
                          isOpen ? 'rotate-180' : '',
                        ].join(' ')}
                        strokeWidth={1.75}
                      />
                    </button>
                    {isOpen ? (
                      <p className="pb-5 pr-8 text-sm leading-relaxed text-charcoal/70">
                        {item.answer}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
