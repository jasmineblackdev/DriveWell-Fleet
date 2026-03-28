import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Truck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', password: '', confirm: '',
  })
  const [showPw,      setShowPw]      = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const pwLong   = form.password.length >= 8
  const pwNumber = /\d/.test(form.password)
  const pwMatch  = form.password === form.confirm && form.confirm.length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!pwLong || !pwNumber)    return setError('Password must be at least 8 characters and contain a number.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setLoading(true)
    const result = await register({
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      password:  form.password,
      company:   form.company,
    })
    setLoading(false)

    if (result.ok) {
      navigate('/onboarding')
    } else {
      setError(result.error)
    }
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
        maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: '#2563eb', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Truck size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Create Fleet Account</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Start your 14-day free trial</p>
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

          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                First Name
              </label>
              <input
                type="text" value={form.firstName} onChange={set('firstName')}
                placeholder="Jane" required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Last Name
              </label>
              <input
                type="text" value={form.lastName} onChange={set('lastName')}
                placeholder="Smith" required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Company Name
            </label>
            <input
              type="text" value={form.company} onChange={set('company')}
              placeholder="FleetCo Logistics" required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Work Email
            </label>
            <input
              type="email" value={form.email} onChange={set('email')}
              placeholder="jane@fleetco.com" required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={set('password')}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#9ca3af', padding: '0', cursor: 'pointer',
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <Req met={pwLong}   label="8+ characters" />
                <Req met={pwNumber} label="Contains a number" />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm} onChange={set('confirm')}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '10px 40px 10px 12px', border: `1px solid ${form.confirm.length > 0 ? (pwMatch ? '#16a34a' : '#dc2626') : '#d1d5db'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#9ca3af', padding: '0', cursor: 'pointer',
              }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600',
              background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account…' : 'Create Account — Free Trial'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: '600' }}>Sign in</Link>
        </p>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
          No credit card required for trial.
        </p>
      </div>
    </div>
  )
}

const Req = ({ met, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <CheckCircle2 size={12} color={met ? '#16a34a' : '#d1d5db'} />
    <span style={{ fontSize: '12px', color: met ? '#16a34a' : '#9ca3af' }}>{label}</span>
  </div>
)

export default Register
