import React, { useState } from 'react'
import { UserPlus, Mail, Copy, CheckCircle, Clock, X } from 'lucide-react'

const STORAGE_KEY = 'dw_fleet_invitations'

const loadInvitations = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

const InviteDrivers = () => {
  const [invitations, setInvitations] = useState(loadInvitations)
  const [email, setEmail]   = useState('')
  const [sending, setSending] = useState(false)
  const [copied, setCopied]   = useState(null)
  const [error, setError]     = useState('')

  const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const send = () => {
    setError('')
    if (!isValidEmail(email)) { setError('Please enter a valid email address'); return }
    if (invitations.find(i => i.email === email.toLowerCase())) { setError('This driver has already been invited'); return }

    setSending(true)
    setTimeout(() => {
      const inv = {
        id:        Date.now(),
        email:     email.toLowerCase(),
        status:    'pending',
        sentAt:    new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        token:     Math.random().toString(36).slice(2),
      }
      const next = [inv, ...invitations]
      setInvitations(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setEmail('')
      setSending(false)
    }, 800)
  }

  const revoke = (id) => {
    const next = invitations.filter(i => i.id !== id)
    setInvitations(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const copyLink = (inv) => {
    const link = `${window.location.origin}/join?token=${inv.token}`
    navigator.clipboard.writeText(link).catch(() => {})
    setCopied(inv.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const pending  = invitations.filter(i => i.status === 'pending')
  const accepted = invitations.filter(i => i.status === 'accepted')

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Invite Drivers</h1>
        <p className="page-subtitle">Add drivers to your fleet</p>
      </div>

      {/* Invite form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={20} color="#2563eb" /> Send Invitation
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="email"
              value={email}
              onChange={e => { setError(''); setEmail(e.target.value) }}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="driver@example.com"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
            />
            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px' }}>{error}</p>}
          </div>
          <button
            onClick={send}
            disabled={sending || !email}
            style={{ padding: '11px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Mail size={16} />
            {sending ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>
          Drivers will receive an email with a link to create their account and join your fleet. Invitations expire after 7 days.
        </p>
      </div>

      {/* Bulk invite hint */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#1e40af' }}>
        <strong>Tip:</strong> Need to invite many drivers at once? Contact our support team for a CSV bulk-import option.
      </div>

      {/* Pending invitations */}
      {pending.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#f59e0b" /> Pending ({pending.length})
          </h3>
          {pending.map(inv => {
            const daysLeft = Math.ceil((new Date(inv.expiresAt) - new Date()) / 86400000)
            return (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '15px' }}>{inv.email}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    Sent {new Date(inv.sentAt).toLocaleDateString()} · Expires in {daysLeft} days
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => copyLink(inv)}
                    title="Copy invite link"
                    style={{ padding: '7px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                  >
                    {copied === inv.id ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} color="#6b7280" />}
                    {copied === inv.id ? 'Copied' : 'Copy link'}
                  </button>
                  <button onClick={() => revoke(inv.id)} title="Revoke" style={{ padding: '7px', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    <X size={14} color="#dc2626" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} color="#10b981" /> Accepted ({accepted.length})
          </h3>
          {accepted.map(inv => (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ fontWeight: '500' }}>{inv.email}</p>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Joined</span>
            </div>
          ))}
        </div>
      )}

      {invitations.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
          <UserPlus size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontWeight: '500' }}>No invitations sent yet</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>Enter a driver's email above to get started.</p>
        </div>
      )}
    </div>
  )
}

export default InviteDrivers
