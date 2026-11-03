export const selectedContact = {
  label: '(919) 426-1801',
  phone: '(919) 426-1801',
}

export const caller = {
  name: 'Ben Parker',
  initials: 'BP',
  company: 'Aerolabs',
  title: 'RevOps Manager',
  phone: '(415) 123-4567',
  email: 'ben.parker@aerolabs.com',
  contactCenter: 'Dialpad Customer Care',
  verified: true,
}

// What the AI agent captured before handing the call to a human.
export const transferContext = {
  queue: 'Dialpad Customer Care - Gold - Enterprise Support',
  source: 'DP Support Ai Agent',
  summary:
    'Customer needs help connecting HubSpot to Dialpad. The assistant walked them through the connection and sign-in process, but it did not resolve the issue.',
  // Shown on the incoming call card, in priority order.
  cardFields: [
    { label: 'Feature', value: 'HubSpot integration' },
    { label: 'Issue', value: 'Connection and authentication' },
    { label: 'Customer type', value: 'Engaged, 3 tickets this month' },
    { label: 'Sentiment', value: 'Neutral', sentiment: 'neutral' },
  ],
  // Full detail shown in the sidebar once the call is accepted.
  fields: [
    { label: 'Stated Desired Outcome', value: 'Get HubSpot calls and contacts syncing before Monday’s sales kickoff' },
    { label: 'Product Service', value: 'HubSpot integration' },
    { label: 'Reason For Contact', value: 'HubSpot shows “Authorization failed” after sign-in' },
    { label: 'Troubleshooting Steps Attempted', value: 'Disconnected and reconnected the integration; signed in with a HubSpot Super Admin; cleared browser cache' },
    { label: 'Escalation Reason', value: 'Connection still failing after guided steps; may need back-end token reset' },
    { label: 'Customer Sentiment Analysis', value: 'Neutral, growing impatient' },
    { label: 'Authentication Status', value: 'Verified (caller ID + account email)' },
    { label: 'Account', value: 'Aerolabs · Enterprise plan · 240 seats' },
    { label: 'Location', value: 'Austin, TX' },
    { label: 'Skills Triggered', value: 'Integrations Troubleshooting, Account Verification' },
  ],
}

export const salesforce = [
  { label: 'Account Owner', value: 'Priya Nair' },
  { label: 'Plan', value: 'Enterprise · Renews Mar 2027' },
  { label: 'Open Cases', value: '3 (2 related to integrations)' },
]

// Delay before the incoming call appears, and how long Decline counts down.
export const RING_DELAY_MS = 1000
export const RING_TIMEOUT_MS = 10000

export const sidebarSections = [
  {
    title: 'Favorites',
    defaultOpen: true,
    items: [
      { label: 'Ben Parker', subtitle: 'In a meeting · Working from SF', avatar: 'BP', avatarColor: '#7C52FF', status: 'busy' },
      { label: 'Alicia Kurniawan', avatar: 'AK', avatarColor: '#7C52FF', badge: 2 },
      { label: 'design', icon: 'channel' },
      { label: 'Claire Reynolds, Lori Smith...', icon: 'group' },
      { label: 'Veronica Smith', subtitle: '⚡ TCB!', avatar: 'VS', avatarColor: '#9E9E9E' },
    ],
  },
  {
    title: 'Coaching teams',
    defaultOpen: true,
    items: [
      { label: 'Sales SMB', icon: 'square', iconColor: '#4CAF50' },
    ],
  },
  {
    title: 'Recents',
    defaultOpen: true,
    items: [
      { label: '(919) 426-1801', icon: 'user' },
      { label: '(805) 684-7000', icon: 'user' },
      { label: '(913) 221-3070', icon: 'user' },
      { label: '(684) 555-0102', icon: 'user' },
      { label: '(629) 555-0129', icon: 'user' },
      { label: '(201) 555-0124', icon: 'user' },
      { label: '(302) 555-0107', icon: 'user' },
      { label: '(808) 555-0111', icon: 'user' },
      { label: '(209) 555-0104', icon: 'user' },
      { label: '(319) 555-0115', icon: 'user' },
    ],
  },
]
