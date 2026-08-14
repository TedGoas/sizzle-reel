export const chartLabels = [
  'Jan 4', 'Jan 11', 'Jan 18', 'Jan 25', 'Feb 1', 'Feb 8', 'Feb 15', 'Feb 22', 'Mar 1',
]

export const barData = {
  aiGraded: [417, 428, 421, 411, 424, 417, 429, 419, 428],
  humanGraded: [23, 12, 19, 29, 16, 23, 11, 21, 12],
}

export const lineData = [88, 86, 87, 85, 86, 84, 85, 83, 86]

export const summaryStats = {
  averageGrade: '86%',
  trend: '+2%',
  trendDirection: 'up',
  comparison: 'vs. previous 60 days',
}

export const agentRows = [
  { name: 'West Coast Sales', avgGrade: '86%', change: '+2%', changeDir: 'up', callsGraded: 56, gradeDistribution: { ai: 48, human: 8 } },
  { name: 'Enterprise Support', avgGrade: '94%', change: '+2%', changeDir: 'up', callsGraded: 55, gradeDistribution: { ai: 50, human: 5 } },
  { name: 'Billing & Payments', avgGrade: '82%', change: '+2%', changeDir: 'up', callsGraded: 54, gradeDistribution: { ai: 45, human: 9 } },
  { name: 'New Customer Onboarding', avgGrade: '71%', change: '-1%', changeDir: 'down', callsGraded: 52, gradeDistribution: { ai: 42, human: 10 } },
  { name: 'Technical Support', avgGrade: '52%', change: '-2%', changeDir: 'down', callsGraded: 50, gradeDistribution: { ai: 40, human: 10 } },
  { name: 'Retention & Loyalty', avgGrade: '93%', change: '-4%', changeDir: 'down', callsGraded: 48, gradeDistribution: { ai: 44, human: 4 } },
  { name: 'East Coast Sales', avgGrade: '100%', change: '-4%', changeDir: 'down', callsGraded: 44, gradeDistribution: { ai: 38, human: 6 } },
  { name: 'Partner Solutions', avgGrade: '78%', change: '-5%', changeDir: 'down', callsGraded: 32, gradeDistribution: { ai: 26, human: 6 } },
]

export const sidebarNavItems = [
  { label: 'Analytics Agent', indent: 0 },
  { label: 'All calls', indent: 0 },
  { label: 'Coaching teams', indent: 0 },
  { label: 'AI CSAT', indent: 0 },
  { label: 'AI Assistants', indent: 0 },
  { label: 'AI Scorecards', indent: 0, expanded: true },
  { label: 'By group', indent: 1, active: true },
  { label: 'By agent', indent: 1 },
  { label: 'By scorecards', indent: 1 },
  { label: 'Playbooks', indent: 0 },
]
