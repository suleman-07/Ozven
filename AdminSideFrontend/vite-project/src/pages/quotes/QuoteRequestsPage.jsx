import { useCallback, useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Mail,
  Phone,
  Search,
  Trash2,
  UserRound,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { deleteResource, getErrorMessage, getResource, listResource, PAGE_SIZE } from '../../services/adminApi'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/formatters'

const pageSize = PAGE_SIZE

function QuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingQuote, setViewingQuote] = useState(null)
  const [deletingQuote, setDeletingQuote] = useState(null)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 1 })

  const loadQuotes = useCallback(async (page = currentPage, query = searchTerm) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await listResource('/quotes', { page, limit: pageSize, search: query })

      setQuoteRequests(result.items.map(normalizeQuote))
      setPagination(result.pagination)
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load quote requests right now.')
      setQuoteRequests([])
      setPagination({ page, limit: pageSize, total: 0, totalPages: 1 })
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadQuotes(currentPage, searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [currentPage, loadQuotes, searchTerm])

  const totalPages = Math.max(1, pagination.totalPages)
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleViewQuote = async (quote) => {
    setError(null)

    try {
      const payload = await getResource('/quotes', quote.id, 'quote')
      setViewingQuote(normalizeQuote(payload))
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load quote request details right now.')
      setError(message)
      toast.error(message)
    }
  }

  const handleDeleteQuote = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await deleteResource('/quotes', deletingQuote.id)
      setDeletingQuote(null)
      await loadQuotes(currentPage, searchTerm)
      toast.success('Quote request deleted successfully.')
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to delete quote request right now.')
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <PageTitle
        title="Quote Requests"
        description="Review and manage incoming quote requests with search, view details, delete, and pagination backed by the admin API."
      />

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              placeholder="Search quote requests"
              className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              onChange={handleSearchChange}
            />
          </div>

          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{quoteRequests.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{pagination.total}</span> requests
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <TableSkeleton />
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-4 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-950">Unable to load quote requests</p>
                    <p className="mt-1 text-sm text-slate-500">{error}</p>
                    <Button variant="secondary" className="mt-4" onClick={() => void loadQuotes(currentPage, searchTerm)}>
                      Try again
                    </Button>
                  </td>
                </tr>
              ) : quoteRequests.length ? (
                quoteRequests.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <UserRound size={19} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{quote.name}</p>
                          <p className="text-xs text-slate-500">ID: QTE-{quote.id.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <TableCell>{quote.email}</TableCell>
                    <TableCell>{quote.phone}</TableCell>
                    <TableCell>{quote.product}</TableCell>
                    <TableCell>{quote.createdDate}</TableCell>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`View ${quote.name}`}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                          onClick={() => void handleViewQuote(quote)}
                        >
                          <Eye size={17} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${quote.name}`}
                          className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                          onClick={() => setDeletingQuote(quote)}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-900">{safeCurrentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-9 px-3"
              disabled={safeCurrentPage === 1 || isLoading}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={17} aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="secondary"
              className="h-9 px-3"
              disabled={safeCurrentPage === totalPages || isLoading}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Next
              <ChevronRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {viewingQuote ? <QuoteDetailsModal quote={viewingQuote} onClose={() => setViewingQuote(null)} /> : null}

      {deletingQuote ? (
        <DeleteQuoteModal
          quote={deletingQuote}
          isSubmitting={isSubmitting}
          onClose={() => setDeletingQuote(null)}
          onDelete={handleDeleteQuote}
        />
      ) : null}
    </section>
  )
}

function TableHead({ children, align = 'left' }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
        align === 'right' ? 'text-right' : 'text-left',
      )}
    >
      {children}
    </th>
  )
}

function TableCell({ children }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{children}</td>
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 6 }).map((__, cellIndex) => (
        <td key={cellIndex} className="px-4 py-4">
          <div className="h-4 animate-pulse rounded bg-slate-100" />
        </td>
      ))}
    </tr>
  ))
}

function EmptyState() {
  return (
    <tr>
      <td colSpan="6" className="px-4 py-14 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Inbox size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-950">No quote requests found</h2>
        <p className="mt-1 text-sm text-slate-500">Try a different search term or wait for new requests.</p>
      </td>
    </tr>
  )
}

function QuoteDetailsModal({ quote, onClose }) {
  return (
    <Modal title="Quote Request Details" onClose={onClose} size="large">
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-lg bg-slate-50 p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <UserRound size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-semibold text-slate-950">{quote.name}</p>
            <p className="mt-1 text-sm text-slate-500">{quote.company}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem icon={Mail} label="Email" value={quote.email} />
          <DetailItem icon={Phone} label="Phone" value={quote.phone} />
          <DetailItem label="Product" value={quote.product} />
          <DetailItem label="Quantity" value={quote.quantity} />
          <DetailItem label="Created Date" value={quote.createdDate} />
          <DetailItem label="Request ID" value={`QTE-${quote.id.toString().padStart(3, '0')}`} />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Message</p>
          <p className="mt-2 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            {quote.message}
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {Icon ? <Icon size={14} aria-hidden="true" /> : null}
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}

function DeleteQuoteModal({ quote, isSubmitting, onClose, onDelete }) {
  return (
    <Modal title="Delete Quote Request" onClose={onClose} size="large">
      <div>
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Trash2 size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete the request from{' '}
              <span className="font-semibold text-slate-950">{quote.name}</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : 'Delete Request'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function normalizeQuote(quote) {
  return {
    ...quote,
    id: quote.id,
    name: quote.name || 'Unknown Contact',
    email: quote.email || 'No email provided',
    phone: quote.phone || 'No phone provided',
    product: quote.product?.name || quote.product || 'General Quote',
    quantity: quote.quantity || 'Not provided',
    company: quote.company || 'Not provided',
    message: quote.message || 'No message provided.',
    createdDate: formatDate(quote.createdAt || quote.createdDate, 'Not available'),
  }
}

export default QuoteRequestsPage
