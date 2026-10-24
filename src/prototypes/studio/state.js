import { reactive } from 'vue'
import { agents } from './config/agentsData.js'
import { AEROLABS } from './config/aerolabsData.js'

// Agent templates (non-reactive) — fallback for createAgentFromPrompt when Claude is unavailable
const agentTemplates = {
  'AI Receptionist': {
    name: 'AI Receptionist',
    description: 'Greets callers professionally, routes to the right team, and captures messages when agents are unavailable.',
    skills: [
      {
        name: 'Route Incoming Calls',
        description: 'Greets callers and intelligently routes them based on intent and department availability.',
        instructions: `<p><strong>Greet Caller</strong> — Answer the call with a professional greeting and introduce the organization by name.</p>
<p><strong>Identify Intent</strong> — Ask an open-ended question to understand the caller's purpose, then use <span class="connection-badge">Classify Intent</span> to match to a department.</p>
<p><strong>Check Availability</strong> — Query <span class="connection-badge">Get Department Availability</span> to confirm the target queue has capacity.</p>
<p><strong>Confirm Routing</strong> — Inform the caller of where they're being routed and the estimated wait time using <span class="connection-badge">Get Queue Wait Time</span>.</p>
<p><strong>Transfer Call</strong> — Execute the transfer using <span class="connection-badge connection-badge--transfer">Transfer to Contact Center</span> with full context and caller intent attached.</p>
<p><strong>Log Interaction</strong> — Record the routing outcome in <span class="connection-badge">Create Interaction Log</span> for quality assurance.</p>`,
        guardrails: `<p>Never share direct extension numbers or employee personal contact information.</p>
<p>Always confirm the caller's destination before completing a transfer.</p>
<p>If the target department is unavailable, offer to take a message rather than leaving the caller on hold indefinitely.</p>
<p>Do not make routing decisions based on caller identity or account status alone — route by stated intent.</p>`,
        labels: 'voice, inbound, routing, ivr',
        actionCount: 5,
      },
      {
        name: 'Take Messages',
        description: 'Captures caller name, number, and message details for agent follow-up.',
        instructions: `<p><strong>Explain Unavailability</strong> — Inform the caller that no agent is available and offer to take a message on their behalf.</p>
<p><strong>Collect Contact Info</strong> — Gather the caller's full name and best callback number, then validate the number format using <span class="connection-badge">Validate Phone Number</span>.</p>
<p><strong>Capture Message</strong> — Ask the caller to briefly describe their reason for calling and record verbatim where appropriate.</p>
<p><strong>Confirm Details</strong> — Read back the caller's name, number, and message summary to confirm accuracy.</p>
<p><strong>Log Message</strong> — Save the message record using <span class="connection-badge">Create Message Log</span> tagged to the appropriate department.</p>
<p><strong>Notify Agent</strong> — Send an alert to the assigned team via <span class="connection-badge">Send Notification</span> so the message is actioned promptly.</p>`,
        guardrails: `<p>Never promise a specific callback time — only commit to passing the message along.</p>
<p>Always verify and read back contact information before ending the call.</p>
<p>Do not record sensitive information such as payment details in message logs.</p>
<p>If a caller declines to leave a message, end the interaction politely and log the missed contact attempt.</p>`,
        labels: 'voice, messaging, voicemail',
        actionCount: 3,
      },
      {
        name: 'Schedule Callbacks',
        description: 'Books callback time slots when live agents are busy or after-hours.',
        instructions: `<p><strong>Explain Callback Option</strong> — Offer the caller a scheduled callback as an alternative to waiting on hold.</p>
<p><strong>Collect Preferences</strong> — Ask for the caller's preferred callback date and time window, and confirm their timezone.</p>
<p><strong>Check Agent Availability</strong> — Query <span class="connection-badge">Get Agent Availability</span> to find open callback slots that match the caller's preference.</p>
<p><strong>Present Options</strong> — Offer up to three available time slots within business hours and let the caller choose.</p>
<p><strong>Confirm Booking</strong> — Book the selected slot using <span class="connection-badge">Create Callback</span> and confirm the appointment details.</p>
<p><strong>Send Reminder</strong> — Deliver a confirmation via <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span> with the callback time and agent name.</p>`,
        guardrails: `<p>Only offer callback slots within confirmed business hours — never schedule outside operating times.</p>
<p>Never guarantee a specific agent will perform the callback unless explicitly assigned.</p>
<p>If the caller's preferred time has no availability, offer the closest available alternative.</p>
<p>Always send a written confirmation — do not rely on verbal confirmation alone.</p>`,
        labels: 'voice, scheduling, callbacks',
        actionCount: 4,
      },
    ],
  },

  'Scheduling Assistant': {
    name: 'Scheduling Assistant',
    description: 'Books and manages appointments, sends reminders, and handles rescheduling requests automatically.',
    skills: [
      {
        name: 'Book Appointments',
        description: 'Checks availability and books appointments based on customer preferences.',
        instructions: `<p><strong>Collect Details</strong> — Gather the appointment purpose, preferred date and time, and any special requirements from the customer.</p>
<p><strong>Check Availability</strong> — Query <span class="connection-badge">Check Calendar Availability</span> for open slots that match the customer's preferences.</p>
<p><strong>Present Options</strong> — Offer up to three available time slots; let the customer select their preferred option.</p>
<p><strong>Gather Attendee Info</strong> — Confirm the customer's name, contact details, and any additional attendees.</p>
<p><strong>Create Appointment</strong> — Book the selected slot using <span class="connection-badge">Create Appointment</span> and assign the appropriate staff member.</p>
<p><strong>Send Confirmation</strong> — Deliver a booking confirmation via <span class="connection-badge">Send Email</span> and <span class="connection-badge">Send SMS</span> with date, time, location, and preparation instructions.</p>
<p><strong>Update CRM</strong> — Log the appointment in <span class="connection-badge">Update CRM Record</span> linked to the customer's profile.</p>`,
        guardrails: `<p>Never double-book a time slot — always verify availability immediately before confirming.</p>
<p>Respect business hours; only offer appointments within confirmed operating times.</p>
<p>Do not book appointments requiring specialist staff without confirming that staff member's availability.</p>
<p>Always send written confirmation — verbal booking alone is insufficient.</p>`,
        labels: 'scheduling, appointments, calendar',
        actionCount: 5,
      },
      {
        name: 'Send Reminders',
        description: 'Proactively sends confirmation and reminder messages ahead of scheduled appointments.',
        instructions: `<p><strong>Retrieve Upcoming Appointments</strong> — Query <span class="connection-badge">Get Upcoming Appointments</span> for bookings within the next 24–48 hours.</p>
<p><strong>Check Contact Preferences</strong> — Retrieve the customer's preferred notification channel using <span class="connection-badge">Get Contact Preferences</span>.</p>
<p><strong>Compose Reminder</strong> — Generate a personalized reminder including appointment time, location, staff name, and any preparation notes.</p>
<p><strong>Send Reminder</strong> — Deliver via <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span> based on the customer's preferred channel.</p>
<p><strong>Log Reminder</strong> — Record the reminder sent status in <span class="connection-badge">Update Appointment Record</span> for audit purposes.</p>
<p><strong>Handle Responses</strong> — If the customer replies to confirm or cancel, update the appointment status via <span class="connection-badge">Update Appointment Status</span> and route cancellations to Handle Cancellations skill.</p>`,
        guardrails: `<p>Only send reminders through the customer's preferred channel — respect opt-out lists.</p>
<p>Do not send reminders outside of permitted contact hours (e.g., no SMS after 9 PM local time).</p>
<p>Never include sensitive medical, financial, or personal details in reminder messages.</p>
<p>If the reminder delivery fails, log the failure and alert the appropriate team to follow up manually.</p>`,
        labels: 'scheduling, reminders, notifications',
        actionCount: 4,
      },
      {
        name: 'Handle Cancellations',
        description: 'Processes cancellation requests and offers alternative time slots.',
        instructions: `<p><strong>Verify Appointment</strong> — Confirm the appointment to be cancelled using <span class="connection-badge">Get Appointment Details</span> by customer ID or booking reference.</p>
<p><strong>Check Cancellation Policy</strong> — Validate whether the cancellation is within the allowed window using <span class="connection-badge connection-badge--workflow">Cancel Policy</span> workflow.</p>
<p><strong>Process Cancellation</strong> — Cancel the appointment using <span class="connection-badge">Cancel Appointment</span> and free the slot for other bookings.</p>
<p><strong>Apply Fees if Applicable</strong> — If the cancellation is outside the free window, apply the appropriate fee through <span class="connection-badge">Apply Cancellation Fee</span>.</p>
<p><strong>Offer Reschedule</strong> — Proactively offer available alternative times using <span class="connection-badge">Check Calendar Availability</span> before closing the interaction.</p>
<p><strong>Send Confirmation</strong> — Deliver a cancellation confirmation via <span class="connection-badge">Send Email</span> including any fee details and reschedule options.</p>`,
        guardrails: `<p>Always enforce the published cancellation policy — do not waive fees without manager approval.</p>
<p>Offer a reschedule option before fully closing a cancellation interaction.</p>
<p>Never cancel an appointment without sending written confirmation to the customer.</p>
<p>If an appointment has associated pre-payments or deposits, escalate the refund to the billing team rather than processing it directly.</p>`,
        labels: 'scheduling, cancellations, policy',
        actionCount: 5,
      },
    ],
  },

  'Recruiting Agent': {
    name: 'Recruiting Agent',
    description: 'Screens candidates, schedules interviews, and keeps applicants informed throughout the hiring process.',
    skills: [
      {
        name: 'Screen Candidates',
        description: 'Asks qualifying questions to assess candidate fit before advancing.',
        instructions: `<p><strong>Retrieve Job Requirements</strong> — Pull the active job posting and required qualifications using <span class="connection-badge">Get Job Requirements</span>.</p>
<p><strong>Introduce the Process</strong> — Greet the candidate and explain the screening format, expected duration, and next steps.</p>
<p><strong>Ask Qualifying Questions</strong> — Work through the structured screening questions covering experience, skills, and availability based on the role requirements.</p>
<p><strong>Evaluate Responses</strong> — Score answers using <span class="connection-badge">Evaluate Candidate</span> against minimum qualifications and knockout criteria.</p>
<p><strong>Log Screening Result</strong> — Record the candidate's responses and score in the ATS using <span class="connection-badge">Log Screening Result</span>.</p>
<p><strong>Communicate Next Steps</strong> — Inform the candidate of the outcome — advance to interview scheduling or send a polite decline via <span class="connection-badge">Send Candidate Email</span>.</p>`,
        guardrails: `<p>Never ask questions about protected characteristics including age, race, religion, national origin, gender, disability, marital status, or family plans.</p>
<p>Apply the same screening questions consistently to all candidates for the same role to ensure EEOC compliance.</p>
<p>Do not make final hiring decisions — only advance or decline candidates; all final decisions remain with the hiring team.</p>
<p>Always inform candidates when data collected will be stored and how it will be used.</p>`,
        labels: 'HR, recruiting, screening, compliance',
        actionCount: 4,
      },
      {
        name: 'Schedule Interviews',
        description: 'Coordinates interview times across hiring managers and applicants.',
        instructions: `<p><strong>Retrieve Candidate Details</strong> — Pull the candidate's profile and role information from the ATS using <span class="connection-badge">Get Candidate Profile</span>.</p>
<p><strong>Check Interviewer Availability</strong> — Query <span class="connection-badge">Get Interviewer Availability</span> for open slots across all required interviewers.</p>
<p><strong>Propose Times</strong> — Present up to three options to the candidate that work for all interviewers, accounting for their timezone.</p>
<p><strong>Confirm Selection</strong> — Once the candidate selects a time, lock the slot using <span class="connection-badge">Reserve Interview Slot</span>.</p>
<p><strong>Create Calendar Invites</strong> — Send calendar invitations to all participants via <span class="connection-badge">Send Calendar Invite</span> with interview format, location/link, and preparation materials.</p>
<p><strong>Update ATS</strong> — Log the scheduled interview in <span class="connection-badge">Update ATS Record</span> and advance the candidate to the Interview stage.</p>`,
        guardrails: `<p>Always obtain confirmation from both the candidate and interviewers before finalizing the schedule.</p>
<p>Account for time zones when proposing interview times — clearly state the local time for each party.</p>
<p>If a proposed time is not accepted within 24 hours, follow up with alternative options rather than leaving the scheduling open.</p>
<p>Never share one interviewer's availability details with the candidate — only present confirmed options.</p>`,
        labels: 'HR, recruiting, interviews, scheduling',
        actionCount: 5,
      },
    ],
  },

  'Account Manager': {
    name: 'Account Manager',
    description: 'Handles account inquiries, processes service requests, and escalates complex issues to human agents.',
    skills: [
      {
        name: 'Account Lookup',
        description: 'Retrieves account details and current status for authenticated customers.',
        instructions: `<p><strong>Verify Identity</strong> — Authenticate the customer using multi-factor verification via <span class="connection-badge">Verify Identity</span> before accessing any account data.</p>
<p><strong>Retrieve Account</strong> — Pull the full account record using <span class="connection-badge">Get Account Details</span> including plan, status, and contact information.</p>
<p><strong>Retrieve Usage History</strong> — Query <span class="connection-badge">Get Usage History</span> to provide relevant account activity context.</p>
<p><strong>Check Billing Status</strong> — Retrieve current invoice and payment status using <span class="connection-badge">Get Billing Status</span>.</p>
<p><strong>Summarize Account</strong> — Present the account summary to the customer in clear, plain language covering plan, billing, and status.</p>
<p><strong>Log Inquiry</strong> — Record the account lookup interaction using <span class="connection-badge">Create Interaction Log</span> for audit compliance.</p>`,
        guardrails: `<p>Never share account details without completing full identity verification first — no exceptions.</p>
<p>Mask sensitive data in all responses — show only the last 4 digits of payment methods and partial account numbers.</p>
<p>Do not retain or log the customer's authentication credentials.</p>
<p>If verification fails after three attempts, end the session and advise the customer to contact support directly.</p>`,
        labels: 'account, lookup, authenticated, security',
        actionCount: 5,
      },
      {
        name: 'Handle Requests',
        description: 'Processes common account changes such as address, plan, or contact updates.',
        instructions: `<p><strong>Identify Request Type</strong> — Determine what the customer wants to change: address, email, phone, plan, or subscription preference.</p>
<p><strong>Validate Eligibility</strong> — Confirm the customer is authorized to make the requested change using <span class="connection-badge">Check Change Eligibility</span>.</p>
<p><strong>Collect New Information</strong> — Gather the updated details from the customer and validate format (e.g., address format, email syntax).</p>
<p><strong>Apply Change</strong> — Process the account update using <span class="connection-badge">Update Account Details</span>.</p>
<p><strong>Update CRM</strong> — Sync the change to the CRM record using <span class="connection-badge">Update CRM Record</span>.</p>
<p><strong>Send Confirmation</strong> — Deliver a change summary via <span class="connection-badge">Send Email</span> including what was changed, when, and a reference number.</p>`,
        guardrails: `<p>Only process changes for the verified account holder — never act on unverified third-party requests.</p>
<p>Log all account modifications with a timestamp, agent ID, and before/after values for audit compliance.</p>
<p>Escalate plan downgrades or cancellation requests to a human agent; do not process these autonomously.</p>
<p>Always send written confirmation of changes — do not rely on verbal acknowledgement alone.</p>`,
        labels: 'account, changes, requests, service',
        actionCount: 4,
      },
      {
        name: 'Escalate Issues',
        description: 'Identifies complex issues and transfers to the appropriate human team.',
        instructions: `<p><strong>Identify Escalation Trigger</strong> — Detect signals requiring human intervention: billing disputes, legal requests, account security concerns, or repeated unresolved issues.</p>
<p><strong>Summarize Context</strong> — Compile a full interaction summary including issue description, steps already taken, and customer sentiment using <span class="connection-badge">Generate Interaction Summary</span>.</p>
<p><strong>Identify Target Team</strong> — Determine the correct escalation queue (billing, technical, legal, retention) based on issue type.</p>
<p><strong>Check Agent Availability</strong> — Confirm an agent is available in the target queue using <span class="connection-badge">Get Agent Availability</span>.</p>
<p><strong>Transfer with Context</strong> — Execute the transfer via <span class="connection-badge connection-badge--transfer">Transfer to Contact Center</span> with the full context summary attached.</p>
<p><strong>Log Escalation</strong> — Record the escalation event in <span class="connection-badge">Create Escalation Record</span> with all context for quality review.</p>`,
        guardrails: `<p>Always provide the receiving agent with a complete summary — never transfer without context.</p>
<p>Do not attempt to resolve legal requests, account security breaches, or formal complaints autonomously.</p>
<p>If no agent is available, offer a callback rather than leaving the customer on hold without a timeline.</p>
<p>Never re-ask the customer for information already collected during the interaction.</p>`,
        labels: 'escalation, support, transfer, retention',
        actionCount: 5,
      },
    ],
  },

  'CRM Buddy': {
    name: 'CRM Buddy',
    description: 'Keeps CRM data accurate by logging every interaction and syncing record updates in real time.',
    skills: [
      {
        name: 'Log Interactions',
        description: 'Records call outcomes, notes, and follow-up actions in the CRM automatically.',
        instructions: `<p><strong>Capture Interaction Type</strong> — Identify the channel and nature of the interaction (inbound call, chat, email reply, etc.).</p>
<p><strong>Record Outcome</strong> — Note the resolution status: resolved, escalated, callback scheduled, or no resolution.</p>
<p><strong>Write Interaction Notes</strong> — Summarize the conversation key points clearly and concisely using plain language.</p>
<p><strong>Create Interaction Log</strong> — Save the complete record using <span class="connection-badge">Create Interaction Log</span> linked to the correct contact and account.</p>
<p><strong>Tag and Categorize</strong> — Apply relevant tags and category codes using <span class="connection-badge">Tag Contact</span> for reporting and segmentation.</p>
<p><strong>Assign Follow-up</strong> — If action is required, create a follow-up task using <span class="connection-badge">Create Follow-up Task</span> with due date and assigned owner.</p>`,
        guardrails: `<p>Never modify or overwrite an existing interaction log — always create a new record.</p>
<p>Include all relevant context, not just the outcome — partial logs reduce data quality.</p>
<p>Do not log sensitive personal or financial data in free-text fields; use structured fields for regulated data.</p>
<p>Always link the log to the correct contact record — verify the match before saving.</p>`,
        labels: 'CRM, logging, automation, data',
        actionCount: 4,
      },
      {
        name: 'Update Records',
        description: 'Syncs contact information and deal stage changes based on conversation context.',
        instructions: `<p><strong>Identify Changes Needed</strong> — Review the interaction to determine what CRM fields need updating (contact info, deal stage, tags, preferences).</p>
<p><strong>Retrieve Current Record</strong> — Pull the existing contact or account record using <span class="connection-badge">Get Contact Record</span> to verify current values.</p>
<p><strong>Validate Data Format</strong> — Check that new values are correctly formatted (e.g., phone with country code, valid email, ISO date format).</p>
<p><strong>Apply Updates</strong> — Write the changes to the CRM using <span class="connection-badge">Update Contact</span> or <span class="connection-badge">Update Deal Stage</span> as appropriate.</p>
<p><strong>Prevent Duplicates</strong> — Run <span class="connection-badge">Check Duplicate Records</span> before creating any new contacts to maintain data cleanliness.</p>
<p><strong>Sync Downstream Systems</strong> — Trigger a sync webhook using <span class="connection-badge">Send Webhook</span> to propagate updates to connected tools (email platform, billing, etc.).</p>`,
        guardrails: `<p>Validate all data before writing — invalid formats can corrupt downstream integrations.</p>
<p>Never create a new contact record without first checking for an existing match.</p>
<p>Log a change history entry for every field updated — include the before value, after value, and timestamp.</p>
<p>Do not overwrite manually entered data with lower-confidence automated data without explicit approval logic.</p>`,
        labels: 'CRM, data, sync, records',
        actionCount: 5,
      },
    ],
  },

  'Sales Support Agent': {
    name: 'Sales Support Agent',
    description: 'Qualifies inbound leads, delivers product information, and seamlessly hands off to human sales reps.',
    skills: [
      {
        name: 'Qualify Leads',
        description: 'Evaluates prospect needs, budget, and timeline to score lead quality.',
        instructions: `<p><strong>Capture Prospect Details</strong> — Gather company name, industry, size, and the prospect's role in the buying decision.</p>
<p><strong>Assess Needs</strong> — Ask open-ended questions to uncover the prospect's key pain points and use <span class="connection-badge">Evaluate Requirements</span> to match to product capabilities.</p>
<p><strong>Qualify Budget</strong> — Determine financial capacity using the <span class="connection-badge">Budget Assessment</span> workflow without asking for exact figures prematurely.</p>
<p><strong>Establish Timeline</strong> — Identify when the prospect expects to make a decision and the key stakeholders involved.</p>
<p><strong>Score the Lead</strong> — Calculate a BANT lead score using <span class="connection-badge">Lead Scoring</span> based on Budget, Authority, Need, and Timeline responses.</p>
<p><strong>Route or Nurture</strong> — Transfer hot leads to sales via <span class="connection-badge">Create Sales Opportunity</span> or add low-score prospects to nurture campaigns using <span class="connection-badge">Add to Marketing List</span>.</p>`,
        guardrails: `<p>Never use high-pressure tactics — present options and let the prospect decide their timeline.</p>
<p>Apply the same qualification criteria consistently across all leads to ensure fair and accurate scoring.</p>
<p>Respect opt-out requests immediately — remove any prospect who declines further contact from active outreach.</p>
<p>Do not advance a lead to sales without a minimum qualifying score — unqualified transfers waste rep time.</p>`,
        labels: 'sales, leads, qualification, BANT',
        actionCount: 5,
      },
      {
        name: 'Transfer to Sales',
        description: 'Hands off warm leads to the appropriate sales representative with full context.',
        instructions: `<p><strong>Confirm Lead Quality</strong> — Verify the lead meets the minimum qualification threshold before initiating a transfer.</p>
<p><strong>Identify the Right Rep</strong> — Match the lead to the appropriate sales representative by territory, industry, or account size using <span class="connection-badge">Get Rep Assignment</span>.</p>
<p><strong>Check Rep Availability</strong> — Confirm the rep is available now or schedule a handoff call using <span class="connection-badge">Get Rep Availability</span>.</p>
<p><strong>Prepare Lead Summary</strong> — Compile a full context brief including qualification score, pain points, budget range, and timeline using <span class="connection-badge">Generate Lead Summary</span>.</p>
<p><strong>Execute Transfer</strong> — Complete the handoff via <span class="connection-badge connection-badge--transfer">Transfer to Sales</span> with the lead summary attached.</p>
<p><strong>Log Transfer</strong> — Record the handoff event in <span class="connection-badge">Update CRM Record</span> and advance the opportunity to the Sales stage.</p>`,
        guardrails: `<p>Only transfer leads that meet or exceed the minimum qualification score — do not send cold leads to reps.</p>
<p>Always provide a complete context brief before transfer — a rep should never need to re-ask qualifying questions.</p>
<p>Confirm the rep accepts the transfer before disconnecting — never drop a lead in an unmonitored queue.</p>
<p>If the assigned rep is unavailable, offer the prospect a scheduled callback with that rep rather than a cold re-routing.</p>`,
        labels: 'sales, transfer, handoff, warm-lead',
        actionCount: 5,
      },
    ],
  },

  'Customer Support Bot': {
    name: 'Customer Support Bot',
    description: 'Resolves common support requests autonomously and escalates to human agents when needed.',
    skills: [
      {
        name: 'Answer FAQs',
        description: 'Responds to frequently asked questions using the knowledge base.',
        instructions: `<p><strong>Parse the Question</strong> — Identify the core intent behind the customer's question and extract key terms for search.</p>
<p><strong>Search Knowledge Base</strong> — Query <span class="connection-badge">Search Knowledge Base</span> using intent keywords to retrieve the most relevant articles.</p>
<p><strong>Evaluate Confidence</strong> — Assess the relevance score of the top results; only return answers above the confidence threshold.</p>
<p><strong>Deliver Answer</strong> — Present the answer in plain language, summarizing the KB content rather than pasting raw article text.</p>
<p><strong>Suggest Related Articles</strong> — Offer 2–3 related articles using <span class="connection-badge">Get Related Articles</span> to help the customer self-serve further.</p>
<p><strong>Collect Feedback</strong> — Ask if the answer resolved the customer's question and log the feedback using <span class="connection-badge">Log Interaction</span>.</p>`,
        guardrails: `<p>Never improvise answers not grounded in knowledge base content — low-confidence responses must be escalated.</p>
<p>Flag and report outdated KB articles rather than using them — accuracy is critical.</p>
<p>Do not present AI-generated interpretations as factual policy — only relay confirmed KB content.</p>
<p>If the knowledge base returns no relevant results, immediately offer to connect the customer with a human agent.</p>`,
        labels: 'support, FAQ, knowledge-base, self-service',
        actionCount: 4,
      },
      {
        name: 'Escalate to Agent',
        description: 'Detects complex situations and transfers customers to available live agents.',
        instructions: `<p><strong>Detect Escalation Signals</strong> — Identify triggers: repeated failures, customer frustration, complex technical issue, or explicit escalation request via <span class="connection-badge">Detect Escalation Trigger</span>.</p>
<p><strong>Acknowledge the Customer</strong> — Empathetically acknowledge the situation and set expectations for the transfer.</p>
<p><strong>Summarize Conversation</strong> — Generate a complete handoff summary using <span class="connection-badge">Generate Conversation Summary</span> covering the issue, attempts made, and customer sentiment.</p>
<p><strong>Check Agent Availability</strong> — Confirm a live agent is available in the correct queue using <span class="connection-badge">Get Agent Availability</span>.</p>
<p><strong>Execute Transfer</strong> — Complete the handoff via <span class="connection-badge connection-badge--transfer">Transfer to Contact Center</span> with the conversation summary attached.</p>
<p><strong>Log Escalation</strong> — Record the escalation in <span class="connection-badge">Create Escalation Record</span> for QA and trend analysis.</p>`,
        guardrails: `<p>Always confirm agent availability before initiating a transfer — never transfer to an empty queue.</p>
<p>Never drop a customer mid-conversation without informing them and providing an alternative.</p>
<p>Provide the receiving agent with a complete summary — the customer should not need to repeat their issue.</p>
<p>Do not attempt to resolve complaints involving legal claims, refunds over threshold, or security incidents — escalate immediately.</p>`,
        labels: 'support, escalation, transfer, CX',
        actionCount: 5,
      },
    ],
  },

  'FAQ Assistant': {
    name: 'FAQ Assistant',
    description: 'Instantly answers common customer questions by searching the knowledge base.',
    skills: [
      {
        name: 'Answer Questions',
        description: 'Delivers concise, accurate responses and suggests related articles.',
        instructions: `<p><strong>Parse Intent</strong> — Extract the core question and key entities from the customer's input using <span class="connection-badge">Parse Intent</span>.</p>
<p><strong>Search Knowledge Base</strong> — Execute the search across structured FAQs and unstructured articles using <span class="connection-badge">Search Knowledge Base</span>.</p>
<p><strong>Format Response</strong> — Present the answer in clear, plain language tailored to the customer's vocabulary using <span class="connection-badge">Format Response</span>.</p>
<p><strong>Suggest Related Articles</strong> — Offer 2–3 contextually related articles using <span class="connection-badge">Get Related Articles</span> to support self-service.</p>
<p><strong>Log Interaction</strong> — Record the interaction and feedback using <span class="connection-badge">Log Interaction</span> to improve KB relevance over time.</p>`,
        guardrails: `<p>Only return answers from verified KB content — never surface user-generated or unreviewed content as authoritative.</p>
<p>Acknowledge uncertainty when a question falls outside KB coverage — offer escalation rather than guessing.</p>
<p>Do not editorialize or add opinions beyond what is documented in the KB.</p>
<p>If a customer disputes the answer, log the dispute and escalate rather than arguing.</p>`,
        labels: 'knowledge, answers, support, citations',
        actionCount: 4,
      },
    ],
  },

  'Order Tracker': {
    name: 'Order Tracker',
    description: 'Provides customers with real-time order status and proactive delivery updates.',
    skills: [
      {
        name: 'Look Up Orders',
        description: 'Retrieves order details using order number or customer account information.',
        instructions: `<p><strong>Verify Customer Identity</strong> — Confirm the customer's identity using <span class="connection-badge">Verify Customer</span> with email or account number before sharing order data.</p>
<p><strong>Retrieve Order Details</strong> — Fetch the full order record using <span class="connection-badge">Get Order Details</span> including items, quantities, and payment status.</p>
<p><strong>Parse Tracking Status</strong> — Query the carrier API using <span class="connection-badge">Track Shipment</span> to get the latest location and status update.</p>
<p><strong>Present Summary</strong> — Deliver a clear order summary covering items ordered, current status, carrier, and estimated delivery date.</p>`,
        guardrails: `<p>Always verify the customer's identity before displaying order details — order data is personally identifiable.</p>
<p>Mask payment method details in all responses — show only the last 4 digits.</p>
<p>Do not share another customer's order information even if the order numbers are similar.</p>`,
        labels: 'orders, lookup, tracking, authenticated',
        actionCount: 3,
      },
      {
        name: 'Send Status Updates',
        description: 'Delivers current order status and estimated delivery timeline via preferred channel.',
        instructions: `<p><strong>Retrieve Current Status</strong> — Query <span class="connection-badge">Get Delivery Status</span> for the real-time carrier status of the shipment.</p>
<p><strong>Check for Exceptions</strong> — Identify any delivery exceptions (delays, failed attempts, weather holds) via <span class="connection-badge">Get Delivery Exceptions</span>.</p>
<p><strong>Send Notification</strong> — Deliver the update via <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span> based on the customer's preference.</p>`,
        guardrails: `<p>Never guarantee a specific delivery date or time — only share the carrier's estimated window.</p>
<p>Respect the customer's notification channel preference — do not send updates via channels they haven't opted into.</p>`,
        labels: 'orders, notifications, delivery, tracking',
        actionCount: 3,
      },
    ],
  },

  'Billing Helper': {
    name: 'Billing Helper',
    description: 'Resolves billing questions, processes refunds, and updates payment information securely.',
    skills: [
      {
        name: 'Review Charges',
        description: 'Explains line items and resolves billing discrepancies with customers.',
        instructions: `<p><strong>Verify Identity</strong> — Authenticate the customer using <span class="connection-badge">Verify Identity</span> before accessing any billing information.</p>
<p><strong>Retrieve Invoice</strong> — Pull the customer's current and recent invoices using <span class="connection-badge">Get Invoice</span>.</p>
<p><strong>Explain Line Items</strong> — Walk through each charge clearly, explaining what it covers, when it was incurred, and how it was calculated.</p>
<p><strong>Apply Adjustments</strong> — If a charge is confirmed to be in error, apply a credit using <span class="connection-badge">Apply Credit</span> following the adjustment policy.</p>
<p><strong>Send Summary</strong> — Deliver a written billing explanation via <span class="connection-badge">Send Email</span> including the invoice, any adjustments made, and a reference number.</p>`,
        guardrails: `<p>Require full identity verification before sharing any billing details — billing data is sensitive personal information.</p>
<p>Never adjust charges above the autonomous approval limit — escalate large credits to the billing team.</p>`,
        labels: 'billing, charges, account, finance',
        actionCount: 4,
      },
      {
        name: 'Process Refunds',
        description: 'Initiates and tracks refund requests within policy guidelines.',
        instructions: `<p><strong>Verify Identity and Order</strong> — Authenticate the customer using <span class="connection-badge">Verify Identity</span> and retrieve the order using <span class="connection-badge">Get Order Details</span>.</p>
<p><strong>Check Refund Eligibility</strong> — Validate whether the request qualifies for a refund using <span class="connection-badge">Check Refund Policy</span> based on product, date, and reason code.</p>
<p><strong>Process Refund</strong> — Submit the refund to the original payment method using <span class="connection-badge">Process Refund</span> and capture the transaction reference.</p>
<p><strong>Send Confirmation</strong> — Deliver a refund confirmation via <span class="connection-badge">Send Email</span> including refund amount, timeline, and reference number.</p>`,
        guardrails: `<p>Strictly comply with the published refund policy — do not make exceptions without documented manager approval.</p>
<p>Refunds must go to the original payment method — do not redirect funds to a different account.</p>`,
        labels: 'billing, refunds, finance, policy',
        actionCount: 4,
      },
    ],
  },

  'IT Help Desk': {
    name: 'IT Help Desk',
    description: 'Diagnoses tech issues, resets credentials, and escalates tickets that require human intervention.',
    skills: [
      {
        name: 'Diagnose Issues',
        description: 'Guides users through troubleshooting steps to identify root cause.',
        instructions: `<p><strong>Collect Symptoms</strong> — Ask the user to describe the issue including what happened, when it started, and what error messages are appearing.</p>
<p><strong>Check System Health</strong> — Verify platform and service status using <span class="connection-badge">System Health Check</span> to rule out a broader outage.</p>
<p><strong>Search Known Issues</strong> — Query <span class="connection-badge">Search Knowledge Base</span> for documented solutions matching the symptom pattern.</p>
<p><strong>Apply Fix or Escalate</strong> — If a known fix exists, guide the user through it step by step; if the issue is unresolved, create a ticket using <span class="connection-badge">Create Support Ticket</span> with full diagnostic data attached.</p>`,
        guardrails: `<p>Never apply untested or undocumented fixes — only recommend solutions from the verified KB or change management process.</p>
<p>Escalate hardware issues immediately — do not attempt physical-layer fixes remotely.</p>`,
        labels: 'IT, diagnostics, troubleshooting, support',
        actionCount: 3,
      },
      {
        name: 'Reset Passwords',
        description: 'Verifies identity and resets credentials across supported systems.',
        instructions: `<p><strong>Verify Identity Strongly</strong> — Authenticate the user using two or more verification factors via <span class="connection-badge">Verify Identity</span> before proceeding with any credential changes.</p>
<p><strong>Reset Credentials</strong> — Initiate the password reset using <span class="connection-badge">Reset Password</span> and generate a secure temporary credential or reset link.</p>
<p><strong>Deliver Credentials Securely</strong> — Send the temporary password or reset link via <span class="connection-badge">Send Temporary Credentials</span> to the user's verified alternate contact method.</p>`,
        guardrails: `<p>Never share credentials verbally or via unencrypted channels — always use the secure delivery method.</p>
<p>Require multi-factor verification before any credential reset — failed verification must halt the process.</p>`,
        labels: 'IT, security, credentials, access, authentication',
        actionCount: 3,
      },
    ],
  },

  'Appointment Reminder': {
    name: 'Appointment Reminder',
    description: 'Proactively reminds customers of upcoming appointments and handles confirmations or rescheduling.',
    skills: [
      {
        name: 'Send Reminders',
        description: 'Delivers timely appointment reminders via voice, SMS, or email.',
        instructions: `<p><strong>Retrieve Upcoming Appointments</strong> — Query <span class="connection-badge">Get Upcoming Appointments</span> for appointments scheduled within the next 24–72 hours.</p>
<p><strong>Get Contact Preferences</strong> — Retrieve the customer's preferred notification channel (voice, SMS, email) using <span class="connection-badge">Get Contact Preferences</span>.</p>
<p><strong>Send Reminder</strong> — Deliver via <span class="connection-badge">Send SMS</span>, <span class="connection-badge">Send Email</span>, or initiate an outbound call based on the customer's channel preference.</p>
<p><strong>Log Delivery</strong> — Record the reminder delivery status in <span class="connection-badge">Update Appointment Record</span> and set the next follow-up reminder if configured.</p>`,
        guardrails: `<p>Only contact customers through their explicitly opted-in channels — respect all communication preferences and opt-outs.</p>
<p>Do not send reminders outside of permitted contact hours — respect local time zones and regulatory quiet hours.</p>`,
        labels: 'scheduling, reminders, notifications, outbound',
        actionCount: 3,
      },
      {
        name: 'Handle Confirmations',
        description: 'Collects customer confirmations and updates the scheduling system accordingly.',
        instructions: `<p><strong>Receive Customer Response</strong> — Capture the customer's reply (confirm, cancel, or reschedule) from the reminder message.</p>
<p><strong>Process Confirmation</strong> — If confirmed, update the appointment status to "Confirmed" using <span class="connection-badge">Update Appointment Status</span>.</p>
<p><strong>Offer Reschedule</strong> — If the customer requests a new time, immediately offer available alternatives using <span class="connection-badge">Check Calendar Availability</span>.</p>
<p><strong>Send Acknowledgement</strong> — Deliver a confirmation receipt via <span class="connection-badge">Send Email</span> or <span class="connection-badge">Send SMS</span> reflecting the updated appointment status.</p>`,
        guardrails: `<p>Handle cancellation requests gracefully — always offer a reschedule option before closing out a cancellation.</p>
<p>Notify all relevant stakeholders (provider, admin, etc.) when an appointment status changes — do not let schedule changes go unannounced.</p>`,
        labels: 'scheduling, confirmations, appointments, responses',
        actionCount: 3,
      },
    ],
  },

  '__default__': {
    name: null,
    description: 'An AI agent that handles customer requests and escalates complex issues to human agents.',
    skills: [
      {
        name: 'Handle Requests',
        description: 'Understands and responds to a wide range of incoming customer requests.',
        instructions: `<p><strong>Greet and Acknowledge</strong> — Welcome the customer and acknowledge their request to set a positive tone.</p>
<p><strong>Identify Intent</strong> — Classify the customer's request type using <span class="connection-badge">Classify Intent</span> to route it to the correct response path.</p>
<p><strong>Gather Details</strong> — Ask clarifying questions to collect all the information needed to fulfil the request.</p>
<p><strong>Retrieve Relevant Data</strong> — Pull relevant records using <span class="connection-badge">Get Customer Record</span> to personalize the response.</p>
<p><strong>Fulfill Request</strong> — Process the request using the appropriate action or workflow and confirm completion with the customer.</p>
<p><strong>Log Interaction</strong> — Record the interaction outcome using <span class="connection-badge">Create Interaction Log</span> for reporting and continuous improvement.</p>`,
        guardrails: `<p>Always verify the customer's identity before accessing or modifying their account data.</p>
<p>Do not make commitments or promises outside of what the organization's policies permit.</p>
<p>Escalate requests that fall outside the defined scope of this skill rather than attempting to resolve them autonomously.</p>`,
        labels: 'general, requests, service, support',
        actionCount: 3,
      },
      {
        name: 'Escalate Issues',
        description: 'Identifies situations requiring human attention and transfers with full context.',
        instructions: `<p><strong>Detect Escalation Need</strong> — Identify signals that require human intervention via <span class="connection-badge">Detect Escalation Trigger</span>.</p>
<p><strong>Acknowledge the Customer</strong> — Empathetically communicate that you are connecting them with a specialist.</p>
<p><strong>Summarize the Interaction</strong> — Generate a complete handoff summary using <span class="connection-badge">Generate Interaction Summary</span>.</p>
<p><strong>Transfer with Context</strong> — Execute the transfer via <span class="connection-badge connection-badge--transfer">Transfer to Contact Center</span> with the full summary attached.</p>`,
        guardrails: `<p>Always confirm agent availability before transferring — never send a customer to an unmanned queue.</p>
<p>Provide the receiving agent with a complete context summary — the customer should not need to repeat their story.</p>`,
        labels: 'escalation, transfer, support, CX',
        actionCount: 3,
      },
    ],
  },
}

