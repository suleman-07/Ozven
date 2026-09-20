import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import { slugify } from '../../utils/catalog'
import { getSubcategoryIcon } from '../../utils/subcategoryIcons'

export default function MobileMenu({ open, onClose, categories = [] }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-dark/60" aria-label="Close menu" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-dark text-base shadow-soft animate-fade-in">
        <div className="flex items-center justify-between border-b border-gold-hairline/30 px-4 py-3.5">
          <img
            src="/logo-ozven.png?v=2"
            alt="Ozven Packaging"
            className="h-8 w-auto max-w-[9.5rem] object-contain object-left brightness-110 contrast-110"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/15 text-base/70 transition hover:border-gold hover:text-gold"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-0.5 border-b border-gold-hairline/25 pb-4">
            <NavLink
              to="/"
              onClick={onClose}
              className="block rounded-md px-1 py-2.5 text-[15px] font-medium text-base/90 transition hover:text-gold"
            >
              Home
            </NavLink>
            <NavLink
              to="/reviews"
              onClick={onClose}
              className="block rounded-md px-1 py-2.5 text-[15px] font-medium text-base/90 transition hover:text-gold"
            >
              Reviews
            </NavLink>
            <NavLink
              to="/contact"
              onClick={onClose}
              className="mt-3 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded bg-gold px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-dark transition hover:bg-gold-light"
            >
              Get a Quote
            </NavLink>
          </div>

          <div className="pt-4">
            <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Categories
            </p>
            <ul className="mt-2 space-y-0.5">
              {categories.length ? (
                categories.map((category) => {
                  const categorySlug = category.slug || slugify(category.name)
                  const id = category.id || categorySlug
                  const isOpen = expandedId === id
                  const subs = category.subcategories || []

                  return (
                    <li key={id} className="border-b border-gold-hairline/15">
                      <div className="flex items-center gap-2 py-2.5">
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-between px-1 text-left text-[15px] text-base/85 transition hover:text-gold"
                          aria-expanded={isOpen}
                          onClick={() => setExpandedId(isOpen ? null : id)}
                        >
                          <span>{category.name}</span>
                          {subs.length ? (
                            <ChevronDown
                              className={`h-4 w-4 text-gold transition ${isOpen ? 'rotate-180' : ''}`}
                            />
                          ) : null}
                        </button>
                      </div>

                      {isOpen && subs.length ? (
                        <ul className="space-y-0.5 pb-2.5">
                          {subs.map((sub) => {
                            const subSlug = sub.slug || slugify(sub.name)
                            const Icon = getSubcategoryIcon(sub.name)
                            return (
                              <li key={sub.id || subSlug}>
                                <Link
                                  to={`/category/${categorySlug}/${subSlug}`}
                                  onClick={onClose}
                                  className="flex items-center gap-2.5 py-2 pl-1 text-sm text-base/60 transition hover:text-gold-light"
                                >
                                  <span className="flex h-7 w-7 items-center justify-center rounded border border-gold-hairline/30 text-gold">
                                    <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                                  </span>
                                  {sub.name}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}

                      {isOpen && !subs.length ? (
                        <Link
                          to={`/category/${categorySlug}`}
                          onClick={onClose}
                          className="block pb-2.5 pl-1 text-sm text-gold"
                        >
                          View category →
                        </Link>
                      ) : null}
                    </li>
                  )
                })
              ) : (
                <li className="py-3 text-sm text-base/45">No categories yet</li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
