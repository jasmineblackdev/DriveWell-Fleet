import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400)) // simulate latency
    const ok = login(email, password)
    if (ok) {
      navigate('/dashboard')
    } else {
      setError('Invalid email or password. Try admin@fleetco.com / demo1234')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: '#2563eb', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Truck size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>DriveWell Fleet</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Fleet manager portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px', background: '#fef2f2', borderRadius: '8px',
              border: '1px solid #fca5a5', marginBottom: '20px',
            }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '13px', color: '#dc2626' }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fleetco.com"
              required
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '14px', outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '10px 40px 10px 12px', border: '1px solid #d1d5db',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#9ca3af', padding: '0',
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
          Demo: admin@fleetco.com / demo1234
        </p>

        {/* SSO divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Or sign in with SSO</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button disabled style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb',
            background: '#f9fafb', color: '#9ca3af', fontSize: '14px', cursor: 'not-allowed',
          }}>
            <span style={{ fontSize: '16px' }}>🔷</span>
            Continue with Okta
            <span style={{
              marginLeft: '6px', padding: '1px 7px', borderRadius: '999px',
              background: '#e5e7eb', fontSize: '10px', fontWeight: '700', color: '#6b7280',
            }}>
              Enterprise only
            </span>
          </button>
          <button disabled style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb',
            background: '#f9fafb', color: '#9ca3af', fontSize: '14px', cursor: 'not-allowed',
          }}>
            <span style={{ fontSize: '16px' }}>🪟</span>
            Continue with Azure AD
            <span style={{
              marginLeft: '6px', padding: '1px 7px', borderRadius: '999px',
              background: '#e5e7eb', fontSize: '10px', fontWeight: '700', color: '#6b7280',
            }}>
              Enterprise only
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
