import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import BoxStylePage from '../pages/box-style/BoxStylePage'
import CategoryPage from '../pages/category/CategoryPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import FinishPage from '../pages/finish/FinishPage'
import IndustryPage from '../pages/industry/IndustryPage'
import MaterialPage from '../pages/material/MaterialPage'
import ProductPage from '../pages/product/ProductPage'
import QuoteRequestsPage from '../pages/quotes/QuoteRequestsPage'
import ModulePlaceholder from '../components/common/ModulePlaceholder'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/industries" element={<IndustryPage />} />
              <Route path="/box-styles" element={<BoxStylePage />} />
              <Route path="/materials" element={<MaterialPage />} />
              <Route path="/finishes" element={<FinishPage />} />
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
