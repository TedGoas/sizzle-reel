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
    points: series([68, 122, 180, 206, 156, 84, 62], [12, 18, 40, 34, 44, 16, 8]),
  },
  {
    id: 'resolution',
    label: 'Resolution rate',
    positive: 'Resolved',
    negative: 'Unresolved',
    points: series([207, 126, 40, 28, 55, 148, 202], [23, 54, 50, 42, 45, 42, 18]),
  },
  {
    id: 'skillSuccess',
    label: 'Skill success rate',
    positive: 'No errors',
    negative: 'With errors',
    points: series([28, 52, 88, 126, 167, 207, 244], [12, 18, 22, 24, 23, 23, 16]),
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
