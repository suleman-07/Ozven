import { useSearchParams } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Container from '../components/common/Container'
import QuoteForm from '../components/common/QuoteForm'
import SectionHeading from '../components/common/SectionHeading'

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (000) 000-0000',
    href: 'tel:+10000000000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@ozven.example',
    href: 'mailto:hello@ozven.example',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Packaging Avenue, Suite 100, Your City, ST 00000',
    href: null,
  },
]

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const prefillProduct = searchParams.get('productName') || ''
  const prefillProductId = searchParams.get('productId') || ''

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <section className="bg-base py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Get a custom quote"
              description="Share a few details and we’ll follow up with next steps for your packaging project."
            />

            <ul className="mt-10 space-y-5">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <li
                  key={label}
                  className="flex gap-4 rounded border border-gold-hairline/25 bg-base px-5 py-4"
                >
                  <span className="mt-0.5 inline-flex text-gold">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-sm text-charcoal hover:text-gold">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-charcoal">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-gold-hairline/30 bg-white p-6 shadow-soft sm:p-8">
            <QuoteForm
              showHeader
              defaultProductName={prefillProduct}
              productId={prefillProductId}
              submitLabel="Submit"
            />
          </div>
        </Container>
      </section>
    </>
  )
}
