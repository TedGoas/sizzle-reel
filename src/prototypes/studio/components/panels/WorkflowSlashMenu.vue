<template>
	<Teleport to="body">
		<div
			v-if="show"
			class="slash-submenu slash-workflow-submenu"
			:style="{ top: position.top + 'px', left: position.left + 'px' }"
			@mousedown.prevent
		>
			<div class="slash-workflow-search">
				<dt-input
					v-model="search"
					placeholder="Search workflows"
					size="sm"
					@keydown.escape.stop="emit('close')"
				/>
			</div>

			<template v-if="!search">
				<div class="slash-section-label slash-section-label--spaced">Digital</div>
				<div
					v-for="item in workflowSubmenu.digital"
					:key="item.id"
					class="slash-submenu-item"
					@click.stop="emit('select', item)"
				>
					{{ item.label }}
				</div>
				<div class="slash-divider" />
				<div class="slash-section-label slash-section-label--spaced">Voice</div>
				<div
					v-for="item in workflowSubmenu.voice"
					:key="item.id"
					class="slash-submenu-item"
					@click.stop="emit('select', item)"
				>
					{{ item.label }}
				</div>
			</template>

			<template v-else>
				<div
					v-for="item in filteredItems"
					:key="item.id"
					class="slash-submenu-item"
					@click.stop="emit('select', item)"
				>
					<span class="slash-submenu-label">{{ item.label }}</span>
					<span class="slash-item-category">{{ item.category }}</span>
				</div>
				<div v-if="!filteredItems.length" class="slash-no-results">No workflows found</div>
			</template>
		</div>
		<div v-if="show" class="workflow-slash-overlay" @click="emit('close')" />
	</Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { DtInput } from '../ui';

const props = defineProps({
	show:     { type: Boolean, default: false },
	position: { type: Object,  default: () => ({ top: 0, left: 0 }) },
});

const emit = defineEmits(['select', 'close']);
const search = defineModel('search', { default: '' });

const workflowSubmenu = {
	digital: [
		{ id: 'wf-account-cancel',  label: 'Account cancellations' },
		{ id: 'wf-change-prefs',    label: 'Change preferences'    },
		{ id: 'wf-update-settings', label: 'Update settings'       },
		{ id: 'wf-renewals',        label: 'Manage renewals'       },
	],
	voice: [
		{ id: 'wf-cancel-orders', label: 'Cancel orders'       },
		{ id: 'wf-cancel-policy', label: 'Cancel Policy'       },
		{ id: 'wf-event-cancel',  label: 'Event cancellations' },
		{ id: 'wf-cancel-appt',   label: 'Cancel appointment'  },
		{ id: 'wf-refund',        label: 'Request refund'      },
		{ id: 'wf-feedback',      label: 'Feedback submission' },
	],
};

const filteredItems = computed(() => {
	if (!search.value) return [];
	const q = search.value.toLowerCase();
	return [
		...workflowSubmenu.digital.filter(i => i.label.toLowerCase().includes(q)).map(i => ({ ...i, category: 'Digital' })),
		...workflowSubmenu.voice.filter(i => i.label.toLowerCase().includes(q)).map(i => ({ ...i, category: 'Voice' })),
	];
});
</script>

<style scoped>
.slash-submenu {
	position: fixed;
	z-index: 2000;
	background: #f9f9f9;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 8px;
	padding: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	gap: 1px;
	max-height: calc(100vh - 32px);
	overflow-y: auto;
}

.slash-workflow-submenu {
	border-radius: 16px;
	min-width: 240px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.04), 0 2px 16px rgba(0, 0, 0, 0.08);
}

.slash-workflow-search {
	padding: 4px 4px 8px;
}

.slash-section-label {
	padding: 2px 8px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: #808080;
	line-height: 1.4;
}

.slash-section-label--spaced {
	padding-top: 4px;
}

.slash-divider {
	height: 1px;
	background: rgba(28, 28, 28, 0.1);
	margin: 3px 0;
}

.slash-submenu-item {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 5px 8px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #1c1c1c;
	line-height: 22px;
	transition: background 0.1s ease;
}

.slash-submenu-item:hover {
	background: rgba(28, 28, 28, 0.08);
}

.slash-submenu-label {
	flex: 1;
}

.slash-item-category {
	font-size: 12px;
	color: #999;
}

.slash-no-results {
	padding: 8px;
	font-size: 13px;
	color: #999;
	text-align: center;
}

.workflow-slash-overlay {
	position: fixed;
	inset: 0;
	z-index: 1999;
}
</style>
