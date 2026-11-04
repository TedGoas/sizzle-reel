const past30 = {
  heroes: [
    { id: 'total', label: 'Total conversations', value: '18,420', trend: 6.4, note: 'Every inbound conversation this period.' },
    { id: 'contained', label: 'AI contained', value: '12,080', trend: 8.1, note: 'Handled end to end without a human handoff.' },
    { id: 'transferred', label: 'Transferred', value: '4,120', trend: -3.2, note: 'Reached a human agent this period.' },
  ],
  quality: [
    { id: 'csat', label: 'AI CSAT', value: '4.2', unit: '/ 5', note: 'Satisfied · voice 4.3, digital 4.1' },
    { id: 'aht', label: 'Average handle time', value: '4m 23s', note: 'Voice 5m 12s · Digital 3m 34s' },
    { id: 'fcr', label: 'First contact resolution', value: '71%', note: 'Resolved without a repeat contact in 72 hours.' },
  ],
  purposes: [
    { label: 'Order status', value: 32 },
    { label: 'Returns', value: 21 },
    { label: 'Billing', value: 18 },
    { label: 'Sizing', value: 15 },
    { label: 'Other', value: 14 },
  ],
  reasons: [
    { label: 'Knowledge gap', value: 34 },
    { label: 'Customer request', value: 28 },
    { label: 'Policy exception', value: 22 },
    { label: 'Tool error', value: 16 },
  ],
  destinations: [
    { label: 'Billing', value: 40 },
    { label: 'Sales', value: 27 },
    { label: 'Support', value: 21 },
    { label: 'Supervisor', value: 12 },
  ],
  skills: [
    { name: 'Order status', volume: '4,200', containment: '86%', success: '94%' },
    { name: 'Track delivery', volume: '3,100', containment: '91%', success: '97%' },
    { name: 'Sizing advice', volume: '2,400', containment: '78%', success: '88%' },
    { name: 'Return item', volume: '1,900', containment: '64%', success: '81%' },
    { name: 'Reset password', volume: '980', containment: '88%', success: '96%' },
  ],
}

const past7 = {
  heroes: [
    { id: 'total', label: 'Total conversations', value: '1,542', trend: 2.1, note: 'Every inbound conversation this period.' },
    { id: 'contained', label: 'AI contained', value: '1,104', trend: 4.6, note: 'Handled end to end without a human handoff.' },
    { id: 'transferred', label: 'Transferred', value: '286', trend: 1.4, note: 'Reached a human agent this period.' },
  ],
  quality: [
    { id: 'csat', label: 'AI CSAT', value: '4.4', unit: '/ 5', note: 'Satisfied · voice 4.5, digital 4.2' },
    { id: 'aht', label: 'Average handle time', value: '3m 58s', note: 'Voice 4m 40s · Digital 3m 12s' },
    { id: 'fcr', label: 'First contact resolution', value: '74%', note: 'Resolved without a repeat contact in 72 hours.' },
  ],
  purposes: [
    { label: 'Order status', value: 36 },
    { label: 'Returns', value: 19 },
    { label: 'Billing', value: 17 },
    { label: 'Sizing', value: 16 },
    { label: 'Other', value: 12 },
  ],
  reasons: [
    { label: 'Customer request', value: 36 },
    { label: 'Knowledge gap', value: 27 },
    { label: 'Policy exception', value: 24 },
    { label: 'Tool error', value: 13 },
  ],
  destinations: [
    { label: 'Support', value: 38 },
    { label: 'Billing', value: 29 },
    { label: 'Sales', value: 22 },
    { label: 'Supervisor', value: 11 },
  ],
  skills: [
    { name: 'Order status', volume: '206', containment: '88%', success: '95%' },
    { name: 'Sizing advice', volume: '184', containment: '80%', success: '90%' },
    { name: 'Return item', volume: '165', containment: '67%', success: '83%' },
    { name: 'Reset password', volume: '93', containment: '90%', success: '97%' },
    { name: 'Track delivery', volume: '78', containment: '92%', success: '98%' },
  ],
}

export const analyticsRanges = [
  { id: 'past30', label: 'Past 30 days', data: past30 },
  { id: 'past7', label: 'Past 7 days', data: past7 },
]
