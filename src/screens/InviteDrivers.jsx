import React, { useState, useRef } from 'react'
import { UserPlus, Mail, Copy, CheckCircle, Clock, X, Upload, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'dw_fleet_invitations'

const loadInvitations = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

const InviteDrivers = () => {
  const { token } = useAuth()
  const [invitations, setInvitations] = useState(loadInvitations)
  const [email,       setEmail]       = useState('')
  const [sending,     setSending]     = useState(false)
  const [copied,      setCopied]      = useState(null)
  const [error,       setError]       = useState('')
  const [csvStatus,   setCsvStatus]   = useState(null) // null | 'parsing' | { sent, failed, errors }
  const csvRef = useRef()

  const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const callApi = async (emailAddr) => {
    const API = import.meta.env.VITE_API_URL || ''
    if (!API || !token) return null
    try {
      const res = await fetch(`${API}/fleet/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: emailAddr }),
      })
      if (!res.ok) return null
      return await res.json()
    } catch { return null }
  }

  const saveLocal = (inv, current) => {
    const next = [inv, ...current]
    setInvitations(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  }

  const send = async () => {
    setError('')
    if (!isValidEmail(email)) { setError('Please enter a valid email address'); return }
    if (invitations.find(i => i.email === email.toLowerCase())) {
      setError('This driver has already been invited'); return
    }

    setSending(true)
    const apiData = await callApi(email.toLowerCase())
    const inv = {
      id:        Date.now(),
      email:     email.toLowerCase(),
      status:    'pending',
      sentAt:    new Date().toISOString(),
      expiresAt: apiData?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      token:     apiData?.inviteToken || Math.random().toString(36).slice(2),
    }
    saveLocal(inv, invitations)
    setEmail('')
    setSending(false)
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

  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setCsvStatus('parsing')

    const text = await file.text()
    // Parse: accept CSV, TSV, or newline-delimited; skip header row if it contains "email"
    const lines = text.split(/[\r\n,;\t]+/).map(s => s.trim().toLowerCase()).filter(Boolean)
    const emails = lines.filter(s => isValidEmail(s) && !s.startsWith('email'))

    if (emails.length === 0) {
      setCsvStatus({ sent: 0, failed: 0, errors: ['No valid email addresses found in file.'] })
      return
    }

    let sent = 0, failed = 0
    const errors = []
    let current = [...invitations]

    for (const addr of emails) {
      if (current.find(i => i.email === addr)) {
        errors.push(`${addr} — already invited`)
        failed++
        continue
      }
      const apiData = await callApi(addr)
      const inv = {
        id:        Date.now() + Math.random(),
        email:     addr,
        status:    'pending',
        sentAt:    new Date().toISOString(),
        expiresAt: apiData?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        token:     apiData?.inviteToken || Math.random().toString(36).slice(2),
      }
      current = [inv, ...current]
      sent++
    }

    setInvitations(current)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    setCsvStatus({ sent, failed, errors })
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
            style={{ padding: '11px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px', opacity: !email ? 0.5 : 1 }}
          >
            <Mail size={16} />
            {sending ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>
          Drivers will receive an email with a link to download DriveWell and join your fleet. Invitations expire after 7 days.
        </p>
      </div>

      {/* CSV Bulk Import */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={18} color="#2563eb" /> Bulk Import via CSV
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '14px' }}>
          Upload a CSV file with one email per row (or a column labeled "email") to invite multiple drivers at once.
        </p>

        <input
          ref={csvRef}
          type="file"
          accept=".csv,.txt"
          style={{ display: 'none' }}
          onChange={handleCsvUpload}
        />

        {csvStatus === 'parsing' ? (
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Processing file…</p>
        ) : csvStatus ? (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>
                {csvStatus.sent} invited
              </span>
              {csvStatus.failed > 0 && (
                <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>
                  {csvStatus.failed} skipped
                </span>
              )}
            </div>
            {csvStatus.errors.length > 0 && (
              <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
                {csvStatus.errors.slice(0, 5).map((e, i) => (
                  <p key={i} style={{ fontSize: '12px', color: '#92400e', marginBottom: '2px' }}>{e}</p>
                ))}
                {csvStatus.errors.length > 5 && (
                  <p style={{ fontSize: '12px', color: '#92400e' }}>…and {csvStatus.errors.length - 5} more</p>
                )}
              </div>
            )}
            <button
              onClick={() => { setCsvStatus(null); csvRef.current?.click() }}
              style={{ padding: '8px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
            >
              Upload another file
            </button>
          </div>
        ) : (
          <button
            onClick={() => csvRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', border: '1.5px dashed #d1d5db', borderRadius: '8px', background: '#f9fafb', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
          >
            <Upload size={16} color="#6b7280" />
            Choose CSV file
          </button>
        )}
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
                    Sent {new Date(inv.sentAt).toLocaleDateString()} · {daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expired'}
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
          <p style={{ fontSize: '14px', marginTop: '4px' }}>Enter a driver's email above or upload a CSV to get started.</p>
        </div>
      )}
    </div>
  )
}

export default InviteDrivers
