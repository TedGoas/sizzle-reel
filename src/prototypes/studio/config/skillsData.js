export const skillUsageData = [
	{ name: "Track delivery", count: 78, percentage: 38 },
	{ name: "Order status", count: 206, percentage: 100 },
	{ name: "Return item", count: 165, percentage: 80 },
	{ name: "Sizing advice", count: 184, percentage: 89 },
	{ name: "Reset password", count: 93, percentage: 45 },
];

export const miningOpportunities = [
	{
		name: "Generate returns label",
		description: "Generate returns slips for customers in Northern Ireland.",
		percentage: "27.2",
		colorToken: "var(--dt-color-chart-sequential-01)",
		steps: [
			"Verify details",
			"Check address",
			"Confirm eligibility",
			"Identify items",
			"Generate slip",
			"Send slip",
			"Provide instructions",
			"Log interaction",
		],
	},
	{
		name: "Resolve failed payment in checkout",
		description: "Help customers complete purchases when payment fails.",
		percentage: "9.1",
		colorToken: "var(--dt-color-chart-sequential-02)",
		steps: [
			"Identify error",
			"Verify payment method",
			"Check card details",
			"Retry payment",
			"Confirm transaction",
			"Send receipt",
			"Log issue",
		],
	},
	{
		name: "Damaged items claim",
		description: "Process claims for damaged or defective items.",
		percentage: "7.6",
		colorToken: "var(--dt-color-chart-sequential-03)",
		steps: [
			"Verify purchase",
			"Document damage",
			"Review photos",
			"Determine resolution",
			"Process refund",
			"Arrange pickup",
			"Confirm completion",
		],
	},
	{
		name: "Re-route delivery",
		description: "Update delivery addresses for orders in transit.",
		percentage: "5.3",
		colorToken: "var(--dt-color-chart-sequential-04)",
		steps: [
			"Locate order",
			"Verify new address",
			"Check delivery status",
			"Contact carrier",
			"Update routing",
			"Confirm changes",
			"Notify customer",
		],
	},
	{
		name: "Unlock accounts",
		description: "Help customers regain access to locked accounts.",
		percentage: "2.2",
		colorToken: "var(--dt-color-chart-sequential-05)",
		steps: [
			"Verify identity",
			"Review lock reason",
			"Reset credentials",
			"Unlock account",
			"Send confirmation",
			"Provide guidance",
		],
	},
];

export const miningResults = [
	{
		id: 1,
		name: "Appointment Scheduling",
		description: "Help customers schedule, modify, and cancel appointments",
		occurrences: 12,
	},
	{
		id: 2,
		name: "Document Retrieval",
		description: "Find and send case documents to clients",
		occurrences: 8,
	},
	{
		id: 3,
		name: "Payment Processing",
		description: "Process payments and send receipts",
		occurrences: 6,
	},
];

export const callSources = [
	{ id: 1, name: "BDR Outbound" },
	{ id: 2, name: "Enterprise Sales" },
	{ id: 3, name: "Marketing Inbound" },
	{ id: 4, name: "Mid-Market Sales" },
	{ id: 5, name: "Sales Engineering" },
	{ id: 6, name: "SMB Sales" },
];

export const callPurposeCategories = [
	{ value: "account-management", label: "Account Management" },
	{ value: "appointment", label: "Appointment" },
	{ value: "billing-questions", label: "Billing Questions" },
	{ value: "callback", label: "Callback" },
	{ value: "cancellation", label: "Cancellation" },
	{ value: "claim", label: "Claim" },
	{ value: "complaint", label: "Complaint" },
	{ value: "compliance", label: "Compliance" },
	{ value: "employment", label: "Employment" },
	{ value: "feedback", label: "Feedback" },
	{ value: "legal", label: "Legal" },
	{ value: "loyalty-rewards", label: "Loyalty & Rewards" },
	{ value: "marketing-inquiry", label: "Marketing Inquiry" },
	{ value: "operations", label: "Operations" },
	{ value: "order-status", label: "Order Status" },
	{ value: "product-inquiry", label: "Product Inquiry" },
	{ value: "purchase", label: "Purchase" },
	{ value: "redirect", label: "Redirect" },
	{ value: "refund", label: "Refund" },
	{ value: "return-exchange", label: "Return / Exchange" },
	{ value: "service-maintenance", label: "Service / Maintenance" },
	{ value: "shipping-delivery", label: "Shipping & Delivery" },
	{ value: "tech-product-support", label: "Tech / Product Support" },
	{ value: "warranty", label: "Warranty" },
];

export const archivedSkills = [
  {
    id: 'archived-1',
    name: 'Legacy Order Lookup',
    description: 'Previous order lookup flow, replaced by Package Tracking.',
    status: 'Archived',
    actionCount: 3,
    usageCount: 0,
    passRate: null,
    hasMiningOpportunity: false,
    miningOpportunityName: null,
    workflows: []
  },
  {
    id: 'draft-1',
    name: 'Delivery Rescheduling',
    description: 'Allow customers to reschedule deliveries.',
    status: 'Draft',
    actionCount: 0,
    usageCount: null,
    passRate: null,
    hasMiningOpportunity: true,
    miningOpportunityName: 'Re-route delivery',
    workflows: []
  }
]
