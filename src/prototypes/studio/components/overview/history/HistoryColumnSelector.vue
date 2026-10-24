<template>
	<dt-popover placement="bottom-end" :max-width="300">
		<template #anchor>
			<dt-button importance="outlined" kind="muted" size="sm" icon-position="right">
				<template #icon>
					<dt-icon name="chevron-down" size="200" />
				</template>
				{{ visibleColumnsCount }} columns
			</dt-button>
		</template>
		<template #content>
			<div class="edit-columns-popover">
				<!-- Header -->
				<DtStack direction="row" class="d-jc-space-between d-ai-center edit-columns-header">
					<h3 class="d-headline--sm d-fc-primary">Edit columns</h3>
				</DtStack>

				<!-- Column List -->
				<div class="edit-columns-list">
					<div
						v-for="col in columns"
						:key="col.key"
						class="column-item"
						:class="{ disabled: col.locked }"
						@click="!col.locked && !col.pinned && toggleColumn(col.key)"
					>
						<dt-icon name="grip-vertical" size="300" class="drag-handle" />
						<span class="column-name">{{ col.label }}</span>
						<DtStack direction="row" gap="200">
							<dt-icon v-if="col.pinned" name="lock" size="300" class="lock-icon" />
							<dt-icon
								:name="col.locked || (!modelValue[col.key] && !col.pinned) ? 'eye-off' : 'eye'"
								size="300"
								:class="['visibility-icon', { disabled: col.locked }]"
							/>
						</DtStack>
					</div>
				</div>
			</div>
		</template>
	</dt-popover>
</template>

<script setup>
import { DtStack, DtButton, DtIcon, DtPopover } from '../../ui';

const props = defineProps({
	modelValue: { type: Object, required: true },
	visibleColumnsCount: { type: Number, default: 0 }
});

const emit = defineEmits(['update:modelValue']);

const columns = [
	{ key: 'date',               label: 'Date',                locked: true },
	{ key: 'conversationSummary',label: 'Conversation summary', pinned: true },
	{ key: 'outcome',            label: 'Outcome' },
	{ key: 'escalationReason',   label: 'Escalation reason' },
	{ key: 'handleTime',         label: 'Handle time' },
	{ key: 'guardian',           label: 'Guardian' },
	{ key: 'skills',             label: 'Skills' },
	{ key: 'aiCsat',             label: 'AI CSAT' },
	{ key: 'dollarAmount',       label: 'Dollar amount' },
	{ key: 'customerSentiment',  label: 'Customer sentiment' },
	{ key: 'customerPersonality',label: 'Customer personality' },
	{ key: 'interactions',       label: 'Interactions' },
	{ key: 'channels',           label: 'Channels' },
];

function toggleColumn(key) {
	emit('update:modelValue', { ...props.modelValue, [key]: !props.modelValue[key] });
}
</script>

<style scoped>
.edit-columns-popover {
	margin: calc(var(--dt-space-500, 16px) * -1);
	display: flex;
	flex-direction: column;
	width: 300px;
	background: var(--dt-color-surface-primary);
	border-radius: 16px;
	border: 1px solid var(--dt-color-border-subtle);
	box-shadow: var(--dt-shadow-large, 0 2px 12px 0 rgba(20, 23, 33, 0.30));
	overflow: visible;
}

.edit-columns-header {
	padding: var(--dt-space-450, 14px) var(--dt-space-500, 16px);
	border-bottom: 1px solid var(--dt-color-border-subtle);
}

.edit-columns-list {
	display: flex;
	flex-direction: column;
	padding: var(--dt-space-400, 12px);
	max-height: 400px;
	overflow-y: auto;
	gap: var(--dt-space-200, 4px);
}

.column-item {
	display: flex;
	align-items: center;
	gap: var(--dt-space-400, 12px);
	padding: var(--dt-space-350, 10px) var(--dt-space-400, 12px);
	border-bottom: 1px solid var(--dt-color-border-subtle);
	transition: background-color 0.2s ease;
	cursor: pointer;
}

.column-item:last-child {
	border-bottom: none;
}

.column-item:hover:not(.disabled) {
	background: var(--dt-color-surface-secondary-hover);
}

.column-item.disabled {
	opacity: 0.5;
	cursor: default;
}

.column-item .drag-handle {
	color: var(--dt-color-foreground-secondary);
	cursor: grab;
	flex-shrink: 0;
}

.column-item .column-name {
	flex: 1;
	font: var(--dt-typography-body-md-compact);
	color: var(--dt-color-foreground-primary);
}

.column-item.disabled .column-name {
	color: var(--dt-color-foreground-secondary);
}

.column-item .visibility-icon {
	color: var(--dt-color-foreground-secondary);
	cursor: pointer;
	flex-shrink: 0;
}

.column-item .visibility-icon.disabled {
	color: var(--dt-color-foreground-disabled);
	cursor: default;
}

.column-item .lock-icon {
	color: var(--dt-color-foreground-secondary);
	flex-shrink: 0;
}
</style>
