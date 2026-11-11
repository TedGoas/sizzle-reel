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

const SLICE_COLORS = [
  '--dt-color-chart-categorical-01',
  '--dt-color-chart-categorical-02',
  '--dt-color-chart-categorical-03',
  '--dt-color-chart-categorical-04',
  '--dt-color-chart-categorical-05',
]

export function topSlices(rows, limit = 5) {
  const sorted = [...rows].sort((a, b) => b.value - a.value)
  const top = sorted.slice(0, limit)
  const rest = sorted.slice(limit).reduce((sum, row) => sum + row.value, 0)
  const slices = top.map((row, index) => ({
    label: row.label,
    value: row.value,
    colorToken: SLICE_COLORS[index],
  }))
  if (rest > 0) {
    slices.push({ label: 'Other', value: rest, colorToken: '--dt-color-chart-neutral' })
  }
  return slices
}

function buildRouting(points) {
  const total = periodTotal(points, 'total')
  const contained = periodTotal(points, 'contained')
  const transferred = periodTotal(points, 'transferred')
  const split = (count) => {
    const resolved = Math.round(count * 0.74)
    const unknown = Math.round(count * 0.08)
    return { resolved, unknown, unresolved: count - resolved - unknown }
  }
  const containedSplit = split(contained)
  const transferredSplit = split(transferred)
  return {
    nodes: [
      { id: 'all', label: 'Conversations', column: 0, value: total, tone: 'routing' },
      { id: 'contained', label: 'AI contained', column: 1, value: contained, tone: 'routing' },
      { id: 'transferred', label: 'Transferred', column: 1, value: transferred, tone: 'routing' },
      { id: 'resolved', label: 'Resolved', column: 2, value: containedSplit.resolved + transferredSplit.resolved, tone: 'resolved' },
      { id: 'unresolved', label: 'Not resolved', column: 2, value: containedSplit.unresolved + transferredSplit.unresolved, tone: 'unresolved' },
      { id: 'unknown', label: 'Unknown', column: 2, value: containedSplit.unknown + transferredSplit.unknown, tone: 'unknown' },
    ],
    links: [
      { from: 'all', to: 'contained', value: contained, tone: 'routing' },
      { from: 'all', to: 'transferred', value: transferred, tone: 'routing' },
      { from: 'contained', to: 'resolved', value: containedSplit.resolved, tone: 'resolved' },
      { from: 'contained', to: 'unresolved', value: containedSplit.unresolved, tone: 'unresolved' },
      { from: 'contained', to: 'unknown', value: containedSplit.unknown, tone: 'unknown' },
      { from: 'transferred', to: 'resolved', value: transferredSplit.resolved, tone: 'resolved' },
      { from: 'transferred', to: 'unresolved', value: transferredSplit.unresolved, tone: 'unresolved' },
      { from: 'transferred', to: 'unknown', value: transferredSplit.unknown, tone: 'unknown' },
    ],
  }
}

function pack(points, skillRows, source) {
  return {
    days: points,
    quality: source.quality,
    purposes: source.purposes,
    reasons: source.reasons,
    destinations: source.destinations,
    routing: buildRouting(points),
    skills: skillRows,
  }
}

const past30Quality = {
  quality: [
    {
      id: 'csat',
      label: 'AI CSAT',
      value: '4.2',
      trend: 0.2,
      rows: [
        { label: 'Contained', value: '4.3', token: '--dt-color-chart-categorical-01' },
        { label: 'Transferred', value: '4.0', token: '--dt-color-chart-categorical-03' },
      ],
    },
    {
      id: 'aht',
      label: 'Average handle time',
      columns: [
        { id: 'voice', label: 'Voice', value: '5m 12s', trend: -3 },
        { id: 'digital', label: 'Digital', value: '3m 34s', trend: 2 },
      ],
    },
    {
      id: 'fcr',
      label: 'First contact resolution',
      value: '71%',
      trend: -1.4,
      evaluated: 1840,
      pending: 420,
    },
  ],
  purposes: [
    { label: 'Order status', value: 2480 },
    { label: 'Returns', value: 1620 },
    { label: 'Billing', value: 1390 },
    { label: 'Sizing', value: 1160 },
    { label: 'Store hours', value: 740 },
    { label: 'Promo code', value: 410 },
    { label: 'Damaged item', value: 280 },
    { label: 'Address change', value: 190 },
  ],
  reasons: [
    { label: 'Knowledge gap', value: 820 },
    { label: 'Customer request', value: 690 },
    { label: 'Policy exception', value: 540 },
    { label: 'Tool error', value: 390 },
    { label: 'Language limit', value: 210 },
    { label: 'Verification fail', value: 140 },
    { label: 'After hours', value: 90 },
  ],
  destinations: [
    { label: 'Billing', value: 640 },
    { label: 'Sales', value: 430 },
    { label: 'Support', value: 340 },
    { label: 'Supervisor', value: 190 },
    { label: 'Retention', value: 120 },
    { label: 'Shipping', value: 80 },
    { label: 'Warranty', value: 50 },
  ],
}

const past7Quality = {
  quality: [
    {
      id: 'csat',
      label: 'AI CSAT',
      value: '4.4',
      trend: 0.3,
      rows: [
        { label: 'Contained', value: '4.5', token: '--dt-color-chart-categorical-01' },
        { label: 'Transferred', value: '4.2', token: '--dt-color-chart-categorical-03' },
      ],
    },
    {
      id: 'aht',
      label: 'Average handle time',
      columns: [
        { id: 'voice', label: 'Voice', value: '4m 40s', trend: -2 },
        { id: 'digital', label: 'Digital', value: '3m 12s', trend: -1 },
      ],
    },
    {
      id: 'fcr',
      label: 'First contact resolution',
      value: '74%',
      trend: 1.2,
      evaluated: 410,
      pending: 86,
    },
  ],
  purposes: [
    { label: 'Order status', value: 560 },
    { label: 'Sizing', value: 250 },
    { label: 'Returns', value: 290 },
    { label: 'Billing', value: 260 },
    { label: 'Store hours', value: 140 },
    { label: 'Promo code', value: 70 },
    { label: 'Damaged item', value: 48 },
    { label: 'Address change', value: 32 },
  ],
  reasons: [
    { label: 'Customer request', value: 180 },
    { label: 'Knowledge gap', value: 130 },
    { label: 'Policy exception', value: 120 },
    { label: 'Tool error', value: 64 },
    { label: 'Language limit', value: 40 },
    { label: 'Verification fail', value: 22 },
    { label: 'After hours', value: 14 },
  ],
  destinations: [
    { label: 'Support', value: 150 },
    { label: 'Billing', value: 114 },
    { label: 'Sales', value: 86 },
    { label: 'Supervisor', value: 42 },
    { label: 'Retention', value: 28 },
    { label: 'Shipping', value: 16 },
    { label: 'Warranty', value: 10 },
  ],
}

export const analyticsRanges = [
  { id: 'past30', label: 'Past 30 days', data: pack(days, skills, past30Quality) },
  { id: 'past7', label: 'Past 7 days', data: pack(days.slice(-7), weekSkills(skills), past7Quality) },
]

export function periodTotal(points, key) {
  return points.reduce((sum, point) => sum + point[key], 0)
}
