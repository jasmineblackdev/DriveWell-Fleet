import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle2, Clock,
  DollarSign, Activity, ShieldAlert, BarChart2, Shield,
} from 'lucide-react'
import { mockDrivers, getDaysUntilDot } from '../data/mockFleetData'
import { scoreFleet, RISK_CONFIG, CATEGORY_LABELS } from '../utils/riskEngine'

// ── Sub-components ─────────────────────────────────────────────────────────────

const MetricCard = ({ label, value, sub, color = '#2563eb', icon: Icon, trend }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null
  const trendColor = trend === 'up' ? '#16a34a' : '#dc2626'

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
          <p style={{ fontSize: '30px', fontWeight: '800', color, lineHeight: 1 }}>{value}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            {TrendIcon && <TrendIcon size={12} color={trendColor} />}
            {sub && <p style={{ fontSize: '12px', color: TrendIcon ? trendColor : '#9ca3af' }}>{sub}</p>}
          </div>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  )
}

const FleetReadinessGauge = ({ score }) => {
  const color = score >= 70 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626'
  const label = score >= 70 ? 'Strong' : score >= 50 ? 'Fair' : 'At Risk'
  const pct   = score

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* Background arc */}
        <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="#f3f4f6" strokeWidth="12" strokeLinecap="round" />
        {/* Filled arc */}
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 188} 188`}
        />
      </svg>
      <div style={{ marginTop: '-16px' }}>
        <p style={{ fontSize: '36px', fontWeight: '800', color, lineHeight: 1 }}>{score}</p>
        <p style={{ fontSize: '13px', fontWeight: '600', color, marginTop: '2px' }}>{label}</p>
        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Fleet Readiness Score</p>
      </div>
    </div>
  )
}

const RiskBar = ({ high, elevated, low, total }) => {
  const hPct = Math.round((high / total) * 100)
  const ePct = Math.round((elevated / total) * 100)
  const lPct = 100 - hPct - ePct

  return (
    <div>
      <div style={{ height: '14px', borderRadius: '999px', overflow: 'hidden', display: 'flex', background: '#f3f4f6', marginBottom: '12px' }}>
        <div style={{ width: `${lPct}%`, background: '#22c55e', transition: 'width 0.5s' }} />
        <div style={{ width: `${ePct}%`, background: '#eab308', transition: 'width 0.5s' }} />
        <div style={{ width: `${hPct}%`, background: '#ef4444', transition: 'width 0.5s' }} />
      </div>
      <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
        {[
          { label: `${low} Low Risk`,      dot: '#22c55e' },
          { label: `${elevated} Elevated`, dot: '#eab308' },
          { label: `${high} High Risk`,    dot: '#ef4444' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
            <span style={{ color: '#374151' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TrendBadge = ({ trend }) => {
  const cfg = {
    improving: { icon: TrendingUp,   color: '#16a34a', bg: '#f0fdf4', label: 'Improving'  },
    stable:    { icon: Minus,        color: '#d97706', bg: '#fffbeb', label: 'Stable'      },
    declining: { icon: TrendingDown, color: '#dc2626', bg: '#fef2f2', label: 'Declining'   },
  }[trend] || { icon: Minus, color: '#6b7280', bg: '#f9fafb', label: '—' }

  const Icon = cfg.icon
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: cfg.bg, padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', color: cfg.color }}>
      <Icon size={11} /> {cfg.label}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { scored, summary } = useMemo(() => scoreFleet(mockDrivers), [])
  const { total, highRisk, elevated, low, fleetReadiness, projectedFailures, estimatedExposure, estimatedSavings, topCategories } = summary

  const urgentDOT = scored
    .filter(d => { const days = getDaysUntilDot(d.dotPhysicalDate); return days >= 0 && days <= 30 })
    .sort((a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate))
    .slice(0, 5)

  const overdueDOT   = scored.filter(d => getDaysUntilDot(d.dotPhysicalDate) < 0)
  const actionNeeded = scored.filter(d => d.riskLevel === 'high').sort((a, b) => b.riskScore - a.riskScore).slice(0, 5)
  const improving    = scored.filter(d => d.trend === 'improving').length
  const declining    = scored.filter(d => d.trend === 'declining').length

  const activeThisWeek = scored.filter(d => {
    const diff = (new Date() - new Date(d.lastActive)) / 86400000
    return diff <= 7
  }).length
  const engagementRate = Math.round((activeThisWeek / total) * 100)

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Fleet Intelligence Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {overdueDOT.length > 0 && (
            <span style={{ marginLeft: '16px', background: '#fef2f2', color: '#dc2626', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
              ⚠ {overdueDOT.length} DOT overdue
            </span>
          )}
        </p>
      </div>

      {/* Row 1: Fleet Readiness Score + Risk Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Fleet Readiness Score */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <FleetReadinessGauge score={fleetReadiness} />
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>Improving</p>
              <p style={{ fontWeight: '700', color: '#16a34a', fontSize: '18px' }}>{improving}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>Stable</p>
              <p style={{ fontWeight: '700', color: '#d97706', fontSize: '18px' }}>{scored.filter(d => d.trend === 'stable').length}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>Declining</p>
              <p style={{ fontWeight: '700', color: '#dc2626', fontSize: '18px' }}>{declining}</p>
            </div>
          </div>
        </div>

        {/* Risk Distribution + Top Factors */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Risk Distribution — {total} Drivers</h2>
            <Link to="/roster" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>View Roster →</Link>
          </div>
          <RiskBar high={highRisk} elevated={elevated} low={low} total={total} />

          <div style={{ marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Top Risk Factors Across Fleet</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {topCategories.map(c => (
                <div key={c.category} style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 12px', fontSize: '13px' }}>
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>{c.affectedDrivers}</span>
                  <span style={{ color: '#374151', marginLeft: '6px' }}>{CATEGORY_LABELS[c.category] || c.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Executive Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <MetricCard icon={ShieldAlert}   label="High Risk Drivers"      value={highRisk}          color="#dc2626"  sub="need immediate attention"                        trend={highRisk > 3 ? 'down' : null} />
        <MetricCard icon={Activity}      label="Engagement Rate"         value={`${engagementRate}%`} color="#2563eb" sub={`${activeThisWeek} active this week`}         trend="up" />
        <MetricCard icon={TrendingUp}    label="Improving Trend"         value={improving}          color="#16a34a"  sub={`of ${total} drivers improving`}               trend="up" />
        <MetricCard icon={Clock}         label="DOT Due ≤ 30 Days"       value={urgentDOT.length}   color="#d97706"  sub="renewals upcoming"                             />
        <MetricCard icon={DollarSign}    label="Risk Exposure Est."      value={`$${(estimatedExposure / 1000).toFixed(0)}K`} color="#7c3aed" sub="projected DOT failures"  />
      </div>

      {/* Row 3: Financial Impact + Action Required */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Financial Impact */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Estimated Business Impact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Projected DOT Failures', value: projectedFailures, color: '#dc2626', note: 'without intervention' },
              { label: 'Risk Exposure',           value: `$${estimatedExposure.toLocaleString()}`, color: '#7c3aed', note: 'downtime + replacement' },
              { label: 'Projected Savings',       value: `$${estimatedSavings.toLocaleString()}`,  color: '#16a34a', note: 'with DriveWell' },
              { label: 'ROI This Year',           value: estimatedSavings > 0 ? `${Math.round((estimatedSavings / (total * 25 * 12)) * 100)}%` : '—', color: '#2563eb', note: 'on subscription cost' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>{item.label}</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: item.color }}>{item.value}</p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{item.note}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>
            Based on 15% annual DOT failure rate, 40% reduction with DriveWell engagement, avg. $15,000/failure cost (recruiting + training + downtime, per ATRI research).
          </p>
        </div>

        {/* Action Required */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Action Required</h2>
            <Link to="/roster" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>View all →</Link>
          </div>

          {actionNeeded.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', background: '#f0fdf4', borderRadius: '10px' }}>
              <CheckCircle2 size={20} color="#16a34a" />
              <p style={{ fontSize: '14px', color: '#15803d' }}>No high-risk drivers right now. Great work!</p>
            </div>
          ) : (
            <div>
              {actionNeeded.map((driver, i) => {
                const cfg = RISK_CONFIG[driver.riskLevel]
                const topFactor = driver.riskFactors[0]
                return (
                  <div key={driver.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < actionNeeded.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{driver.name}</p>
                        <TrendBadge trend={driver.trend} />
                      </div>
                      {topFactor && (
                        <p style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topFactor.label}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '18px', fontWeight: '800', color: cfg.color, lineHeight: 1 }}>{driver.riskScore}</p>
                        <p style={{ fontSize: '10px', color: '#9ca3af' }}>risk</p>
                      </div>
                      <Link to={`/driver/${driver.id}`} style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', whiteSpace: 'nowrap' }}>View →</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Industry Benchmark */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', color: 'white', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <BarChart2 size={20} color="#93c5fd" />
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Fleet vs Industry Benchmark</h2>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', color: '#93c5fd' }}>
            FMCSA fleet health data
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { label: 'DOT Readiness Score', yours: fleetReadiness,                              industry: 58, higher: true,  unit: '/100' },
            { label: 'High-Risk Driver Rate', yours: Math.round((highRisk / total) * 100),      industry: 22, higher: false, unit: '%'    },
            { label: 'Projected Failure Rate', yours: Math.round((projectedFailures / total) * 100), industry: 15, higher: false, unit: '%' },
            { label: 'Weekly Engagement',    yours: engagementRate,                             industry: 34, higher: true,  unit: '%'    },
          ].map(m => {
            const winning = m.higher ? m.yours > m.industry : m.yours < m.industry
            return (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#93c5fd', marginBottom: '10px', fontWeight: '600' }}>{m.label}</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px' }}>
                  <div>
                    <p style={{ fontSize: '26px', fontWeight: '800', color: winning ? '#86efac' : '#fca5a5', lineHeight: 1 }}>{m.yours}{m.unit}</p>
                    <p style={{ fontSize: '10px', color: '#93c5fd', marginTop: '3px' }}>Your Fleet</p>
                  </div>
                  <span style={{ color: '#475569', fontSize: '12px' }}>vs</span>
                  <div>
                    <p style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>{m.industry}{m.unit}</p>
                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>Industry Avg</p>
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: '700', color: winning ? '#86efac' : '#fca5a5' }}>
                  {winning ? '▲ Above Average' : '▼ Below Average'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 4b: Insurance Premium Impact */}
      <div className="card" style={{ marginBottom: '20px', border: '1px solid #e9d5ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={18} color="#7c3aed" />
          <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Insurance Premium Impact</h2>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>
            Actuarial Estimate
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
          {[
            { label: 'Est. Annual Premium (current)',  value: `$${(total * 3500).toLocaleString()}`,                     sub: 'at current risk level',         color: '#374151' },
            { label: 'Projected Premium with DriveWell', value: `$${Math.round(total * 3500 * 0.91).toLocaleString()}`, sub: '~9% wellness discount',          color: '#15803d' },
            { label: 'Est. Annual Premium Savings',   value: `$${Math.round(total * 3500 * 0.09).toLocaleString()}`,    sub: 'shareable with your carrier',    color: '#7c3aed' },
          ].map(m => (
            <div key={m.label} style={{ padding: '14px', background: '#faf5ff', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>{m.label}</p>
              <p style={{ fontSize: '22px', fontWeight: '800', color: m.color }}>{m.value}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{m.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#9ca3af' }}>
          Based on $3,500/driver avg commercial trucking premium and 9% wellness discount. Share the Insurance Report with your carrier to initiate a premium review.
        </p>
      </div>

      {/* Row 5: Urgent DOT Renewals */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Upcoming DOT Renewals</h2>
          <Link to="/renewals" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>View all renewals →</Link>
        </div>

        {urgentDOT.length === 0 && overdueDOT.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <p style={{ fontSize: '14px', color: '#15803d' }}>No DOT renewals due in the next 30 days.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Driver', 'Risk Score', 'Days Until DOT', 'Top Risk Factor', 'Trend', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...overdueDOT, ...urgentDOT].map(driver => {
                  const days = getDaysUntilDot(driver.dotPhysicalDate)
                  const cfg  = RISK_CONFIG[driver.riskLevel]
                  const topFactor = driver.riskFactors[0]
                  return (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px' }}>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{driver.name}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>{driver.cdlNumber}</p>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: cfg.bg, padding: '4px 10px', borderRadius: '999px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: cfg.color }}>{driver.riskScore}</span>
                          <span style={{ fontSize: '11px', color: cfg.color }}>{cfg.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: '700', color: days < 0 ? '#dc2626' : days <= 14 ? '#dc2626' : '#d97706', fontSize: '14px' }}>
                          {days < 0 ? `${Math.abs(days)}d OVERDUE` : days === 0 ? 'TODAY' : `${days} days`}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280', maxWidth: '200px' }}>
                        {topFactor ? topFactor.label : '—'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <TrendBadge trend={driver.trend} />
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Link to={`/driver/${driver.id}`} style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>View →</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