// Derives a concise agent name from a free-form prompt when Claude is unavailable
function deriveAgentName(prompt) {
  const patterns = [
    { test: /new\s+customer|new\s+account|onboard|sign[\s-]?up|registr/i,   name: 'New Customers Agent' },
    { test: /billing|invoice|payment|refund|charg/i,                         name: 'Billing Agent' },
    { test: /sales|lead|prospect|qualif/i,                                   name: 'Sales Agent' },
    { test: /recruit|hir|interview|candidate|job\s+applicant/i,              name: 'Recruiting Agent' },
    { test: /schedul|appointment|booking|calendar/i,                         name: 'Scheduling Agent' },
    { test: /order|track.*deliver|deliver.*track|shipment/i,                 name: 'Order Tracker' },
    { test: /it\s+help|password.*reset|tech.*issue|troubleshoot/i,           name: 'IT Help Desk' },
    { test: /faq|knowledge\s+base|frequently\s+asked/i,                     name: 'FAQ Assistant' },
    { test: /reminder|upcoming.*appointment|confirm.*appointment/i,          name: 'Reminder Agent' },
    { test: /account\s+manag|account.*request|account.*change/i,            name: 'Account Manager' },
    { test: /crm|contact\s+record|interaction\s+log/i,                      name: 'CRM Assistant' },
    { test: /receiv|receptionist|route.*call|incoming.*call/i,              name: 'AI Receptionist' },
    { test: /support|help\s+desk|ticket/i,                                  name: 'Support Agent' },
    { test: /customer|client/i,                                             name: 'Customer Agent' },
  ]
  for (const { test, name } of patterns) {
    if (test.test(prompt)) return name
  }
  return 'AI Agent'
}

