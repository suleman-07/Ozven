import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, PackageCheck, X } from 'lucide-react'
import { navigationItems } from '../../constants/navigation'
import { cn } from '../../utils/cn'

function Sidebar({ isCollapsed, isOpen, onClose, onToggleCollapse }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-950/5 transition-all duration-300 lg:translate-x-0 lg:shadow-none',
          isCollapsed ? 'lg:w-20' : 'lg:w-72',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b border-slate-200 px-4',
            isCollapsed ? 'lg:justify-center' : 'justify-between',
          )}
        >
          <div className={cn('flex min-w-0 items-center gap-3', isCollapsed && 'lg:justify-center')}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
              <PackageCheck size={22} aria-hidden="true" />
            </span>
            <div className={cn('min-w-0', isCollapsed && 'lg:hidden')}>
              <p className="truncate text-sm font-semibold text-slate-950">Ozven</p>
              <p className="text-xs text-slate-500">Admin Console</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isCollapsed && 'lg:justify-center lg:px-2',
                    isActive
                      ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )
                }
              >
                <Icon size={19} className="shrink-0" aria-hidden="true" />
                <span className={cn('truncate', isCollapsed && 'lg:hidden')}>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="mb-3 hidden h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 lg:flex"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight size={18} aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft size={18} aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>

          <div className={cn('rounded-lg bg-slate-50 p-4', isCollapsed && 'lg:hidden')}>
            <p className="text-sm font-semibold text-slate-950">Production Setup</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Static data now, API-ready structure for later.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
