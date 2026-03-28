/**
 * DOT Risk Engine
 * Calculates driver-level and fleet-level risk scores.
 * Output mirrors how fleet safety platforms score driver behavior —
 * except this applies to health readiness instead of driving behavior.
 */

/**
 * Score a single driver. Returns:
 * { riskScore: 0–100, riskLevel: 'low'|'elevated'|'high', riskFactors: [...], dotReadiness: 0–100 }
 */
export const scoreDriver = (driver) => {
  const { metrics, workoutsThisMonth, lastActive, dotPhysicalDate, dotHistory } = driver
  let risk = 0
  const factors = []

  // ── Blood Pressure ──────────────────────────────────────────────────────────
  if (metrics.diastolic >= 100) {
    risk += 25
    factors.push({ label: 'Diastolic BP ≥ 100', severity: 'critical', category: 'cardiovascular' })
  } else if (metrics.systolic >= 160) {
    risk += 25
    factors.push({ label: 'Stage 2 hypertension', severity: 'high', category: 'cardiovascular' })
  } else if (metrics.systolic >= 140) {
    risk += 15
    factors.push({ label: 'Stage 1 hypertension', severity: 'medium', category: 'cardiovascular' })
  }

  // ── Blood Glucose ───────────────────────────────────────────────────────────
  if (metrics.bloodGlucose >= 126) {
    risk += 20
    factors.push({ label: 'Diabetic glucose range', severity: 'high', category: 'metabolic' })
  } else if (metrics.bloodGlucose >= 100) {
    risk += 10
    factors.push({ label: 'Pre-diabetic glucose', severity: 'medium', category: 'metabolic' })
  }

  // ── BMI ─────────────────────────────────────────────────────────────────────
  if (metrics.bmi >= 40) {
    risk += 20
    factors.push({ label: 'BMI ≥ 40 — sleep apnea risk', severity: 'high', category: 'weight' })
  } else if (metrics.bmi >= 35) {
    risk += 12
    factors.push({ label: 'BMI ≥ 35 — obese class II', severity: 'medium', category: 'weight' })
  } else if (metrics.bmi >= 30) {
    risk += 6
    factors.push({ label: 'BMI ≥ 30 — obese class I', severity: 'low', category: 'weight' })
  }

  // ── Engagement & Activity ───────────────────────────────────────────────────
  const daysSinceActive = Math.ceil((new Date() - new Date(lastActive)) / 86400000)
  if (daysSinceActive >= 14) {
    risk += 15
    factors.push({ label: `Inactive ${daysSinceActive} days`, severity: 'high', category: 'engagement' })
  } else if (daysSinceActive >= 7) {
    risk += 8
    factors.push({ label: `Inactive ${daysSinceActive} days`, severity: 'medium', category: 'engagement' })
  }

  if (workoutsThisMonth < 4) {
    risk += 8
    factors.push({ label: 'Low exercise — fewer than 4 sessions/month', severity: 'medium', category: 'fitness' })
  }

  // ── DOT History ─────────────────────────────────────────────────────────────
  const conditionals = (dotHistory || []).filter(h => h.result === 'conditional').length
  if (conditionals >= 2) {
    risk += 10
    factors.push({ label: 'Multiple conditional DOT results', severity: 'high', category: 'history' })
  } else if (conditionals === 1) {
    risk += 5
    factors.push({ label: 'Prior conditional DOT result', severity: 'low', category: 'history' })
  }

  // ── Upcoming DOT Deadline ───────────────────────────────────────────────────
  const daysUntilDot = Math.ceil((new Date(dotPhysicalDate) - new Date()) / 86400000)
  if (daysUntilDot < 0) {
    risk += 15
    factors.push({ label: 'DOT physical OVERDUE', severity: 'critical', category: 'compliance' })
  } else if (daysUntilDot <= 14) {
    risk += 8
    factors.push({ label: `DOT physical in ${daysUntilDot} days`, severity: 'high', category: 'compliance' })
  }

  const riskScore = Math.min(risk, 100)
  const riskLevel = riskScore >= 50 ? 'high' : riskScore >= 25 ? 'elevated' : 'low'

  // DOT readiness (inverse of risk, bounded 0–100)
  const dotReadiness = Math.max(0, Math.min(100, 100 - riskScore))

  return { riskScore, riskLevel, riskFactors: factors, dotReadiness }
}

/**
 * Score all drivers. Returns fleet-level intelligence summary.
 */
export const scoreFleet = (drivers) => {
  const scored = drivers.map(d => ({ ...d, ...scoreDriver(d) }))

  const total     = scored.length
  const highRisk  = scored.filter(d => d.riskLevel === 'high').length
  const elevated  = scored.filter(d => d.riskLevel === 'elevated').length
  const low       = scored.filter(d => d.riskLevel === 'low').length

  const avgRisk       = Math.round(scored.reduce((s, d) => s + d.riskScore, 0) / total)
  const fleetReadiness = Math.round(scored.reduce((s, d) => s + d.dotReadiness, 0) / total)

  // Most common risk categories across the fleet
  const categoryCounts = {}
  scored.forEach(d => {
    d.riskFactors.forEach(f => {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1
    })
  })
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => ({ category: cat, affectedDrivers: count }))

  // Estimated financial exposure
  // $15,000/failure based on ATRI (American Transportation Research Institute) research:
  // recruiting ($5–8K) + training ($3–5K) + downtime/lost revenue ($4–7K) per disqualified driver
  const FAILURE_COST = 15000
  const highRiskFailureRate = 0.55  // estimated probability of DOT fail for high-risk drivers
  const elevatedFailureRate = 0.25
  const projectedFailures = Math.round(highRisk * highRiskFailureRate + elevated * elevatedFailureRate)
  const estimatedExposure  = projectedFailures * FAILURE_COST
  const estimatedSavings   = Math.round(estimatedExposure * 0.4) // 40% reduction with DriveWell engagement

  return {
    scored,
    summary: {
      total, highRisk, elevated, low,
      avgRisk, fleetReadiness,
      projectedFailures, estimatedExposure, estimatedSavings,
      topCategories,
    }
  }
}

/** Category display labels */
export const CATEGORY_LABELS = {
  cardiovascular: 'Blood Pressure',
  metabolic:      'Blood Glucose',
  weight:         'BMI / Weight',
  engagement:     'Engagement',
  fitness:        'Physical Activity',
  history:        'DOT History',
  compliance:     'DOT Compliance',
}

/** Risk level display config */
export const RISK_CONFIG = {
  low:      { label: 'Low Risk',      color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
  elevated: { label: 'Elevated Risk', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  high:     { label: 'High Risk',     color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
}
