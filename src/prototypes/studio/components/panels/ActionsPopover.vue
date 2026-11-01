<template>
	<div v-if="visible" class="skill-popover" @click.stop>
		<div class="skill-popover-header">
			<div class="skill-popover-title">
				<dt-icon name="tools" size="300" />
				<span>Actions</span>
			</div>
			<dt-button
				importance="clear"
				kind="muted"
				size="sm"
				circle
				@click="emit('close')"
			>
				<template #icon><dt-icon name="close" size="200" /></template>
			</dt-button>
		</div>

		<p class="skill-popover-desc">
			Add and manage the actions used in this skill.
		</p>

		<div class="search-combobox">
			<dt-input
				v-model="actionsSearchQuery"
				placeholder="Search and add actions"
				size="sm"
				@focus="showDropdown = true"
				@blur="showDropdown = false"
			>
				<template #leftIcon><dt-icon name="search" size="200" /></template>
			</dt-input>

			<div v-if="showDropdown" class="search-dropdown">
				<div
					v-for="action in dropdownItems"
					:key="action.id"
					class="search-dropdown-item"
					@mousedown.prevent
				>
					<slash-source-icon :source="action.source" />
					<span>{{ action.label }}</span>
				</div>
				<div v-if="actionsSearchQuery && dropdownItems.length === 0" class="actions-empty">
					No actions found
				</div>
			</div>
		</div>

		<div
			v-if="connectorGroups.length > 0"
			class="actions-section-divider"
		></div>

		<div v-if="connectorGroups.length > 0" class="actions-connector-list">
			<div
				v-for="group in connectorGroups"
				:key="group.source"
				class="connector-group"
			>
				<div class="connector-group-name">
					{{ connectorNames[group.source] || group.source }}
				</div>

				<dt-select-menu
					:modelValue="modelValue[group.source]"
					:options="connectionOptions[group.source] || []"
					:disabled="lockedConnectors.includes(group.source)"
					size="sm"
					@update:modelValue="updateConnection(group.source, $event)"
				/>

				<button
					class="connector-collapse-toggle"
					@click="toggleConnectorCollapse(group.source)"
				>
					<dt-icon
						:name="collapsedConnectors.includes(group.source) ? 'chevron-right' : 'chevron-down'"
						size="200"
					/>
					{{ group.actions.length }} actions
				</button>

				<div
					v-if="!collapsedConnectors.includes(group.source)"
					class="connector-actions"
				>
					<div
						v-for="action in group.actions"
						:key="action.id"
						class="connector-action-item"
					>
						<slash-source-icon :source="group.source" />
						<span class="action-item-label">{{ action.label }}</span>
						<span
							v-if="action.instances >= 1"
							class="action-instance-count"
						>
							{{ action.instances }}
							{{ action.instances === 1 ? 'instance' : 'instances' }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DtButton, DtIcon, DtInput, DtSelectMenu } from '../ui';

