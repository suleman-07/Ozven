import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <Outlet />
    </main>
  )
}

export default AuthLayout
