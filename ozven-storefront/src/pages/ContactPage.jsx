import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import SectionHeading from '../components/common/SectionHeading'
import { createQuote } from '../api'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  productName: 'General Quote',
}

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

const fieldClassName =
  'w-full border border-gold-hairline/30 bg-base px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const prefillProduct = searchParams.get('productName') || 'General Quote'
  const prefillProductId = searchParams.get('productId') || ''

  const [form, setForm] = useState({
    ...initialForm,
    productName: prefillProduct,
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      await createQuote({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        productName: form.productName || 'General Quote',
        productId: prefillProductId || undefined,
      })
      setSuccess(true)
      setForm({ ...initialForm, productName: prefillProduct })
    } catch (err) {
      setError(err?.message || 'Unable to submit quote right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <section className="bg-base py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-16">
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
                  className="flex gap-4 border border-gold-hairline/25 bg-base px-5 py-4"
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

          <div className="border border-gold-hairline/30 bg-base p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-2xl text-charcoal sm:text-3xl">Request a quote</h2>
            <p className="mt-2 text-sm text-charcoal/65">
              Submissions go to the public quotes API.
            </p>

            {success ? (
              <div className="mt-8 border border-emerald/30 bg-emerald/[0.06] px-5 py-6 text-sm text-emerald">
                Quote request submitted successfully. We’ll be in touch soon.
              </div>
            ) : null}
            {error ? (
              <div className="mt-8 border border-gold-hairline/40 px-5 py-4 text-sm text-charcoal" role="alert">
                {error}
              </div>
            ) : null}

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <label className="block text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Name
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={onChange}
                  className={fieldClassName}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  className={fieldClassName}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Phone
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  minLength={7}
                  value={form.phone}
                  onChange={onChange}
                  className={fieldClassName}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Product
                </span>
                <input
                  name="productName"
                  type="text"
                  required
                  value={form.productName}
                  onChange={onChange}
                  className={fieldClassName}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  minLength={5}
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  className={`${fieldClassName} resize-y`}
                />
              </label>

              <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? 'Sending…' : 'Send quote request'}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  )
}
