import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'fleet_auth'

const MOCK_USERS = [
  { id: 'demo-1', email: 'admin@fleetco.com', password: 'demo1234', name: 'Fleet Admin', company: 'FleetCo Logistics', role: 'fleet_admin' },
]

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('fleet_token') || null)

  const persist = (u, t) => {
    setUser(u)
    setToken(t)
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
      localStorage.setItem('fleet_token', t || '')
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('fleet_token')
    }
  }

  const login = async (email, password) => {
    // Try real API first
    if (API) {
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.user?.role !== 'fleet_admin' && data.user?.role !== 'admin') {
            return { ok: false, error: 'This portal is for fleet administrators only.' }
          }
          persist(data.user, data.accessToken)
          return { ok: true }
        }
        const err = await res.json()
        return { ok: false, error: err.error || 'Login failed' }
      } catch {
        // fall through to mock
      }
    }

    // Mock fallback
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...u } = found
      persist(u, 'mock-token')
      return { ok: true }
    }
    return { ok: false, error: 'Invalid email or password. Try admin@fleetco.com / demo1234' }
  }

  const register = async ({ firstName, lastName, email, password, company }) => {
    if (API) {
      try {
        const res = await fetch(`${API}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password, company, role: 'fleet_admin' }),
        })
        if (res.ok) {
          const data = await res.json()
          persist(data.user, data.accessToken)
          return { ok: true }
        }
        const err = await res.json()
        return { ok: false, error: err.error || 'Registration failed' }
      } catch {
        // fall through to mock
      }
    }

    // Mock: just create and persist
    if (MOCK_USERS.find(u => u.email === email)) {
      return { ok: false, error: 'An account with that email already exists.' }
    }
    const newUser = { id: `mock-${Date.now()}`, email, name: `${firstName} ${lastName}`, company, role: 'fleet_admin' }
    MOCK_USERS.push({ ...newUser, password })
    persist(newUser, 'mock-token')
    return { ok: true }
  }

  const logout = () => persist(null, null)

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
