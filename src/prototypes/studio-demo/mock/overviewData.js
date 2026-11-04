export const metricSeries = [
  {
    id: 'containment',
    label: 'Containment rate',
    rate: '78%',
    positive: 'Contained',
    negative: 'Transferred',
    labels: ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4'],
    positiveValues: [120, 132, 128, 140, 136, 150, 144],
    negativeValues: [38, 30, 34, 28, 32, 26, 30],
  },
  {
    id: 'resolution',
    label: 'Resolution rate',
    rate: '86%',
    positive: 'Resolved',
    negative: 'Unresolved',
    labels: ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4'],
    positiveValues: [140, 148, 152, 160, 155, 168, 162],
    negativeValues: [28, 24, 22, 20, 26, 18, 22],
  },
  {
    id: 'skillSuccess',
    label: 'Skill success rate',
    rate: '91%',
    positive: 'No errors',
    negative: 'With errors',
    labels: ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4'],
    positiveValues: [160, 168, 172, 180, 176, 188, 184],
    negativeValues: [18, 16, 14, 12, 18, 10, 14],
  },
]

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
