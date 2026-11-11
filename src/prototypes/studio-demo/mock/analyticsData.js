import { agents } from '../agents.js'

export const TIMING = {
  qualityCount: 560,
}

const agentNames = agents.map((agent) => agent.name)

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

function skill(name, agentIndex, conversations, escalated, intended, runs, completion, trend, spark) {
  const completed = Math.round(runs * completion / 100)
  return {
    name,
    agent: agentNames[agentIndex % agentNames.length],
    conversations,
    escalated,
    intended,
    runs,
    incomplete: runs - completed,
    completed,
    completion,
    trend,
    spark,
  }
}

const skills = [
  skill('Order status', 0, 4200, 186, 42, 4860, 94, 3, [88, 90, 91, 93, 92, 94, 94]),
  skill('Track delivery', 1, 3100, 64, 28, 3410, 97, 1, [94, 95, 96, 95, 97, 96, 97]),
  skill('Sizing advice', 2, 2400, 148, 36, 2680, 88, -6, [94, 92, 90, 89, 88, 87, 88]),
  skill('Return item', 3, 1900, 214, 51, 2210, 81, -8, [89, 87, 86, 84, 83, 82, 81]),
  skill('Billing question', 0, 1640, 132, 19, 1880, 84, -3, [88, 87, 86, 85, 84, 85, 84]),
  skill('Reset password', 1, 980, 28, 11, 1040, 96, 0, [96, 95, 96, 97, 96, 96, 96]),
  skill('Cancel order', 2, 870, 126, 22, 990, 76, -12, [88, 86, 84, 82, 80, 78, 76]),
  skill('Exchange item', 3, 740, 71, 17, 860, 83, -4, [88, 87, 86, 85, 84, 84, 83]),
  skill('Promo code', 0, 610, 24, 9, 670, 90, 5, [84, 86, 87, 88, 89, 90, 90]),
  skill('Store hours', 1, 540, 6, 4, 560, 99, 0, [99, 98, 99, 99, 98, 99, 99]),
  skill('Damaged item', 2, 430, 98, 14, 510, 74, -11, [86, 84, 82, 80, 78, 76, 74]),
  skill('Update address', 3, 360, 18, 7, 410, 93, 2, [90, 91, 91, 92, 92, 93, 93]),
]

function weekSkills(rows) {
  return rows.map((skillRow, index) => {
    const scale = 0.16 + (index % 3) * 0.03
    const runs = Math.max(24, Math.round(skillRow.runs * scale))
    const completion = Math.min(99, Math.max(40, skillRow.completion + (index % 2 === 0 ? 1 : -2)))
    const completed = Math.round(runs * completion / 100)
    return {
      ...skillRow,
      conversations: Math.max(12, Math.round(skillRow.conversations * scale)),
      escalated: Math.max(0, Math.round(skillRow.escalated * scale)),
      intended: Math.max(0, Math.round(skillRow.intended * scale)),
      runs,
      incomplete: runs - completed,
      completed,
      completion,
      trend: skillRow.trend + (index % 2 === 0 ? 1 : -1),
      spark: skillRow.spark.map((point, pointIndex) => (
        Math.min(99, Math.max(30, point + (pointIndex % 2 === 0 ? 2 : -1)))
      )),
    }
  })
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
