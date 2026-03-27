import React, { useState } from 'react'
import { FileText, Download, Calendar, TrendingUp, Users, Activity } from 'lucide-react'
import { mockDrivers, getFleetStats } from '../data/mockFleetData'

const QuarterSelector = ({ value, onChange }) => {
  const options = ['Q1 2026', 'Q4 2025', 'Q3 2025', 'Q2 2025']
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px',
        fontSize: '14px', background: 'white', color: '#374151',
      }}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

const Reports = () => {
  const [quarter, setQuarter] = useState('Q1 2026')
  const [exporting, setExporting] = useState(false)
  const stats = getFleetStats(mockDrivers)

  const handleExport = async () => {
    setExporting(true)
    await new Promise(r => setTimeout(r, 1200))
    setExporting(false)
    alert('PDF export is a placeholder in this demo. In production this would generate a real PDF report.')
  }

  const dotReadyRate = Math.round((stats.green / stats.total) * 100)
  const engagementRate = Math.round((stats.activeThisWeek / stats.total) * 100)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Reports</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Quarterly wellness summary for your fleet</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <QuarterSelector value={quarter} onChange={setQuarter} />
          <button
            className="btn-primary"
            onClick={handleExport}
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={15} />
            {exporting ? 'Generating…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Report preview */}
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
        {/* Report header */}
        <div style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                Fleet Wellness Report
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                {quarter} Summary
              </h2>
              <p style={{ opacity: 0.8, fontSize: '14px' }}>FleetCo Logistics — {stats.total} Enrolled Drivers</p>
            </div>
            <FileText size={48} style={{ opacity: 0.3 }} />
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Key metrics */}
          <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '16px' }}>Key Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { icon: Users,       label: 'Total Drivers',      value: stats.total,       unit: 'enrolled',      color: '#2563eb' },
              { icon: Activity,    label: 'DOT-Ready Rate',      value: `${dotReadyRate}%`, unit: 'green status', color: '#22c55e' },
              { icon: TrendingUp,  label: 'Avg Workouts/Mo',     value: stats.avgWorkouts, unit: 'sessions',      color: '#8b5cf6' },
              { icon: Calendar,    label: 'Engagement Rate',     value: `${engagementRate}%`, unit: 'active this week', color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
                <item.icon size={20} color={item.color} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '24px', fontWeight: '700', color: item.color }}>{item.value}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.label}</p>
                <p style={{ fontSize: '11px', color: '#9ca3af' }}>{item.unit}</p>
              </div>
            ))}
          </div>

          {/* DOT Health breakdown */}
          <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '16px' }}>DOT Health Breakdown</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'DOT Ready',  count: stats.green,  pct: Math.round(stats.green  / stats.total * 100), color: '#22c55e', bg: '#dcfce7' },
              { label: 'At Risk',    count: stats.yellow, pct: Math.round(stats.yellow / stats.total * 100), color: '#eab308', bg: '#fef9c3' },
              { label: 'High Risk',  count: stats.red,    pct: Math.round(stats.red    / stats.total * 100), color: '#ef4444', bg: '#fee2e2' },
            ].map(item => (
              <div key={item.label} style={{ flex: 1, minWidth: '140px', padding: '16px', background: item.bg, borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '32px', fontWeight: '700', color: item.color }}>{item.count}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: item.color }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{item.pct}% of fleet</p>
              </div>
            ))}
          </div>

          {/* Avg vitals */}
          <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '16px' }}>Average Fleet Vitals</h3>
          <table style={{ marginBottom: '32px' }}>
            <thead>
              <tr><th>Metric</th><th>Fleet Average</th><th>DOT Standard</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Blood Pressure</td>
                <td>{stats.avgBP.systolic}/{stats.avgBP.diastolic} mmHg</td>
                <td>&lt;140/90 mmHg</td>
                <td>
                  <span className={`badge ${stats.avgBP.systolic < 140 && stats.avgBP.diastolic < 90 ? 'badge-green' : 'badge-red'}`}>
                    {stats.avgBP.systolic < 140 && stats.avgBP.diastolic < 90 ? 'Within Limit' : 'Above Limit'}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Workout Engagement</td>
                <td>{stats.avgWorkouts} sessions/mo</td>
                <td>≥8 recommended</td>
                <td>
                  <span className={`badge ${stats.avgWorkouts >= 8 ? 'badge-green' : 'badge-yellow'}`}>
                    {stats.avgWorkouts >= 8 ? 'On Track' : 'Below Target'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px', fontSize: '12px', color: '#9ca3af', borderTop: '2px solid #e5e7eb' }}>
            <p>
              <strong style={{ color: '#6b7280' }}>Note:</strong> All driver health data is anonymized and aggregated in accordance with HIPAA guidelines.
              Individual driver metrics are only accessible by authorized fleet managers.
              Report generated by DriveWell Fleet Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
