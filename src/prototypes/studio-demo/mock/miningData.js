// Skill mining: one source for the setup form, the fake run, and the gaps it finds.
// Analyzed total matches totalConversations.total in overviewData.js.

export const TIMING = {
  miningRun: 4000, // ms from "Mine for skills" to results
}

export const callSources = [
  { id: 'main', label: 'Main support line', detail: '(415) 555-0142' },
  { id: 'orders', label: 'Orders and delivery', detail: '(415) 555-0178' },
  { id: 'showroom', label: 'Showroom bookings', detail: '(415) 555-0193' },
  { id: 'chat', label: 'Website chat', detail: 'aerolabs.com' },
]

export const callPurposes = [
  'Order status',
  'Returns',
  'Billing',
  'Scheduling',
  'Product advice',
  'Delivery',
  'Account access',
]

export const MAX_PURPOSES = 5

export const dateRanges = [
  { id: '7', label: 'Last 7 days', hint: 'Best when customers call about the same things each week.' },
  { id: '30', label: 'Last 30 days', hint: 'Catches issues that only come up a few times a month.' },
]

export const miningSummary = {
  analyzed: 1542,
  uncovered: 278,
  range: 'Oct 30 to Nov 5',
}

export const miningGaps = [
  {
    id: 'damaged-claim',
    name: 'Damaged item claim',
    description: 'Customers report items that arrived broken and want a refund or replacement.',
    calls: 94,
    colorToken: '--dt-color-chart-categorical-01',
    quotes: [
      'My blender showed up with a cracked jar. I have photos.',
      'The sofa leg snapped off when we unboxed it. Can you send a new one?',
      'Two of the four plates in the set were broken. I just want those replaced.',
    ],
    steps: [
      'Find the order',
      'Ask which item is damaged',
      'Collect photos',
      'Offer a refund or a replacement',
      'Send a return label if needed',
      'Confirm by email',
    ],
  },
  {
    id: 'cancel-shipped',
    name: 'Cancel a shipped order',
    description: 'Customers try to cancel after the order has left the warehouse.',
    calls: 67,
    colorToken: '--dt-color-chart-categorical-02',
    quotes: [
      'I ordered the wrong color. Can I still cancel?',
      'It says shipped but I don’t need it anymore.',
      'Please stop the delivery. I found it cheaper in the store.',
    ],
    steps: [
      'Find the order',
      'Check shipping status',
      'Explain it can’t be canceled',
      'Offer a return label',
      'Confirm the refund timeline',
    ],
  },
  {
    id: 'showroom-visit',
    name: 'Book a showroom visit',
    description: 'Customers want to see furniture in person before they buy.',
    calls: 48,
    colorToken: '--dt-color-chart-categorical-03',
    quotes: [
      'Can I come see the Harlow sofa this weekend?',
      'Is the downtown showroom open Thursday afternoon?',
      'I want to sit in the recliner before I order it.',
    ],
    steps: [
      'Ask which product line',
      'Pick a showroom',
      'Offer open times',
      'Book the visit',
      'Send a calendar invite',
    ],
  },
  {
    id: 'reschedule-delivery',
    name: 'Reschedule a delivery',
    description: 'Customers need a different delivery day or time window.',
    calls: 41,
    colorToken: '--dt-color-chart-categorical-04',
    quotes: [
      'I won’t be home Friday. Can it come Monday?',
      'Can you move my delivery to the morning?',
      'The building elevator is out that day. I need a new date.',
    ],
    steps: [
      'Find the order',
      'Check carrier availability',
      'Offer new windows',
      'Update the delivery',
      'Send a text confirmation',
    ],
  },
  {
    id: 'assembly',
    name: 'Book assembly service',
    description: 'Customers want help putting furniture together after delivery.',
    calls: 28,
    colorToken: '--dt-color-chart-categorical-05',
    quotes: [
      'Do you have people who can build the bed frame?',
      'How much is assembly for a dresser?',
      'Can the delivery team set up the dining table too?',
    ],
    steps: [
      'Find the order',
      'Quote the assembly fee',
      'Pick a time',
      'Take payment',
      'Confirm the booking',
    ],
  },
]

export function gapShare(gap) {
  return ((gap.calls / miningSummary.analyzed) * 100).toFixed(1)
}

export const uncoveredShare = Math.round((miningSummary.uncovered / miningSummary.analyzed) * 100)

// Mining drawers overlay the Overview page. Narrower than History so the results stay readable.
export const DRAWER_WIDTH = 480
