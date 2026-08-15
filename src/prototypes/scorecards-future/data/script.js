export const PROMPT = 'I want to build a scorecard for refunds.'

export const SUGGESTION_CHIPS = [
  'Scorecard for refunds',
  'Scorecard for new-hire greetings',
  'Scorecard for billing disputes',
]

export const AI_Q1 = 'Is this for a specific team, or anyone who handles refunds?'
export const USER_A1 = 'Billing and support — anyone who processes refunds.'
export const AI_Q2 = 'Should it cover just the refund decision, or also policy and next steps?'
export const USER_A2 = 'The whole refund: confirm the order, explain the policy, and close the request.'

export const AI_PREVIEW =
  'Here’s a draft refunds scorecard. Click a question to edit it.'

export const THINK_1 = [
  'Looking at refund conversations…',
  'Figuring out what to ask…',
]

export const THINK_2 = ['Taking that in…']

export const THINK_3 = [
  'Drafting questions…',
  'Putting the scorecard together…',
]

function yesNo(id, number, text, triggerChips = []) {
  return {
    id,
    number,
    text,
    responseType: 'Yes or no',
    responses: [
      { label: 'Yes', points: 10 },
      { label: 'No', points: 0 },
    ],
    triggerChips,
    isAi: true,
  }
}

export function createRefundQuestions() {
  return [
    yesNo(1, 1, 'Did the agent confirm the order or account?', [
      'order number',
      'account',
    ]),
    yesNo(2, 2, 'Did the agent confirm the refund reason?', [
      'reason',
      'why',
    ]),
    yesNo(3, 3, 'Did the agent explain the refund policy?', [
      'policy',
      'eligible',
    ]),
    yesNo(4, 4, 'Did the agent confirm the refund amount and timeline?', [
      'amount',
      '5-7 days',
    ]),
    yesNo(5, 5, 'Did the agent have a professional tone?'),
    yesNo(6, 6, 'Did the agent conclude the refund request properly?', [
      'anything else',
      'thank you',
    ]),
  ]
}
