import React from 'react'
import { mockDrivers, getDaysUntilDot } from '../data/mockFleetData'
import { AlertTriangle, Clock, Calendar, CheckCircle2, Download } from 'lucide-react'

const GROUPS = [
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    color: '#dc2626',
    bg: '#fee2e2',
    border: '#fca5a5',
    filter: (d) => getDaysUntilDot(d.dotPhysicalDate) < 0,
    sort: (a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate), // most overdue first
  },
  {
    key: 'soon30',
    label: 'Due Within 30 Days',
    icon: Clock,
    color: '#a16207',
    bg: '#fef9c3',
    border: '#fde047',
    filter: (d) => { const days = getDaysUntilDot(d.dotPhysicalDate); return days >= 0 && days <= 30 },
    sort: (a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate),
  },
  {
    key: 'soon90',
    label: 'Due in 31–90 Days',
    icon: Calendar,
    color: '#c2410c',
    bg: '#ffedd5',
    border: '#fed7aa',
    filter: (d) => { const days = getDaysUntilDot(d.dotPhysicalDate); return days > 30 && days <= 90 },
    sort: (a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate),
  },
  {
    key: 'ok',
    label: 'DOT Current (91+ Days)',
    icon: CheckCircle2,
    color: '#15803d',
    bg: '#dcfce7',
    border: '#86efac',
    filter: (d) => getDaysUntilDot(d.dotPhysicalDate) > 90,
    sort: (a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate),
  },
]

const DriverRow = ({ driver }) => {
  const days = getDaysUntilDot(driver.dotPhysicalDate)
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '10px 12px', fontSize: '14px', fontWeight: '500' }}>{driver.name}</td>
      <td style={{ padding: '10px 12px', fontSize: '13px', color: '#6b7280', fontFamily: 'monospace' }}>{driver.cdlNumber}</td>
      <td style={{ padding: '10px 12px', fontSize: '13px' }}>
        {new Date(driver.dotPhysicalDate).toLocaleDateString()}
      </td>
      <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '600' }}>
        {days < 0 ? (
          <span style={{ color: '#dc2626' }}>{Math.abs(days)}d overdue</span>
        ) : (
          <span style={{ color: days <= 30 ? '#a16207' : days <= 90 ? '#c2410c' : '#15803d' }}>
            {days}d remaining
          </span>
        )}
      </td>
    </tr>
  )
}

const exportCsv = () => {
  const rows = [
    ['Name', 'CDL Number', 'DOT Physical Date', 'Days Remaining', 'Status'],
    ...mockDrivers.map(d => {
      const days = getDaysUntilDot(d.dotPhysicalDate)
      const status = days < 0 ? 'OVERDUE' : days <= 30 ? 'Due Soon' : days <= 90 ? 'Due in 90 Days' : 'Current'
      return [d.name, d.cdlNumber, new Date(d.dotPhysicalDate).toLocaleDateString(), days, status]
    })
  ]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `dot-renewals-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const DotRenewalTracker = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>DOT Renewal Tracker</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Track upcoming DOT physical expirations</p>
        </div>
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
          onClick={exportCsv}
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {GROUPS.map(group => {
        const Icon = group.icon
        const drivers = mockDrivers.filter(group.filter).sort(group.sort)
        if (drivers.length === 0) return null
        return (
          <div key={group.key} style={{ marginBottom: '24px' }}>
            {/* Group header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              background: group.bg,
              border: `1px solid ${group.border}`,
              borderRadius: '10px 10px 0 0',
            }}>
              <Icon size={18} color={group.color} />
              <span style={{ fontWeight: '700', fontSize: '15px', color: group.color }}>
                {group.label}
              </span>
              <span style={{
                marginLeft: 'auto',
                padding: '2px 10px', borderRadius: '999px',
                background: 'rgba(0,0,0,0.1)',
                fontSize: '12px', fontWeight: '700', color: group.color,
              }}>
                {drivers.length} driver{drivers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '0 0 10px 10px', border: `1px solid ${group.border}`, borderTop: 'none' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Driver</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>CDL</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>DOT Date</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(driver => <DriverRow key={driver.id} driver={driver} />)}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DotRenewalTracker
