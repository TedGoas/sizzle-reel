<template>
	<div class="widget average-handle-time">
		<dt-stack direction="row" gap="300">
			<h3 class="widget-title">Average handle time</h3>
			<dt-icon name="info" size="200" />
		</dt-stack>
		<dt-stack gap="400" direction="column" class="metric-content">
			<p class="hero-metric">{{ data.totalFormatted }}</p>
			<p class="metric-subtitle">
				{{ data.voiceFormatted }} voice, {{ data.digitalFormatted }} digital
			</p>
		</dt-stack>
	</div>
</template>

<script setup>
import { DtStack, DtIcon } from '../ui';

defineProps({
	data: {
		type: Object,
		required: true,
	},
});
</script>

<style scoped>
.widget {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-500);
	padding: var(--dt-space-500, 16px);
	overflow: hidden;
	animation: fadeIn 0.6s ease-out;
}

.widget-title {
	font-family: var(--dt-font-family-sans);
	font-size: var(--dt-font-size-200, 12px);
	font-weight: var(--dt-font-weight-medium, 500);
	line-height: var(--dt-font-line-height-300, 1.33);
	margin: 0;
	color: var(--dt-color-foreground-secondary);
}

.hero-metric {
	font: var(--dt-typography-headline-xl-compact);
	color: var(--dt-color-foreground-primary);
	margin: 0;
	animation: fadeInUp 0.6s ease-out 0.2s both;
}

.metric-subtitle {
	font: var(--dt-typography-label-sm-plain-compact);
	color: var(--dt-color-foreground-secondary);
	margin: 0;
	animation: fadeInUp 0.6s ease-out 0.3s both;
}

.average-handle-time {
	grid-column: 7 / 10;
	grid-row: 3;
}

.metric-content {
	flex: 1;
	justify-content: flex-end;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
