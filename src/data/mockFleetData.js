// Mock fleet data — 15 drivers

const today = new Date()

const daysFromNow = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const daysAgo = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const mockDrivers = [
  {
    id: 1,
    name: "Jake Miller",
    cdlNumber: "CDL-TX-123456",
    dotPhysicalDate: daysFromNow(192),
    lastActive: daysAgo(0),
    workoutsThisMonth: 12,
    status: "green",
    metrics: { weight: 245, systolic: 128, diastolic: 82, bloodGlucose: 98, bmi: 35.2 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 2,
    name: "Maria Santos",
    cdlNumber: "CDL-FL-789012",
    dotPhysicalDate: daysFromNow(28),
    lastActive: daysAgo(1),
    workoutsThisMonth: 8,
    status: "yellow",
    metrics: { weight: 178, systolic: 136, diastolic: 87, bloodGlucose: 108, bmi: 27.1 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(360), result: "passed" },
    ]
  },
  {
    id: 3,
    name: "Darnell Thompson",
    cdlNumber: "CDL-GA-334455",
    dotPhysicalDate: daysFromNow(7),
    lastActive: daysAgo(2),
    workoutsThisMonth: 5,
    status: "red",
    metrics: { weight: 298, systolic: 148, diastolic: 95, bloodGlucose: 130, bmi: 38.4 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(400), result: "conditional" },
    ]
  },
  {
    id: 4,
    name: "Lisa Chen",
    cdlNumber: "CDL-CA-556677",
    dotPhysicalDate: daysFromNow(312),
    lastActive: daysAgo(0),
    workoutsThisMonth: 18,
    status: "green",
    metrics: { weight: 155, systolic: 118, diastolic: 76, bloodGlucose: 92, bmi: 23.1 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 5,
    name: "Robert Hayes",
    cdlNumber: "CDL-TN-998877",
    dotPhysicalDate: daysFromNow(55),
    lastActive: daysAgo(5),
    workoutsThisMonth: 3,
    status: "yellow",
    metrics: { weight: 262, systolic: 139, diastolic: 89, bloodGlucose: 115, bmi: 33.8 },
    dotHistory: [
      { date: daysAgo(730), result: "conditional" },
      { date: daysAgo(360), result: "passed" },
    ]
  },
  {
    id: 6,
    name: "Keisha Brown",
    cdlNumber: "CDL-OH-112233",
    dotPhysicalDate: daysFromNow(240),
    lastActive: daysAgo(1),
    workoutsThisMonth: 14,
    status: "green",
    metrics: { weight: 168, systolic: 122, diastolic: 80, bloodGlucose: 95, bmi: 25.6 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 7,
    name: "Miguel Reyes",
    cdlNumber: "CDL-AZ-445566",
    dotPhysicalDate: daysFromNow(14),
    lastActive: daysAgo(0),
    workoutsThisMonth: 7,
    status: "yellow",
    metrics: { weight: 241, systolic: 134, diastolic: 85, bloodGlucose: 111, bmi: 30.9 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(380), result: "passed" },
    ]
  },
  {
    id: 8,
    name: "Sharon Williams",
    cdlNumber: "CDL-NC-667788",
    dotPhysicalDate: daysFromNow(180),
    lastActive: daysAgo(3),
    workoutsThisMonth: 10,
    status: "green",
    metrics: { weight: 189, systolic: 126, diastolic: 81, bloodGlucose: 99, bmi: 28.7 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 9,
    name: "Terrence Davis",
    cdlNumber: "CDL-MS-889900",
    dotPhysicalDate: daysAgo(15),
    lastActive: daysAgo(15),
    workoutsThisMonth: 1,
    status: "red",
    metrics: { weight: 305, systolic: 155, diastolic: 98, bloodGlucose: 138, bmi: 40.2 },
    dotHistory: [
      { date: daysAgo(730), result: "conditional" },
      { date: daysAgo(380), result: "conditional" },
    ]
  },
  {
    id: 10,
    name: "Amanda Foster",
    cdlNumber: "CDL-CO-223344",
    dotPhysicalDate: daysFromNow(90),
    lastActive: daysAgo(2),
    workoutsThisMonth: 9,
    status: "green",
    metrics: { weight: 152, systolic: 119, diastolic: 78, bloodGlucose: 94, bmi: 22.4 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 11,
    name: "Carlos Mendoza",
    cdlNumber: "CDL-NM-556789",
    dotPhysicalDate: daysFromNow(30),
    lastActive: daysAgo(7),
    workoutsThisMonth: 4,
    status: "yellow",
    metrics: { weight: 257, systolic: 141, diastolic: 91, bloodGlucose: 120, bmi: 34.5 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "conditional" },
    ]
  },
  {
    id: 12,
    name: "Rachel Kim",
    cdlNumber: "CDL-WA-778899",
    dotPhysicalDate: daysFromNow(275),
    lastActive: daysAgo(0),
    workoutsThisMonth: 20,
    status: "green",
    metrics: { weight: 145, systolic: 114, diastolic: 72, bloodGlucose: 88, bmi: 21.8 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 13,
    name: "Frank Jackson",
    cdlNumber: "CDL-LA-334422",
    dotPhysicalDate: daysFromNow(60),
    lastActive: daysAgo(10),
    workoutsThisMonth: 2,
    status: "red",
    metrics: { weight: 290, systolic: 149, diastolic: 96, bloodGlucose: 127, bmi: 37.8 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(370), result: "conditional" },
    ]
  },
  {
    id: 14,
    name: "Denise Marshall",
    cdlNumber: "CDL-MO-990011",
    dotPhysicalDate: daysFromNow(120),
    lastActive: daysAgo(4),
    workoutsThisMonth: 11,
    status: "green",
    metrics: { weight: 172, systolic: 124, diastolic: 79, bloodGlucose: 97, bmi: 26.3 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(365), result: "passed" },
    ]
  },
  {
    id: 15,
    name: "Paul Nguyen",
    cdlNumber: "CDL-TX-445512",
    dotPhysicalDate: daysFromNow(45),
    lastActive: daysAgo(1),
    workoutsThisMonth: 6,
    status: "yellow",
    metrics: { weight: 234, systolic: 137, diastolic: 88, bloodGlucose: 113, bmi: 31.4 },
    dotHistory: [
      { date: daysAgo(730), result: "passed" },
      { date: daysAgo(370), result: "passed" },
    ]
  },
]

