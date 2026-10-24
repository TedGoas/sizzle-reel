<template>
	<div class="contact-center-config">
		<!-- Contact Center Selection -->
		<div class="form-section">
			<label class="form-label">
				{{ isDepartments ? 'Department' : 'Contact center' }}
			</label>
			<p class="form-helper">All calls will be routed to the agent</p>
			<dt-select-menu
				v-model="selectedContactCenter"
				:options="isDepartments ? departmentOptions : contactCenterOptions"
			/>
		</div>

		<!-- Agent Tone and Voice -->
		<div class="form-section">
			<label class="form-label">Agent tone and voice</label>
			<dt-select-menu
				v-model="selectedTone"
				:options="toneOptions"
			/>
		</div>

		<!-- Default Transfer -->
		<div class="form-section">
			<label class="form-label">Default transfer</label>
			<dt-radio-group
				v-model="defaultTransfer"
				name="defaultTransfer"
			>
				<div class="transfer-options">
					<dt-radio value="operators">
						Operators
					</dt-radio>
					<div v-if="defaultTransfer === 'operators'" class="transfer-dropdown">
					<dt-select-menu
						v-model="selectedOperator"
						:options="operatorOptions"
		/>
				</div>

				<dt-radio value="voicemail">
					Voicemail
				</dt-radio>
				<div v-if="defaultTransfer === 'voicemail'" class="transfer-dropdown">
					<dt-select-menu
						v-model="selectedVoicemail"
						:options="voicemailOptions"
		/>
				</div>

				<dt-radio value="groups"
				>
					Groups
				</dt-radio>
				<div v-if="defaultTransfer === 'groups'" class="transfer-dropdown">
					<dt-select-menu
						v-model="selectedGroup"
						:options="groupOptions"
		/>
				</div>

				<dt-radio value="team-member"
				>
					Team member
				</dt-radio>
				<div v-if="defaultTransfer === 'team-member'" class="transfer-dropdown">
					<dt-select-menu
						v-model="selectedTeamMember"
						:options="teamMemberOptions"
		/>
				</div>

				<dt-radio value="room-phone"
				>
					Room phone/External number
				</dt-radio>
				<div v-if="defaultTransfer === 'room-phone'" class="transfer-dropdown">
					<dt-select-menu
						v-model="selectedRoomPhone"
						:options="roomPhoneOptions"
					/>
				</div>
				</div>
			</dt-radio-group>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { DtSelectMenu, DtRadioGroup, DtRadio } from '../ui';

const props = defineProps({
	isDepartments: {
		type: Boolean,
		default: false
	}
});

// Mock options for contact centers
const contactCenterOptions = [
	{ value: '', label: 'Choose a contact center...', disabled: true },
	{ value: 'sales-cc', label: 'Sales Contact Center' },
	{ value: 'support-cc', label: 'Customer Support' },
	{ value: 'technical-cc', label: 'Technical Support' },
	{ value: 'billing-cc', label: 'Billing & Accounts' },
	{ value: 'enterprise-cc', label: 'Enterprise Sales' },
	{ value: 'retention-cc', label: 'Customer Retention' }
];

// Mock options for departments
const departmentOptions = [
	{ value: '', label: 'Choose a department...', disabled: true },
	{ value: 'sales-dept', label: 'Sales Department' },
	{ value: 'support-dept', label: 'Support Department' },
	{ value: 'cs-dept', label: 'Customer Success' },
	{ value: 'eng-dept', label: 'Engineering' },
	{ value: 'billing-dept', label: 'Billing & Finance' },
	{ value: 'ops-dept', label: 'Operations' }
];

// Mock options for agent tone - realistic AI voice personas
const toneOptions = [
	{ value: '', label: 'Choose agent voice tone...', disabled: true },
	{ value: 'professional', label: 'Professional & Efficient' },
	{ value: 'friendly', label: 'Friendly & Conversational' },
	{ value: 'empathetic', label: 'Empathetic & Supportive' },
	{ value: 'concise', label: 'Concise & Direct' },
	{ value: 'enthusiastic', label: 'Enthusiastic & Energetic' },
	{ value: 'calm', label: 'Calm & Reassuring' }
];

