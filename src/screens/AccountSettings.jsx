import React, { useState } from 'react'
import { Building2, CreditCard, Bell, Shield, Save, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Section = ({ title, icon, children }) => (
  <div className="card" style={{ marginBottom: '20px' }}>
    <h2 style={{ fontWeight: '700', fontSize: '17px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon} {title}
    </h2>
    {children}
  </div>
)

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>{label}</label>
    {children}
  </div>
)

const inp = { width: '100%', padding: '11px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }

const AccountSettings = () => {
  const { user } = useAuth()
  const [saved, setSaved]   = useState(false)

  const [company, setCompany] = useState({
    name:         'Demo Fleet Co.',
    billingEmail: user?.email || '',
    phone:        '',
    address:      '',
  })

  const [notifs, setNotifs] = useState({
    weeklyReport:   true,
    certAlerts:     true,
    inactiveAlerts: true,
    productUpdates: false,
  })

  const saveCompany = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleNotif = (k) => setNotifs(n => ({ ...n, [k]: !n[k] }))

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage your fleet account</p>
      </div>

      {/* Company info */}
      <Section title="Company Information" icon={<Building2 size={18} color="#2563eb" />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Company Name">
            <input style={inp} value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} placeholder="Your Fleet Company" />
          </Field>
          <Field label="Billing Email">
            <input type="email" style={inp} value={company.billingEmail} onChange={e => setCompany(c => ({ ...c, billingEmail: e.target.value }))} />
          </Field>
          <Field label="Phone Number">
            <input style={inp} value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} placeholder="(555) 000-0000" />
          </Field>
          <Field label="Business Address">
            <input style={inp} value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} placeholder="123 Main St, City, State" />
          </Field>
        </div>
        <button
          onClick={saveCompany}
          style={{ marginTop: '8px', padding: '11px 24px', background: saved ? '#10b981' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </Section>

      {/* Billing */}
      <Section title="Billing & Subscription" icon={<CreditCard size={18} color="#2563eb" />}>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '700', fontSize: '16px', color: '#15803d' }}>Fleet Starter Plan</p>
              <p style={{ fontSize: '13px', color: '#16a34a', marginTop: '2px' }}>Up to 25 drivers · $25/driver/month</p>
            </div>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Active</span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>Next billing: April 27, 2026 · 12 active drivers = $300.00</p>
        </div>

        {[
          { label: 'Update Payment Method', note: 'Visa ending in 4242' },
          { label: 'View Billing History',  note: 'Download invoices' },
          { label: 'Upgrade Plan',          note: 'More drivers, lower per-seat rate' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
            <div>
              <p style={{ fontWeight: '500', fontSize: '15px' }}>{item.label}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{item.note}</p>
            </div>
            <ChevronRight size={18} color="#9ca3af" />
          </div>
        ))}
      </Section>

      {/* Notifications */}
      <Section title="Email Notifications" icon={<Bell size={18} color="#2563eb" />}>
        {[
          { key: 'weeklyReport',   label: 'Weekly fleet wellness summary', note: 'Sent every Monday morning' },
          { key: 'certAlerts',     label: 'DOT cert expiration alerts',     note: 'When a driver cert expires within 60 days' },
          { key: 'inactiveAlerts', label: 'Inactive driver alerts',         note: 'Drivers who haven\'t checked in for 3+ days' },
          { key: 'productUpdates', label: 'Product updates & news',         note: 'New features and announcements' },
        ].map(n => (
          <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <p style={{ fontWeight: '500', fontSize: '15px' }}>{n.label}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{n.note}</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <div
                onClick={() => toggleNotif(n.key)}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer',
                  background: notifs[n.key] ? '#2563eb' : '#d1d5db', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                  position: 'absolute', top: '2px', transition: 'left 0.2s',
                  left: notifs[n.key] ? '22px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
            </label>
          </div>
        ))}
      </Section>

      {/* Security */}
      <Section title="Security" icon={<Shield size={18} color="#2563eb" />}>
        {[
          { label: 'Change Password',        note: 'Last changed 30+ days ago' },
          { label: 'Two-Factor Authentication', note: 'Currently disabled — recommended' },
          { label: 'Active Sessions',        note: 'Manage logged-in devices' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
            <div>
              <p style={{ fontWeight: '500', fontSize: '15px' }}>{item.label}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{item.note}</p>
            </div>
            <ChevronRight size={18} color="#9ca3af" />
          </div>
        ))}
      </Section>
    </div>
  )
}

export default AccountSettings
