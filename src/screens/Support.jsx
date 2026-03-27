import React, { useState } from 'react'
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Mail, Phone, BookOpen } from 'lucide-react'

const FAQ = [
  {
    q: 'How do I add drivers to my fleet?',
    a: 'Go to Invite Drivers from the sidebar. Enter each driver\'s email address and click Send Invite. They\'ll receive an invitation link to create their account and automatically join your fleet.',
  },
  {
    q: 'What health data can I see for my drivers?',
    a: 'To protect driver privacy, you can see: (1) whether a driver has checked in (yes/no), (2) their DOT cert expiration date, and (3) fleet-wide aggregate wellness trends. Individual health values (blood pressure, weight, etc.) are private to each driver.',
  },
  {
    q: 'How is the DOT Readiness Score calculated?',
    a: 'The score (0–100) is based on FMCSA medical thresholds: Blood Pressure (30 pts), BMI (20 pts), Heart Rate (15 pts), Blood Glucose (20 pts), and Check-In Streak (15 pts). You see fleet-average scores only, not individual readings.',
  },
  {
    q: 'How does billing work?',
    a: 'Fleet plans are billed monthly per active driver. "Active" means the driver accepted their invitation and has logged into DriveWell at least once that month. You\'re never charged for invited-but-not-accepted seats.',
  },
  {
    q: 'Can I export data for insurance purposes?',
    a: 'Yes. Go to Insurance Report in the sidebar. You can generate a PDF report showing anonymized fleet wellness metrics and DOT compliance rates. This report uses only aggregate data — no individual driver health values.',
  },
  {
    q: 'What happens to driver data if I cancel?',
    a: 'If you cancel, drivers retain their accounts and personal health data. They lose access to fleet-connected features but can continue using DriveWell individually. Your fleet dashboard is archived for 90 days in case you return.',
  },
  {
    q: 'How do I upgrade or downgrade my plan?',
    a: 'Go to Account Settings > Billing & Subscription. You can upgrade immediately (prorated billing) or downgrade at your next renewal date. Contact support if your fleet size has changed significantly.',
  },
]

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: '500', fontSize: '15px', color: '#111827', paddingRight: '16px' }}>{q}</span>
        {open ? <ChevronUp size={18} color="#6b7280" style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color="#6b7280" style={{ flexShrink: 0 }} />}
      </button>
      {open && <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', paddingBottom: '16px' }}>{a}</p>}
    </div>
  )
}

const Support = () => {
  const [form, setForm]   = useState({ subject: '', priority: 'normal', message: '' })
  const [sent, setSent]   = useState(false)
  const [search, setSearch] = useState('')

  const filtered = FAQ.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ subject: '', priority: 'normal', message: '' })
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Support</h1>
        <p className="page-subtitle">We're here to help</p>
      </div>

      {/* Contact options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: <Mail size={24} color="#2563eb" />, label: 'Email Support', note: 'fleet@drivewell.app', badge: '< 4 hr response', badgeColor: '#eff6ff', badgeText: '#2563eb' },
          { icon: <Phone size={24} color="#059669" />, label: 'Phone', note: '(800) 555-WELL', badge: 'M–F 8am–6pm CT', badgeColor: '#f0fdf4', badgeText: '#15803d' },
          { icon: <BookOpen size={24} color="#8b5cf6" />, label: 'Documentation', note: 'Fleet Admin Guide', badge: 'Self-serve', badgeColor: '#faf5ff', badgeText: '#7c3aed' },
        ].map(c => (
          <div key={c.label} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ marginBottom: '10px' }}>{c.icon}</div>
            <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{c.label}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{c.note}</p>
            <span style={{ background: c.badgeColor, color: c.badgeText, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{c.badge}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* FAQ */}
        <div className="card">
          <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} color="#2563eb" /> FAQ
          </h2>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search FAQ…"
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', marginBottom: '12px' }}
          />
          {filtered.length === 0 && <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '24px' }}>No matching questions.</p>}
          {filtered.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>

        {/* Contact form */}
        <div className="card">
          <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#2563eb" /> Open a Ticket
          </h2>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 24px', color: '#059669' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>✓</p>
              <p style={{ fontWeight: '700', fontSize: '18px' }}>Ticket submitted!</p>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Our fleet support team will respond within 4 business hours.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: '20px', padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Submit another</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label style={lbl}>Subject</label>
              <select style={inp} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required>
                <option value="">Select a topic…</option>
                <option>Driver invitation issue</option>
                <option>Billing question</option>
                <option>Plan upgrade/downgrade</option>
                <option>Data or report question</option>
                <option>Technical issue</option>
                <option>Feature request</option>
                <option>Other</option>
              </select>

              <label style={lbl}>Priority</label>
              <select style={inp} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low — general question</option>
                <option value="normal">Normal — need help soon</option>
                <option value="high">High — affecting operations</option>
                <option value="urgent">Urgent — system is down</option>
              </select>

              <label style={lbl}>Message</label>
              <textarea
                style={{ ...inp, minHeight: '130px', resize: 'vertical' }}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Describe the issue in detail…"
                required
              />

              <button type="submit" style={{ marginTop: '16px', width: '100%', padding: '13px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginTop: '14px', marginBottom: '6px' }
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }

export default Support
