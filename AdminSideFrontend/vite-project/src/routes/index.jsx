import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
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
              <Route path="/categories" element={<ModulePlaceholder title="Categories" />} />
              <Route path="/industries" element={<ModulePlaceholder title="Industries" />} />
              <Route path="/box-styles" element={<ModulePlaceholder title="Box Styles" />} />
              <Route path="/materials" element={<ModulePlaceholder title="Materials" />} />
              <Route path="/finishes" element={<ModulePlaceholder title="Finishes" />} />
              <Route path="/products" element={<ModulePlaceholder title="Products" />} />
              <Route path="/quotes" element={<ModulePlaceholder title="Quotes" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default AppRoutes
