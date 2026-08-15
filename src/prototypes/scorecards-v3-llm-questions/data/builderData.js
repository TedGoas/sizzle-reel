export const scorecardMeta = {
  name: 'Ai Scorecard Example',
  status: 'Draft',
  gradeBy: 'Grade by Ai',
  breadcrumbs: ['Admin', 'Office', 'AI Scorecards', 'Ai Scorecard Example'],
}

export const DRAFT_QUESTION = 'Did the agent ask for the persons name?'
export const REWRITE_SUGGESTION = "Did the agent confirm the customer's identity?"

function yesNoQuestion(id, number, text, isAi = true, aiSuggestions = []) {
  return {
    id,
    number,
    text,
    responseType: 'Yes or no',
    responses: [
      { label: 'Yes', points: 10 },
      { label: 'No', points: 0 },
    ],
    triggerWords: '',
    isAi,
    aiSuggestions,
  }
}

export function createBlankQuestion() {
  return yesNoQuestion(3, 3, '', true, [REWRITE_SUGGESTION])
}

export function createInitialQuestions() {
  return [
    yesNoQuestion(1, 1, 'Did the agent ask for the persons name?'),
    yesNoQuestion(2, 2, 'Did the agent restate the purpose of the conversation?'),
    createBlankQuestion(),
  ]
}

export const questions = createInitialQuestions()

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
