import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Activity,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { mockDrivers, getFleetStats, getDaysUntilDot } from '../data/mockFleetData'

const StatCard = ({ icon: Icon, label, value, sub, color = '#2563eb' }) => (
  <div className="card" style={{ marginBottom: 0 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '28px', fontWeight: '700', color, lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{sub}</p>}
      </div>
      <div style={{
        width: '42px', height: '42px', borderRadius: '10px',
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
    </div>
  </div>
)

const StatusDonut = ({ green, yellow, red, total }) => {
  const gPct = Math.round((green / total) * 100)
  const yPct = Math.round((yellow / total) * 100)
  const rPct = 100 - gPct - yPct

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      {/* Simple bar visualization */}
      <div style={{ flex: 1 }}>
        <div style={{
          height: '12px', borderRadius: '999px', overflow: 'hidden',
          display: 'flex', background: '#f3f4f6'
        }}>
          <div style={{ width: `${gPct}%`, background: '#22c55e' }} />
          <div style={{ width: `${yPct}%`, background: '#eab308' }} />
          <div style={{ width: `${rPct}%`, background: '#ef4444' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          {green} ready
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
          {yellow} at risk
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          {red} high risk
        </span>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const stats = getFleetStats(mockDrivers)

  const urgentDrivers = mockDrivers
    .filter(d => {
      const days = getDaysUntilDot(d.dotPhysicalDate)
      return days >= 0 && days <= 30
    })
    .sort((a, b) => getDaysUntilDot(a.dotPhysicalDate) - getDaysUntilDot(b.dotPhysicalDate))
    .slice(0, 5)

  const overdueDrivers = mockDrivers.filter(d => getDaysUntilDot(d.dotPhysicalDate) < 0)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Fleet Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={Users}       label="Total Drivers"    value={stats.total}              sub="enrolled in DriveWell"         color="#2563eb" />
        <StatCard icon={Activity}    label="Active This Week" value={stats.activeThisWeek}     sub={`of ${stats.total} drivers`}   color="#22c55e" />
        <StatCard icon={TrendingUp}  label="Avg Workouts/Mo"  value={stats.avgWorkouts}        sub="sessions per driver"           color="#8b5cf6" />
        <StatCard icon={Calendar}    label="DOT Due ≤30 Days" value={stats.upcomingDot}        sub="need attention"                color="#eab308" />
        {overdueDrivers.length > 0 && (
          <StatCard icon={AlertTriangle} label="DOT Overdue"  value={overdueDrivers.length}   sub="immediate action required"     color="#ef4444" />
        )}
      </div>

      {/* Fleet DOT Health */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Fleet DOT Health</h2>
        <StatusDonut {...stats} />
        <div style={{ marginTop: '16px', display: 'flex', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Avg Blood Pressure</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#374151' }}>
              {stats.avgBP.systolic}/{stats.avgBP.diastolic}
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '400', marginLeft: '4px' }}>mmHg</span>
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>DOT-Ready Rate</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
              {Math.round((stats.green / stats.total) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Urgent DOT Renewals */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Urgent DOT Renewals</h2>
          <Link to="/roster" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {urgentDrivers.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
            <CheckCircle2 size={20} color="#22c55e" />
            <p style={{ fontSize: '14px', color: '#15803d' }}>No DOT renewals due in the next 30 days.</p>
          </div>
        ) : (
          <div>
            {urgentDrivers.map(driver => {
              const days = getDaysUntilDot(driver.dotPhysicalDate)
              return (
                <div key={driver.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid #f3f4f6',
                }}>
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '14px' }}>{driver.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{driver.cdlNumber}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge badge-${driver.status}`}>{driver.status.toUpperCase()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: days <= 7 ? '#dc2626' : '#a16207' }}>
                      <Clock size={13} />
                      {days === 0 ? 'Today' : `${days}d`}
                    </div>
                    <Link to={`/driver/${driver.id}`} style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>
                      View →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
