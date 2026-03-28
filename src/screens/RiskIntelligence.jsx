import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle, DollarSign, Users } from 'lucide-react'
import { mockDrivers, getDaysUntilDot } from '../data/mockFleetData'
import { scoreFleet, RISK_CONFIG, CATEGORY_LABELS } from '../utils/riskEngine'

// ── Mini sparkline bar ──────────────────────────────────────────────────────
const MiniBar = ({ value, max, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ flex: 1, height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s' }} />
    </div>
    <span style={{ fontSize: '13px', fontWeight: '600', color, minWidth: '28px', textAlign: 'right' }}>{value}</span>
  </div>
)

// ── Risk Category breakdown card ─────────────────────────────────────────────
const CategoryCard = ({ category, affectedDrivers, total, drivers }) => {
  const [open, setOpen] = useState(false)
  const pct   = Math.round((affectedDrivers / total) * 100)
  const color = pct >= 50 ? '#dc2626' : pct >= 25 ? '#d97706' : '#16a34a'
  const names = drivers.filter(d => d.riskFactors.some(f => f.category === category)).map(d => d.name)

  return (
    <div className="card" style={{ marginBottom: '12px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <p style={{ fontWeight: '700', fontSize: '15px' }}>{CATEGORY_LABELS[category] || category}</p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{affectedDrivers} of {total} drivers affected ({pct}%)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '28px', fontWeight: '800', color, lineHeight: 1 }}>{pct}%</p>
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>of fleet</p>
        </div>
      </div>
      <MiniBar value={affectedDrivers} max={total} color={color} />
      {open && names.length > 0 && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>AFFECTED DRIVERS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {names.map(n => (
              <span key={n} style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '999px', fontSize: '13px' }}>{n}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────────
const RiskIntelligence = () => {
  const { scored, summary } = useMemo(() => scoreFleet(mockDrivers), [])
  const { total, highRisk, elevated, low, fleetReadiness, projectedFailures, estimatedExposure, estimatedSavings, topCategories } = summary

  const [roiDrivers,   setRoiDrivers]   = useState(total)
  const [roiReduction, setRoiReduction] = useState(40)
  const [roiPlan,      setRoiPlan]      = useState(25)

  // All categories and counts
  const categoryCounts = useMemo(() => {
    const counts = {}
    scored.forEach(d => d.riskFactors.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1 }))
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [scored])

  // ROI calculator — $15,000/failure per ATRI research (recruiting + training + downtime)
  const roiFailures  = Math.round(roiDrivers * 0.15 * (roiReduction / 100))
  const roiSavings   = roiFailures * 15000
  const roiCost      = roiDrivers * roiPlan * 12
  const roiNet       = roiSavings - roiCost
  const roiPct       = roiCost > 0 ? Math.round((roiNet / roiCost) * 100) : 0

  // Drivers who haven't engaged in 7+ days
  const disengaged = scored.filter(d => (new Date() - new Date(d.lastActive)) / 86400000 >= 7)
    .sort((a, b) => b.riskScore - a.riskScore)

  // Expiring certs within 60 days
  const expiringCerts = scored
    .filter(d => { const days = getDaysUntilDot(d.dotPhysicalDate); return days >= 0 && days <= 60 })
    .sort((a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate))

  return (
    <div className="main-content">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Brain size={26} color="#7c3aed" />
          <h1 style={{ fontSize: '26px', fontWeight: '700' }}>Risk Intelligence</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Which drivers are at risk, why, and what it costs your business.</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Fleet Readiness',   value: `${fleetReadiness}/100`, color: fleetReadiness >= 70 ? '#16a34a' : '#d97706' },
          { label: 'High Risk Drivers', value: highRisk,                 color: '#dc2626' },
          { label: 'Risk Exposure',     value: `$${(estimatedExposure / 1000).toFixed(0)}K`, color: '#7c3aed' },
          { label: 'Est. Savings',      value: `$${(estimatedSavings / 1000).toFixed(0)}K`, color: '#16a34a' },
        ].map(m => (
          <div key={m.label} className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{m.label}</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: m.color, lineHeight: 1 }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Risk Category Analysis */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Risk Factor Breakdown</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Click any category to see affected drivers</p>
          {categoryCounts.map(([cat, count]) => (
            <CategoryCard key={cat} category={cat} affectedDrivers={count} total={total} drivers={scored} />
          ))}
        </div>

        <div>
          {/* ROI Calculator */}
          <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <DollarSign size={20} color="#a5b4fc" />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>ROI Calculator</h2>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#a5b4fc', display: 'block', marginBottom: '6px' }}>
                Number of Drivers: <strong style={{ color: 'white' }}>{roiDrivers}</strong>
              </label>
              <input type="range" min={5} max={500} step={5} value={roiDrivers} onChange={e => setRoiDrivers(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#818cf8' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#a5b4fc', display: 'block', marginBottom: '6px' }}>
                Expected Failure Reduction: <strong style={{ color: 'white' }}>{roiReduction}%</strong>
              </label>
              <input type="range" min={10} max={70} step={5} value={roiReduction} onChange={e => setRoiReduction(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#818cf8' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#a5b4fc', display: 'block', marginBottom: '6px' }}>
                Plan: <strong style={{ color: 'white' }}>${roiPlan}/driver/mo</strong>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{ v: 25, l: 'Starter' }, { v: 20, l: 'Growth' }, { v: 17, l: 'Pro' }].map(p => (
                  <button key={p.v} onClick={() => setRoiPlan(p.v)}
                    style={{ flex: 1, padding: '6px', border: `1px solid ${roiPlan === p.v ? '#818cf8' : 'rgba(255,255,255,0.2)'}`, borderRadius: '6px', background: roiPlan === p.v ? '#818cf8' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                    {p.l}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Failures Prevented', value: roiFailures,                   color: '#86efac' },
                { label: 'Savings Generated',  value: `$${roiSavings.toLocaleString()}`, color: '#86efac' },
                { label: 'Annual Plan Cost',   value: `$${roiCost.toLocaleString()}`,    color: '#fca5a5' },
                { label: 'Net ROI',            value: `${roiPct > 0 ? '+' : ''}${roiPct}%`, color: roiPct >= 0 ? '#86efac' : '#fca5a5' },
              ].map(m => (
                <div key={m.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#a5b4fc', marginBottom: '6px' }}>{m.label}</p>
                  <p style={{ fontSize: '22px', fontWeight: '800', color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#818cf8', marginTop: '14px' }}>
              Based on 15% annual failure rate × {roiReduction}% reduction × $15,000/failure (ATRI industry avg: recruiting + training + downtime).
            </p>
          </div>

          {/* Disengaged Drivers */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Disengaged Drivers</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>No activity in 7+ days</p>
              </div>
              <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' }}>{disengaged.length}</span>
            </div>
            {disengaged.length === 0 ? (
              <p style={{ color: '#16a34a', fontSize: '14px' }}>All drivers engaged this week.</p>
            ) : (
              disengaged.slice(0, 5).map(d => {
                const daysSince = Math.ceil((new Date() - new Date(d.lastActive)) / 86400000)
                const cfg = RISK_CONFIG[d.riskLevel]
                return (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{d.name}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>Last active {daysSince} days ago</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: cfg.color }}>{d.riskScore} risk</span>
                      <Link to={`/driver/${d.id}`} style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>View →</Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Expiring certs */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Certs Expiring ≤ 60 Days</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Schedule DOT physicals now</p>
              </div>
              <Link to="/renewals" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>View all →</Link>
            </div>
            {expiringCerts.length === 0 ? (
              <p style={{ color: '#16a34a', fontSize: '14px' }}>No certs expiring in the next 60 days.</p>
            ) : (
              expiringCerts.map(d => {
                const days = getDaysUntilDot(d.dotPhysicalDate)
                const cfg  = RISK_CONFIG[d.riskLevel]
                return (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{d.name}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>{d.cdlNumber}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '700', color: days <= 14 ? '#dc2626' : '#d97706', fontSize: '14px' }}>{days}d</p>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: cfg.color }}>Risk: {d.riskScore}</p>
                      </div>
                      <Link to={`/driver/${d.id}`} style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>View →</Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Score Methodology */}
      <div className="card" style={{ marginTop: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Score Methodology</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginBottom: '14px' }}>
          DriveWell's Risk Score is derived from each driver's DOT Readiness Score, which maps directly to the medical standards
          set forth in <strong>FMCSA 49 CFR §391.41</strong> (Physical Qualifications for Drivers). Five clinically grounded categories
          are weighted by their relative impact on DOT disqualification outcomes:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '14px' }}>
          {[
            { cat: 'Blood Pressure',  weight: '30 pts', note: '§391.41(b)(6)' },
            { cat: 'Blood Glucose',   weight: '20 pts', note: '§391.41(b)(3)' },
            { cat: 'BMI / Weight',    weight: '20 pts', note: 'Sleep apnea screening' },
            { cat: 'Heart Rate',      weight: '15 pts', note: '§391.41(b)(4)' },
            { cat: 'Habits & Sleep',  weight: '15 pts', note: 'HOS & lifestyle factors' },
          ].map(m => (
            <div key={m.cat} style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontWeight: '700', fontSize: '13px', marginBottom: '2px' }}>{m.cat}</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb', lineHeight: 1, marginBottom: '4px' }}>{m.weight}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>{m.note}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.5' }}>
          Fleet risk scores are aggregated from individual driver DOT Readiness Scores. High Risk = score &lt;50,
          Elevated = 50–69, Low Risk = 70+. Methodology reviewed against published FMCSA medical advisory criteria.
          DriveWell does not provide medical diagnoses or replace a certified DOT medical examiner.
        </p>
      </div>
    </div>
  )
}

export default RiskIntelligence
