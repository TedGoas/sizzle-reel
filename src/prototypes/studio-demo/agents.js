export const agents = [
  {
    id: 1,
    name: 'Aerolabs Delivery Agent',
    locale: 'English US',
    group: 'Sales Center',
    additionalGroups: '',
    resolutionRate: '74.5%',
    usage: 145,
    sparkline: '0,18 10,12 20,15 30,8 40,14 50,10 60,6',
    type: 'Agentic',
    status: 'Published',
  },
  {
    id: 2,
    name: 'Customer Support Agent',
    locale: 'English US',
    group: 'North Sales Center',
    additionalGroups: '+4 more',
    resolutionRate: '88%',
    usage: 126,
    sparkline: '0,10 10,8 20,12 30,6 40,14 50,11 60,9',
    type: 'Agentic',
    status: 'Published',
  },
  {
    id: 3,
    name: 'Sales Assistant Agent',
    locale: 'English US',
    group: 'North Sales Center',
    additionalGroups: '+4 more',
    resolutionRate: '25%',
    usage: 122,
    sparkline: '0,16 10,14 20,18 30,12 40,10 50,15 60,13',
    type: 'Agentic',
    status: 'Published',
  },
  {
    id: 4,
    name: 'Technical Support Agent',
    locale: 'English US',
    group: 'Aerolabs hello',
    additionalGroups: '',
    resolutionRate: '82.5%',
    usage: 80,
    sparkline: '0,12 10,11 20,13 30,12 40,11 50,12 60,11',
    type: 'Generative',
    status: 'Published',
  },
]

export const suggestionChips = [
  'AI Receptionist',
  'Scheduling Assistant',
  'Recruiting Agent',
  'Account Manager',
  'CRM Buddy',
  'Sales Support Agent',
]

export const canvasDescriptions = {
  'AI Receptionist': 'Greets callers professionally, routes to the right team, and captures messages when agents are unavailable.',
  'Scheduling Assistant': 'Books and manages appointments, sends reminders, and handles rescheduling requests automatically.',
  'Recruiting Agent': 'Screens candidates, schedules interviews, and keeps applicants informed throughout the hiring process.',
  'Account Manager': 'Handles account inquiries, processes service requests, and escalates complex issues to human agents.',
  'CRM Buddy': 'Keeps CRM data accurate by logging every interaction and syncing record updates in real time.',
  'Sales Support Agent': 'Qualifies inbound leads, delivers product information, and seamlessly hands off to human sales reps.',
}

export const receptionistSkills = [
  'Route Incoming Calls',
  'Take Messages',
  'Schedule Callbacks',
]

