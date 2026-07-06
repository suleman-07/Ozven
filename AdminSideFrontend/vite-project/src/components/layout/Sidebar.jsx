import { NavLink } from 'react-router-dom'
import { PackageCheck, X } from 'lucide-react'
import { navigationItems } from '../../constants/navigation'
import { cn } from '../../utils/cn'

function Sidebar({ isOpen, onClose }) {
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
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
              <PackageCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">Oxo Packaging</p>
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
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )
                }
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg bg-slate-50 p-4">
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
