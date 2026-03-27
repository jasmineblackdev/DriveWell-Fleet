import React, { useState } from 'react'
import { Building2, Mail, Upload, Bell, Shield, Save, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Section = ({ title, icon: Icon, children }) => (
  <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <Icon size={20} color="#2563eb" />
      <h2 style={{ fontSize: '17px', fontWeight: '600' }}>{title}</h2>
    </div>
    {children}
  </div>
)

const Field = ({ label, type = 'text', placeholder, defaultValue, helper }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      style={{
        width: '100%', maxWidth: '480px', padding: '9px 12px',
        border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px',
      }}
    />
    {helper && <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{helper}</p>}
  </div>
)

const Toggle = ({ label, description, defaultChecked = false }) => {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '500' }}>{label}</p>
        {description && <p style={{ fontSize: '12px', color: '#9ca3af' }}>{description}</p>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none', padding: '0',
          background: on ? '#2563eb' : '#d1d5db', position: 'relative', transition: 'background 0.2s',
        }}
      >
        <span style={{
          width: '18px', height: '18px', borderRadius: '50%', background: 'white',
          position: 'absolute', top: '3px', left: on ? '23px' : '3px', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

const Settings = () => {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [inviteEmails, setInviteEmails] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleInvite = () => {
    if (!inviteEmails.trim() && !csvFile) return
    setInviteSent(true)
    setTimeout(() => setInviteSent(false), 3000)
    setInviteEmails('')
    setCsvFile(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Settings</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage your fleet portal preferences</p>
        </div>
        <button
          className="btn-primary"
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Fleet Info */}
      <Section title="Fleet Information" icon={Building2}>
        <Field label="Fleet / Company Name"    defaultValue={user?.company}     placeholder="FleetCo Logistics" />
        <Field label="Admin Contact Email"      defaultValue={user?.email}       placeholder="admin@company.com" type="email" />
        <Field label="DOT Fleet Number (USDOT)" defaultValue="USDOT-2891045"    placeholder="USDOT-XXXXXXX" />
      </Section>

      {/* Invite Drivers */}
      <Section title="Invite Drivers" icon={Mail}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Email Addresses
          </label>
          <textarea
            value={inviteEmails}
            onChange={e => setInviteEmails(e.target.value)}
            placeholder="driver1@company.com, driver2@company.com"
            rows={3}
            style={{
              width: '100%', maxWidth: '480px', padding: '9px 12px',
              border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px',
              resize: 'vertical', fontFamily: 'inherit',
            }}
          />
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Separate multiple emails with commas
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Or Upload CSV
          </label>
          <div style={{
            border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px',
            textAlign: 'center', maxWidth: '480px',
            background: csvFile ? '#f0fdf4' : '#f9fafb',
          }}>
            <Upload size={24} color={csvFile ? '#22c55e' : '#9ca3af'} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '14px', color: csvFile ? '#15803d' : '#6b7280', marginBottom: '8px' }}>
              {csvFile ? csvFile.name : 'Drop a CSV file here, or click to browse'}
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={e => setCsvFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
              Choose File
            </label>
            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
              CSV format: name, email, cdl_number
            </p>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleInvite}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {inviteSent ? <CheckCircle2 size={15} /> : <Mail size={15} />}
          {inviteSent ? 'Invites Sent!' : 'Send Invites'}
        </button>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Toggle label="DOT renewal alerts"        description="Notify me 90, 60, 30, 14, and 7 days before expirations" defaultChecked />
        <Toggle label="High-risk driver alerts"   description="Alert when a driver's status changes to red"              defaultChecked />
        <Toggle label="Weekly engagement summary" description="Receive a weekly email on fleet workout engagement"       defaultChecked />
        <Toggle label="New driver join alerts"    description="Notify when a driver accepts their invitation" />
      </Section>

      {/* SSO */}
      <Section title="Single Sign-On (SSO)" icon={Shield}>
        <Toggle label="Enable SSO" description="Allow team members to sign in via your identity provider" />
        <Field label="SAML Metadata URL" placeholder="https://your-idp.example.com/metadata.xml" helper="Paste the SAML metadata URL from your identity provider" />
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px', color: '#374151' }}>Identity Providers</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['🔷 Okta', '🪟 Azure AD'].map(name => (
              <button key={name} disabled style={{
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb',
                background: '#f9fafb', color: '#9ca3af', fontSize: '13px', cursor: 'not-allowed',
              }}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          SSO is available on the Enterprise plan.{' '}
          <span style={{ color: '#2563eb', cursor: 'pointer' }}>Contact sales to upgrade.</span>
        </p>
      </Section>

      {/* Security */}
      <Section title="Security & Billing" icon={Shield}>
        <Field label="Current Password" type="password" placeholder="••••••••" />
        <Field label="New Password"     type="password" placeholder="••••••••" />
        <div style={{ marginTop: '8px', marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Billing Plan</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-blue">Pro — 15 drivers</span>
            <button className="btn-secondary" style={{ fontSize: '12px', padding: '5px 12px' }}>
              Upgrade Plan
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Settings
