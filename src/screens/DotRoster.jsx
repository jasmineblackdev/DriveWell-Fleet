import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronUp, ChevronDown, Filter } from 'lucide-react'
import { mockDrivers, getDaysUntilDot } from '../data/mockFleetData'

const SORT_KEYS = {
  name:     (d) => d.name,
  dotDays:  (d) => getDaysUntilDot(d.dotPhysicalDate),
  status:   (d) => ({ green: 0, yellow: 1, red: 2 }[d.status]),
  workouts: (d) => -d.workoutsThisMonth,
}

const DotRoster = () => {
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey,    setSortKey]    = useState('dotDays')
  const [sortAsc,    setSortAsc]    = useState(true)

  const filtered = useMemo(() => {
    let list = [...mockDrivers]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.cdlNumber.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      list = list.filter(d => d.status === statusFilter)
    }

    const fn = SORT_KEYS[sortKey] ?? SORT_KEYS.name
    list.sort((a, b) => {
      const av = fn(a)
      const bv = fn(b)
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })

    return list
  }, [search, statusFilter, sortKey, sortAsc])

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronUp size={12} style={{ opacity: 0.3 }} />
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  const dotDaysLabel = (days) => {
    if (days < 0)  return { text: `${Math.abs(days)}d overdue`, color: '#dc2626' }
    if (days === 0) return { text: 'Today',                     color: '#dc2626' }
    if (days <= 14) return { text: `${days} days`,              color: '#dc2626' }
    if (days <= 30) return { text: `${days} days`,              color: '#a16207' }
    return               { text: `${days} days`,              color: '#374151' }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>DOT Roster</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>{filtered.length} of {mockDrivers.length} drivers</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by name or CDL…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px',
              background: 'white',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'green', 'yellow', 'red'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '8px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                background: statusFilter === s ? '#2563eb' : 'white',
                color:      statusFilter === s ? 'white'   : '#374151',
                fontWeight: statusFilter === s ? '600'     : '400',
              }}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>
                  <button onClick={() => handleSort('name')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Driver <SortIcon k="name" />
                  </button>
                </th>
                <th>
                  <button onClick={() => handleSort('status')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status <SortIcon k="status" />
                  </button>
                </th>
                <th>
                  <button onClick={() => handleSort('dotDays')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    DOT Renewal <SortIcon k="dotDays" />
                  </button>
                </th>
                <th>BP</th>
                <th>BMI</th>
                <th>
                  <button onClick={() => handleSort('workouts')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Workouts/Mo <SortIcon k="workouts" />
                  </button>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(driver => {
                const days = getDaysUntilDot(driver.dotPhysicalDate)
                const { text: daysText, color: daysColor } = dotDaysLabel(days)
                return (
                  <tr key={driver.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: '500' }}>{driver.name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>{driver.cdlNumber}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${driver.status}`}>
                        {driver.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: daysColor }}>{daysText}</span>
                      <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {new Date(driver.dotPhysicalDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td style={{ fontWeight: '500' }}>
                      {driver.metrics.systolic}/{driver.metrics.diastolic}
                    </td>
                    <td style={{ fontWeight: '500' }}>
                      {driver.metrics.bmi}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: `${Math.min(driver.workoutsThisMonth * 4, 60)}px`,
                          height: '6px',
                          borderRadius: '3px',
                          background: driver.workoutsThisMonth >= 12 ? '#22c55e' : driver.workoutsThisMonth >= 6 ? '#eab308' : '#ef4444',
                        }} />
                        <span style={{ fontSize: '13px' }}>{driver.workoutsThisMonth}</span>
                      </div>
                    </td>
                    <td>
                      <Link to={`/driver/${driver.id}`} className="btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DotRoster
