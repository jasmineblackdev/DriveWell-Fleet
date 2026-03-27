import React, { useState } from 'react'
import { mockDrivers, mockWeeklyWorkouts } from '../data/mockFleetData'

const BarChart = ({ weeklyData, height = 100 }) => {
  const max = Math.max(...weeklyData.map(w => w.count), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: `${height}px`, padding: '0 8px' }}>
      {weeklyData.map((w, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>{w.count}</span>
          <div style={{
            width: '100%',
            height: `${Math.max((w.count / max) * (height - 24), 4)}px`,
            background: '#2563eb',
            borderRadius: '3px 3px 0 0',
            minHeight: '4px',
          }} />
          <span style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>W{i + 1}</span>
        </div>
      ))}
    </div>
  )
}

const StatCard = ({ label, value, sub, color = '#2563eb' }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <p style={{ fontSize: '32px', fontWeight: '700', color, marginBottom: '4px' }}>{value}</p>
    <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
    {sub && <p style={{ fontSize: '12px', color: '#9ca3af' }}>{sub}</p>}
  </div>
)

const EngagementAnalytics = () => {
  const [selectedDriver, setSelectedDriver] = useState(mockDrivers[0].id)
  const [selectedWeek, setSelectedWeek] = useState(7) // 0-indexed week selector

  const activeThisWeek = mockDrivers.filter(d => {
    const diff = (new Date() - new Date(d.lastActive)) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  const dauPct = Math.round((activeThisWeek / mockDrivers.length) * 100)

  const avgWorkouts = Math.round(
    mockDrivers.reduce((s, d) => s + d.workoutsThisMonth, 0) / mockDrivers.length
  )
  const adoptionPct = Math.round((mockDrivers.filter(d => d.workoutsThisMonth > 0).length / mockDrivers.length) * 100)
  const completionRate = Math.round(
    (mockDrivers.reduce((s, d) => s + Math.min(d.workoutsThisMonth, 4), 0) / (mockDrivers.length * 4)) * 100
  )

  const driverWeekData = mockWeeklyWorkouts[selectedDriver] || []
  const weekTotal = driverWeekData.reduce((s, w) => s + w.count, 0)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Engagement Analytics</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Driver app usage and workout engagement</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <StatCard label="Daily Active Users" value={`${dauPct}%`} sub={`${activeThisWeek} of ${mockDrivers.length} drivers`} color="#2563eb" />
        <StatCard label="Feature Adoption" value={`${adoptionPct}%`} sub="Used app this month" color="#22c55e" />
        <StatCard label="Workout Completion" value={`${completionRate}%`} sub="vs. weekly target" color="#f97316" />
      </div>

      {/* Per-driver bar chart */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>8-Week Workout History</h3>
          <select
            value={selectedDriver}
            onChange={e => setSelectedDriver(Number(e.target.value))}
            style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px' }}
          >
            {mockDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
          {mockDrivers.find(d => d.id === selectedDriver)?.name} — {weekTotal} total workouts over 8 weeks
        </p>

        <BarChart weeklyData={driverWeekData} height={110} />
      </div>

      {/* Average workouts */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Fleet Workout Leaderboard</h3>
        {[...mockDrivers]
          .sort((a, b) => b.workoutsThisMonth - a.workoutsThisMonth)
          .slice(0, 8)
          .map((driver, i) => (
            <div key={driver.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '8px 0',
              borderBottom: i < 7 ? '1px solid #f3f4f6' : 'none',
            }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: i < 3 ? '#fef9c3' : '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', color: i < 3 ? '#a16207' : '#6b7280',
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: '14px' }}>{driver.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '80px', height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${(driver.workoutsThisMonth / 20) * 100}%`, background: '#2563eb', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb', width: '32px', textAlign: 'right' }}>
                  {driver.workoutsThisMonth}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default EngagementAnalytics
