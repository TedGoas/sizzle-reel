export function getMockFixedSteps() {
	return [
		{
			title: 'Verify Identity',
			detail: 'Confirm the customer\'s identity before accessing or modifying any booking.',
			actions: [],
		},
		{
			title: 'Retrieve Calendars',
			detail: 'Use List Events to get all calendar IDs and the primary time zone.',
			actions: [{ name: 'List Events', type: 'api' }],
		},
		{
			title: 'Collect Details',
			detail: 'Gather the appointment purpose, preferred date and time, and the customer\'s contact information.',
			actions: [],
		},
		{
			title: 'Check Availability',
			detail: 'Use List Events to find open slots within business hours and present up to three options.',
			actions: [{ name: 'List Events', type: 'api' }],
		},
		{
			title: 'Confirm Destructive Actions',
			detail: 'Before any cancellation, apply the Cancel Policy workflow and get explicit customer confirmation.',
			actions: [{ name: 'Cancel Policy', type: 'workflow' }, { name: 'Delete Events', type: 'api' }],
		},
		{
			title: 'Execute Action',
			detail: 'Schedule, modify, or cancel the appointment using the appropriate calendar action.',
			actions: [{ name: 'Create Events', type: 'api' }, { name: 'Update Events', type: 'api' }, { name: 'Delete Events', type: 'api' }],
		},
		{
			title: 'Send Confirmation',
			detail: 'Send the customer a confirmation via Send SMS or Send Email with the appointment details.',
			actions: [{ name: 'Send SMS', type: 'api' }, { name: 'Send Email', type: 'api' }],
		},
	];
}

export function getMockCompassIssues() {
	return [
		{
			id: 1,
			label: '"List Event" doesn\'t match action "List Events"',
			details: {
				suggestions: [
					'Rename the step reference from "List Event" to "List Events" to match the configured action identifier',
					'Alternatively, update the action configuration to register the action as "List Event"',
				],
				reasoning:
					'Action names are case- and character-sensitive. A mismatch between the step reference and the registered action identifier will cause the skill to fail at runtime.',
			},
		},
		{
			id: 2,
			label: '"Create Events" has no connection selected',
			details: {
				suggestions: [
					'Open the "Create Events" action and select a calendar integration connection',
					'If no connection exists, create one under Integrations before configuring this action',
				],
				reasoning:
					'Actions that interact with external services require an authenticated connection. Without one, this step will throw a configuration error.',
			},
		},
		{
			id: 3,
			label: '"Delete Events" needs a confirmation step',
			details: {
				suggestions: [
					'Add a confirmation step before "Delete Events" that asks the customer to confirm the deletion',
					'Include a branch: if confirmed proceed to delete; if declined, return to the previous step',
				],
				reasoning:
					'Destructive actions should always require explicit user confirmation to avoid accidental data loss.',
			},
		},
		{
			id: 4,
			label: '"Cancel Policy" workflow is not configured',
			details: {
				suggestions: [
					'Define the cancellation policy steps: check eligibility, present policy terms, and handle acceptance or rejection',
					'Link the "Cancel Policy" workflow to the relevant action or sub-flow in the instructions',
				],
				reasoning:
					'The instructions reference a "Cancel Policy" workflow but no corresponding steps or sub-flow are defined.',
			},
		},
		{
			id: 5,
			label: '"Send SMS" has no fallback action',
			details: {
				suggestions: [
					'Add a fallback branch after "Send SMS" that handles delivery failure, such as sending an email',
					'Specify a retry count before triggering the fallback to avoid unnecessary escalations',
				],
				reasoning:
					'SMS delivery can fail for various reasons. Without a fallback, the skill will silently fail to notify the customer.',
			},
		},
		{
			id: 6,
			label: 'Identity verification step is undefined',
			details: {
				suggestions: [
					'Add a verification step that collects and validates a customer identifier such as account number or date of birth',
					'Define what happens if verification fails: allow retry, escalate to a human agent, or end the session',
				],
				reasoning:
					'The instructions mention identity verification but provide no definition of how it should occur.',
			},
		},
	];
}
