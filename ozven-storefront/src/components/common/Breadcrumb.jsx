import { Link } from 'react-router-dom'
import Container from './Container'

export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" className="border-b border-gold-hairline/20 bg-base/80">
      <Container className="flex flex-wrap items-center gap-2 py-4 text-sm text-charcoal/60">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span className="text-gold-hairline/70">/</span> : null}
              {isLast || !item.to ? (
                <span className={isLast ? 'text-charcoal' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to} className="transition hover:text-gold">
                  {item.label}
                </Link>
              )}
            </span>
          )
        })}
      </Container>
    </nav>
  )
}
