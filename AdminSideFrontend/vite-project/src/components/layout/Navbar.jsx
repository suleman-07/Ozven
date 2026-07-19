import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

function Navbar({ isSidebarCollapsed, onMenuClick, onToggleSidebar }) {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

        <button
          type="button"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex"
          onClick={onToggleSidebar}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={22} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={22} aria-hidden="true" />
          )}
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

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50"
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
                AU
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-4 text-slate-950">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <ChevronDown
                size={16}
                className={cn('hidden text-slate-400 transition sm:block', isProfileOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>

            {isProfileOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-950/10"
              >
                <div className="border-b border-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  >
                    <UserRound size={17} aria-hidden="true" />
                    Profile
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  >
                    <Settings size={17} aria-hidden="true" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut size={17} aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
