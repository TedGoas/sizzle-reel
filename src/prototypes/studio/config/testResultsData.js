import { STATUS_COLORS } from './statusColors.js'

export const testResults = [
  {
    id: 1,
    status: 'Excellent',
    completion: 11,
    total: 12,
    percentage: 92,
    color: STATUS_COLORS.excellent,
    date: 'January 18, 2026',
    agent: 'Agent v12',
    isNew: true,
    channels: ['phone', 'message'],
    description: 'Strong performance across appointment scheduling and basic legal inquiries. Excellent handling of multi-channel interactions with consistent tone and accuracy.',
    scenarios: [
      {
        id: 1,
        scenario: 'Client books initial injury consultation',
        details: 'The AI efficiently scheduled consultation and collected preliminary case details.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Appointment Scheduling', passed: true },
          { name: 'Case Intake', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 2,
        scenario: 'Caller asks about contingency fee structure',
        details: 'The AI accurately explained fee arrangements and payment terms.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Billing Information', passed: true },
          { name: 'Policy Explanation', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 3,
        scenario: 'Client reschedules medical evaluation',
        details: 'The AI processed rescheduling request and coordinated with medical provider.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Appointment Management', passed: true },
          { name: 'Calendar Coordination', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 4,
        scenario: 'User requests police report submission guidance',
        details: 'The AI provided clear instructions for document upload and verification.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Document Assistance', passed: true },
          { name: 'Case Documentation', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 5,
        scenario: 'Caller inquires about settlement timeline',
        details: 'The AI provided realistic expectations and explained case progression stages.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Legal Information', passed: true },
          { name: 'Timeline Guidance', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 6,
        scenario: 'Client asks about medical lien negotiations',
        details: 'The AI struggled to explain complex lien reduction process accurately.',
        channel: 'Digital',
        passFail: 'Fail',
        skills: [
          { name: 'Financial Guidance', passed: false },
          { name: 'Medical Billing', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 7,
        scenario: 'User verifies case status after demand letter',
        details: 'The AI successfully retrieved current case phase and next steps.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Case Tracking', passed: true },
          { name: 'Status Updates', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 8,
        scenario: 'Client updates employment information',
        details: 'The AI processed data changes and confirmed wage loss documentation needs.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Data Management', passed: true },
          { name: 'Information Updates', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 9,
        scenario: 'Caller requests interpreter for deposition prep',
        details: 'The AI arranged interpreter services and scheduled preparation session.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Service Coordination', passed: true },
          { name: 'Accessibility Support', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 10,
        scenario: 'Client checks on property damage claim',
        details: 'The AI provided accurate updates on vehicle valuation and repair status.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Claim Management', passed: true },
          { name: 'Property Damage', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 11,
        scenario: 'User asks about statute of limitations deadline',
        details: 'The AI correctly identified applicable deadline and advised on filing urgency.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Legal Knowledge', passed: true },
          { name: 'Deadline Management', passed: true }
        ],
        difficulty: 'Hard'
      },
      {
        id: 12,
        scenario: 'Client cancels witness interview appointment',
        details: 'The AI processed cancellation and coordinated alternate scheduling.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Appointment Management', passed: true },
          { name: 'Witness Coordination', passed: true }
        ],
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 2,
    status: 'Failed',
    completion: 4,
    total: 8,
    percentage: 50,
    color: STATUS_COLORS.failed,
    date: 'January 8, 2026',
    agent: 'Agent v11',
    isNew: false,
    channels: ['phone', 'message'],
    description: 'Mixed results across claim processing and legal guidance scenarios. Strong on administrative tasks but struggles with complex liability determinations and settlement negotiations.',
    scenarios: [
      {
        id: 1,
        scenario: 'Client asks about comparative negligence ruling',
        details: 'The AI failed to explain how fault percentage affects settlement amount.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Legal Analysis', passed: false },
          { name: 'Settlement Calculation', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 2,
        scenario: 'User schedules IME appointment',
        details: 'The AI successfully coordinated independent medical examination scheduling.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Medical Coordination', passed: true },
          { name: 'Appointment Scheduling', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 3,
        scenario: 'Caller inquires about insurance subrogation process',
        details: 'The AI provided confusing explanation of insurance reimbursement rights.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Insurance Knowledge', passed: false },
          { name: 'Claims Processing', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 4,
        scenario: 'Client uploads accident scene photos',
        details: 'The AI guided user through secure document upload successfully.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Document Management', passed: true },
          { name: 'Technical Support', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 5,
        scenario: 'User asks about loss of consortium claim eligibility',
        details: 'The AI struggled to explain derivative claim requirements for spouse.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Legal Expertise', passed: false },
          { name: 'Claim Types', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 6,
        scenario: 'Client confirms attorney callback time',
        details: 'The AI efficiently scheduled callback and sent calendar invitation.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Scheduling', passed: true },
          { name: 'Communication', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 7,
        scenario: 'Caller requests litigation status update',
        details: 'The AI provided inaccurate information about discovery phase timeline.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Case Tracking', passed: true },
          { name: 'Litigation Process', passed: false }
        ],
        difficulty: 'Medium'
      },
      {
        id: 8,
        scenario: 'Client verifies office address for deposition',
        details: 'The AI provided correct location and parking instructions.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Information Retrieval', passed: true },
          { name: 'Client Support', passed: true }
        ],
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 3,
    status: 'Passed',
    completion: 5,
    total: 7,
    percentage: 71,
    color: STATUS_COLORS.passed,
    date: 'December 22, 2025',
    agent: 'Agent v10',
    isNew: false,
    channels: ['phone'],
    description: 'Solid performance on routine administrative tasks and basic information requests. Demonstrates reliable appointment management and document handling capabilities.',
    scenarios: [
      {
        id: 1,
        scenario: 'New client intake call',
        details: 'The AI collected complete case information and scheduled initial consultation.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Intake Process', passed: true },
          { name: 'Information Gathering', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 2,
        scenario: 'Client requests treatment provider list',
        details: 'The AI provided approved medical provider network information.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Medical Referrals', passed: true },
          { name: 'Resource Navigation', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 3,
        scenario: 'User asks about pre-existing condition impact',
        details: 'The AI failed to accurately explain how prior injuries affect current claim.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Medical Assessment', passed: false },
          { name: 'Claim Valuation', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 4,
        scenario: 'Client reschedules case evaluation meeting',
        details: 'The AI processed rescheduling and sent updated confirmation.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Calendar Management', passed: true },
          { name: 'Communication', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 5,
        scenario: 'User inquires about uninsured motorist coverage',
        details: 'The AI provided incomplete explanation of UM/UIM policy benefits.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Insurance Policies', passed: false },
          { name: 'Coverage Analysis', passed: false }
        ],
        difficulty: 'Medium'
      },
      {
        id: 6,
        scenario: 'Client confirms receipt of settlement offer',
        details: 'The AI verified document delivery and scheduled review meeting.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Document Tracking', passed: true },
          { name: 'Appointment Scheduling', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 7,
        scenario: 'User asks about case referral to co-counsel',
        details: 'The AI explained referral process and timeline expectations clearly.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Process Explanation', passed: true },
          { name: 'Client Education', passed: true }
        ],
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 4,
    status: 'Excellent',
    completion: 9,
    total: 10,
    percentage: 90,
    color: STATUS_COLORS.excellent,
    date: 'November 30, 2025',
    agent: 'Agent v9',
    isNew: false,
    channels: ['phone', 'message'],
    description: 'Excellent results demonstrating strong capabilities in client communication and case management. Handles both routine and moderately complex scenarios with high accuracy.',
    scenarios: [
      {
        id: 1,
        scenario: 'Client provides witness contact information',
        details: 'The AI efficiently recorded witness details and confirmed follow-up steps.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Information Collection', passed: true },
          { name: 'Case Documentation', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 2,
        scenario: 'User asks about medical bill payment timing',
        details: 'The AI clearly explained lien resolution and payment sequence.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Financial Guidance', passed: true },
          { name: 'Settlement Process', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 3,
        scenario: 'Client requests case file copies',
        details: 'The AI processed request and arranged secure document delivery.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Document Management', passed: true },
          { name: 'File Access', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 4,
        scenario: 'Caller inquires about expert witness reports',
        details: 'The AI provided incomplete information about report timeline and availability.',
        channel: 'Voice',
        passFail: 'Fail',
        skills: [
          { name: 'Litigation Support', passed: false },
          { name: 'Expert Coordination', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 5,
        scenario: 'Client updates current mailing address',
        details: 'The AI processed address change and confirmed update across all systems.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Data Management', passed: true },
          { name: 'Profile Updates', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 6,
        scenario: 'User checks on demand letter response deadline',
        details: 'The AI provided accurate timeline and explained next steps if deadline passes.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Timeline Management', passed: true },
          { name: 'Process Knowledge', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 7,
        scenario: 'Client asks about arbitration versus trial',
        details: 'The AI explained both options and their potential outcomes effectively.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Legal Education', passed: true },
          { name: 'Process Comparison', passed: true }
        ],
        difficulty: 'Hard'
      },
      {
        id: 8,
        scenario: 'User requests rush processing for medical records',
        details: 'The AI coordinated expedited records request with providers.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Medical Coordination', passed: true },
          { name: 'Urgency Handling', passed: true }
        ],
        difficulty: 'Medium'
      },
      {
        id: 9,
        scenario: 'Client confirms attendance at mediation',
        details: 'The AI confirmed details and provided preparation guidelines.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Event Coordination', passed: true },
          { name: 'Client Preparation', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 10,
        scenario: 'User asks about post-settlement tax implications',
        details: 'The AI provided general guidance and advised consulting tax professional.',
        channel: 'Voice',
        passFail: 'Pass',
        skills: [
          { name: 'Financial Guidance', passed: true },
          { name: 'Professional Referral', passed: true }
        ],
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 5,
    status: 'Failed',
    completion: 3,
    total: 5,
    percentage: 60,
    color: STATUS_COLORS.failed,
    date: 'October 15, 2025',
    agent: 'Agent v8',
    isNew: false,
    channels: ['message'],
    description: 'Adequate performance on basic digital channel interactions but shows limitations in handling nuanced legal questions and complex case scenarios.',
    scenarios: [
      {
        id: 1,
        scenario: 'Client sends insurance adjuster contact info',
        details: 'The AI recorded information and confirmed receipt appropriately.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Information Capture', passed: true },
          { name: 'Data Entry', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 2,
        scenario: 'User asks about joint and several liability',
        details: 'The AI failed to explain multiple defendant liability apportionment.',
        channel: 'Digital',
        passFail: 'Fail',
        skills: [
          { name: 'Legal Concepts', passed: false },
          { name: 'Liability Analysis', passed: false }
        ],
        difficulty: 'Hard'
      },
      {
        id: 3,
        scenario: 'Client requests copy of signed retainer agreement',
        details: 'The AI located and sent the executed contract promptly.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Document Retrieval', passed: true },
          { name: 'File Management', passed: true }
        ],
        difficulty: 'Easy'
      },
      {
        id: 4,
        scenario: 'User inquires about diminished value claim',
        details: 'The AI provided incorrect guidance on property damage claim types.',
        channel: 'Digital',
        passFail: 'Fail',
        skills: [
          { name: 'Property Claims', passed: false },
          { name: 'Damage Assessment', passed: false }
        ],
        difficulty: 'Medium'
      },
      {
        id: 5,
        scenario: 'Client confirms email address for correspondence',
        details: 'The AI updated contact preferences and sent test confirmation.',
        channel: 'Digital',
        passFail: 'Pass',
        skills: [
          { name: 'Contact Management', passed: true },
          { name: 'Communication Setup', passed: true }
        ],
        difficulty: 'Easy'
      }
    ]
  }
]
