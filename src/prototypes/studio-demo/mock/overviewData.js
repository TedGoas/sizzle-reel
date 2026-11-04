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
    positive: 'Contained',
    negative: 'Transferred',
    points: series([144, 164, 196, 189, 162, 140, 136], [36, 36, 34, 36, 43, 35, 32]),
  },
  {
    id: 'resolution',
    label: 'Resolution rate',
    positive: 'Resolved',
    negative: 'Unresolved',
    points: series([207, 183, 145, 136, 157, 189, 207], [23, 27, 30, 32, 28, 26, 21]),
  },
  {
    id: 'skillSuccess',
    label: 'Skill success rate',
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
  voice: 854,
  digital: 688,
}

export const guardianAlerts = {
  total: 21,
  cautions: 13,
  highRisk: 8,
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
  { name: 'Order status', count: 206 },
  { name: 'Sizing advice', count: 184 },
  { name: 'Return item', count: 165 },
  { name: 'Reset password', count: 93 },
  { name: 'Track delivery', count: 78 },
]
