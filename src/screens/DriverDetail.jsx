import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Activity, Calendar, Dumbbell, CheckCircle2, AlertCircle } from 'lucide-react'
import { mockDrivers, getDaysUntilDot } from '../data/mockFleetData'

const MetricTile = ({ label, value, unit, color = '#2563eb' }) => (
  <div style={{
    background: '#f9fafb',
    borderRadius: '10px',
    padding: '14px 16px',
    textAlign: 'center',
  }}>
    <p style={{ fontSize: '22px', fontWeight: '700', color }}>{value}</p>
    <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{label}</p>
    {unit && <p style={{ fontSize: '11px', color: '#9ca3af' }}>{unit}</p>}
  </div>
)

const DriverDetail = () => {
  const { id } = useParams()
  const driver = mockDrivers.find(d => d.id === Number(id))

  if (!driver) {
    return (
      <div>
        <Link to="/roster" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Roster
        </Link>
        <p>Driver not found.</p>
      </div>
    )
  }

  const days = getDaysUntilDot(driver.dotPhysicalDate)
  const bpHigh = driver.metrics.systolic >= 140 || driver.metrics.diastolic >= 90
  const bmiHigh = driver.metrics.bmi >= 35
  const glucHigh = driver.metrics.bloodGlucose >= 126

  const bpColor = bpHigh ? '#dc2626' : driver.metrics.systolic >= 130 ? '#a16207' : '#15803d'
  const bmiColor = bmiHigh ? '#dc2626' : driver.metrics.bmi >= 30 ? '#a16207' : '#15803d'
  const glucColor = glucHigh ? '#dc2626' : driver.metrics.bloodGlucose >= 100 ? '#a16207' : '#15803d'

  return (
    <div>
      <Link to="/roster" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Roster
      </Link>

      {/* Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{driver.name}</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{driver.cdlNumber}</p>
        </div>
        <span className={`badge badge-${driver.status}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
          {driver.status.toUpperCase()}
        </span>
      </div>

      {/* DOT Renewal */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Calendar size={20} color="#2563eb" />
          <h2 style={{ fontSize: '17px', fontWeight: '600' }}>DOT Physical</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Next renewal</p>
            <p style={{ fontSize: '18px', fontWeight: '700' }}>
              {new Date(driver.dotPhysicalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Days remaining</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: days < 0 ? '#dc2626' : days <= 14 ? '#dc2626' : days <= 30 ? '#a16207' : '#374151' }}>
              {days < 0 ? `${Math.abs(days)}d overdue` : `${days} days`}
            </p>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Activity size={20} color="#2563eb" />
          <h2 style={{ fontSize: '17px', fontWeight: '600' }}>Health Metrics</h2>
          <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>Anonymized</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          <MetricTile label="Weight"        value={driver.metrics.weight}    unit="lbs"   color="#2563eb" />
          <MetricTile label="Blood Pressure" value={`${driver.metrics.systolic}/${driver.metrics.diastolic}`} unit="mmHg" color={bpColor} />
          <MetricTile label="BMI"            value={driver.metrics.bmi}                                      color={bmiColor} />
          <MetricTile label="Blood Glucose"  value={driver.metrics.bloodGlucose} unit="mg/dL" color={glucColor} />
        </div>

        {/* Risk flags */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { flag: bpHigh,   label: 'Blood pressure exceeds DOT limit (140/90)',    type: 'red'   },
            { flag: bmiHigh,  label: 'BMI in obese class II+ range (≥35)',           type: 'red'   },
            { flag: glucHigh, label: 'Blood glucose at diabetic threshold (≥126)',   type: 'red'   },
            { flag: !bpHigh && !bmiHigh && !glucHigh, label: 'All key metrics within DOT standards', type: 'green' },
          ].filter(r => r.flag).map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: r.type === 'green' ? '#15803d' : '#dc2626' }}>
              {r.type === 'green' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {r.label}
            </div>
          ))}
        </div>
      </div>

      {/* Engagement */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Dumbbell size={20} color="#2563eb" />
          <h2 style={{ fontSize: '17px', fontWeight: '600' }}>Workout Engagement</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '32px', fontWeight: '700', color: driver.workoutsThisMonth >= 12 ? '#15803d' : driver.workoutsThisMonth >= 6 ? '#a16207' : '#dc2626' }}>
              {driver.workoutsThisMonth}
            </p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Workouts this month</p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Last active</p>
            <p style={{ fontSize: '14px', fontWeight: '500' }}>
              {new Date(driver.lastActive).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* DOT History */}
      <div className="card">
        <h2 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '16px' }}>DOT History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {driver.dotHistory.map((h, i) => (
              <tr key={i}>
                <td>{new Date(h.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${h.result === 'passed' ? 'badge-green' : h.result === 'conditional' ? 'badge-yellow' : 'badge-red'}`}>
                    {h.result.charAt(0).toUpperCase() + h.result.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DriverDetail
