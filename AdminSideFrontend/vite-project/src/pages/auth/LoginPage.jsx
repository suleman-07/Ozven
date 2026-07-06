import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, PackageCheck } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    login()
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-brand-600 text-white">
          <PackageCheck size={24} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-950">Oxo Admin</h1>
          <p className="text-sm text-slate-500">Packaging management console</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            defaultValue="admin@oxopackaging.com"
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            defaultValue="password"
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </label>

        <Button type="submit" className="w-full">
          <LogIn size={18} aria-hidden="true" />
          Sign in
        </Button>
      </form>
    </section>
  )
}

export default LoginPage
