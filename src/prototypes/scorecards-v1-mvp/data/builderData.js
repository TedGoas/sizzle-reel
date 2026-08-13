export const scorecardMeta = {
  name: 'Customer care',
  status: 'Draft',
  gradeBy: 'Grade by Ai',
  breadcrumbs: ['Admin', 'Office', 'AI Scorecards', 'Customer Care'],
}

export const questions = [
  {
    id: 1,
    number: 1,
    text: 'Did the agent ask for the persons name?',
    responseType: 'Yes or no',
    responses: [
      { label: 'Yes', points: 10 },
      { label: 'No', points: 0 },
    ],
    triggerWords: '',
    isAi: true,
    aiSuggestions: [
      'Did the agent ask for and confirm the caller\'s full name at the beginning of the conversation?',
      'Was the caller\'s name requested and verified by the agent during the initial greeting?',
    ],
  },
  {
    id: 2,
    number: 2,
    text: 'Did the agent restate the purpose of the conversation?',
    responseType: 'Yes or no',
    responses: [
      { label: 'Yes', points: 10 },
      { label: 'No', points: 0 },
    ],
    triggerWords: '',
    isAi: true,
    aiSuggestions: [
      'Did the agent clearly summarize and confirm the reason for the customer\'s call?',
      'Was the purpose of the interaction restated by the agent to ensure mutual understanding?',
    ],
  },
  {
    id: 3,
    number: 3,
    text: 'Was the caller\'s account information verified?',
    responseType: 'Yes or no',
    responses: [
      { label: 'Yes', points: 10 },
      { label: 'No', points: 0 },
    ],
    triggerWords: 'account number, verify, confirm identity',
    isAi: true,
    aiSuggestions: [
      'Did the agent properly verify the caller\'s identity and account details before proceeding?',
      'Was the customer\'s account information confirmed through proper verification steps?',
    ],
  },
  {
    id: 4,
    number: 4,
    text: 'Did the agent understand the nature of the caller\'s issue?',
    responseType: 'Yes or no',
    responses: [
      { label: 'Yes', points: 10 },
      { label: 'No', points: 0 },
    ],
    triggerWords: '',
    isAi: false,
    aiSuggestions: [
      'Did the agent demonstrate a clear understanding of the customer\'s problem or request?',
      'Was the agent able to accurately identify and articulate the caller\'s core issue?',
    ],
  },
]

export const adminNavItems = [
  { label: 'Office', hasPlus: false },
  { label: 'Departments', hasPlus: true },
  { label: 'Ai Contact Centers', hasPlus: true },
  { label: 'Geo. Routing', hasPlus: true },
  { label: 'Coaching Groups', hasPlus: true },
  { label: 'Coaching Teams', hasPlus: true },
  { label: 'Channels & Workflows', hasPlus: false },
  { label: 'Ai Scorecards', hasPlus: false, active: true },
  { label: 'Billing', hasPlus: false },
  { label: 'Dialpad Ai', hasPlus: false },
  { label: 'Privacy & Legal', hasPlus: false },
]
