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
        skills: scenario.skills.map((name, skillIndex) => ({ name, passed: pass || skillIndex !== 0 })),
        difficulty: scenario.complexity === 'Complex' ? 'Hard' : scenario.complexity === 'Medium' ? 'Medium' : 'Easy',
      }
    }),
  }
}

function seedResult(partial) {
  const tone = statusFor(partial.percentage)
  return { isNew: false, ...tone, ...partial }
}

function scenarioRow(index, scenario, details, channel, pass, skills, difficulty) {
  return {
    id: String(index + 1),
    scenario,
    details,
    channel,
    passFail: pass ? 'Pass' : 'Fail',
    skills: skills.map((name, skillIndex) => ({ name, passed: pass || skillIndex !== 0 })),
    difficulty,
  }
}

function makeRun(id, date, channels, description, defs) {
  const scenarios = defs.map((def, index) => scenarioRow(index, ...def))
  const total = scenarios.length
  const completion = scenarios.filter((row) => row.passFail === 'Pass').length
  return seedResult({
    id,
    date,
    channels,
    description,
    scenarios,
    completion,
    total,
    percentage: Math.round((completion / total) * 100),
  })
}

export function seedResults() {
  return [
    makeRun('seed-1', 'November 2, 2026', ['Voice', 'Digital'], 'Strong performance across order status and appointment scheduling. Tone stayed consistent on both channels.', [
      ['Customer asks where an order is', 'The agent confirmed the package is out for delivery today.', 'Voice', true, ['Track delivery', 'Order status'], 'Easy'],
      ['Caller wants to reschedule a visit', 'The agent found a new slot and sent a confirmation.', 'Digital', true, ['Appointment Scheduling'], 'Medium'],
      ['Customer asks about a restocking fee', 'The agent quoted the policy and offered a return label.', 'Voice', true, ['Policy Explanation', 'Return item'], 'Medium'],
      ['User disputes a duplicate charge', 'The agent could not locate the second invoice and stopped short of a resolution.', 'Digital', false, ['Billing Inquiry'], 'Hard'],
      ['Caller asks for store hours on Sunday', 'The agent read the weekend hours from the knowledge base.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Customer wants a same-day delivery window', 'The agent offered the remaining afternoon slots and booked one.', 'Digital', true, ['Track delivery', 'Appointment Scheduling'], 'Medium'],
      ['User asks to add a gate code to a delivery', 'The agent saved the code on the open order.', 'Voice', true, ['Order status'], 'Easy'],
      ['Caller wants the status of an open return', 'The agent found the return and said the refund posts in three days.', 'Digital', true, ['Return item'], 'Medium'],
      ['Customer asks which size runs large', 'The agent recommended the usual size from the product notes.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['User wants to book two fittings in one visit', 'The agent reserved a longer slot and confirmed both services.', 'Digital', true, ['Appointment Scheduling', 'Calendar Coordination'], 'Hard'],
      ['Caller asks to update a phone number', 'The agent verified the account and saved the new number.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Customer asks why a promo code failed', 'The agent explained the code expired yesterday and offered the current one.', 'Digital', true, ['Policy Explanation', 'Billing Inquiry'], 'Medium'],
      ['User asks for the nearest pickup point', 'The agent listed the two closest locations and their hours.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Caller wants a damaged item replaced', 'The agent started a replacement and emailed the label.', 'Digital', true, ['Return item', 'Order status'], 'Hard'],
    ]),
    makeRun('seed-2', 'October 28, 2026', ['Voice'], 'Solid on routine voice tasks. Complex billing questions still slip.', [
      ['Caller asks for store hours', 'The agent answered from the knowledge base.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Customer wants a same-day callback', 'The agent booked the callback and read it back.', 'Voice', true, ['Appointment Scheduling'], 'Easy'],
      ['Caller asks to waive a late fee', 'The agent explained the policy but could not apply an exception.', 'Voice', false, ['Billing Inquiry', 'Policy Explanation'], 'Hard'],
      ['User checks a return window', 'The agent confirmed the item is still eligible.', 'Voice', true, ['Return item'], 'Medium'],
      ['Caller asks where a package is stuck', 'The agent named the local facility and the next scan window.', 'Voice', true, ['Track delivery'], 'Easy'],
      ['Customer wants to split a shipment', 'The agent could not create a second shipment from the voice flow.', 'Voice', false, ['Order status'], 'Hard'],
      ['User asks to move a fitting to Friday', 'The agent moved the appointment and sent a text confirmation.', 'Voice', true, ['Appointment Scheduling', 'Calendar Coordination'], 'Medium'],
      ['Caller asks about a restocking fee', 'The agent quoted the fee and when it is waived.', 'Voice', true, ['Policy Explanation'], 'Medium'],
      ['Customer disputes a shipping charge', 'The agent found the charge but could not issue the credit.', 'Voice', false, ['Billing Inquiry'], 'Hard'],
      ['User asks for the order total', 'The agent read the item, tax, and shipping lines.', 'Voice', true, ['Order status', 'Billing Inquiry'], 'Easy'],
      ['Caller wants to cancel a pickup', 'The agent cancelled the pickup and confirmed the new plan.', 'Voice', true, ['Appointment Scheduling'], 'Easy'],
      ['Customer asks if a jacket is waterproof', 'The agent answered from the product notes.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['User asks to change a delivery address', 'The agent updated the address before the carrier scan.', 'Voice', true, ['Track delivery', 'Order status'], 'Medium'],
    ]),
    makeRun('seed-3', 'October 21, 2026', ['Digital'], 'Basic digital questions passed. Multi-step returns and billing failed often enough to miss the bar.', [
      ['Customer asks for a password reset link', 'The agent sent the reset link.', 'Digital', true, ['Knowledge Retrieval'], 'Easy'],
      ['User wants to return two items from one order', 'The agent created a label for only one item.', 'Digital', false, ['Return item'], 'Hard'],
      ['Customer asks why a refund is pending', 'The agent described the timeline correctly.', 'Digital', true, ['Billing Inquiry'], 'Medium'],
      ['User asks to change a delivery address mid-route', 'The agent could not reach the carrier tool.', 'Digital', false, ['Track delivery'], 'Hard'],
      ['Customer asks for store hours', 'The agent posted the weekday and weekend hours.', 'Digital', true, ['Knowledge Retrieval'], 'Easy'],
      ['User wants to exchange a size', 'The agent reserved the new size but never created the return.', 'Digital', false, ['Return item', 'Order status'], 'Hard'],
      ['Customer asks where an order is', 'The agent shared the latest tracking scan.', 'Digital', true, ['Track delivery', 'Order status'], 'Easy'],
      ['User disputes a duplicate charge', 'The agent could not tell the two charges apart.', 'Digital', false, ['Billing Inquiry'], 'Hard'],
      ['Customer asks about a cancellation policy', 'The agent quoted the window and the fee.', 'Digital', true, ['Policy Explanation'], 'Medium'],
      ['User wants a callback tomorrow morning', 'The agent booked 9:30 and repeated it.', 'Digital', true, ['Appointment Scheduling'], 'Easy'],
      ['Customer asks to apply a promo after checkout', 'The agent could not reopen the paid order.', 'Digital', false, ['Billing Inquiry', 'Policy Explanation'], 'Hard'],
      ['User asks which items are final sale', 'The agent listed the excluded categories.', 'Digital', true, ['Policy Explanation', 'Knowledge Retrieval'], 'Medium'],
      ['Customer wants to add a delivery note', 'The agent saved the note on the shipment.', 'Digital', true, ['Order status'], 'Easy'],
      ['User asks to reroute a package to a store', 'The agent lost the reroute request after the first confirmation.', 'Digital', false, ['Track delivery', 'Appointment Scheduling'], 'Hard'],
    ]),
    makeRun('seed-4', 'October 14, 2026', ['Digital'], 'A clean digital pass. One hard billing exception is the only miss.', [
      ['Customer asks for an order receipt', 'The agent emailed the receipt to the account address.', 'Digital', true, ['Order status', 'Billing Inquiry'], 'Easy'],
      ['User wants to book a styling appointment', 'The agent reserved Thursday at 4 and sent the calendar invite.', 'Digital', true, ['Appointment Scheduling', 'Calendar Coordination'], 'Medium'],
      ['Customer asks if a return is still in the window', 'The agent confirmed six days remain.', 'Digital', true, ['Return item', 'Policy Explanation'], 'Easy'],
      ['User asks to track two packages', 'The agent listed both scans in one reply.', 'Digital', true, ['Track delivery'], 'Medium'],
      ['Customer asks for the sizing chart', 'The agent summarized the chart for the product.', 'Digital', true, ['Knowledge Retrieval'], 'Easy'],
      ['User wants to update an email address', 'The agent verified the account and saved the new email.', 'Digital', true, ['Knowledge Retrieval'], 'Easy'],
      ['Customer asks about a damaged shipment', 'The agent opened a replacement and shared the new tracking number.', 'Digital', true, ['Return item', 'Order status'], 'Hard'],
      ['User asks to cancel an unshipped order', 'The agent cancelled it and confirmed the refund timing.', 'Digital', true, ['Order status', 'Billing Inquiry'], 'Medium'],
      ['Customer asks for weekend hours', 'The agent answered from the knowledge base.', 'Digital', true, ['Knowledge Retrieval'], 'Easy'],
      ['User wants a later delivery window', 'The agent moved the window to 4–7pm.', 'Digital', true, ['Track delivery', 'Appointment Scheduling'], 'Medium'],
      ['Customer asks why tax looks high', 'The agent could not break the tax lines out of the invoice.', 'Digital', false, ['Billing Inquiry'], 'Hard'],
      ['User asks to save a pickup for Friday', 'The agent booked the pickup and sent a reminder.', 'Digital', true, ['Appointment Scheduling'], 'Easy'],
    ]),
    makeRun('seed-5', 'October 7, 2026', ['Voice', 'Digital'], 'Routine questions passed on both channels. Multi-item returns and fee exceptions still need work.', [
      ['Caller asks where an order is', 'The agent confirmed it left the warehouse this morning.', 'Voice', true, ['Track delivery', 'Order status'], 'Easy'],
      ['User wants to reschedule a delivery', 'The agent moved it to Thursday and read the window back.', 'Digital', true, ['Appointment Scheduling', 'Track delivery'], 'Medium'],
      ['Customer asks to return three items', 'The agent created labels for two items and dropped the third.', 'Voice', false, ['Return item'], 'Hard'],
      ['User asks about a late fee', 'The agent explained the fee but could not waive it.', 'Digital', false, ['Billing Inquiry', 'Policy Explanation'], 'Hard'],
      ['Caller asks for the return address', 'The agent read the warehouse address slowly.', 'Voice', true, ['Return item', 'Knowledge Retrieval'], 'Easy'],
      ['Customer wants to know if a color is in stock', 'The agent checked inventory and named the available sizes.', 'Digital', true, ['Knowledge Retrieval', 'Order status'], 'Medium'],
      ['User asks to book a repair drop-off', 'The agent reserved a Saturday morning slot.', 'Voice', true, ['Appointment Scheduling'], 'Easy'],
      ['Caller asks to change a shipping speed', 'The agent upgraded the shipment and confirmed the new arrival date.', 'Digital', true, ['Track delivery', 'Order status'], 'Medium'],
      ['Customer disputes a missing discount', 'The agent found the code but could not reprice the order.', 'Voice', false, ['Billing Inquiry'], 'Hard'],
      ['User asks for appointment confirmation details', 'The agent repeated the time, place, and what to bring.', 'Digital', true, ['Appointment Scheduling', 'Knowledge Retrieval'], 'Easy'],
      ['Caller asks to cancel and rebook the same day', 'The agent freed the old slot and booked 3pm.', 'Voice', true, ['Appointment Scheduling', 'Calendar Coordination'], 'Hard'],
      ['Customer asks about office location', 'The agent shared the address and parking note.', 'Digital', true, ['Knowledge Retrieval'], 'Easy'],
      ['User wants to update contact information', 'The agent saved the new phone number after a confirmation.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Caller asks for a price match', 'The agent described the policy and stopped before applying it.', 'Digital', false, ['Policy Explanation', 'Billing Inquiry'], 'Hard'],
      ['Customer asks for a delivery photo', 'The agent pulled the photo from the latest scan.', 'Voice', true, ['Track delivery'], 'Medium'],
    ]),
    makeRun('seed-6', 'September 30, 2026', ['Voice'], 'Early voice run. Simple lookups passed, and most multi-step requests failed.', [
      ['Caller asks for store hours', 'The agent answered from the knowledge base.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Customer asks where an order is', 'The agent shared the latest scan.', 'Voice', true, ['Track delivery'], 'Easy'],
      ['Caller wants to reschedule a visit', 'The agent offered times but never booked one.', 'Voice', false, ['Appointment Scheduling'], 'Medium'],
      ['User disputes a duplicate charge', 'The agent could not find the second invoice.', 'Voice', false, ['Billing Inquiry'], 'Hard'],
      ['Caller asks about a cancellation policy', 'The agent quoted the window correctly.', 'Voice', true, ['Policy Explanation'], 'Easy'],
      ['Customer wants to return an item', 'The agent started the return and then lost the order number.', 'Voice', false, ['Return item'], 'Medium'],
      ['User asks to book multiple appointments', 'The agent booked only the first visit.', 'Voice', false, ['Appointment Scheduling', 'Calendar Coordination'], 'Hard'],
      ['Caller asks for a password reset', 'The agent sent the reset link by text.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Customer asks to change a delivery address', 'The agent could not reach the carrier tool.', 'Voice', false, ['Track delivery', 'Order status'], 'Hard'],
      ['User asks about wait times', 'The agent gave the current queue estimate.', 'Voice', true, ['Knowledge Retrieval'], 'Easy'],
      ['Caller wants an emergency appointment', 'The agent described the policy and did not offer a slot.', 'Voice', false, ['Appointment Scheduling', 'Policy Explanation'], 'Hard'],
      ['Customer asks for a refund status', 'The agent could not tell a pending refund from a posted one.', 'Voice', false, ['Billing Inquiry', 'Return item'], 'Medium'],
    ]),
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
