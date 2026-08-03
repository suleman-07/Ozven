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
        <div className="flex items-center justify-between border-b border-gold-hairline/30 px-5 py-4">
          <img src="/logo-ozven.png?v=2" alt="Ozven Packaging" className="h-10 w-auto object-contain" />
          <button type="button" onClick={onClose} className="text-base/70 hover:text-gold" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-1 border-b border-gold-hairline/25 pb-5">
            <NavLink to="/" onClick={onClose} className="block py-2 text-lg text-base/90">
              Home
            </NavLink>
            <NavLink to="/reviews" onClick={onClose} className="block py-2 text-lg text-base/90">
              Reviews
            </NavLink>
            <NavLink
              to="/contact"
              onClick={onClose}
              className="mt-3 inline-flex w-full items-center justify-center bg-gold px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-dark"
            >
              Get a Quote
            </NavLink>
          </div>

          <div className="pt-5">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Categories</p>
            <ul className="mt-3 space-y-1">
              {categories.length ? (
                categories.map((category) => {
                  const categorySlug = category.slug || slugify(category.name)
                  const id = category.id || categorySlug
                  const isOpen = expandedId === id
                  const subs = category.subcategories || []

                  return (
                    <li key={id} className="border-b border-gold-hairline/15">
                      <div className="flex items-center gap-2 py-3">
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-between text-left text-base text-base/85 hover:text-gold"
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
                        <ul className="space-y-1 pb-3">
                          {subs.map((sub) => {
                            const subSlug = sub.slug || slugify(sub.name)
                            const Icon = getSubcategoryIcon(sub.name)
                            return (
                              <li key={sub.id || subSlug}>
                                <Link
                                  to={`/category/${categorySlug}/${subSlug}`}
                                  onClick={onClose}
                                  className="flex items-center gap-3 py-2 pl-1 text-sm text-base/60 hover:text-gold-light"
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded border border-gold-hairline/30 text-gold">
                                    <Icon className="h-4 w-4" strokeWidth={1.6} />
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
                          className="block pb-3 pl-1 text-sm text-gold"
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
