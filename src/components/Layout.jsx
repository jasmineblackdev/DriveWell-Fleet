import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <main style={{
      marginLeft: '240px',
      flex: 1,
      padding: '32px',
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      {children}
    </main>
  </div>
)

export default Layout
