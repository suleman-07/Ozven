import { useCallback, useMemo, useState } from 'react'
import api from '../services/api'
import { AuthContext } from './auth-context'

const TOKEN_KEY = 'oxo_admin_token'
const ADMIN_KEY = 'oxo_admin_user'

function getStoredUser() {
  const storedUser = localStorage.getItem(ADMIN_KEY)
  const token = localStorage.getItem(TOKEN_KEY)

  if (!storedUser || !token) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(ADMIN_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback(async ({ email, password }) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    const token = response?.data?.token
    const admin = response?.data?.admin

    if (!token) {
      throw new Error('Login failed. Token was not returned.')
    }

    const nextUser = {
      name: admin?.name || 'Admin User',
      email: admin?.email || email,
      role: admin?.role || 'Super Admin',
    }

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(nextUser))
    setUser(nextUser)

    return nextUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_KEY)
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