export const skillEditors = {
  'Route Incoming Calls': {
    description: '<p>Greets callers and intelligently routes them based on intent and department availability.</p>',
    instructions: [
      '<p><strong>Greet Caller</strong> — Answer the call with a professional greeting and introduce the organization by name.</p>',
      '<p><strong>Identify Intent</strong> — Ask an open-ended question to understand the caller’s purpose, then use <span class="connection-badge">Classify Intent</span> to match to a department.</p>',
      '<p><strong>Check Availability</strong> — Query <span class="connection-badge">Get Department Availability</span> to confirm the target queue has capacity.</p>',
      '<p><strong>Confirm Routing</strong> — Tell the caller where they’re being routed and the estimated wait time using <span class="connection-badge">Get Queue Wait Time</span>.</p>',
      '<p><strong>Transfer Call</strong> — Transfer with <span class="connection-badge connection-badge--transfer">Transfer to Contact Center</span>, including the caller’s intent.</p>',
      '<p><strong>Log Interaction</strong> — Record the outcome in <span class="connection-badge">Create Interaction Log</span>.</p>',
    ].join(''),
    guardrails: [
      '<p>Never share direct extension numbers or employee personal contact information.</p>',
      '<p>Always confirm the caller’s destination before completing a transfer.</p>',
      '<p>If the target department is unavailable, offer to take a message rather than leaving the caller on hold.</p>',
      '<p>Route by stated intent, not by caller identity or account status alone.</p>',
    ].join(''),
    labels: 'voice, inbound, routing, ivr',
    actions: 5,
  },
  'Take Messages': {
    description: '<p>Captures caller name, number, and message details for agent follow-up.</p>',
    instructions: [
      '<p><strong>Explain Unavailability</strong> — Let the caller know no agent is available and offer to take a message.</p>',
      '<p><strong>Collect Contact Info</strong> — Gather the caller’s name and callback number, then validate it with <span class="connection-badge">Validate Phone Number</span>.</p>',
      '<p><strong>Capture Message</strong> — Ask them to describe why they’re calling and record it.</p>',
      '<p><strong>Confirm Details</strong> — Read back the name, number, and message summary.</p>',
      '<p><strong>Log Message</strong> — Save it with <span class="connection-badge">Create Message Log</span> for the right department.</p>',
      '<p><strong>Notify Agent</strong> — Alert the team with <span class="connection-badge">Send Notification</span>.</p>',
    ].join(''),
    guardrails: [
      '<p>Never promise a specific callback time — only commit to passing the message along.</p>',
      '<p>Always read back contact information before ending the call.</p>',
      '<p>Do not record payment details or other sensitive information in the message.</p>',
      '<p>If the caller declines to leave a message, end politely and log the missed attempt.</p>',
    ].join(''),
    labels: 'voice, messaging, voicemail',
    actions: 3,
  },
  'Schedule Callbacks': {
    description: '<p>Books callback time slots when live agents are busy or after-hours.</p>',
    instructions: [
      '<p><strong>Explain Callback Option</strong> — Offer a scheduled callback instead of waiting on hold.</p>',
      '<p><strong>Collect Preferences</strong> — Ask for a preferred date, time window, and timezone.</p>',
      '<p><strong>Check Agent Availability</strong> — Query <span class="connection-badge">Get Agent Availability</span> for matching slots.</p>',
      '<p><strong>Present Options</strong> — Offer up to three times within business hours.</p>',
      '<p><strong>Confirm Booking</strong> — Book the choice with <span class="connection-badge">Create Callback</span> and repeat the details.</p>',
      '<p><strong>Send Reminder</strong> — Confirm by <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span>.</p>',
    ].join(''),
    guardrails: [
      '<p>Only offer callback slots within confirmed business hours.</p>',
      '<p>Never guarantee a specific agent unless one is explicitly assigned.</p>',
      '<p>If the preferred time is unavailable, offer the closest alternative.</p>',
      '<p>Always send a written confirmation in addition to the verbal one.</p>',
    ].join(''),
    labels: 'voice, scheduling, callbacks',
    actions: 4,
  },
  'Reschedule Appointments': {
    description: '<p>Moves an existing booking to a new time and sends a confirmation email.</p>',
    instructions: [
      '<p><strong>Retrieve Appointment</strong> — Look up the customer’s existing booking using <span class="connection-badge">Get Appointment Details</span>.</p>',
      '<p><strong>Show Available Slots</strong> — Query <span class="connection-badge">Check Calendar Availability</span> and offer up to three open times.</p>',
      '<p><strong>Confirm the New Time</strong> — Read the chosen slot back and ask the customer to confirm before anything changes.</p>',
      '<p><strong>Update the Appointment</strong> — Move the booking with <span class="connection-badge">Update Appointment</span> and free the original slot.</p>',
      '<p><strong>Send Confirmation</strong> — Deliver the new time via <span class="connection-badge">Send Email</span> with the updated details.</p>',
    ].join(''),
    guardrails: '',
    labels: 'scheduling, appointments, reschedule',
    actions: 5,
  },
  'Handle Cancellations': {
    description: '<p>Confirms the purchase is inside the cancellation window and eligible, then completes or declines it.</p>',
    instructions: [
      '<p><strong>Confirm the Purchase</strong> — Ask which order they want to cancel and restate the item before anything changes.</p>',
      '<p><strong>Check the Window</strong> — Use <span class="connection-badge">Check Cancellation Policy</span> to confirm the purchase is still inside the cancellation window.</p>',
      '<p><strong>Check Eligibility</strong> — Use <span class="connection-badge">Check Product Eligibility</span> to confirm what they bought can be cancelled.</p>',
      '<p><strong>Cancel or Decline</strong> — If both checks pass, cancel it with <span class="connection-badge">Cancel Order</span>. If either fails, explain why and leave the order unchanged.</p>',
      '<p><strong>Confirm the Result</strong> — Repeat what happened and what the customer should expect next.</p>',
    ].join(''),
    guardrails: [
      '<p>Never cancel a purchase that is outside the cancellation window.</p>',
      '<p>Never cancel an item that is not eligible for cancellation.</p>',
      '<p>Confirm the specific purchase with the customer before cancelling it.</p>',
    ].join(''),
    labels: 'cancellations, orders, policy',
    actions: 3,
  },
}

// Shown when someone asks what to add. The three ideas stay the same for every agent.
export const skillIdeas = [
  {
    name: 'Reschedule Appointments',
    detail: 'Let customers move existing bookings to different times without canceling and rebooking.',
  },
  {
    name: 'View Upcoming Appointments',
    detail: 'Customers can check their scheduled appointments and details at any time.',
  },
  {
    name: 'Send Confirmations',
    detail: 'Similar to reminders, but triggered immediately after booking for extra assurance.',
  },
]

export const skillAdviceHandles = {
  'AI Receptionist': 'routing calls, taking messages, and scheduling callbacks',
  'Scheduling Assistant': 'booking, reminders, and cancellations',
  'Recruiting Agent': 'screening candidates and scheduling interviews',
  'Account Manager': 'account questions, requests, and escalations',
  'CRM Buddy': 'logging interactions and updating records',
  'Sales Support Agent': 'qualifying leads and handing off to sales',
}

export const skillAdviceClosing = "Which sounds most useful for your use case, or did you have something else in mind?"

export const chipPrompts = {
  'AI Receptionist': 'An AI receptionist that answers incoming calls, greets callers professionally, routes them to the right department, and takes messages when no agents are available.',
  'Scheduling Assistant': 'A scheduling assistant that books appointments, sends automated reminders to customers, and handles rescheduling or cancellation requests.',
  'Recruiting Agent': 'A recruiting agent that pre-screens job applicants with qualifying questions and schedules interviews with the hiring team.',
  'Account Manager': 'An account manager that handles customer inquiries, processes account changes, and escalates complex issues to the right team.',
  'CRM Buddy': 'A CRM assistant that logs every customer interaction automatically and keeps contact records and deal stages up to date.',
  'Sales Support Agent': 'A sales support agent that qualifies inbound leads, answers product questions, and hands off warm prospects to a human sales rep.',
}
