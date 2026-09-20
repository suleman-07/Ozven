import { useMemo, useState } from 'react'
import { Truck } from 'lucide-react'
import Button from './Button'
import { createQuote } from '../../api'

const fieldClassName =
  'w-full rounded border border-gold-hairline/30 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold'

const COLOR_OPTIONS = [
  'Black',
  'White',
  'Brown / Kraft',
  'Red',
  'Blue',
  'Green',
  'Custom / Pantone',
]

const initialForm = {
  name: '',
  email: '',
  phone: '',
  quantity: '',
  color: '',
  productName: '',
  length: '',
  width: '',
  depth: '',
  unit: 'inch',
  message: '',
  captchaAnswer: '',
}

function makeCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  return { a, b, sum: a + b }
}

export default function QuoteForm({
  defaultProductName = '',
  productId = '',
  submitLabel = 'Submit',
  showHeader = false,
  className = '',
}) {
  const [form, setForm] = useState({
    ...initialForm,
    productName: defaultProductName || '',
  })
  const [captcha, setCaptcha] = useState(makeCaptcha)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const sizeHint = useMemo(
    () => `Enter dimensions in ${form.unit}`,
    [form.unit],
  )

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setForm({
      ...initialForm,
      productName: defaultProductName || '',
    })
    setCaptcha(makeCaptcha())
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    if (Number(form.captchaAnswer) !== captcha.sum) {
      setError('Captcha answer is incorrect. Please try again.')
      setSubmitting(false)
      setCaptcha(makeCaptcha())
      setForm((current) => ({ ...current, captchaAnswer: '' }))
      return
    }

    try {
      await createQuote({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        quantity: Number(form.quantity),
        color: form.color.trim(),
        productName: form.productName.trim() || 'General Quote',
        length: Number(form.length),
        width: Number(form.width),
        depth: Number(form.depth),
        unit: form.unit,
        message: form.message.trim(),
        productId: productId || undefined,
      })
      setSuccess(true)
      resetForm()
    } catch (err) {
      setError(err?.message || 'Unable to submit quote. Please try again.')
      setCaptcha(makeCaptcha())
      setForm((current) => ({ ...current, captchaAnswer: '' }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      {showHeader ? (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-2xl text-charcoal sm:text-3xl">Get custom quote</h3>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal">
            <Truck className="h-5 w-5 text-gold" strokeWidth={1.7} />
            Free Shipping
          </div>
        </div>
      ) : null}

      {success ? (
        <div className="mb-6 rounded border border-emerald/30 bg-emerald/[0.06] px-5 py-4 text-sm text-emerald">
          Quote request submitted. Our packaging team will follow up shortly.
        </div>
      ) : null}
      {error ? (
        <div className="mb-6 rounded border border-gold-hairline/40 px-5 py-4 text-sm text-charcoal" role="alert">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="name"
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={onChange}
            className={fieldClassName}
            placeholder="Name"
            aria-label="Name"
          />
          <input
            name="phone"
            type="tel"
            required
            minLength={7}
            value={form.phone}
            onChange={onChange}
            className={fieldClassName}
            placeholder="Phone No"
            aria-label="Phone number"
          />
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            className={fieldClassName}
            placeholder="Email Address"
            aria-label="Email address"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm font-semibold text-charcoal">Qty:</span>
            <input
              name="quantity"
              type="number"
              required
              min={1}
              value={form.quantity}
              onChange={onChange}
              className={fieldClassName}
              placeholder="Quantity"
              aria-label="Quantity"
            />
          </div>
          <select
            name="color"
            required
            value={form.color}
            onChange={onChange}
            className={fieldClassName}
            aria-label="Select color"
          >
            <option value="">Select Color</option>
            {COLOR_OPTIONS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          <input
            name="productName"
            type="text"
            required
            minLength={2}
            value={form.productName}
            onChange={onChange}
            className={fieldClassName}
            placeholder="Product Name"
            aria-label="Product name"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">Size:</span>
            <span className="text-xs text-charcoal/55">{sizeHint}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.7fr]">
            <input
              name="length"
              type="number"
              required
              min={0.01}
              step="0.01"
              value={form.length}
              onChange={onChange}
              className={fieldClassName}
              placeholder="L"
              aria-label="Length"
            />
            <input
              name="width"
              type="number"
              required
              min={0.01}
              step="0.01"
              value={form.width}
              onChange={onChange}
              className={fieldClassName}
              placeholder="W"
              aria-label="Width"
            />
            <input
              name="depth"
              type="number"
              required
              min={0.01}
              step="0.01"
              value={form.depth}
              onChange={onChange}
              className={fieldClassName}
              placeholder="D"
              aria-label="Depth"
            />
            <select
              name="unit"
              required
              value={form.unit}
              onChange={onChange}
              className={fieldClassName}
              aria-label="Unit"
            >
              <option value="inch">inch</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
            </select>
          </div>
        </div>

        <textarea
          name="message"
          required
          minLength={5}
          rows={4}
          maxLength={1000}
          value={form.message}
          onChange={onChange}
          className={`${fieldClassName} resize-y`}
          placeholder="Write short message"
          aria-label="Message"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-charcoal/15 bg-charcoal/[0.04] px-3 text-sm font-semibold text-charcoal">
                {captcha.a}
              </span>
              <span className="text-sm font-semibold text-charcoal">+</span>
              <span className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-charcoal/15 bg-charcoal/[0.04] px-3 text-sm font-semibold text-charcoal">
                {captcha.b}
              </span>
              <span className="text-sm font-semibold text-charcoal">=</span>
              <input
                name="captchaAnswer"
                type="number"
                required
                value={form.captchaAnswer}
                onChange={onChange}
                className={`${fieldClassName} w-24`}
                placeholder="Ans"
                aria-label="Captcha answer"
              />
            </div>
            <p className="mt-2 text-xs text-charcoal/55">(Are you human, or spambot?)</p>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Sending…' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}
