// Single source for the AI Agent drawer (and any other place that needs the company).
// Hearth & Home is the home-goods store behind the History conversations.

export const TIMING = {
  voicePreview: 2000, // how long the voice sample "plays"
  publishWorking: 1500, // spinner inside "Publish v1.2"
  skillUpdateWorking: 1000, // spinner inside the skill drawer's Update
  successToast: 4000, // how long the success toast stays up
}

export const publishInfo = {
  savedAgo: '2 min ago',
  savedBy: 'Nora Kim',
  version: '1.2',
}

export const company = {
  name: 'Hearth & Home',
  description:
    'We sell furniture, lighting, and home decor online and in 12 stores across the US. Most callers want to check an order, book a delivery, or return something.',
}

export const voiceOptions = [
  { value: 'ava', label: '🇺🇸 Ava - Warm and professional' },
  { value: 'marcus', label: '🇺🇸 Marcus - Calm and clear' },
  { value: 'olivia', label: '🇬🇧 Olivia - Bright and friendly' },
  { value: 'james', label: '🇬🇧 James - Measured and formal' },
  { value: 'lucia', label: '🇪🇸 Lucía - Warm and upbeat' },
]

export const knowledgeOptions = [
  { value: 'help-center', label: 'Help Center articles' },
  { value: 'returns', label: 'Return and exchange policy (PDF)' },
  { value: 'catalog', label: 'Product catalog' },
  { value: 'delivery', label: 'Delivery and assembly FAQ' },
  { value: 'stores', label: 'Store hours and locations' },
]

export const agentSettings = {
  voice: 'ava',
  knowledgeBase: 'help-center',
  greeting:
    "Thanks for calling Hearth & Home. I can check an order, book a delivery, or get you to the right team. What can I help with?",
  tasks: [
    '<p><strong>Greet every caller.</strong> Say the company name and ask how you can help.</p>',
    '<p><strong>Route the call.</strong> Figure out what the caller needs and send them to the right team. Use <span class="connection-badge connection-badge--workflow">Route Incoming Calls</span>.</p>',
    '<p><strong>Take a message.</strong> If no one is free, get their name, number, and a short note. Use <span class="connection-badge connection-badge--workflow">Take Messages</span>.</p>',
    '<p><strong>Offer a callback.</strong> If the wait is long, book a time for the team to call back. Use <span class="connection-badge connection-badge--workflow">Schedule Callbacks</span>.</p>',
  ].join(''),
  transfers: [
    '<p>If the caller disputes a charge or asks for a refund, transfer to <span class="connection-badge connection-badge--transfer">Billing team</span>.</p>',
    '<p>If a delivery arrived damaged or is missing parts, transfer to <span class="connection-badge connection-badge--transfer">Customer care</span>.</p>',
    '<p>If the caller asks for a person twice, transfer to <span class="connection-badge connection-badge--transfer">Operators</span>.</p>',
  ].join(''),
  fallbackDigital: 'agents',
  fallbackVoice: 'operators',
}

export const fallbackOptions = {
  digital: [
    { value: 'agents', label: 'Agents' },
    { value: 'contact-center', label: 'Contact Center' },
    { value: 'team-member', label: 'Team member' },
  ],
  voice: [
    { value: 'operators', label: 'Operators' },
    { value: 'voicemail', label: 'Voicemail' },
    { value: 'groups', label: 'Groups' },
    { value: 'team-member', label: 'Team member' },
    { value: 'room-phone', label: 'Room phone' },
  ],
}
