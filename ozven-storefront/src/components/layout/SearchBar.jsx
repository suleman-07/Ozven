import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Search, X } from 'lucide-react'
import { getProducts } from '../../api'
import { getProductImage } from '../../utils/catalog'

const DEBOUNCE_MS = 400

/**
 * Expanding inline product search.
 * Uses GET /api/public/products?search=keyword (debounced).
 */
export default function SearchBar({ variant = 'onDark' }) {
  const [open, setOpen] = useState(false)
  const iconClass =
    variant === 'onDark'
      ? 'text-white transition hover:text-gold'
      : 'text-gold transition hover:text-gold-light'
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setSearched(false)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const timer = window.setTimeout(async () => {
      try {
        const payload = await getProducts({ search: trimmed, page: 1, limit: 8 })
        setResults(payload.products || [])
      } catch {
        setResults([])
      } finally {
        setSearched(true)
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [query, open])

  const closeSearch = () => {
    setOpen(false)
    setQuery('')
    setResults([])
    setSearched(false)
  }

  return (
    <div ref={rootRef} className="relative flex items-center">
      {!open ? (
        <button
          type="button"
          aria-label="Search products"
          onClick={() => setOpen(true)}
          className={`inline-flex h-10 w-10 items-center justify-center ${iconClass}`}
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              className="w-40 border border-white/25 bg-dark-alt px-3 py-2 text-sm text-white outline-none transition focus:border-gold sm:w-56"
              aria-label="Search products by name"
              aria-expanded={searched || loading}
              aria-controls="nav-search-results"
            />

            {(loading || searched) && (
              <div
                id="nav-search-results"
                className="absolute right-0 top-full z-[70] mt-2 w-[min(100vw-2rem,22rem)] border border-gold-hairline/40 bg-base shadow-soft"
              >
                {loading ? (
                  <p className="px-4 py-3 text-sm text-charcoal/60">Searching…</p>
                ) : results.length ? (
                  <ul className="max-h-80 overflow-y-auto py-1">
                    {results.map((product) => {
                      const image = getProductImage(product)
                      return (
                        <li key={product.id || product.slug}>
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-charcoal/5"
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-gold-hairline/30 bg-dark-alt">
                              {image ? (
                                <img src={image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <Package className="h-4 w-4 text-gold" strokeWidth={1.5} />
                              )}
                            </span>
                            <span className="truncate text-sm text-charcoal">{product.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-charcoal/60">No products found</p>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="text-white/70 transition hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
