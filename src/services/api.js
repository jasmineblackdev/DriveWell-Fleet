/**
 * DriveWell Fleet API Service
 *
 * All methods attempt a real API call when VITE_API_URL is set.
 * When the env var is absent (or the request fails), they fall back
 * to the static mock data so the dashboard keeps working during
 * development.
 *
 * Intended API contract (subject to change):
 *
 *   GET  /api/fleet/drivers            – list all enrolled drivers
 *   GET  /api/fleet/drivers/:id        – single driver detail + history
 *   GET  /api/fleet/stats              – aggregated fleet statistics
 *   GET  /api/fleet/activity           – recent activity feed events
 *   GET  /api/fleet/trends             – fleet-wide wellness trends
 */

import {
  mockDrivers,
  mockActivityEvents,
  mockFleetTrends,
  getFleetStats,
  getDaysUntilDot,
} from '../data/mockFleetData'

const BASE_URL = import.meta.env.VITE_API_URL // e.g. http://localhost:4000

// ── helpers ──────────────────────────────────────────────────────────────────

const isConfigured = () => Boolean(BASE_URL)

const request = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Fleet API GET ${path} → ${res.status}`)
  return res.json()
}

// ── Drivers ───────────────────────────────────────────────────────────────────

/**
 * Fetch the full list of enrolled drivers.
 * @returns {Promise<Array>}
 */
export const getDrivers = async () => {
  if (isConfigured()) {
    try {
      return await request('/api/fleet/drivers')
    } catch (err) {
      console.warn('Fleet API unavailable, using mock drivers:', err.message)
    }
  }
  return mockDrivers
}

/**
 * Fetch a single driver's detail including check-in history and workout logs.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export const getDriver = async (id) => {
  if (isConfigured()) {
    try {
      return await request(`/api/fleet/drivers/${id}`)
    } catch (err) {
      console.warn(`Fleet API unavailable, using mock driver ${id}:`, err.message)
    }
  }
  return mockDrivers.find((d) => String(d.id) === String(id)) ?? null
}

// ── Fleet Statistics ──────────────────────────────────────────────────────────

/**
 * Fetch aggregated fleet statistics (DOT readiness breakdown, averages, etc.).
 * Falls back to computing stats from mock driver data.
 * @returns {Promise<object>}
 */
export const getStats = async () => {
  if (isConfigured()) {
    try {
      return await request('/api/fleet/stats')
    } catch (err) {
      console.warn('Fleet API unavailable, computing stats from mock data:', err.message)
    }
  }
  return getFleetStats(mockDrivers)
}

// ── Activity Feed ─────────────────────────────────────────────────────────────

/**
 * Fetch the most recent activity feed events across all drivers.
 * @param {{ limit?: number }} options
 * @returns {Promise<Array>}
 */
export const getActivityFeed = async ({ limit = 50 } = {}) => {
  if (isConfigured()) {
    try {
      const events = await request(`/api/fleet/activity?limit=${limit}`)
      return events
    } catch (err) {
      console.warn('Fleet API unavailable, using mock activity feed:', err.message)
    }
  }
  return mockActivityEvents.slice(0, limit)
}

// ── Wellness Trends ───────────────────────────────────────────────────────────

/**
 * Fetch fleet-wide wellness trend data (BP, glucose, workouts over time).
 * @returns {Promise<Array>}
 */
export const getTrends = async () => {
  if (isConfigured()) {
    try {
      return await request('/api/fleet/trends')
    } catch (err) {
      console.warn('Fleet API unavailable, using mock trends:', err.message)
    }
  }
  return mockFleetTrends
}

// ── Convenience re-exports ────────────────────────────────────────────────────

export { getDaysUntilDot }
