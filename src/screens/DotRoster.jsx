import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { mockDrivers, getDaysUntilDot } from '../data/mockFleetData'
import { scoreFleet, RISK_CONFIG, CATEGORY_LABELS } from '../utils/riskEngine'

const TrendIcon = ({ trend }) => {
  if (trend === 'improving') return <TrendingUp size={14} color="#16a34a" />
  if (trend === 'declining') return <TrendingDown size={14} color="#dc2626" />
  return <Minus size={14} color="#d97706" />
}

const DotRoster = () => {
  const { scored } = useMemo(() => scoreFleet(mockDrivers), [])

  const [search,       setSearch]       = useState('')
  const [riskFilter,   setRiskFilter]   = useState('all')
  const [sortKey,      setSortKey]      = useState('riskScore')
  const [sortAsc,      setSortAsc]      = useState(false)
  const [expandedId,   setExpandedId]   = useState(null)

  const SORT_KEYS = {
    name:      (d) => d.name,
    dotDays:   (d) => getDaysUntilDot(d.dotPhysicalDate),
    riskScore: (d) => d.riskScore,
    workouts:  (d) => -d.workoutsThisMonth,
    streak:    (d) => -(d.checkInStreak || 0),
  }

  const filtered = useMemo(() => {
    let list = [...scored]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.cdlNumber.toLowerCase().includes(q))
    }

    if (riskFilter !== 'all') {
      list = list.filter(d => d.riskLevel === riskFilter)
    }

    const fn = SORT_KEYS[sortKey] ?? SORT_KEYS.name
    list.sort((a, b) => {
      const av = fn(a), bv = fn(b)
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })

    return list
  }, [scored, search, riskFilter, sortKey, sortAsc])

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(key === 'name') }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronUp size={11} style={{ opacity: 0.3 }} />
    return sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />
  }

  const SortBtn = ({ k, label }) => (
    <button onClick={() => handleSort(k)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
      {label} <SortIcon k={k} />
    </button>
  )

  const dotDaysStyle = (days) => {
    if (days < 0)   return { text: `${Math.abs(days)}d OVERDUE`, color: '#dc2626', fw: '700' }
    if (days <= 14) return { text: `${days}d`,    color: '#dc2626', fw: '700' }
    if (days <= 30) return { text: `${days}d`,    color: '#d97706', fw: '600' }
    return               { text: `${days}d`,    color: '#374151', fw: '400' }
  }

  const counts = {
    all:      scored.length,
    high:     scored.filter(d => d.riskLevel === 'high').length,
    elevated: scored.filter(d => d.riskLevel === 'elevated').length,
    low:      scored.filter(d => d.riskLevel === 'low').length,
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>DOT Roster</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>{filtered.length} of {scored.length} drivers · sorted by risk</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or CDL…"
            style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: 'white', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { key: 'all',      label: `All (${counts.all})`,           activeColor: '#2563eb' },
            { key: 'high',     label: `High Risk (${counts.high})`,    activeColor: '#dc2626' },
            { key: 'elevated', label: `Elevated (${counts.elevated})`, activeColor: '#d97706' },
            { key: 'low',      label: `Low (${counts.low})`,           activeColor: '#16a34a' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setRiskFilter(f.key)}
              style={{
                padding: '8px 14px', border: '1.5px solid', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap',
                background:   riskFilter === f.key ? f.activeColor : 'white',
                color:        riskFilter === f.key ? 'white' : '#374151',
                borderColor:  riskFilter === f.key ? f.activeColor : '#e5e7eb',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={th}><SortBtn k="name" label="Driver" /></th>
                <th style={th}><SortBtn k="riskScore" label="Risk Score" /></th>
                <th style={th}>Risk Factors</th>
                <th style={th}><SortBtn k="dotDays" label="DOT Renewal" /></th>
                <th style={th}>BP</th>
                <th style={th}>BMI</th>
                <th style={th}><SortBtn k="workouts" label="Workouts" /></th>
                <th style={th}><SortBtn k="streak" label="Streak" /></th>
                <th style={th}>Trend</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((driver, idx) => {
                const days = getDaysUntilDot(driver.dotPhysicalDate)
                const dStyle = dotDaysStyle(days)
                const cfg = RISK_CONFIG[driver.riskLevel]
                const isExpanded = expandedId === driver.id

                return (
                  <React.Fragment key={driver.id}>
                    <tr
                      style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: isExpanded ? '#fafafa' : 'white' }}
                      onClick={() => setExpandedId(isExpanded ? null : driver.id)}
                    >
                      <td style={td}>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{driver.name}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>{driver.cdlNumber}</p>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '4px 10px', borderRadius: '999px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: cfg.color }}>{driver.riskScore}</span>
                          <span style={{ fontSize: '11px', color: cfg.color, fontWeight: '600' }}>{cfg.label}</span>
                        </div>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '220px' }}>
                          {driver.riskFactors.slice(0, 2).map(f => (
                            <span key={f.label} style={{ fontSize: '11px', background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                              {f.label}
                            </span>
                          ))}
                          {driver.riskFactors.length > 2 && (
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>+{driver.riskFactors.length - 2} more</span>
                          )}
                          {driver.riskFactors.length === 0 && <span style={{ fontSize: '12px', color: '#9ca3af' }}>None</span>}
                        </div>
                      </td>
                      <td style={td}>
                        <p style={{ fontWeight: dStyle.fw, color: dStyle.color, fontSize: '14px' }}>{dStyle.text}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {new Date(driver.dotPhysicalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </p>
                      </td>
                      <td style={{ ...td, fontWeight: '600' }}>
                        <span style={{ color: driver.metrics.systolic >= 140 ? '#dc2626' : '#374151' }}>
                          {driver.metrics.systolic}/{driver.metrics.diastolic}
                        </span>
                      </td>
                      <td style={{ ...td, fontWeight: '600' }}>
                        <span style={{ color: driver.metrics.bmi >= 35 ? '#dc2626' : driver.metrics.bmi >= 30 ? '#d97706' : '#374151' }}>
                          {driver.metrics.bmi}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: `${Math.min(driver.workoutsThisMonth * 4, 60)}px`, height: '6px', borderRadius: '3px', background: driver.workoutsThisMonth >= 12 ? '#22c55e' : driver.workoutsThisMonth >= 6 ? '#eab308' : '#ef4444' }} />
                          <span style={{ fontSize: '13px' }}>{driver.workoutsThisMonth}</span>
                        </div>
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: (driver.checkInStreak || 0) >= 7 ? '#16a34a' : '#6b7280' }}>
                          {driver.checkInStreak || 0}d
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendIcon trend={driver.trend} />
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{driver.trend}</span>
                        </div>
                      </td>
                      <td style={td}>
                        <Link
                          to={`/driver/${driver.id}`}
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', whiteSpace: 'nowrap' }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>

                    {/* Expanded risk factor detail */}
                    {isExpanded && driver.riskFactors.length > 0 && (
                      <tr>
                        <td colSpan={10} style={{ background: '#fafafa', padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>All Risk Factors</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {driver.riskFactors.map(f => {
                              const sColor = { critical: '#dc2626', high: '#dc2626', medium: '#d97706', low: '#16a34a' }[f.severity] || '#6b7280'
                              const sBg    = { critical: '#fef2f2', high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' }[f.severity] || '#f9fafb'
                              return (
                                <div key={f.label} style={{ background: sBg, border: `1px solid ${sColor}30`, borderRadius: '8px', padding: '6px 12px', fontSize: '13px' }}>
                                  <span style={{ color: sColor, fontWeight: '600', textTransform: 'capitalize', fontSize: '11px' }}>{f.severity} · </span>
                                  <span style={{ color: '#374151' }}>{f.label}</span>
                                  <span style={{ color: '#9ca3af', fontSize: '11px', marginLeft: '6px' }}>({CATEGORY_LABELS[f.category] || f.category})</span>
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const th = { padding: '10px 14px', textAlign: 'left', fontWeight: '600', fontSize: '11px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }
const td = { padding: '12px 14px', verticalAlign: 'middle' }

export default DotRoster