// Returns the agent shell with no canvasSkills — nodes are pushed to state.skillNodes individually
function buildAgentMeta(template, prompt) {
  const agentName = template.name || deriveAgentName(prompt)
  const fallbackTasks = template.description
    ? `${template.description}${template.skills?.length ? ' Key responsibilities include: ' + template.skills.map(s => s.name).join(', ') + '.' : ''}`
    : ''
  const fallbackGreeting = `Hi there! I'm ${agentName}, your Aerolabs assistant. I'm here to help — feel free to ask me anything and I'll do my best to assist you.`
  return {
    id: `agent-${Date.now()}`,
    name: agentName,
    personaName: template.personaName || 'Aria',
    status: 'Draft',
    type: 'Agentic',
    locale: 'English US',
    group: '—',
    additionalGroups: '',
    resolutionRate: '—',
    usage: 0,
    sparkline: '0,12 10,12 20,12 30,12 40,12 50,12 60,12',
    description: template.description,
    agentTasks: template.agentTasks || fallbackTasks,
    greetingMessage: template.greetingMessage || fallbackGreeting,
    companyName: AEROLABS.name,
    companyDesc: AEROLABS.companyDesc,
    canvasSkills: [],
  }
}

export const state = reactive({
  // Navigation state
  currentPage: 'agent-list',
  currentAgentTab: 'overview',

  // Agent list — reactive, seeded from static data
  agentsList: [...agents],

  // AI generation state
  isGeneratingNodes: false,
  initialPrompt: '',

  // AI assistant chat
  showAssistantChat: false,
  pendingChatMessage: null,
  pendingAssistantMessage: null,
  explainSkillId: null,
  pendingFixAll: false,
  pendingOpenSkillId: null,
  skillLinterData: {},
  skillCompassData: {},
  globalCompassIds: [],

  // Selected items
  selectedAgent: null,
  selectedTestResult: null,
  selectedSkillId: null,

  // UI state
  showMiningDrawer: false,
  showMiningDetailsModal: false,
  showOpportunityDrawer: false,
  selectedOpportunity: null,
  provingGroundView: 'list', // 'list' | 'empty' | 'detail'
  isFullScreenEditor: false, // Canvas editor fullscreen state
  miningStatus: null, // null | 'in-progress' | 'complete'
  hasMiningResults: false, // false = empty state, true = show results
  showPublishedToast: false, // Toast for agent published success
  showTestCompleteToast: false, // Toast for test completion

  // Skill creation from mining
  createSkillFromMining: null, // Contains opportunity data when creating skill from mining
  isCreatingSkill: false, // Animation state for skill creation
  hasUnsavedChanges: false, // Track if canvas has unsaved changes
  activeSkillBuild: null, // skillId currently being built, null when idle

  // Canvas skill nodes - persist across tab navigation
  // These will be loaded from agent.canvasSkills when an agent is selected
  skillNodes: [],

  // Testing/Proving Ground - persist generated scenarios
  generatedScenarios: [],
  selectedScenarioIds: new Set(),
  selectedTestChannel: 'Select channels',
  latestTestResultId: null, // ID of most recent test result
  testResultsList: [], // All test results (initialized from testResultsData)

  // Filter state (UI only for prototype)
  selectedChannel: 'all',
  selectedSort: 'default',

  // Workflow builder state
  workflowData: {
    skillName: '',
    skillDescription: ''
  },
  currentBuilderStep: 0,

  // Methods
  setCurrentPage(page) {
    this.currentPage = page
  },

  setCurrentAgentTab(tab) {
    this.currentAgentTab = tab
  },

  selectAgent(agent) {
    this.selectedAgent = agent
    this.currentPage = 'agent-detail'
    this.currentAgentTab = 'overview'

    // Use splice to mutate in-place so captured array references in components stay valid
    this.skillNodes.splice(0)
    if (agent.canvasSkills && agent.canvasSkills.length > 0) {
      JSON.parse(JSON.stringify(agent.canvasSkills)).forEach(s => this.skillNodes.push(s))
    }
  },

  startAgentCreation() {
    this.currentPage = 'agent-creation'
  },

  createAgentFromPrompt(prompt, claudeData = null, nameOverride = null) {
    let template
    if (claudeData) {
      template = {
        name: claudeData.agentName,
        personaName: claudeData.personaName,
        description: claudeData.agentDescription,
        agentTasks: claudeData.agentTasks,
        greetingMessage: claudeData.greetingMessage,
        skills: claudeData.skills,
      }
    } else {
      const key = Object.keys(agentTemplates).find(k =>
        prompt.toLowerCase().includes(k.toLowerCase())
      ) || '__default__'
      template = agentTemplates[key]
    }
    const agentMeta = buildAgentMeta(template, prompt)
    if (nameOverride) agentMeta.name = nameOverride

    this.agentsList.unshift(agentMeta)
    this.isGeneratingNodes = true
    this.initialPrompt = prompt
    this.showAssistantChat = true
    this.selectAgent(agentMeta)
    this.currentAgentTab = 'agent-editor'
    this.isFullScreenEditor = true

    const NODE_INTERVAL = 700
    const SHIMMER_DURATION = 1200
    const agentId = agentMeta.id

    const SKILL_SPACING = 160
    const agentCenterY = 120
    const N = template.skills.length
    const firstSkillTop = agentCenterY - 70 - ((N - 1) * SKILL_SPACING / 2)

    template.skills.forEach((skill, i) => {
      setTimeout(() => {
        if (this.selectedAgent?.id !== agentId) return
        this.skillNodes.push({
          id: `skill-${i + 1}`,
          name: skill.name,
          description: skill.description,
          position: { left: 420, top: firstSkillTop + i * SKILL_SPACING },
          isNew: true,
          isGenerating: true,
          instructions: skill.instructions,
          guardrails: skill.guardrails,
          labels: skill.labels,
          actionCount: skill.actionCount,
        })
        setTimeout(() => {
          if (this.selectedAgent?.id !== agentId) return
          const idx = this.skillNodes.findIndex(n => n.id === `skill-${i + 1}`)
          if (idx !== -1) {
            this.skillNodes[idx].isGenerating = false
            this.skillNodes[idx].isNew = false
          }
        }, SHIMMER_DURATION)
      }, i * NODE_INTERVAL)
    })

    const totalTime = (template.skills.length - 1) * NODE_INTERVAL + SHIMMER_DURATION
    setTimeout(() => {
      if (this.selectedAgent?.id !== agentId) return
      this.isGeneratingNodes = false
      const agent = this.agentsList.find(a => a.id === agentId)
      if (agent) agent.canvasSkills = JSON.parse(JSON.stringify(this.skillNodes))
    }, totalTime)
  },

  createBlankAgent() {
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: 'Untitled Agent',
      personaName: '',
      status: 'Draft',
      type: 'Agentic',
      locale: 'English US',
      group: '—',
      additionalGroups: '',
      resolutionRate: '—',
      usage: 0,
      sparkline: '0,12 10,12 20,12 30,12 40,12 50,12 60,12',
      description: '',
      companyName: AEROLABS.name,
      companyDesc: AEROLABS.companyDesc,
      canvasSkills: [],
    }
    this.agentsList.unshift(newAgent)
    this.selectAgent(newAgent)
    this.currentAgentTab = 'agent-editor'
    this.isFullScreenEditor = true
  },

  selectTestResult(result) {
    this.selectedTestResult = result
    this.provingGroundView = 'detail'
  },

  backToTestsList() {
    this.provingGroundView = 'list'
    this.selectedTestResult = null
  },

  toggleMiningDrawer() {
    this.showMiningDrawer = !this.showMiningDrawer
  },

  setBuilderStep(step) {
    this.currentBuilderStep = step
  },

  resetWorkflowData() {
    this.workflowData = { skillName: '', skillDescription: '' }
    this.currentBuilderStep = 0
  },

  navigateToSkillDetail(skillId) {
    this.selectedSkillId = skillId
    this.currentPage = 'skill-detail'
  },

  backFromSkillDetail() {
    this.currentPage = 'agent-detail'
    this.currentAgentTab = 'skills-workflows'
    this.selectedSkillId = null
  },

  // Aggregation concept — driven by prototype settings select
  // Values: 'strip-above' | 'strip-inside' | 'header-inline'
  aggregationConcept: 'strip-above',
  setAggregationConcept(value) {
    state.aggregationConcept = value
  }
})
