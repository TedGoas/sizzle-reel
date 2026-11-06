// Conversation open before the call. Accepting the call switches to the caller.
export const selectedContact = {
  label: 'Alicia Kurniawan',
  initials: 'AK',
  avatarColor: '#7C52FF',
}

export const caller = {
  name: 'Ben Parker',
  initials: 'BP',
  company: 'Aerolabs',
  title: 'RevOps Manager',
  phone: '(415) 123-4567',
  email: 'ben.parker@aerolabs.com',
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
    { label: 'Stated desired outcome', value: 'Get HubSpot calls and contacts syncing before Monday’s sales kickoff' },
    { label: 'Product service', value: 'HubSpot integration' },
    { label: 'Reason for contact', value: 'HubSpot shows “Authorization failed” after sign-in' },
    { label: 'Troubleshooting steps attempted', value: 'Disconnected and reconnected the integration; signed in with a HubSpot Super Admin; cleared browser cache' },
    { label: 'Escalation reason', value: 'Connection still failing after guided steps; may need back-end token reset' },
    { label: 'Customer sentiment analysis', value: 'Neutral, growing impatient' },
    { label: 'Authentication status', value: 'Verified (caller ID + account email)' },
    { label: 'Account', value: 'Aerolabs · Enterprise plan · 240 seats' },
    { label: 'Location', value: 'San Francisco, CA' },
    { label: 'Skills triggered', value: 'Integrations Troubleshooting, Account Verification' },
  ],
}

export const salesforce = [
  { label: 'Account owner', value: 'Priya Nair' },
  { label: 'Plan', value: 'Enterprise · Renews Mar 2027' },
  { label: 'Open cases', value: '3 (2 related to integrations)' },
]

// Wrap-up: disposition options and the AI draft that pre-fills the modal.
export const dispositions = [
  'Resolved',
  'Resolved: follow-up required',
  'Unresolved: escalated to Tier 2',
  'Unresolved: customer to call back',
  'Not an issue: working as intended',
  'Callback scheduled',
  'Transferred to another team',
]

export const wrapUpDraft = {
  disposition: 'Resolved: follow-up required',
  notes: 'Ben (Aerolabs, Enterprise) could not authenticate the HubSpot integration after the AI agent\'s reconnect steps failed. Re-authorized OAuth with an Aerolabs admin account and confirmed contacts are syncing again. Follow-up: send Ben a sync-health check in 24 hours. Linked to the 2 open integration cases.',
}

// Every delay and duration in the prototype. Tune here only.
export const TIMING = {
  ringDelayMs: 1000,            // Page load to the incoming call card.
  ringTimeoutMs: 10000,         // How long the Decline button counts down.
  wrapUpDispositionAtMs: 3000,  // Wrap-up shimmer before the disposition lands.
  wrapUpNotesDurationMs: 6000,  // How long the AI notes take to stream in.
}

export const sidebarSections = [
  {
    title: 'Favorites',
    defaultOpen: true,
    items: [
      { label: 'Jordan Lee', subtitle: 'In a meeting · Working from SF', avatar: 'JL', avatarColor: '#7C52FF', status: 'busy' },
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
      { label: '(617) 555-0193', icon: 'user' },
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
