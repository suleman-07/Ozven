import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Mail, Menu, Phone, RefreshCw } from 'lucide-react'
import Container from '../common/Container'
import MegaMenu from './MegaMenu'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import { getCategories } from '../../api'
import useFetch from '../../hooks/useFetch'
import { slugify } from '../../utils/catalog'
import {
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
} from '../../utils/siteConfig'

function BrandLogo({ className = '' }) {
  return (
    <Link to="/" className={`flex shrink-0 items-center ${className}`} aria-label="Ozven Packaging home">
      <img
        src="/logo-ozven.png?v=2"
        alt="Ozven Packaging"
        className="h-12 w-auto object-contain [filter:brightness(0.88)_contrast(1.25)_drop-shadow(0_1px_1px_rgba(13,13,13,0.35))_drop-shadow(0_2px_4px_rgba(13,13,13,0.2))] sm:h-[3.75rem]"
      />
    </Link>
  )
}

function ContactChip({ href, icon: Icon, label, value }) {
  return (
    <a
      href={href}
      aria-label={`${label}: ${value}`}
      className="group hidden items-center gap-3 rounded-full border border-charcoal/15 bg-white px-3.5 py-2 transition duration-200 hover:border-gold hover:shadow-sm sm:inline-flex"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/[0.08] text-charcoal transition duration-200 group-hover:bg-gold group-hover:text-dark">
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="pr-1.5">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal">
          {label}
        </span>
        <span className="block text-sm font-bold tracking-wide text-dark">
          {value}
        </span>
      </span>
    </a>
  )
}

export default function Header() {
  const location = useLocation()
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(() => getCategories(), [])

  const allCategories = Array.isArray(categoriesData) ? categoriesData : []
  const navCategories = allCategories.slice(0, 3)
  const activeCategory =
    allCategories.find((category) => category.id === activeCategoryId) || null

  useEffect(() => {
    setActiveCategoryId(null)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!activeCategoryId) return undefined
    const onPointerDown = (event) => {
      if (!event.target.closest('[data-site-header]')) {
        setActiveCategoryId(null)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [activeCategoryId])

  return (
    <header data-site-header className="sticky top-0 z-50" onMouseLeave={() => setActiveCategoryId(null)}>
      {/* Top utility bar */}
      <div className="border-b border-charcoal/10 bg-white">
        <Container className="flex h-[4.25rem] items-center justify-between gap-4 sm:h-[4.75rem]">
          <BrandLogo />

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ContactChip
              href={SITE_PHONE_TEL}
              icon={Phone}
              label="Call"
              value={SITE_PHONE_DISPLAY}
            />
            <ContactChip
              href={SITE_EMAIL_HREF}
              icon={Mail}
              label="Email"
              value={SITE_EMAIL}
            />

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-dark shadow-sm transition duration-200 hover:bg-gold-light hover:shadow-md sm:px-5"
            >
              Get a Quote
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-charcoal/15 text-charcoal transition hover:border-gold hover:text-gold lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </div>

      {/* Dark primary nav */}
      <div className="relative bg-dark">
        <Container className="flex h-12 items-center justify-between gap-3 sm:h-14">
          <nav className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  'rounded-sm px-3.5 py-2 text-sm font-semibold tracking-wide transition',
                  isActive ? 'text-gold' : 'text-white/90 hover:text-gold',
                ].join(' ')
              }
            >
              Home
            </NavLink>

            {categoriesLoading ? (
              <span className="px-3 text-sm text-white/45">Loading categories…</span>
            ) : null}

            {!categoriesLoading && categoriesError ? (
              <button
                type="button"
                onClick={() => refetchCategories().catch(() => {})}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gold/90 transition hover:text-gold"
                title={categoriesError}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry categories
              </button>
            ) : null}

            {!categoriesLoading && !categoriesError && navCategories.length === 0 ? (
              <span className="px-3 text-sm text-white/40">No categories yet</span>
            ) : null}

            {!categoriesLoading &&
              !categoriesError &&
              navCategories.map((category) => {
                const categorySlug = category.slug || slugify(category.name)
                const isOpen = activeCategoryId === category.id

                return (
                  <div
                    key={category.id || categorySlug}
                    onMouseEnter={() => setActiveCategoryId(category.id)}
                  >
                    <button
                      type="button"
                      className={[
                        'inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold tracking-wide transition duration-200',
                        isOpen
                          ? 'bg-gold text-white'
                          : 'text-white/90 hover:bg-gold hover:text-white',
                      ].join(' ')}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() =>
                        setActiveCategoryId((current) =>
                          current === category.id ? null : category.id
                        )
                      }
                    >
                      {category.name}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                )
              })}

            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                [
                  'rounded-sm px-3.5 py-2 text-sm font-semibold tracking-wide transition',
                  isActive ? 'text-gold' : 'text-white/90 hover:text-gold',
                ].join(' ')
              }
            >
              Reviews
            </NavLink>
          </nav>

          <p className="truncate text-sm font-semibold tracking-wide text-white/80 lg:hidden">
            Menu
          </p>

          <div className="flex shrink-0 items-center">
            <SearchBar variant="onDark" />
          </div>
        </Container>

        <div className="relative hidden lg:block">
          <MegaMenu
            open={Boolean(activeCategory)}
            category={activeCategory}
            onNavigate={() => setActiveCategoryId(null)}
          />
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={allCategories}
      />
    </header>
  )
}