// ── 90-day fleet wellness trends ─────────────────────────────────
const generateFleetTrends = () => {
  const arr = []
  const now = new Date()
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const progress = (89 - i) / 89
    arr.push({
      date: d.toISOString().split('T')[0],
      avgSystolic:   Math.round(142 - progress * 6 + (Math.random() - 0.5) * 2),
      avgDiastolic:  Math.round(90  - progress * 4 + (Math.random() - 0.5) * 1.5),
      avgGlucose:    Math.round(115 - progress * 8 + (Math.random() - 0.5) * 3),
      avgBmi:        Math.round((31.2 - progress * 1.5 + (Math.random() - 0.5) * 0.5) * 10) / 10,
      dotReadyPct:   Math.round(45 + progress * 25 + (Math.random() - 0.5) * 5),
    })
  }
  return arr
}
export const mockFleetTrends = generateFleetTrends()

// ── Activity feed events ──────────────────────────────────────────
const EVENT_TYPES = ['workout', 'checkin', 'dot', 'alert', 'milestone']
const EVENT_TEXTS = {
  workout:   ['Driver completed a 20-min cardio workout', 'Driver logged strength training session', 'Driver finished in-cab stretch routine'],
  checkin:   ['Driver completed daily health check-in', 'Driver logged morning wellness check-in'],
  dot:       ['DOT physical scheduled — 30 days out', 'DOT renewal reminder sent to driver', 'Driver DOT physical passed'],
  alert:     ['Driver BP reading above threshold', 'Driver missed 3 consecutive check-ins', 'Driver glucose level flagged for review'],
  milestone: ['Driver hit 7-day workout streak', 'Driver reached 30-day DOT Ready milestone', 'Driver completed 50th workout'],
}
const generateActivityEvents = () => {
  const events = []
  const now = new Date()
  for (let i = 0; i < 30; i++) {
    const minsAgo = Math.floor(Math.random() * 60 * 24 * 7)
    const t = new Date(now - minsAgo * 60000)
    const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
    const texts = EVENT_TEXTS[type]
    events.push({
      id: i + 1,
      time: t.toISOString(),
      type,
      text: texts[Math.floor(Math.random() * texts.length)],
    })
  }
  return events.sort((a, b) => new Date(b.time) - new Date(a.time))
}
export const mockActivityEvents = generateActivityEvents()

// ── Per-driver 8-week workout counts ─────────────────────────────
export const mockWeeklyWorkouts = Object.fromEntries(
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(id => [
    id,
    Array.from({ length: 8 }, () => ({ count: Math.floor(Math.random() * 6) }))
  ])
)

export const getFleetStats = (drivers) => {
  const total = drivers.length
  const green  = drivers.filter(d => d.status === 'green').length
  const yellow = drivers.filter(d => d.status === 'yellow').length
  const red    = drivers.filter(d => d.status === 'red').length

  const avgBP = {
    systolic:  Math.round(drivers.reduce((s, d) => s + d.metrics.systolic,  0) / total),
    diastolic: Math.round(drivers.reduce((s, d) => s + d.metrics.diastolic, 0) / total),
  }

  const activeThisWeek = drivers.filter(d => {
    const last = new Date(d.lastActive)
    const diff = (new Date() - last) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  const avgWorkouts = Math.round(
    drivers.reduce((s, d) => s + d.workoutsThisMonth, 0) / total
  )

  const upcomingDot = drivers.filter(d => {
    const days = Math.ceil((new Date(d.dotPhysicalDate) - new Date()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 30
  }).length

  return { total, green, yellow, red, avgBP, activeThisWeek, avgWorkouts, upcomingDot }
}

export const getDaysUntilDot = (dateStr) =>
  Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
