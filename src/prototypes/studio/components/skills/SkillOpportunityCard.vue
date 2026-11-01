<template>
	<div
		class="skill-opportunity-item"
		:data-segment="segment"
		@click="$emit('opportunity-selected', opportunity)"
	>
		<div class="opportunity-content">
			<dt-stack direction="row" gap="500" align="start">
				<div
					class="color-indicator"
					:style="{ background: opportunity.colorToken }"
				></div>
				<dt-stack direction="column" gap="300">
					<h4 class="opportunity-name">{{ opportunity.name }}</h4>
					<p class="opportunity-description">{{ opportunity.description }}</p>
				</dt-stack>
			</dt-stack>
		</div>
		<div class="opportunity-actions">
			<p class="opportunity-name">{{ opportunity.percentage }}%</p>
			<dt-icon name="chevron-right" size="200" />
		</div>
	</div>
</template>

<script setup>
import { DtIcon, DtStack } from '../ui';

defineProps({
	opportunity: {
		type: Object,
		required: true,
	},
	segment: {
		type: Number,
		default: null,
	},
});

defineEmits(["opportunity-selected"]);
</script>

<style scoped>
.skill-opportunity-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	padding: 8px 12px;
	margin: 0 -12px;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s ease;
}

.skill-opportunity-item:hover {
	background-color: var(--dt-action-color-background-muted-hover, #f5f5f5);
}

.opportunity-content {
	flex: 1;
}

.opportunity-header {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-bottom: 4px;
}

.color-indicator {
	width: 12px;
	height: 12px;
	border-radius: 2px;
	flex-shrink: 0;
	margin-top: var(--dt-size-400);
}

.opportunity-name {
	font: var(--dt-typography-label-md-plain-compact);
	color: var(--dt-color-foreground-primary);
	margin: 0;
}

.opportunity-description {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-tertiary);
	margin: 0;
}

.opportunity-actions {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
}

.opportunity-percentage {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-tertiary);
	margin: 0;
}
</style>
