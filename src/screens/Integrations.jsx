import React, { useState } from 'react'
import { Plug, CheckCircle2, RefreshCw, XCircle } from 'lucide-react'

const INTEGRATIONS = [
  {
    id: 'samsara',
    name: 'Samsara',
    logo: '🚛',
    description: 'Import driver roster, HOS logs, and vehicle data directly from Samsara fleet management.',
    category: 'ELD / TMS',
  },
  {
    id: 'keeptruckin',
    name: 'KeepTruckin (Motive)',
    logo: '📡',
    description: 'Sync driver profiles and ELD compliance data from KeepTruckin (now Motive).',
    category: 'ELD / TMS',
  },
]

const Integrations = () => {
  const [states, setStates] = useState({})

  const connect = (id) => {
    setStates(prev => ({ ...prev, [id]: 'connecting' }))
    setTimeout(() => {
      setStates(prev => ({ ...prev, [id]: 'connected' }))
    }, 1500)
  }

  const disconnect = (id) => {
    setStates(prev => ({ ...prev, [id]: 'idle' }))
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Integrations</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Connect your existing fleet management platforms</p>
      </div>

      {/* ELD / TMS */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          ELD / TMS Platforms
        </p>
        {INTEGRATIONS.map(integration => {
          const status = states[integration.id] || 'idle'
          return (
            <div key={integration.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ fontSize: '36px', flexShrink: 0 }}>{integration.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '600' }}>{integration.name}</h3>
                    {status === 'connected' && (
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                        background: '#dcfce7', color: '#15803d',
                      }}>
                        Connected
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{integration.description}</p>

                  {status === 'connected' && (
                    <div style={{
                      padding: '10px 12px', background: '#f0fdf4', borderRadius: '8px',
                      fontSize: '13px', color: '#15803d', marginBottom: '12px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <CheckCircle2 size={14} />
                      Successfully imported 3 drivers from {integration.name} fleet
                    </div>
                  )}

                  {status === 'idle' && (
                    <button className="btn-primary" style={{ fontSize: '14px', padding: '9px 20px' }} onClick={() => connect(integration.id)}>
                      Connect
                    </button>
                  )}
                  {status === 'connecting' && (
                    <button className="btn-secondary" disabled style={{ fontSize: '14px', padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      Connecting…
                    </button>
                  )}
                  {status === 'connected' && (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '14px', padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => disconnect(integration.id)}
                    >
                      <XCircle size={14} />
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming soon */}
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Coming Soon
        </p>
        {['McLeod Software', 'Trimble Transportation', 'Omnitracs'].map(name => (
          <div key={name} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Plug size={20} style={{ color: '#9ca3af' }} />
              <span style={{ fontWeight: '500', fontSize: '15px', color: '#6b7280' }}>{name}</span>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: '999px', background: '#f3f4f6', fontSize: '12px', color: '#6b7280' }}>
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Integrations
