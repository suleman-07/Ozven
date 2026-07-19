import { useState } from 'react'
import { ArrowLeft, Send, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createResource, getErrorMessage } from '../../services/adminApi'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  quantity: '',
  color: '',
  productName: '',
  length: '',
  width: '',
  depth: '',
  unit: 'inch',
  message: '',
}

function GetQuotePage() {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await createResource('/quotes', {
        ...form,
        quantity: Number(form.quantity),
        length: Number(form.length),
        width: Number(form.width),
        depth: Number(form.depth),
      })

      setForm(initialForm)
      toast.success('Your quote request has been submitted.')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to submit your quote request.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f8ea] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Admin login
        </Link>

        <section className="rounded-2xl border border-stone-200 bg-[#fbfbf0] p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              GET CUSTOM QUOTE
            </h1>
            <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
              <Truck size={20} aria-hidden="true" />
              Free Shipping
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-3">
              <QuoteInput
                label="Name"
                value={form.name}
                placeholder="Name"
                onChange={(value) => updateField('name', value)}
              />
              <QuoteInput
                label="Phone number"
                type="tel"
                value={form.phone}
                placeholder="Phone No"
                onChange={(value) => updateField('phone', value)}
              />
              <QuoteInput
                label="Email address"
                type="email"
                value={form.email}
                placeholder="Email Address"
                onChange={(value) => updateField('email', value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <QuoteInput
                label="Quantity"
                type="number"
                min="1"
                value={form.quantity}
                placeholder="Quantity"
                onChange={(value) => updateField('quantity', value)}
              />
              <label className="block">
                <span className="sr-only">Select color</span>
                <select
                  value={form.color}
                  className={inputClassName}
                  required
                  onChange={(event) => updateField('color', event.target.value)}
                >
                  <option value="">Select Color</option>
                  <option>Black</option>
                  <option>White</option>
                  <option>Brown / Kraft</option>
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Green</option>
                  <option>Custom / Pantone</option>
                </select>
              </label>
              <QuoteInput
                label="Product name"
                value={form.productName}
                placeholder="Product Name"
                onChange={(value) => updateField('productName', value)}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-slate-900">Size:</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.65fr]">
                <QuoteInput
                  label="Length"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.length}
                  placeholder="L"
                  onChange={(value) => updateField('length', value)}
                />
                <QuoteInput
                  label="Width"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.width}
                  placeholder="W"
                  onChange={(value) => updateField('width', value)}
                />
                <QuoteInput
                  label="Depth"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.depth}
                  placeholder="D"
                  onChange={(value) => updateField('depth', value)}
                />
                <label className="block">
                  <span className="sr-only">Dimension unit</span>
                  <select
                    value={form.unit}
                    className={inputClassName}
                    required
                    onChange={(event) => updateField('unit', event.target.value)}
                  >
                    <option value="inch">inch</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                  </select>
                </label>
              </div>
            </div>

            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                value={form.message}
                rows={5}
                maxLength={1000}
                className={`${inputClassName} h-auto resize-y py-3`}
                placeholder="Write short message"
                required
                onChange={(event) => updateField('message', event.target.value)}
              />
            </label>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={17} aria-hidden="true" />
                {isSubmitting ? 'Submitting...' : 'Get Custom Quote'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

function QuoteInput({ label, type = 'text', value, placeholder, onChange, ...props }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={inputClassName}
        required
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </label>
  )
}

const inputClassName =
  'h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100'

export default GetQuotePage
