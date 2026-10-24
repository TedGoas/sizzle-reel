<template>
	<div
		v-if="visible"
		ref="compassPopoverEl"
		class="skill-popover skill-popover--compass"
		@click.stop
	>
		<div class="skill-popover-header">
			<div class="skill-popover-title">
				<dt-icon name="dialpad-sparkle" size="300" />
				<p>Compass review</p>
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

		<p class="skill-popover-desc compass-popover-desc">
			Improve the quality and functionality of your skill by selecting the
			suggestions you want to apply.
		</p>

		<div class="compass-popover-content">
			<span class="compass-section-header">Suggestions</span>
			<div class="compass-items-list">
				<div
					v-for="error in errors"
					:key="error.id"
					class="compass-item"
					:class="{ 'compass-item--hover': hoveredCompassId === error.id }"
					@mouseenter="hoveredCompassId = error.id"
					@mouseleave="hoveredCompassId = null"
				>
					<span class="compass-item-label">{{ error.label }}</span>
					<div class="compass-item-links">
						<a
							v-if="error.details"
							class="compass-item-link"
							href="#"
							@click.prevent="openDetails(error, $event)"
						>View details</a>
						<span
							v-if="hoveredCompassId === error.id"
							class="compass-item-dismiss"
							@click.stop="emit('dismiss-error', error.id)"
						>Ignore</span>
					</div>
				</div>
				<div v-if="errors.length === 0" class="compass-items-empty">
					No improvements found
				</div>
			</div>
		</div>

		<div class="compass-popover-footer">
			<dt-button
				importance="clear"
				kind="muted"
				size="md"
				@click="emit('explain')"
			>
				Explain
			</dt-button>
			<dt-button
				importance="outlined"
				kind="primary"
				size="md"
				@click="emit('fix-all')"
			>
				Improve skill
			</dt-button>
		</div>
	</div>

	<Teleport to="body">
		<div
			v-if="activeCompassIssue"
			class="compass-detail-card"
			:style="detailCardStyle"
			@click.stop
		>
			<div class="compass-detail-header">
				<span class="compass-detail-title">{{ activeCompassIssue.label }}</span>
				<dt-button
					importance="clear"
					kind="muted"
					size="sm"
					circle
					@click="activeCompassIssue = null"
				>
					<template #icon><dt-icon name="close" size="200" /></template>
				</dt-button>
			</div>
			<ul class="compass-detail-suggestions">
				<li
					v-for="(suggestion, i) in activeCompassIssue.details.suggestions"
					:key="i"
				>
					{{ suggestion }}
				</li>
			</ul>
			<div class="compass-detail-reasoning-header">Reasoning</div>
			<p class="compass-detail-reasoning">
				{{ activeCompassIssue.details.reasoning }}
			</p>
		</div>
	</Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { DtButton, DtIcon } from '../ui';

defineProps({
	visible: { type: Boolean, required: true },
	errors: { type: Array, default: () => [] },
	isScanning: { type: Boolean, default: false },
	isShimmering: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'dismiss-error', 'update-checked', 'explain', 'fix-all']);

const hoveredCompassId = ref(null);
const compassPopoverEl = ref(null);
const activeCompassIssue = ref(null);
const detailCardStyle = ref({});

function openDetails(error, event) {
	activeCompassIssue.value = error;
	const linkRect = event.target.getBoundingClientRect();
	const popoverRect = compassPopoverEl.value?.getBoundingClientRect();
	if (linkRect && popoverRect) {
		const cardMaxHeight = 340;
		const padding = 8;
		const top = Math.min(
			Math.max(padding, linkRect.top),
			window.innerHeight - cardMaxHeight - padding,
		);
		detailCardStyle.value = {
			position: 'fixed',
			top: top + 'px',
			right: window.innerWidth - popoverRect.left + 4 + 'px',
			zIndex: 2200,
		};
	}
}
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
	overflow-y: auto;
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

.skill-popover--compass {
	position: relative;
	overflow: hidden;
	padding: 0;
}

.skill-popover--compass .skill-popover-header {
	padding: 16px 16px 0;
	flex-shrink: 0;
}

.compass-popover-desc {
	padding: 0 16px;
	flex-shrink: 0;
	margin-top: -8px;
}

.compass-popover-content {
	flex: 1;
	overflow-y: auto;
	min-height: 0;
	padding: 0 16px 60px;
}

.compass-popover-footer {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 8px 16px 16px;
	background: white;
	pointer-events: none;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	border-radius: 0 0 16px 16px;
}

.compass-popover-footer > * {
	pointer-events: auto;
}

.compass-section-header {
	font: var(--dt-typography-label-md-compact);
	color: var(--dt-color-foreground-primary);
	display: block;
	margin-bottom: 4px;
}

.compass-items-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.compass-item {
	padding: 6px 8px;
	border-radius: 8px;
	background: transparent;
	transition: background 0.1s ease;
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.compass-item--hover {
	background: rgba(28, 28, 28, 0.07);
}

.compass-item-label {
	font: var(--dt-typography-label-sm-plain);
	color: var(--dt-color-foreground-primary);
}

.compass-item-links {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
}

.compass-item-link {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-tertiary);
	text-decoration: underline;
	text-decoration-color: var(--dt-color-foreground-muted);
	cursor: pointer;
}

.compass-item-dismiss {
	font-size: 12px;
	line-height: 1.4;
	color: var(--dt-color-foreground-tertiary);
	cursor: pointer;
	flex-shrink: 0;
}

.compass-items-empty {
	font-size: 13px;
	color: var(--dt-color-foreground-tertiary);
	padding: 8px;
	text-align: center;
}

.compass-detail-card {
	width: 300px;
	max-height: 340px;
	overflow-y: auto;
	background: var(--dt-color-surface-secondary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: 16px;
	box-shadow: var(--dt-shadow-card);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	pointer-events: auto;
}

.compass-detail-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 8px;
}

.compass-detail-title {
	font: var(--dt-typography-label-sm-compact);
	color: var(--dt-color-foreground-primary);
	line-height: 1.4;
}

.compass-detail-suggestions {
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.compass-detail-suggestions li {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.compass-detail-reasoning-header {
	font: var(--dt-typography-label-sm-compact);
	color: var(--dt-color-foreground-primary);
}

.compass-detail-reasoning {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}
</style>
