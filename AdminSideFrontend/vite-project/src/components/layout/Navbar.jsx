import { Bell, Menu, Search } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <div className="hidden min-w-0 flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search dashboard"
            className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="View notifications"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <Bell size={19} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-2.5 py-1.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
              AU
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-4 text-slate-950">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
