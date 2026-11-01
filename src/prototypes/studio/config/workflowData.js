export const builderSteps = ['Define Skill', 'Build Workflow', 'Add Logic', 'Test & Deploy']

export const workflowSteps = [
  {
    type: 'trigger',
    title: 'Customer asks about appointment',
    description: 'Detects when customer wants to schedule or modify appointments'
  },
  {
    type: 'action',
    title: 'Check calendar availability',
    description: 'Query the calendar system for available time slots'
  },
  {
    type: 'response',
    title: 'Provide confirmation',
    description: 'Send appointment details and confirmation to customer'
  }
]

export const logicRules = [
  { enabled: true, label: 'If no availability, suggest alternative times' },
  { enabled: true, label: 'Confirm appointment details before booking' },
  { enabled: false, label: 'Send SMS confirmation after scheduling' }
]

export const testScenarios = [
  {
    id: 1,
    name: 'Schedule new appointment',
    description: 'Customer requests to book an appointment for next week',
    status: 'not-started'
  },
  {
    id: 2,
    name: 'Handle no availability',
    description: 'Customer requests time slot that is unavailable',
    status: 'not-started'
  },
  {
    id: 3,
    name: 'Reschedule existing appointment',
    description: 'Customer needs to change their existing appointment time',
    status: 'not-started'
  }
]
