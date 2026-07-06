import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@oxopackaging.com',
    role: 'Super Admin',
  })

  const login = useCallback(() => {
    localStorage.setItem('oxo_admin_token', 'static-dev-token')
    setUser({
      name: 'Admin User',
      email: 'admin@oxopackaging.com',
      role: 'Super Admin',
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('oxo_admin_token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [login, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
