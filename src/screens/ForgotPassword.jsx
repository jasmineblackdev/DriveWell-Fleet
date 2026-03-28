import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'

const ForgotPassword = () => {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | sent | error
  const [errMsg,  setErrMsg]  = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    const API = import.meta.env.VITE_API_URL || ''
    if (API) {
      try {
        const res = await fetch(`${API}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        // Always show success to avoid email enumeration
        setStatus('sent')
        return
      } catch {
        // fall through — show success anyway (don't leak whether API is reachable)
      }
    }

    // Mock: always succeed
    setStatus('sent')
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: '#2563eb', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Truck size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Reset Password</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {status === 'sent' ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            background: '#f0fdf4',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
          }}>
            <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#15803d' }}>
              Check your email
            </h2>
            <p style={{ fontSize: '14px', color: '#166534' }}>
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link within a few minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errMsg && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 14px', background: '#fef2f2', borderRadius: '8px',
                border: '1px solid #fca5a5', marginBottom: '20px',
              }}>
                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px', color: '#dc2626' }}>{errMsg}</p>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fleetco.com"
                required
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                  borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600',
                background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to="/login"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
