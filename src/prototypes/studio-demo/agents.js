export const agents = [
  {
    id: 1,
    name: 'Aerolabs Delivery Agent',
    locale: 'English US',
    group: 'Sales Center',
    additionalGroups: '',
    resolutionRate: '74.5%',
    usage: 145,
    sparkline: '0,18 10,12 20,15 30,8 40,14 50,10 60,6',
    type: 'Agentic',
    status: 'Published',
  },
  {
    id: 2,
    name: 'Customer Support Agent',
    locale: 'English US',
    group: 'North Sales Center',
    additionalGroups: '+4 more',
    resolutionRate: '88%',
    usage: 126,
    sparkline: '0,10 10,8 20,12 30,6 40,14 50,11 60,9',
    type: 'Agentic',
    status: 'Published',
  },
  {
    id: 3,
    name: 'Sales Assistant Agent',
    locale: 'English US',
    group: 'North Sales Center',
    additionalGroups: '+4 more',
    resolutionRate: '25%',
    usage: 122,
    sparkline: '0,16 10,14 20,18 30,12 40,10 50,15 60,13',
    type: 'Agentic',
    status: 'Published',
  },
  {
    id: 4,
    name: 'Technical Support Agent',
    locale: 'English US',
    group: 'Aerolabs hello',
    additionalGroups: '',
    resolutionRate: '82.5%',
    usage: 80,
    sparkline: '0,12 10,11 20,13 30,12 40,11 50,12 60,11',
    type: 'Generative',
    status: 'Published',
  },
]

export const suggestionChips = [
  'AI Receptionist',
  'Scheduling Assistant',
  'Recruiting Agent',
  'Account Manager',
  'CRM Buddy',
  'Sales Support Agent',
]

export const canvasDescriptions = {
  'AI Receptionist': 'Greets callers professionally, routes to the right team, and captures messages when agents are unavailable.',
  'Scheduling Assistant': 'Books and manages appointments, sends reminders, and handles rescheduling requests automatically.',
  'Recruiting Agent': 'Screens candidates, schedules interviews, and keeps applicants informed throughout the hiring process.',
  'Account Manager': 'Handles account inquiries, processes service requests, and escalates complex issues to human agents.',
  'CRM Buddy': 'Keeps CRM data accurate by logging every interaction and syncing record updates in real time.',
  'Sales Support Agent': 'Qualifies inbound leads, delivers product information, and seamlessly hands off to human sales reps.',
}

export const receptionistSkills = [
  'Route Incoming Calls',
  'Take Messages',
  'Schedule Callbacks',
]

export const chipPrompts = {
  'AI Receptionist': 'An AI receptionist that answers incoming calls, greets callers professionally, routes them to the right department, and takes messages when no agents are available.',
  'Scheduling Assistant': 'A scheduling assistant that books appointments, sends automated reminders to customers, and handles rescheduling or cancellation requests.',
  'Recruiting Agent': 'A recruiting agent that pre-screens job applicants with qualifying questions and schedules interviews with the hiring team.',
  'Account Manager': 'An account manager that handles customer inquiries, processes account changes, and escalates complex issues to the right team.',
  'CRM Buddy': 'A CRM assistant that logs every customer interaction automatically and keeps contact records and deal stages up to date.',
  'Sales Support Agent': 'A sales support agent that qualifies inbound leads, answers product questions, and hands off warm prospects to a human sales rep.',
}