// Mock options for default transfer destinations
const operatorOptions = [
	{ value: '', label: 'Choose an operator...', disabled: true },
	{ value: 'op-sarah', label: 'Sarah Johnson (Operator 1)' },
	{ value: 'op-mike', label: 'Mike Chen (Operator 2)' },
	{ value: 'op-emma', label: 'Emma Rodriguez (Operator 3)' },
	{ value: 'op-james', label: 'James Wilson (Operator 4)' },
	{ value: 'op-lisa', label: 'Lisa Park (Operator 5)' }
];

const voicemailOptions = [
	{ value: '', label: 'Choose a voicemail box...', disabled: true },
	{ value: 'vm-sales', label: 'Sales Team Voicemail' },
	{ value: 'vm-support', label: 'Support Team Voicemail' },
	{ value: 'vm-billing', label: 'Billing Department Voicemail' },
	{ value: 'vm-general', label: 'General Inquiry Voicemail' },
	{ value: 'vm-urgent', label: 'Urgent Issues Voicemail' }
];

const groupOptions = [
	{ value: '', label: 'Choose a group...', disabled: true },
	{ value: 'group-tier1', label: 'Tier 1 Support Group' },
	{ value: 'group-tier2', label: 'Tier 2 Support Group' },
	{ value: 'group-enterprise', label: 'Enterprise Support Group' },
	{ value: 'group-sales', label: 'Inside Sales Group' },
	{ value: 'group-technical', label: 'Technical Specialists Group' },
	{ value: 'group-escalation', label: 'Escalation Team Group' }
];

const teamMemberOptions = [
	{ value: '', label: 'Choose a team member...', disabled: true },
	{ value: 'tm-alex', label: 'Alex Martinez - Senior Support Agent' },
	{ value: 'tm-taylor', label: 'Taylor Kim - Technical Lead' },
	{ value: 'tm-jordan', label: 'Jordan Smith - Customer Success Manager' },
	{ value: 'tm-casey', label: 'Casey Brown - Sales Specialist' },
	{ value: 'tm-morgan', label: 'Morgan Davis - Escalation Manager' },
	{ value: 'tm-riley', label: 'Riley Thompson - Product Expert' }
];

const roomPhoneOptions = [
	{ value: '', label: 'Choose a room or phone number...', disabled: true },
	{ value: 'room-conf1', label: 'Conference Room A - (415) 555-0101' },
	{ value: 'room-conf2', label: 'Conference Room B - (415) 555-0102' },
	{ value: 'room-exec', label: 'Executive Office - (415) 555-0103' },
	{ value: 'room-support', label: 'Support Floor - (415) 555-0104' },
	{ value: 'ext-partner', label: 'External Partner Line - (415) 555-0200' },
	{ value: 'ext-overflow', label: 'Overflow Call Center - (888) 555-0300' }
];

const selectedContactCenter = ref('');
const selectedTone = ref('');
const defaultTransfer = ref('');

// Transfer destination selections
const selectedOperator = ref('');
const selectedVoicemail = ref('');
const selectedGroup = ref('');
const selectedTeamMember = ref('');
const selectedRoomPhone = ref('');
</script>

<style scoped>
.contact-center-config {
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.form-section {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.form-label {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
}

.form-helper {
	font: var(--dt-typography-helper-sm);
	color: var(--dt-color-foreground-secondary);
	margin: 0;
}

.transfer-options {
	display: flex;
	flex-direction: column;
	gap: 0;
	width: 100%;
}

.transfer-options > :deep(.d-radio) {
	margin-bottom: 4px;
}

.transfer-dropdown {
	margin-top: 0;
	margin-bottom: 12px;
	margin-left: 28px;
	margin-right: 0;
}

.transfer-dropdown:last-child {
	margin-bottom: 0;
}

.transfer-dropdown :deep(.dt-select-menu),
.transfer-dropdown :deep(.d-select),
.transfer-dropdown :deep(.d-select__button),
.transfer-dropdown :deep(button) {
	width: 100% !important;
	max-width: 100% !important;
	min-width: 100% !important;
}

:deep(.dt-input) {
	cursor: pointer;
}

:deep(.dt-input input) {
	cursor: pointer;
}
</style>
