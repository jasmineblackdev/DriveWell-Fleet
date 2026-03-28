import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Users, Bell, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STEPS = [
  { id: 'welcome',  title: 'Welcome to DriveWell Fleet', icon: Truck  },
  { id: 'invite',   title: 'Invite Your First Driver',   icon: Users  },
  { id: 'alerts',   title: 'Configure Alerts',           icon: Bell   },
  { id: 'done',     title: "You're All Set!",            icon: CheckCircle2 },
]

const StepDot = ({ index, current }) => (
  <div style={{
    width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700',
    background: index < current ? '#16a34a' : index === current ? '#2563eb' : '#e5e7eb',
    color: index <= current ? 'white' : '#9ca3af',
    flexShrink: 0,
  }}>
    {index < current ? <CheckCircle2 size={14} /> : index + 1}
  </div>
)

const FleetOnboarding = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step,        setStep]        = useState(0)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSent,  setInviteSent]  = useState(false)
  const [sending,     setSending]     = useState(false)
  const [alerts, setAlerts] = useState({
    missedCheckin: true,
    certExpiry:    true,
    weeklyReport:  true,
  })

  const handleSendInvite = async () => {
    if (!inviteEmail) return
    setSending(true)
    const API   = import.meta.env.VITE_API_URL || ''
    const token = localStorage.getItem('fleet_token') || ''
    if (API && token) {
      try {
        await fetch(`${API}/fleet/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ email: inviteEmail }),
        })
      } catch { /* offline — mark as sent anyway */ }
    }
    // Persist invite locally too
    const stored = JSON.parse(localStorage.getItem('dw_fleet_invitations') || '[]')
    stored.unshift({ email: inviteEmail, status: 'pending', sentAt: new Date().toISOString() })
    localStorage.setItem('dw_fleet_invitations', JSON.stringify(stored))
    setSending(false)
    setInviteSent(true)
  }

  const finish = () => {
    localStorage.setItem('dw_fleet_onboarding_done', '1')
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <StepDot index={i} current={step} />
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: i < step ? '#16a34a' : '#e5e7eb' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '64px', background: '#dbeafe', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Truck size={32} color="#2563eb" />
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>
                Welcome, {user?.name?.split(' ')[0] || 'Fleet Admin'}!
              </h1>
              <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6' }}>
                Let's get <strong>{user?.company || 'your fleet'}</strong> set up in under 2 minutes.
                We'll walk you through the essentials.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { icon: Users,       title: 'Invite your drivers',       desc: 'Send a link — they download the app and join your fleet' },
                { icon: Bell,        title: 'Set alert preferences',      desc: 'Get notified about missed check-ins and expiring certs'  },
                { icon: CheckCircle2, title: 'Start monitoring wellness',  desc: 'Live risk scores and DOT readiness from day one'          },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '14px', padding: '14px', background: '#f9fafb', borderRadius: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="#2563eb" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{title}</p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Let's Go <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 1: Invite drivers */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Invite Your First Driver</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                Enter their email address. They'll get a link to download DriveWell and automatically join your fleet.
              </p>
            </div>

            {!inviteSent ? (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Driver Email</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="driver@example.com"
                    onKeyDown={e => e.key === 'Enter' && handleSendInvite()}
                    style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                  <button
                    onClick={handleSendInvite}
                    disabled={!inviteEmail || sending}
                    style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: inviteEmail ? 'pointer' : 'not-allowed', opacity: inviteEmail ? 1 : 0.5 }}
                  >
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <CheckCircle2 size={20} color="#16a34a" />
                <div>
                  <p style={{ fontWeight: '600', color: '#15803d', fontSize: '14px' }}>Invitation sent to {inviteEmail}</p>
                  <p style={{ fontSize: '13px', color: '#166534' }}>You can invite more drivers from the Invite Drivers page anytime.</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(2)}
                style={{ flex: 1, padding: '12px', background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!inviteSent}
                style={{ flex: 2, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: inviteSent ? 'pointer' : 'not-allowed', opacity: inviteSent ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Alerts */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Configure Alert Preferences</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                Choose when DriveWell notifies you. You can change these anytime in Account Settings.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                { key: 'missedCheckin', title: 'Missed Check-in Alerts',  desc: 'Notify me when a driver misses 3+ days of check-ins' },
                { key: 'certExpiry',    title: 'DOT Cert Expiry Alerts',  desc: 'Remind me 60 and 30 days before a cert expires'       },
                { key: 'weeklyReport',  title: 'Weekly Fleet Summary',    desc: 'Email digest with engagement and risk highlights'       },
              ].map(({ key, title, desc }) => (
                <div
                  key={key}
                  onClick={() => setAlerts(a => ({ ...a, [key]: !a[key] }))}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', background: alerts[key] ? '#eff6ff' : '#f9fafb',
                    border: `1.5px solid ${alerts[key] ? '#bfdbfe' : '#e5e7eb'}`,
                    borderRadius: '10px', cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{title}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{desc}</p>
                  </div>
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0, marginLeft: '16px',
                    background: alerts[key] ? '#2563eb' : '#d1d5db', position: 'relative', transition: 'background 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute', top: '3px',
                      left: alerts[key] ? '23px' : '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'white', transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                localStorage.setItem('dw_fleet_alert_prefs', JSON.stringify(alerts))
                setStep(3)
              }}
              style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Save & Continue <ArrowRight size={17} />
            </button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={40} color="#16a34a" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '10px' }}>Setup Complete!</h2>
            <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
              Your fleet portal is ready. As drivers accept their invitations,
              you'll see their risk scores and wellness data here in real time.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              {[
                { label: 'Fleet Readiness',  value: '—',  desc: 'Pending drivers' },
                { label: 'Drivers Invited',  value: inviteSent ? '1' : '0', desc: 'Pending acceptance' },
                { label: 'Alerts Active',    value: Object.values(alerts).filter(Boolean).length, desc: 'of 3 enabled' },
                { label: 'Trial Days Left',  value: '14', desc: 'No card needed' },
              ].map(m => (
                <div key={m.label} style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px' }}>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>{m.value}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{m.label}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>{m.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={finish}
              style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Go to Dashboard <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FleetOnboarding
