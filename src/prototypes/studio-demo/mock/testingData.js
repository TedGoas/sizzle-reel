import { reactive } from 'vue'

const DESCRIPTIONS = [
  'Customer requests to book a new appointment',
  'User asks about available time slots this week',
  'Caller wants to reschedule an existing appointment',
  'Customer inquires about cancellation policy',
  'User requests appointment confirmation details',
  'Caller asks to modify appointment preferences',
  'Customer wants to book multiple appointments',
  'User requests available services and pricing',
  'Customer asks about wait times and availability',
  'Caller needs emergency appointment scheduling',
  'User wants to update contact information',
  'Customer requests appointment history',
  'Caller asks about office location and hours',
  'User needs to cancel and reschedule same day',
  'Customer inquires about a late delivery',
  'Caller wants the status of an open return',
]

const SKILLS = [
  'Appointment Scheduling',
  'Knowledge Retrieval',
  'Order status',
  'Track delivery',
  'Return item',
  'Calendar Coordination',
  'Billing Inquiry',
  'Policy Explanation',
]

const COMPLEXITY = ['Simple', 'Medium', 'Complex']

const CHANNELS = ['Voice and Digital', 'Voice only', 'Digital only']

function pickSkills() {
  const count = 1 + Math.floor(Math.random() * 3)
  return [...SKILLS].sort(() => Math.random() - 0.5).slice(0, count)
}

