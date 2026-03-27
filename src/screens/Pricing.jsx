import React, { useState } from 'react'
import { CheckCircle2, Users, TrendingUp, Shield, Zap, PhoneCall } from 'lucide-react'

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small fleets',
    priceMonthly: 15,
    priceAnnual: 12,
    driverRange: 'Up to 10 drivers',
    color: '#6b7280',
    highlight: false,
    features: [
      'Fleet dashboard & DOT roster',
      'DOT renewal countdown & alerts',
      'Driver health metrics view',
      'Basic engagement stats',
      'Pro app access for all drivers',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Most popular for mid-size fleets',
    priceMonthly: 12,
    priceAnnual: 10,
    driverRange: '11–50 drivers',
    color: '#2563eb',
    highlight: true,
    features: [
      'Everything in Starter',
      'Wellness trends & 90-day charts',
      'Activity feed (real-time driver events)',
      'Individual driver detail views',
      'CSV & PDF report exports',
      'Insurance compliance report',
      'Priority email + chat support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For large fleets that need integrations',
    priceMonthly: 10,
    priceAnnual: 8,
    driverRange: '51–200 drivers',
    color: '#7c3aed',
    highlight: false,
    features: [
      'Everything in Growth',
      'ELD integrations (Samsara, Motive)',
      'API access for custom reporting',
      'Custom DOT alert thresholds',
      'Multi-location fleet support',
      'Dedicated account manager',
      'Phone + SLA-backed support',
    ],
  },
]

const FeatureRow = ({ text }) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
    <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
    <span style={{ fontSize: '13px', color: '#374151' }}>{text}</span>
  </div>
)

const Pricing = () => {
  const [billing, setBilling]   = useState('annual')
  const [drivers, setDrivers]   = useState(25)
  const [calcTier, setCalcTier] = useState('growth')

  const calcTierData = TIERS.find(t => t.id === calcTier)
  const pricePerDriver = billing === 'annual' ? calcTierData.priceAnnual : calcTierData.priceMonthly
  const monthly = drivers * pricePerDriver
  const annual  = monthly * 12

  // ROI calculator
  const avgFailureCost  = 2500
  const failureRateBase = 0.15
  const failureReduction = 0.4
  const preventedFailures = Math.round(drivers * failureRateBase * failureReduction)
  const roiSavings = preventedFailures * avgFailureCost
  const netRoi     = roiSavings - annual

  return (
    <div>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Fleet Pricing</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
          Simple per-driver pricing. Every plan includes Pro app access for all your drivers.
        </p>
      </div>

      {/* Billing toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '4px', gap: '4px' }}>
          {['monthly', 'annual'].map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                background: billing === b ? 'white' : 'transparent',
                color: billing === b ? '#111827' : '#6b7280',
                fontWeight: billing === b ? '600' : '400',
                fontSize: '14px',
                boxShadow: billing === b ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {b === 'annual' ? 'Annual (save ~20%)' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {TIERS.map(tier => {
          const price = billing === 'annual' ? tier.priceAnnual : tier.priceMonthly
          return (
            <div key={tier.id} className="card" style={{
              border: tier.highlight ? `2px solid ${tier.color}` : '1.5px solid #e5e7eb',
              position: 'relative', overflow: 'visible',
            }}>
              {tier.highlight && (
                <div style={{
                  position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                  background: tier.color, color: 'white', padding: '4px 16px',
                  borderRadius: '999px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginTop: tier.highlight ? '8px' : 0, marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: tier.color, marginBottom: '2px' }}>{tier.name}</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{tier.tagline}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>${price}</span>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>/driver/mo</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{tier.driverRange}</p>
              </div>
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', marginBottom: '16px' }}>
                {tier.features.map(f => <FeatureRow key={f} text={f} />)}
              </div>
              <button
                className={tier.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', fontSize: '14px' }}
              >
                Get Started
              </button>
            </div>
          )
        })}
      </div>

      {/* Enterprise */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <Shield size={28} color="#93c5fd" style={{ flexShrink: 0 }} />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Enterprise</h2>
              <p style={{ fontSize: '14px', opacity: 0.75, marginBottom: '8px' }}>200+ drivers · Custom contract · White-label available</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {['Custom pricing', 'SSO / SAML', 'White-label branding', 'Custom integrations', 'Dedicated CSM', 'SLA guarantee'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', opacity: 0.85 }}>
                    <CheckCircle2 size={13} color="#86efac" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button style={{
            padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none',
            borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
          }}>
            <PhoneCall size={16} /> Contact Sales
          </button>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <TrendingUp size={22} color="#2563eb" />
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>ROI Calculator</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          See how much DriveWell saves your fleet by reducing DOT failures and insurance claims.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Number of Drivers</label>
            <input
              type="number"
              value={drivers}
              min={1}
              onChange={e => setDrivers(Math.max(1, Number(e.target.value)))}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Plan</label>
            <select
              value={calcTier}
              onChange={e => setCalcTier(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            >
              {TIERS.map(t => <option key={t.id} value={t.id}>{t.name} — ${billing === 'annual' ? t.priceAnnual : t.priceMonthly}/driver/mo</option>)}
            </select>
          </div>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#dc2626' }}>${monthly.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Monthly cost</p>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#374151' }}>${annual.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Annual cost</p>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e' }}>{preventedFailures}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>DOT failures prevented*</p>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e' }}>${roiSavings.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Estimated savings</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px', background: netRoi > 0 ? '#f0fdf4' : '#fef9c3', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Estimated Net ROI (Year 1)</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: netRoi > 0 ? '#15803d' : '#a16207' }}>
            {netRoi > 0 ? '+' : ''}${netRoi.toLocaleString()}
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
            *Based on avg. 15% annual DOT failure rate and 40% reduction with DriveWell. Avg cost per failure = $2,500.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
