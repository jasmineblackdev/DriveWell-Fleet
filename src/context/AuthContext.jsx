import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_CREDENTIALS = { email: 'admin@fleetco.com', password: 'demo1234' }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem('fleet_user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const login = (email, password) => {
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      const u = { email, name: 'Fleet Admin', company: 'FleetCo Logistics' }
      sessionStorage.setItem('fleet_user', JSON.stringify(u))
      setUser(u)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('fleet_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
