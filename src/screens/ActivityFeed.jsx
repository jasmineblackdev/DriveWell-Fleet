import React, { useState } from 'react'
import { Dumbbell, ClipboardCheck, FileCheck, AlertTriangle, Star } from 'lucide-react'
import { mockActivityEvents } from '../data/mockFleetData'

const TYPE_CONFIG = {
  workout:   { icon: Dumbbell,       color: '#2563eb', bg: '#dbeafe', label: 'Workout' },
  checkin:   { icon: ClipboardCheck, color: '#22c55e', bg: '#dcfce7', label: 'Check-in' },
  dot:       { icon: FileCheck,      color: '#eab308', bg: '#fef9c3', label: 'DOT' },
  alert:     { icon: AlertTriangle,  color: '#ef4444', bg: '#fee2e2', label: 'Alert' },
  milestone: { icon: Star,           color: '#a855f7', bg: '#f3e8ff', label: 'Milestone' },
}

const FILTERS = ['all', 'workout', 'checkin', 'dot', 'alert', 'milestone']

const relativeTime = (isoStr) => {
  const diff = (Date.now() - new Date(isoStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const ActivityFeed = () => {
  const [filter, setFilter] = useState('all')

  const events = filter === 'all'
    ? mockActivityEvents
    : mockActivityEvents.filter(e => e.type === filter)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Activity Feed</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Anonymized fleet-wide activity</p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid #e5e7eb',
              background: filter === f ? '#2563eb' : 'white',
              color: filter === f ? 'white' : '#374151',
              fontWeight: filter === f ? '600' : '400',
              fontSize: '13px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All' : TYPE_CONFIG[f]?.label ?? f}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {events.length === 0 ? (
          <p style={{ padding: '24px', color: '#9ca3af', textAlign: 'center' }}>No events for this filter</p>
        ) : (
          events.map((event, i) => {
            const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.alert
            const Icon = cfg.icon
            return (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 20px',
                  borderBottom: i < events.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: cfg.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', color: '#374151', marginBottom: '2px' }}>{event.text}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{relativeTime(event.time)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ActivityFeed
