import React, { useState } from 'react'
import { CheckCircle2, RefreshCw, XCircle, Lock, ExternalLink } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'eld',
    label: 'ELD / Fleet Management',
    integrations: [
      {
        id: 'samsara',
        name: 'Samsara',
        logo: '🚛',
        description: 'Import driver roster, HOS logs, and vehicle data directly from Samsara. Automatically sync new hires and terminated drivers.',
        available: true,
      },
      {
        id: 'motive',
        name: 'Motive (KeepTruckin)',
        logo: '📡',
        description: 'Sync driver profiles, ELD compliance data, and Hours of Service from Motive. Bi-directional driver status updates.',
        available: true,
      },
      {
        id: 'omnitracs',
        name: 'Omnitracs',
        logo: '🛰️',
        description: 'Pull driver performance and compliance data from Omnitracs fleet management.',
        available: false,
      },
      {
        id: 'trimble',
        name: 'Trimble Transportation',
        logo: '🗺️',
        description: 'Connect Trimble TMS to sync driver records and route compliance data.',
        available: false,
      },
    ],
  },
  {
    id: 'compliance',
    label: 'DOT Compliance & Regulatory',
    integrations: [
      {
        id: 'jjkeller',
        name: 'J.J. Keller Encompass',
        logo: '📋',
        description: 'Sync DOT physical exam records, MVR monitoring, and drug & alcohol testing status from J.J. Keller.',
        available: false,
      },
      {
        id: 'fmcsa',
        name: 'FMCSA Portal',
        logo: '🏛️',
        description: 'Pull your fleet\'s SMS (Safety Measurement System) scores and CSA violation data directly from FMCSA.',
        available: false,
      },
      {
        id: 'clearinghouse',
        name: 'FMCSA Drug & Alcohol Clearinghouse',
        logo: '🔍',
        description: 'Monitor driver drug and alcohol violation status via the federal Clearinghouse registry.',
        available: false,
      },
    ],
  },
  {
    id: 'insurance',
    label: 'Insurance & Risk',
    integrations: [
      {
        id: 'travelers',
        name: 'Travelers Commercial',
        logo: '🏢',
        description: 'Share anonymized fleet wellness reports with your Travelers underwriter for premium discount eligibility.',
        available: false,
      },
      {
        id: 'progressive',
        name: 'Progressive Commercial',
        logo: '📊',
        description: 'Export DOT readiness data to qualify for Progressive\'s commercial fleet wellness discount program.',
        available: false,
      },
    ],
  },
  {
    id: 'health',
    label: 'Health & Wearables',
    integrations: [
      {
        id: 'applehealth',
        name: 'Apple Health (via Driver App)',
        logo: '🍎',
        description: 'Drivers can connect Apple Health on iOS to auto-sync heart rate, steps, and sleep data into their DOT score.',
        available: true,
        driverSide: true,
      },
      {
        id: 'garmin',
        name: 'Garmin Connect',
        logo: '⌚',
        description: 'Drivers can link Garmin wearables to sync activity, heart rate, and sleep tracking automatically.',
        available: false,
        driverSide: true,
      },
    ],
  },
]

const IntegrationCard = ({ integration, status, onConnect, onDisconnect }) => {
  const isConnected  = status === 'connected'
  const isConnecting = status === 'connecting'

  return (
    <div className="card" style={{ marginBottom: '12px', opacity: integration.available ? 1 : 0.65 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ fontSize: '32px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>{integration.logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{integration.name}</h3>
              {integration.driverSide && (
                <span style={{ padding: '2px 8px', background: '#eff6ff', color: '#2563eb', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>
                  Driver app
                </span>
              )}
            </div>
            {isConnected && (
              <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#dcfce7', color: '#15803d', flexShrink: 0 }}>
                Connected
              </span>
            )}
            {!integration.available && (
              <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#f3f4f6', color: '#6b7280', flexShrink: 0 }}>
                Coming Soon
              </span>
            )}
          </div>

          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.5' }}>{integration.description}</p>

          {isConnected && (
            <div style={{ padding: '10px 12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', color: '#15803d', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} />
              Connected · last synced today
            </div>
          )}

          {integration.available && (
            isConnected ? (
              <button
                onClick={() => onDisconnect(integration.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}
              >
                <XCircle size={14} /> Disconnect
              </button>
            ) : isConnecting ? (
              <button disabled style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#6b7280', cursor: 'not-allowed' }}>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Connecting…
              </button>
            ) : (
              <button
                onClick={() => onConnect(integration.id)}
                style={{ padding: '8px 18px', background: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer' }}
              >
                Connect
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const Integrations = () => {
  const [states, setStates] = useState({})

  const connect = (id) => {
    setStates(prev => ({ ...prev, [id]: 'connecting' }))
    setTimeout(() => setStates(prev => ({ ...prev, [id]: 'connected' })), 1500)
  }

  const disconnect = (id) => setStates(prev => ({ ...prev, [id]: 'idle' }))

  const connectedCount = Object.values(states).filter(s => s === 'connected').length

  return (
    <div className="main-content">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Integrations</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Connect DriveWell to your existing fleet tools and compliance systems.</p>
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ padding: '10px 16px', background: connectedCount > 0 ? '#f0fdf4' : '#f9fafb', border: `1px solid ${connectedCount > 0 ? '#86efac' : '#e5e7eb'}`, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color={connectedCount > 0 ? '#16a34a' : '#9ca3af'} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: connectedCount > 0 ? '#15803d' : '#6b7280' }}>
            {connectedCount} integration{connectedCount !== 1 ? 's' : ''} active
          </span>
        </div>
        <div style={{ padding: '10px 16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} color="#0284c7" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1' }}>All data transfers encrypted (TLS 1.3)</span>
        </div>
      </div>

      {CATEGORIES.map(cat => (
        <div key={cat.id} style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            {cat.label}
          </p>
          {cat.integrations.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              status={states[integration.id] || 'idle'}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          ))}
        </div>
      ))}

      {/* Request integration */}
      <div style={{ padding: '20px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>Don't see your platform?</p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px' }}>We prioritize integrations based on customer demand. Let us know what you need.</p>
        <a
          href="mailto:integrations@drivewell.app"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
        >
          Request an Integration <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}

export default Integrations
