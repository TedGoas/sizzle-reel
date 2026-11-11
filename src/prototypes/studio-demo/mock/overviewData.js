const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function series(positiveValues, negativeValues) {
  return days.map((day, index) => ({
    day,
    positive: positiveValues[index],
    negative: negativeValues[index],
  }))
}

export const metricColors = {
  positive: '#CFDAF0',
  negative: '#8AABDD',
  line: '#1C4D70',
}

export const metricSeries = [
  {
    id: 'containment',
    label: 'Containment rate',
    tip: 'Share of conversations the AI handled without transferring to a person.',
    positive: 'Contained',
    negative: 'Transferred',
    points: series([144, 164, 196, 189, 162, 140, 136], [36, 36, 34, 36, 43, 35, 32]),
  },
  {
    id: 'resolution',
    label: 'Resolution rate',
    tip: 'Share of conversations resolved without a repeat contact.',
    positive: 'Resolved',
    negative: 'Unresolved',
    points: series([207, 183, 145, 136, 157, 189, 207], [23, 27, 30, 32, 28, 26, 21]),
  },
  {
    id: 'skillSuccess',
    label: 'Skill success rate',
    tip: 'Share of skill runs that finished without an error.',
    positive: 'No errors',
    negative: 'With errors',
    points: series([142, 157, 167, 178, 189, 201, 212], [23, 21, 21, 20, 19, 17, 16]),
  },
]

export function metricRate(points) {
  const positive = points.reduce((sum, point) => sum + point.positive, 0)
  const total = points.reduce((sum, point) => sum + point.positive + point.negative, 0)
  return `${((positive / total) * 100).toFixed(1)}%`
}

export const totalConversations = {
  total: 1542,
  trend: 3.1,
  caption: 'Voice and digital.',
  tip: 'All customer conversations processed during the selected period.',
  segments: [
    { id: 'voice', label: 'Voice', value: 854, color: 'var(--dt-color-chart-categorical-03)' },
    { id: 'digital', label: 'Digital', value: 688, color: 'var(--dt-color-chart-categorical-01)' },
  ],
}

export const guardianAlerts = {
  total: 21,
  trend: -2,
  share: '1% of conversations',
  caption: 'Flagged this period.',
  tip: 'Conversations Guardian flagged as a caution or a high risk.',
  segments: [
    { id: 'cautions', label: 'Cautions', value: 13, color: 'var(--dt-color-chart-categorical-04)' },
    { id: 'highRisk', label: 'High risk', value: 8, color: 'var(--dt-color-chart-critical)' },
  ],
}

export const overviewTips = {
  metrics: 'Containment, resolution, and skill success for the selected period.',
  csat: 'Average customer satisfaction score for AI-handled conversations, rated from 1 (lowest) to 5 (highest).',
  aht: 'Average time to handle a conversation from start to completion, including wrap-up. Voice and Digital shown side by side.',
  skills: 'How often each skill was started. A conversation can trigger a skill multiple times.',
}

export const aiCsat = {
  score: '4.2',
  label: 'Satisfied',
  voice: '4.3',
  digital: '4.1',
}

export const averageHandleTime = {
  total: '4m 23s',
  voice: '5m 12s',
  digital: '3m 34s',
}

export const skillUsage = [
  { label: 'Order status', value: 206, colorToken: '--dt-color-chart-categorical-01' },
  { label: 'Sizing', value: 184, colorToken: '--dt-color-chart-categorical-02' },
  { label: 'Returns', value: 165, colorToken: '--dt-color-chart-categorical-03' },
  { label: 'Password', value: 93, colorToken: '--dt-color-chart-categorical-04' },
  { label: 'Tracking', value: 78, colorToken: '--dt-color-chart-categorical-05' },
]
