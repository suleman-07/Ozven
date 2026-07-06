import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

function formatSegment(segment) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500">
      <Link to="/dashboard" className="inline-flex items-center gap-1 hover:text-slate-900">
        <Home size={15} aria-hidden="true" />
        <span>Home</span>
      </Link>

      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1

        return (
          <span key={path} className="inline-flex items-center gap-2">
            <ChevronRight size={14} aria-hidden="true" />
            {isLast ? (
              <span className="font-medium text-slate-700">{formatSegment(segment)}</span>
            ) : (
              <Link to={path} className="hover:text-slate-900">
                {formatSegment(segment)}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
