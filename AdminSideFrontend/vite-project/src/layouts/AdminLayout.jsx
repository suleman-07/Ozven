import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import { cn } from '../utils/cn'

function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="app-shell bg-slate-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72',
        )}
      >
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default AdminLayout
