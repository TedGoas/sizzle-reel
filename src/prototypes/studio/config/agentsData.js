export const agents = [
  {
    id: 1,
    name: 'Aerolabs Delivery Agent',
    description: 'Streamlines package delivery operations with real-time tracking, flexible scheduling, and accurate address validation for Aerolabs shipments.',
    locale: 'English US',
    group: 'Sales Center',
    additionalGroups: '',
    resolutionRate: '74.5%',
    usage: 145,
    sparkline: '0,18 10,12 20,15 30,8 40,14 50,10 60,6',
    type: 'Agentic',
    status: 'Published',
    skills: ['Package Tracking', 'Delivery Scheduling', 'Address Verification'],
    canvasSkills: [
      {
        id: 'skill-1',
        name: 'Package Tracking',
        description: 'Provides real-time package location updates and delivery status for customer shipments.',
        position: { left: 420, top: 50 },
        isNew: false,
        actionCount: 6,
        status: 'Published',
        usageCount: 78,
        passRate: 92,
        hasMiningOpportunity: false,
        miningOpportunityName: null,
        workflows: [
          { id: 'wf-1', name: 'Delivery Notification Workflow', status: 'Published', stepCount: 3 }
        ],
        instructions: `<p><strong>Verify Order</strong> — Use <span class="connection-badge">Get Order Details</span> to retrieve customer order and tracking information.</p>
<p><strong>Locate Package</strong> — Query <span class="connection-badge">Track Shipment</span> API with tracking number to get current location and status.</p>
<p><strong>Check Status</strong> — Use <span class="connection-badge">Get Delivery Status</span> to determine if package is in transit, out for delivery, or delivered.</p>
<p><strong>Provide Updates</strong> — Share tracking details including current location, estimated delivery time, and any delays.</p>
<p><strong>Handle Issues</strong> — If package is delayed or lost, escalate using <span class="connection-badge">Create Support Ticket</span> workflow.</p>
<p><strong>Send Confirmation</strong> — Deliver tracking summary via <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span> with real-time updates.</p>`
      },
      {
        id: 'skill-2',
        name: 'Delivery Scheduling',
        description: 'Allows customers to schedule, modify, or cancel delivery windows based on carrier availability.',
        position: { left: 420, top: 220 },
        isNew: false,
        actionCount: 4,
        status: 'Published',
        usageCount: 45,
        passRate: 88,
        hasMiningOpportunity: true,
        miningOpportunityName: 'Re-route delivery',
        workflows: [],
        instructions: `<p><strong>Check Availability</strong> — Query <span class="connection-badge">Get Delivery Windows</span> for available time slots.</p>
<p><strong>Confirm Selection</strong> — Use <span class="connection-badge">Book Delivery Slot</span> to reserve the chosen window.</p>
<p><strong>Send Confirmation</strong> — Notify customer via <span class="connection-badge">Send Email</span> with delivery details.</p>
<p><strong>Handle Changes</strong> — Process reschedule or cancellation requests through <span class="connection-badge">Update Delivery</span>.</p>`
      },
      {
        id: 'skill-3',
        name: 'Address Verification',
        description: 'Validates and corrects shipping addresses to prevent failed deliveries.',
        position: { left: 420, top: 390 },
        isNew: false,
        actionCount: 3,
        status: 'Draft',
        usageCount: null,
        passRate: null,
        hasMiningOpportunity: false,
        miningOpportunityName: null,
        workflows: [],
        instructions: `<p><strong>Validate Address</strong> — Run address through <span class="connection-badge">Address Validation API</span>.</p>
<p><strong>Suggest Corrections</strong> — Present validated address to customer for confirmation.</p>
<p><strong>Update Order</strong> — Save corrected address via <span class="connection-badge">Update Shipping Address</span>.</p>`
      }
    ]
  },
  {
    id: 2,
    name: 'Customer Support Agent',
    description: 'Provides comprehensive customer assistance with troubleshooting technical issues and managing account settings across all service channels.',
    locale: 'English US',
    group: 'North Sales Center',
    additionalGroups: '+4 more',
    resolutionRate: '88%',
    usage: 126,
    sparkline: '0,10 10,8 20,12 30,6 40,14 50,11 60,9',
    type: 'Agentic',
    status: 'Published',
    skills: ['Troubleshooting', 'Account Management'],
    canvasSkills: [
      {
        id: 'skill-1',
        name: 'Account Management',
        description: 'Helps customers manage account settings, billing information, and subscription preferences.',
        position: { left: 420, top: 50 },
        isNew: false,
        actionCount: 6,
        status: 'Published',
        usageCount: 206,
        passRate: 88,
        hasMiningOpportunity: false,
        miningOpportunityName: null,
        workflows: [
          { id: 'wf-1', name: 'Password Reset Workflow', status: 'Published', stepCount: 4 },
          { id: 'wf-2', name: 'Subscription Change Workflow', status: 'Published', stepCount: 5 }
        ],
        instructions: `<p><strong>Verify Identity</strong> — Authenticate customer using <span class="connection-badge">Verify Customer</span> with multi-factor verification.</p>
<p><strong>Retrieve Account</strong> — Access customer account data via <span class="connection-badge">Get Account Details</span> to view current settings.</p>
<p><strong>Update Information</strong> — Modify account details using <span class="connection-badge">Update Account</span> for email, password, or profile changes.</p>
<p><strong>Manage Billing</strong> — Handle payment method updates through <span class="connection-badge">Update Payment Method</span> workflow.</p>
<p><strong>Adjust Subscription</strong> — Process plan changes or cancellations using <span class="connection-badge">Modify Subscription</span> API.</p>
<p><strong>Send Confirmation</strong> — Deliver account update summary via <span class="connection-badge">Send Email</span> with change details and security reminders.</p>`
      },
      {
        id: 'skill-2',
        name: 'Troubleshooting',
        description: 'Guides customers through common technical issues with step-by-step diagnostic flows.',
        position: { left: 420, top: 220 },
        isNew: false,
        actionCount: 5,
        status: 'Published',
        usageCount: 134,
        passRate: 79,
        hasMiningOpportunity: true,
        miningOpportunityName: 'Unlock accounts',
        workflows: [
          { id: 'wf-3', name: 'Escalation Workflow', status: 'Draft', stepCount: 2 }
        ],
        instructions: `<p><strong>Gather Symptoms</strong> — Collect issue details using <span class="connection-badge">Collect Diagnostics</span>.</p>
<p><strong>Search KB</strong> — Query <span class="connection-badge">Knowledge Base</span> for documented solutions.</p>
<p><strong>Apply Fix</strong> — Walk customer through resolution steps.</p>
<p><strong>Verify Resolution</strong> — Confirm issue is resolved via <span class="connection-badge">Run System Tests</span>.</p>
<p><strong>Escalate</strong> — If unresolved, route to human agent via <span class="connection-badge">Create Support Case</span>.</p>`
      }
    ]
  },
  {
    id: 3,
    name: 'Sales Assistant Agent',
    description: 'Engages potential customers with detailed product information and intelligently qualifies sales leads to accelerate the sales pipeline.',
    locale: 'English US',
    group: 'North Sales Center',
    additionalGroups: '+4 more',
    resolutionRate: '25%',
    usage: 122,
    sparkline: '0,16 10,14 20,18 30,12 40,10 50,15 60,13',
    type: 'Agentic',
    status: 'Published',
    skills: ['Product Information', 'Lead Qualification'],
    canvasSkills: [
      {
        id: 'skill-1',
        name: 'Lead Qualification',
        description: 'Identifies and qualifies potential customers based on needs, budget, and purchase timeline.',
        position: { left: 420, top: 50 },
        isNew: false,
        actionCount: 5,
        status: 'Published',
        usageCount: 91,
        passRate: 84,
        hasMiningOpportunity: false,
        miningOpportunityName: null,
        workflows: [
          { id: 'wf-1', name: 'Sales Handoff Workflow', status: 'Published', stepCount: 3 }
        ],
        instructions: `<p><strong>Gather Information</strong> — Collect prospect details including company size, industry, and current challenges.</p>
<p><strong>Assess Needs</strong> — Use <span class="connection-badge">Evaluate Requirements</span> to determine product fit and pain points.</p>
<p><strong>Check Budget</strong> — Qualify financial capacity using <span class="connection-badge">Budget Assessment</span> workflow.</p>
<p><strong>Determine Timeline</strong> — Identify purchase timeline and decision-making process with key stakeholders.</p>
<p><strong>Score Lead</strong> — Calculate lead score using <span class="connection-badge">Lead Scoring</span> based on BANT criteria (Budget, Authority, Need, Timeline).</p>
<p><strong>Route Qualified Leads</strong> — Transfer hot leads to sales team via <span class="connection-badge">Create Sales Opportunity</span> with complete qualification notes.</p>
<p><strong>Nurture Others</strong> — Add unqualified leads to nurture campaigns through <span class="connection-badge">Add to Marketing List</span> workflow.</p>`
      },
      {
        id: 'skill-2',
        name: 'Product Information',
        description: 'Answers product questions, provides pricing details, and shares feature comparisons.',
        position: { left: 420, top: 220 },
        isNew: false,
        actionCount: 3,
        status: 'Published',
        usageCount: 58,
        passRate: 95,
        hasMiningOpportunity: false,
        miningOpportunityName: null,
        workflows: [],
        instructions: `<p><strong>Identify Product</strong> — Determine which product the customer is asking about.</p>
<p><strong>Fetch Details</strong> — Retrieve current specs via <span class="connection-badge">Get Product Catalog</span>.</p>
<p><strong>Share Pricing</strong> — Pull live pricing from <span class="connection-badge">Get Pricing</span> API.</p>`
      }
    ]
  },
  {
    id: 4,
    name: 'Technical Support Agent',
    description: 'Delivers expert technical assistance and resolves a wide range of technical issues with efficient problem-solving capabilities.',
    locale: 'English US',
    group: 'Aerolabs hello',
    additionalGroups: '',
    resolutionRate: '82.5%',
    usage: 80,
    sparkline: '0,12 10,11 20,13 30,12 40,11 50,12 60,11',
    type: 'Generative',
    status: 'Published',
    skills: ['General Support'],
    canvasSkills: [
      {
        id: 'skill-1',
        name: 'Technical Troubleshooting',
        description: 'Diagnoses and resolves technical issues through systematic problem identification and solution implementation.',
        position: { left: 420, top: 50 },
        isNew: false,
        actionCount: 8,
        status: 'Published',
        usageCount: 112,
        passRate: 76,
        hasMiningOpportunity: true,
        miningOpportunityName: 'Resolve failed payment in checkout',
        workflows: [
          { id: 'wf-1', name: 'Escalation to Tier 2 Workflow', status: 'Published', stepCount: 3 }
        ],
        instructions: `<p><strong>Identify Issue</strong> — Gather symptoms and error messages using <span class="connection-badge">Collect Diagnostics</span> to understand the problem scope.</p>
<p><strong>Check System Status</strong> — Verify system health via <span class="connection-badge">System Health Check</span> to identify anomalies.</p>
<p><strong>Review Logs</strong> — Analyze error logs using <span class="connection-badge">Get System Logs</span> to pinpoint root cause.</p>
<p><strong>Search Knowledge Base</strong> — Query <span class="connection-badge">Knowledge Base</span> for known issues and documented solutions.</p>
<p><strong>Apply Solution</strong> — Implement fix using appropriate <span class="connection-badge">System Configuration</span> or <span class="connection-badge">Software Update</span> workflows.</p>
<p><strong>Verify Resolution</strong> — Confirm issue is resolved through <span class="connection-badge">Run System Tests</span> and user validation.</p>
<p><strong>Document Case</strong> — Log resolution details in <span class="connection-badge">Create Support Case</span> for future reference.</p>`
      }
    ]
  }
]