const props = defineProps({
	visible: { type: Boolean, required: true },
	connectorGroups: { type: Array, default: () => [] },
	modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close', 'update:modelValue']);

const actionsSearchQuery = ref('');
const collapsedConnectors = ref([]);
const showDropdown = ref(false);

const connectorNames = {
	'google-calendar': 'Google Calendar',
	'o365-calendar': 'Office 365',
	dialpad: 'Dialpad',
};

const connectionOptions = {
	'google-calendar': [
		{ value: '', label: 'Select a connection' },
		{ value: 'gcal-primary', label: 'Primary Calendar' },
		{ value: 'gcal-work', label: 'Work Calendar' },
	],
	'o365-calendar': [
		{ value: '', label: 'Select a connection' },
		{ value: 'o365-main', label: 'Microsoft 365' },
	],
	dialpad: [{ value: 'aerolabs', label: 'Aerolabs' }],
};

const lockedConnectors = ['dialpad'];

const actionItems = [
	{ id: 'gcal-create', label: 'Create event', source: 'google-calendar' },
	{ id: 'gcal-cancel', label: 'Cancel event', source: 'google-calendar' },
	{ id: 'gcal-delete', label: 'Delete event', source: 'google-calendar' },
	{ id: 'gcal-list', label: 'List events', source: 'google-calendar' },
	{ id: 'o365-cancel', label: 'Cancel events', source: 'o365-calendar' },
	{ id: 'o365-create', label: 'Create events', source: 'o365-calendar' },
	{ id: 'o365-list', label: 'List events', source: 'o365-calendar' },
	{ id: 'dp-sms', label: 'Send SMS', source: 'dialpad' },
	{ id: 'dp-email', label: 'Send email', source: 'dialpad' },
	{ id: 'dp-calendar', label: 'Create calendar event', source: 'dialpad' },
	{ id: 'dp-video', label: 'Join video call', source: 'dialpad' },
];

const dropdownItems = computed(() => {
	const q = actionsSearchQuery.value.trim().toLowerCase();
	if (!q) return actionItems;
	return actionItems.filter((a) => a.label.toLowerCase().includes(q));
});

function toggleConnectorCollapse(source) {
	const idx = collapsedConnectors.value.indexOf(source);
	if (idx === -1) collapsedConnectors.value.push(source);
	else collapsedConnectors.value.splice(idx, 1);
}

function updateConnection(source, value) {
	emit('update:modelValue', { ...props.modelValue, [source]: value });
}

const SlashSourceIcon = {
	props: { source: String },
	components: { DtIcon },
	template: `
		<span class="slash-source-icon">
			<span v-if="source === 'google-calendar'">
				<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="12" height="12" rx="1" fill="white"/>
					<rect x="7.42" y="7.43" width="2.58" height="2.57" fill="#EA4335"/>
					<rect y="7.43" width="2.61" height="2.57" fill="#188038"/>
					<rect x="7.42" width="2.58" height="2.59" fill="#1967D2"/>
					<rect x="7.63" y="2.37" width="2.37" height="5.26" fill="#FBBC04"/>
					<rect x="2.37" y="7.63" width="5.26" height="2.37" fill="#34A853"/>
					<rect width="7.63" height="7.63" fill="#4285F4"/>
				</svg>
			</span>
			<span v-else-if="source === 'o365-calendar'">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="16" height="16" rx="2" fill="#0078D4"/>
					<rect x="4" y="3" width="8" height="1.5" rx="0.5" fill="white" opacity="0.9"/>
					<rect x="4" y="6" width="8" height="6" rx="1" fill="white" opacity="0.15"/>
					<line x1="4" y1="6" x2="12" y2="6" stroke="white" stroke-width="1" opacity="0.9"/>
					<rect x="5" y="7.5" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="9" y="7.5" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="5" y="10" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="9" y="10" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="3" y="2" width="1.5" height="3" rx="0.5" fill="white" opacity="0.9"/>
					<rect x="11.5" y="2" width="1.5" height="3" rx="0.5" fill="white" opacity="0.9"/>
				</svg>
			</span>
			<span v-else-if="source === 'dialpad'">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="8" cy="8" r="7.5" fill="#7C3FFF" stroke="none"/>
					<path d="M8 4.5L9.5 7.2H12L10 8.8L10.8 11.5L8 9.8L5.2 11.5L6 8.8L4 7.2H6.5L8 4.5Z" fill="white"/>
				</svg>
			</span>
			<dt-icon v-else name="zap" size="200" />
		</span>
	`,
};
</script>

<style scoped>
.skill-popover {
	pointer-events: auto;
	flex-shrink: 1;
	min-height: 0;
	width: 100%;
	background: white;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	overflow: visible;
}

.skill-popover-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-shrink: 0;
}

.skill-popover-title {
	display: flex;
	align-items: center;
	gap: 8px;
	font: var(--dt-typography-label-md-compact);
	color: var(--dt-color-foreground-primary);
}

.skill-popover-desc {
	font-size: var(--dt-typography-body-sm-font-size);
	line-height: var(--dt-typography-body-sm-line-height);
	color: var(--dt-color-foreground-secondary);
	margin: 0;
}

.search-combobox {
	position: relative;
}

.search-dropdown {
	position: absolute;
	top: calc(100% + 4px);
	left: 0;
	right: 0;
	background: white;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	max-height: 240px;
	overflow-y: auto;
	z-index: 100;
	display: flex;
	flex-direction: column;
	padding: 4px;
}

.search-dropdown-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	border-radius: 8px;
	font-size: 13px;
	cursor: pointer;
	color: var(--dt-color-foreground-primary);
}

.search-dropdown-item:hover {
	background: var(--dt-color-surface-secondary);
}

.actions-empty {
	font-size: 13px;
	color: var(--dt-color-foreground-tertiary);
	padding: 8px;
	text-align: center;
}

.actions-section-divider {
	height: 1px;
	background: var(--dt-color-border-subtle);
	margin: 0 -16px;
}

.actions-connector-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
	overflow-y: auto;
}

.connector-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.connector-group-name {
	font-size: 13px;
	font-weight: var(--dt-typography-label-md-font-weight);
	color: var(--dt-color-foreground-primary);
}

.connector-collapse-toggle {
	display: flex;
	align-items: center;
	gap: 4px;
	background: none;
	border: none;
	cursor: pointer;
	font-size: 12px;
	color: var(--dt-color-foreground-secondary);
	padding: 0;
	transition: color 0.15s ease;
}

.connector-collapse-toggle:hover {
	color: var(--dt-color-foreground-primary);
}

.connector-actions {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.connector-action-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 0;
	font-size: 13px;
	color: var(--dt-color-foreground-primary);
}

.action-item-label {
	flex: 1;
}

.action-instance-count {
	font-size: 12px;
	color: var(--dt-color-foreground-secondary);
}

.slash-source-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}
</style>