export function generateScenarios() {
  const count = 4 + Math.floor(Math.random() * 7)
  return [...DESCRIPTIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((description, index) => ({
      id: String(index + 1).padStart(3, '0'),
      description,
      complexity: COMPLEXITY[index % COMPLEXITY.length],
      skills: pickSkills(),
    }))
}

function synopsis(percentage, channel) {
  const where = channel.toLowerCase()
  if (percentage >= 85) {
    return `Excellent performance across ${where}. Strong capabilities in the key scenarios, with consistent accuracy.`
  }
  if (percentage >= 70) {
    return `Solid performance on routine tasks, with a few scenarios still to tighten up on ${where}.`
  }
  return `Mixed results. Basic scenarios passed, and the more complex requests need another pass on ${where}.`
}

function statusFor(percentage) {
  if (percentage >= 86) return { status: 'Excellent', color: 'var(--dt-color-foreground-success)' }
  if (percentage >= 66) return { status: 'Passed', color: 'var(--dt-color-border-warning)' }
  return { status: 'Failed', color: 'var(--dt-color-foreground-critical)' }
}

function scenarioChannel(channel, index) {
  if (channel === 'Voice only') return 'Voice'
  if (channel === 'Digital only') return 'Digital'
  return index % 2 === 0 ? 'Voice' : 'Digital'
}

export function buildTestResult(scenarios, channel) {
  const total = scenarios.length
  const maxFails = Math.floor(total * 0.14)
  const failIds = new Set(
    [...scenarios].sort(() => Math.random() - 0.5).slice(0, maxFails).map((scenario) => scenario.id),
  )
  const passed = total - failIds.size
  const percentage = Math.round((passed / total) * 100)
  const tone = statusFor(percentage)
  const now = new Date()
  return {
    id: `run-${now.getTime()}`,
    ...tone,
    completion: passed,
    total,
    percentage,
    date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    isNew: true,
    channels: channel === 'Digital only' ? ['Digital'] : channel === 'Voice only' ? ['Voice'] : ['Voice', 'Digital'],
    description: synopsis(percentage, channel),
    scenarios: scenarios.map((scenario, index) => {
      const pass = !failIds.has(scenario.id)
      return {
        id: scenario.id,
        scenario: scenario.description,
        details: pass
          ? `The agent handled this cleanly: ${scenario.description.charAt(0).toLowerCase()}${scenario.description.slice(1)}.`
          : 'The agent lost the thread and could not finish the request.',
        channel: scenarioChannel(channel, index),
        passFail: pass ? 'Pass' : 'Fail',
        skills: scenario.skills.map((name) => ({ name, passed: pass })),
        difficulty: scenario.complexity === 'Complex' ? 'Hard' : scenario.complexity === 'Medium' ? 'Medium' : 'Easy',
      }
    }),
  }
}

function seedResult(partial) {
  const tone = statusFor(partial.percentage)
  return { isNew: false, ...tone, ...partial }
}

export function seedResults() {
  return [
    seedResult({
      id: 'seed-1',
      completion: 11,
      total: 12,
      percentage: 92,
      date: 'November 2, 2026',
      channels: ['Voice', 'Digital'],
      description: 'Strong performance across order status and appointment scheduling. Tone stayed consistent on both channels.',
      scenarios: [
        { id: '1', scenario: 'Customer asks where an order is', details: 'The agent confirmed the package is out for delivery today.', channel: 'Voice', passFail: 'Pass', skills: [{ name: 'Track delivery', passed: true }, { name: 'Order status', passed: true }], difficulty: 'Easy' },
        { id: '2', scenario: 'Caller wants to reschedule a visit', details: 'The agent found a new slot and sent a confirmation.', channel: 'Digital', passFail: 'Pass', skills: [{ name: 'Appointment Scheduling', passed: true }], difficulty: 'Medium' },
        { id: '3', scenario: 'Customer asks about a restocking fee', details: 'The agent quoted the policy and offered a return label.', channel: 'Voice', passFail: 'Pass', skills: [{ name: 'Policy Explanation', passed: true }, { name: 'Return item', passed: true }], difficulty: 'Medium' },
        { id: '4', scenario: 'User disputes a duplicate charge', details: 'The agent could not locate the second invoice and stopped short of a resolution.', channel: 'Digital', passFail: 'Fail', skills: [{ name: 'Billing Inquiry', passed: false }], difficulty: 'Hard' },
      ],
    }),
    seedResult({
      id: 'seed-2',
      completion: 8,
      total: 10,
      percentage: 80,
      date: 'October 28, 2026',
      channels: ['Voice'],
      description: 'Solid on routine voice tasks. Complex billing questions still slip.',
      scenarios: [
        { id: '1', scenario: 'Caller asks for store hours', details: 'The agent answered from the knowledge base.', channel: 'Voice', passFail: 'Pass', skills: [{ name: 'Knowledge Retrieval', passed: true }], difficulty: 'Easy' },
        { id: '2', scenario: 'Customer wants a same-day callback', details: 'The agent booked the callback and read it back.', channel: 'Voice', passFail: 'Pass', skills: [{ name: 'Appointment Scheduling', passed: true }], difficulty: 'Easy' },
        { id: '3', scenario: 'Caller asks to waive a late fee', details: 'The agent explained the policy but could not apply an exception.', channel: 'Voice', passFail: 'Fail', skills: [{ name: 'Billing Inquiry', passed: false }, { name: 'Policy Explanation', passed: false }], difficulty: 'Hard' },
        { id: '4', scenario: 'User checks a return window', details: 'The agent confirmed the item is still eligible.', channel: 'Voice', passFail: 'Pass', skills: [{ name: 'Return item', passed: true }], difficulty: 'Medium' },
      ],
    }),
    seedResult({
      id: 'seed-3',
      completion: 5,
      total: 9,
      percentage: 56,
      date: 'October 21, 2026',
      channels: ['Digital'],
      description: 'Basic digital questions passed. Multi-step returns and billing failed often enough to miss the bar.',
      scenarios: [
        { id: '1', scenario: 'Customer asks for a password reset link', details: 'The agent sent the reset link.', channel: 'Digital', passFail: 'Pass', skills: [{ name: 'Knowledge Retrieval', passed: true }], difficulty: 'Easy' },
        { id: '2', scenario: 'User wants to return two items from one order', details: 'The agent created a label for only one item.', channel: 'Digital', passFail: 'Fail', skills: [{ name: 'Return item', passed: false }], difficulty: 'Hard' },
        { id: '3', scenario: 'Customer asks why a refund is pending', details: 'The agent described the timeline correctly.', channel: 'Digital', passFail: 'Pass', skills: [{ name: 'Billing Inquiry', passed: true }], difficulty: 'Medium' },
        { id: '4', scenario: 'User asks to change a delivery address mid-route', details: 'The agent could not reach the carrier tool.', channel: 'Digital', passFail: 'Fail', skills: [{ name: 'Track delivery', passed: false }], difficulty: 'Hard' },
      ],
    }),
  ]
}

const store = reactive({ agents: {} })

export function testingFor(agentId) {
  if (!store.agents[agentId]) {
    store.agents[agentId] = {
      results: seedResults(),
      scenarios: [],
      selected: [],
      channel: 'Select channels',
    }
  }
  return store.agents[agentId]
}

export const channelChoices = CHANNELS
