import React, { useState, useMemo } from 'react'
import { mockFleetTrends } from '../data/mockFleetData'

const TABS = [
  { label: '30 Days', days: 30 },
  { label: '60 Days', days: 60 },
  { label: '90 Days', days: 90 },
]

const LineChart = ({ data, lines, height = 120, yMin, yMax }) => {
  const width = 320
  const padL = 36, padR = 8, padT = 8, padB = 20
  const chartW = width - padL - padR
  const chartH = height - padT - padB

  const minVal = yMin ?? Math.min(...lines.flatMap(l => data.map(d => d[l.key])))
  const maxVal = yMax ?? Math.max(...lines.flatMap(l => data.map(d => d[l.key])))
  const range  = maxVal - minVal || 1

  const xPos = (i) => padL + (i / (data.length - 1)) * chartW
  const yPos = (v) => padT + chartH - ((v - minVal) / range) * chartH

  const makePolyline = (key) =>
    data.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(' ')

  const ticks = [minVal, minVal + range / 2, maxVal].map(Math.round)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: `${height}px` }}>
      {ticks.map((t, i) => {
        const y = yPos(t)
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{t}</text>
          </g>
        )
      })}
      {lines.map(line => (
        <polyline
          key={line.key}
          points={makePolyline(line.key)}
          fill="none"
          stroke={line.color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {[0, Math.floor((data.length - 1) / 2), data.length - 1].map(i => (
        <text key={i} x={xPos(i)} y={height - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">
          {data[i]?.date.slice(5)}
        </text>
      ))}
    </svg>
  )
}

const WellnessTrends = () => {
  const [activeTab, setActiveTab] = useState(0)
  const windowDays = TABS[activeTab].days
  const data = useMemo(() => mockFleetTrends.slice(-windowDays), [windowDays])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Wellness Trends</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Fleet-wide health metric averages over time</p>
        </div>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: activeTab === i ? '#2563eb' : 'white',
              color: activeTab === i ? 'white' : '#374151',
              fontWeight: activeTab === i ? '600' : '400',
              fontSize: '14px', cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Avg BP */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Avg Blood Pressure</h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '2px', background: '#ef4444', display: 'inline-block' }} />
              Systolic
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '2px', background: '#f97316', display: 'inline-block' }} />
              Diastolic
            </span>
          </div>
        </div>
        <LineChart
          data={data}
          lines={[
            { key: 'avgSystolic',  color: '#ef4444' },
            { key: 'avgDiastolic', color: '#f97316' },
          ]}
          height={130}
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>DOT limit: 140/90 mmHg</p>
      </div>

      {/* Avg Glucose */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Avg Blood Glucose (mg/dL)</h3>
        <LineChart
          data={data}
          lines={[{ key: 'avgGlucose', color: '#a855f7' }]}
          height={130}
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Normal: &lt;100 · Pre-diabetic: 100–125 · Diabetic: ≥126</p>
      </div>

      {/* Avg BMI */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Avg BMI</h3>
        <LineChart
          data={data}
          lines={[{ key: 'avgBmi', color: '#2563eb' }]}
          height={130}
        />
      </div>

      {/* DOT Ready % */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>DOT-Ready % of Fleet</h3>
        <LineChart
          data={data}
          lines={[{ key: 'dotReadyPct', color: '#22c55e' }]}
          height={130}
          yMin={0}
          yMax={100}
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Percentage of drivers with green DOT status</p>
      </div>
    </div>
  )
}

export default WellnessTrends
