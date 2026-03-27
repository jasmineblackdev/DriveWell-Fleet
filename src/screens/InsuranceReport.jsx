import React, { useState } from 'react'
import { FileText, Download, Shield, TrendingUp, AlertTriangle, CheckCircle2, Printer } from 'lucide-react'
import { mockDrivers, getFleetStats, getDaysUntilDot } from '../data/mockFleetData'

const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`

const MetricBox = ({ label, value, sub, color = '#374151' }) => (
  <div style={{
    padding: '16px', background: '#f9fafb', borderRadius: '10px',
    textAlign: 'center', border: '1px solid #f3f4f6',
  }}>
    <p style={{ fontSize: '26px', fontWeight: '700', color, marginBottom: '4px' }}>{value}</p>
    <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '2px' }}>{label}</p>
    {sub && <p style={{ fontSize: '11px', color: '#9ca3af' }}>{sub}</p>}
  </div>
)

const RiskRow = ({ driver }) => {
  const days = getDaysUntilDot(driver.dotPhysicalDate)
  const urgent = days >= 0 && days <= 30
  const overdue = days < 0
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '10px 12px', fontSize: '14px', fontWeight: '500' }}>{driver.name}</td>
      <td style={{ padding: '10px 12px', fontSize: '13px', color: '#6b7280' }}>{driver.cdlNumber}</td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{
          padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
          background: driver.status === 'green' ? '#dcfce7' : driver.status === 'yellow' ? '#fef9c3' : '#fee2e2',
          color: driver.status === 'green' ? '#15803d' : driver.status === 'yellow' ? '#a16207' : '#dc2626',
        }}>
          {driver.status.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: '10px 12px', fontSize: '13px', color: overdue ? '#dc2626' : urgent ? '#a16207' : '#374151', fontWeight: urgent || overdue ? '600' : '400' }}>
        {overdue ? 'OVERDUE' : days === 0 ? 'Today' : `${days} days`}
      </td>
      <td style={{ padding: '10px 12px', fontSize: '13px', color: '#374151' }}>
        {driver.metrics.systolic}/{driver.metrics.diastolic}
      </td>
      <td style={{ padding: '10px 12px', fontSize: '13px', color: '#374151' }}>
        {driver.metrics.bloodGlucose}
      </td>
      <td style={{ padding: '10px 12px', fontSize: '13px', color: '#374151' }}>
        {driver.workoutsThisMonth}
      </td>
    </tr>
  )
}

const InsuranceReport = () => {
  const [generated, setGenerated] = useState(false)
  const stats = getFleetStats(mockDrivers)
  const dotReadyPct = Math.round((stats.green / stats.total) * 100)
  const atRiskDrivers = mockDrivers.filter(d => d.status !== 'green')
  const overdueDrivers = mockDrivers.filter(d => getDaysUntilDot(d.dotPhysicalDate) < 0)
  const urgentDrivers  = mockDrivers.filter(d => { const x = getDaysUntilDot(d.dotPhysicalDate); return x >= 0 && x <= 30 })
  const avgWorkouts    = (mockDrivers.reduce((s, d) => s + d.workoutsThisMonth, 0) / mockDrivers.length).toFixed(1)
  const activeDrivers  = mockDrivers.filter(d => { const diff = (new Date() - new Date(d.lastActive)) / 86400000; return diff <= 7 }).length

  const handlePrint = () => window.print()

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Insurance Compliance Report</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Generate a fleet wellness report for your insurance carrier</p>
        </div>
        {generated && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#374151' }}
            >
              <Printer size={16} /> Print
            </button>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            >
              <Download size={16} /> Export PDF
            </button>
          </div>
        )}
      </div>

      {!generated ? (
        /* ── Report config ───────────────────────────────────────── */
        <div>
          <div className="card">
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <Shield size={24} color="#2563eb" style={{ flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>What This Report Includes</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  A comprehensive fleet wellness summary that insurance carriers use to assess driver health risk and determine premium adjustments.
                </p>
              </div>
            </div>
            {[
              'Fleet DOT readiness breakdown (green / at-risk / high-risk)',
              'Individual driver health metrics (BP, BMI, glucose)',
              'DOT physical compliance status & upcoming renewals',
              'Driver engagement rate (app usage, workouts completed)',
              'Wellness trend data (90-day aggregate)',
              'At-risk driver summary with recommended actions',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.5' }}>
                Sharing this report with your insurance carrier may qualify your fleet for a wellness discount of <strong>5–15%</strong> on commercial auto premiums. Ask your broker about DriveWell wellness credits.
              </p>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', fontSize: '16px', padding: '16px', marginTop: '8px' }}
            onClick={() => setGenerated(true)}
          >
            Generate Report for {quarter}
          </button>
        </div>
      ) : (
        /* ── Generated report ────────────────────────────────────── */
        <div id="insurance-report">
          {/* Report header */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fleet Wellness Compliance Report</p>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>FleetCo Logistics</h2>
                <p style={{ fontSize: '14px', opacity: 0.85 }}>Report Period: {quarter}</p>
                <p style={{ fontSize: '13px', opacity: 0.7 }}>Generated: {today}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Powered by</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>DriveWell Fleet</p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>drivewell.app</p>
              </div>
            </div>
          </div>

          {/* Executive summary */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#2563eb" /> Executive Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <MetricBox label="DOT-Ready Rate"    value={`${dotReadyPct}%`}   sub={`${stats.green} of ${stats.total} drivers`}      color="#15803d" />
              <MetricBox label="App Engagement"    value={`${Math.round((activeDrivers / stats.total) * 100)}%`} sub="Active last 7 days" color="#2563eb" />
              <MetricBox label="Avg Workouts/Mo"   value={avgWorkouts}          sub="sessions per driver"                              color="#7c3aed" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <MetricBox label="Avg Blood Pressure" value={`${stats.avgBP.systolic}/${stats.avgBP.diastolic}`} sub="mmHg fleet average"  color={stats.avgBP.systolic < 140 ? '#15803d' : '#d97706'} />
              <MetricBox label="At-Risk Drivers"    value={atRiskDrivers.length}                                sub="need wellness support" color={atRiskDrivers.length > 3 ? '#dc2626' : '#d97706'} />
              <MetricBox label="DOT Overdue"        value={overdueDrivers.length}                              sub="immediate action"      color={overdueDrivers.length > 0 ? '#dc2626' : '#15803d'} />
            </div>
          </div>

          {/* DOT readiness breakdown */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>DOT Readiness Breakdown</h3>
            <div style={{ display: 'flex', gap: '0', height: '20px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ width: `${(stats.green / stats.total) * 100}%`, background: '#22c55e' }} />
              <div style={{ width: `${(stats.yellow / stats.total) * 100}%`, background: '#eab308' }} />
              <div style={{ width: `${(stats.red / stats.total) * 100}%`, background: '#ef4444' }} />
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
              <span>🟢 DOT Ready: <strong>{stats.green}</strong> ({Math.round((stats.green / stats.total) * 100)}%)</span>
              <span>🟡 At Risk: <strong>{stats.yellow}</strong> ({Math.round((stats.yellow / stats.total) * 100)}%)</span>
              <span>🔴 High Risk: <strong>{stats.red}</strong> ({Math.round((stats.red / stats.total) * 100)}%)</span>
            </div>
          </div>

          {/* Urgent renewals */}
          {(urgentDrivers.length > 0 || overdueDrivers.length > 0) && (
            <div className="card" style={{ marginBottom: '20px', border: '1.5px solid #fca5a5' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> Urgent Action Required
              </h3>
              {overdueDrivers.length > 0 && (
                <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#dc2626', marginBottom: '4px' }}>DOT Physical OVERDUE ({overdueDrivers.length} driver{overdueDrivers.length > 1 ? 's' : ''})</p>
                  {overdueDrivers.map(d => <p key={d.id} style={{ fontSize: '13px', color: '#7f1d1d' }}>• {d.name} — {d.cdlNumber}</p>)}
                </div>
              )}
              {urgentDrivers.length > 0 && (
                <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#a16207', marginBottom: '4px' }}>Due within 30 days ({urgentDrivers.length} driver{urgentDrivers.length > 1 ? 's' : ''})</p>
                  {urgentDrivers.map(d => <p key={d.id} style={{ fontSize: '13px', color: '#78350f' }}>• {d.name} — {getDaysUntilDot(d.dotPhysicalDate)} days</p>)}
                </div>
              )}
            </div>
          )}

          {/* Full driver table */}
          <div className="card" style={{ marginBottom: '20px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Full Driver Health Matrix</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  {['Driver', 'CDL #', 'Status', 'DOT Due', 'BP', 'Glucose', 'Workouts/Mo'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockDrivers.map(d => <RiskRow key={d.id} driver={d} />)}
              </tbody>
            </table>
          </div>

          {/* Certifications */}
          <div className="card" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Shield size={18} color="#15803d" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: '600', fontSize: '14px', color: '#15803d', marginBottom: '4px' }}>Report Certification</p>
                <p style={{ fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                  This report was generated by DriveWell Fleet on {today}. Data is sourced from driver-reported health metrics, daily check-ins, and app engagement data collected through the DriveWell platform. This report is intended for use with commercial auto insurance carriers as evidence of an active fleet wellness program.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InsuranceReport
