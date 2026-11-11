export const TIMING = {
  qualityCount: 560,
}

const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function buildDays() {
  const points = []
  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(2026, 10, 4)
    date.setDate(date.getDate() - offset)
    const weekend = date.getDay() === 0 || date.getDay() === 6
    const step = 29 - offset
    const wave = Math.round(Math.sin(step / 3.2) * 55)
    const total = (weekend ? 390 : 640) + wave + (step % 4) * 12
    const contained = Math.round(total * (0.68 + Math.sin(step / 5) * 0.05))
    points.push({
      label: monthDay.format(date),
      total,
      contained,
      transferred: total - contained,
    })
  }
  return points
}

const days = buildDays()

const skills = [
  { name: 'Order status', volume: 4200, containment: 86, success: 94 },
  { name: 'Track delivery', volume: 3100, containment: 91, success: 97 },
  { name: 'Sizing advice', volume: 2400, containment: 78, success: 88 },
  { name: 'Return item', volume: 1900, containment: 64, success: 81 },
  { name: 'Billing question', volume: 1640, containment: 71, success: 84 },
  { name: 'Reset password', volume: 980, containment: 88, success: 96 },
  { name: 'Cancel order', volume: 870, containment: 58, success: 76 },
  { name: 'Exchange item', volume: 740, containment: 69, success: 83 },
  { name: 'Promo code', volume: 610, containment: 82, success: 90 },
  { name: 'Store hours', volume: 540, containment: 95, success: 99 },
  { name: 'Damaged item', volume: 430, containment: 52, success: 74 },
  { name: 'Update address', volume: 360, containment: 84, success: 93 },
]

function weekSkills(rows) {
  return rows.map((skill, index) => ({
    ...skill,
    volume: Math.max(12, Math.round(skill.volume * (0.05 + (index % 3) * 0.012))),
    containment: Math.min(99, skill.containment + (index % 2 === 0 ? 2 : -1)),
    success: Math.min(99, skill.success + (index % 2 === 0 ? 1 : 0)),
  }))
}

function pack(points, skillRows, source) {
  return {
    days: points,
    quality: source.quality,
    purposes: source.purposes,
    reasons: source.reasons,
    destinations: source.destinations,
    skills: skillRows,
  }
}

const past30Quality = {
  quality: [
    { id: 'csat', label: 'AI CSAT', value: '4.2', unit: '/ 5', note: 'Satisfied · voice 4.3, digital 4.1' },
    { id: 'aht', label: 'Average handle time', value: '4m 23s', note: 'Voice 5m 12s · Digital 3m 34s' },
    { id: 'fcr', label: 'First contact resolution', value: '71%', note: 'Resolved without a repeat contact in 72 hours.' },
  ],
  purposes: [
    { label: 'Order status', value: 32 },
    { label: 'Returns', value: 21 },
    { label: 'Billing', value: 18 },
    { label: 'Sizing', value: 15 },
    { label: 'Other', value: 14 },
  ],
  reasons: [
    { label: 'Knowledge gap', value: 34 },
    { label: 'Customer request', value: 28 },
    { label: 'Policy exception', value: 22 },
    { label: 'Tool error', value: 16 },
  ],
  destinations: [
    { label: 'Billing', value: 40 },
    { label: 'Sales', value: 27 },
    { label: 'Support', value: 21 },
    { label: 'Supervisor', value: 12 },
  ],
}

const past7Quality = {
  quality: [
    { id: 'csat', label: 'AI CSAT', value: '4.4', unit: '/ 5', note: 'Satisfied · voice 4.5, digital 4.2' },
    { id: 'aht', label: 'Average handle time', value: '3m 58s', note: 'Voice 4m 40s · Digital 3m 12s' },
    { id: 'fcr', label: 'First contact resolution', value: '74%', note: 'Resolved without a repeat contact in 72 hours.' },
  ],
  purposes: [
    { label: 'Order status', value: 36 },
    { label: 'Returns', value: 19 },
    { label: 'Billing', value: 17 },
    { label: 'Sizing', value: 16 },
    { label: 'Other', value: 12 },
  ],
  reasons: [
    { label: 'Customer request', value: 36 },
    { label: 'Knowledge gap', value: 27 },
    { label: 'Policy exception', value: 24 },
    { label: 'Tool error', value: 13 },
  ],
  destinations: [
    { label: 'Support', value: 38 },
    { label: 'Billing', value: 29 },
    { label: 'Sales', value: 22 },
    { label: 'Supervisor', value: 11 },
  ],
}

export const analyticsRanges = [
  { id: 'past30', label: 'Past 30 days', data: pack(days, skills, past30Quality) },
  { id: 'past7', label: 'Past 7 days', data: pack(days.slice(-7), weekSkills(skills), past7Quality) },
]

export function periodTotal(points, key) {
  return points.reduce((sum, point) => sum + point[key], 0)
}
