import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import CategoryPage from '../pages/category/CategoryPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import ProductPage from '../pages/product/ProductPage'
import GetQuotePage from '../pages/quotes/GetQuotePage'
import QuoteRequestsPage from '../pages/quotes/QuoteRequestsPage'
import ModulePlaceholder from '../components/common/ModulePlaceholder'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/get-a-quote" element={<GetQuotePage />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/quote-requests" element={<QuoteRequestsPage />} />
              <Route path="/settings" element={<ModulePlaceholder title="Settings" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default AppRoutes
