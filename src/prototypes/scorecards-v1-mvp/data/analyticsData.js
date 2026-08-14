export const chartLabels = [
  'Mar 2', 'Mar 4', 'Mar 6', 'Mar 8', 'Mar 10',
  'Mar 12', 'Mar 14', 'Mar 16', 'Mar 18', 'Mar 20',
  'Mar 22', 'Mar 24', 'Mar 26', 'Mar 28', 'Mar 30',
]

export const lineData = [88, 90, 91, 91, 89, 93, 91, 92, 94, 92, 91, 93, 95, 91, 89]

export const callsGraded = [21, 14, 26, 19, 11, 10, 15, 13, 18, 21, 18, 26, 23, 21, 18]

export const summaryStats = {
  label: 'All Groups',
  averageGrade: '90%',
  trend: '4%',
  trendDirection: 'up',
  comparison: 'vs prev 30 days',
}

export const HOVER_INDEX = 9
export const HOVER_PATH = [7, 8, 9]

export const agentRows = [
  { name: 'Mobile Support', avgGrade: '96%', change: '4%', changeDir: 'up', callsGraded: 341 },
  { name: 'OberConference Support', avgGrade: '95%', change: '3%', changeDir: 'up', callsGraded: 242 },
  { name: 'Conagra Support', avgGrade: '94%', change: '6%', changeDir: 'up', callsGraded: 88 },
  { name: 'Grand Rapids Call Center', avgGrade: '94%', change: '2%', changeDir: 'down', callsGraded: 179 },
  { name: 'Emergency Call Line', avgGrade: '93%', change: '2%', changeDir: 'up', callsGraded: 258 },
  { name: 'Calpine Call Center', avgGrade: '93%', change: '11%', changeDir: 'down', callsGraded: 431 },
  { name: 'NRG Support', avgGrade: '92%', change: '8%', changeDir: 'up', callsGraded: 266 },
]

export const graders = [
  { name: 'Mark Bayani', calls: 166, avatar: 'https://i.pravatar.cc/56?img=12' },
  { name: 'Alicia Kurniawan', calls: 156, avatar: 'https://i.pravatar.cc/56?img=32' },
  { name: 'Faith Smyth', calls: 216, avatar: 'https://i.pravatar.cc/56?img=5' },
  { name: 'Samantha Jones', calls: 89, avatar: 'https://i.pravatar.cc/56?img=47' },
]

export const sidebarNavItems = [
  { label: 'All calls', indent: 0 },
  { label: 'My calls', indent: 0 },
  { label: 'Coaching teams', indent: 0 },
  { label: 'QA Scorecards', indent: 0, expanded: true },
  { label: 'Teams & Groups', indent: 1, active: true },
  { label: 'Agents', indent: 1 },
  { label: 'Scorecards', indent: 1 },
]
