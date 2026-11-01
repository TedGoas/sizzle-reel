<template>
	<div class="widget ai-csat">
		<dt-stack direction="row" gap="300">
			<h3 class="widget-title">AI CSAT</h3>
			<dt-icon name="info" size="200" />
		</dt-stack>
		<dt-stack gap="400" direction="column" class="metric-content">
			<div class="metric-row">
				<dt-stack direction="row" gap="400">
					<p class="satisfaction-label">{{ satisfactionLevel }}</p>
					<p class="hero-metric">{{ animatedTotal }}</p>
				</dt-stack>
			</div>
			<p class="metric-subtitle">Voice: 3.9, Digital: 4.6</p>
		</dt-stack>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { DtStack, DtIcon } from '../ui';

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
});

const animatedTotal = ref("0.0");

// Computed property for satisfaction level based on CSAT score
const satisfactionLevel = computed(() => {
	const score = parseFloat(animatedTotal.value);

	if (score >= 1 && score < 3) {
		return "Dissatisfied";
	} else if (score >= 3 && score < 4) {
		return "Neutral";
	} else if (score >= 4 && score <= 5) {
		return "Satisfied";
	}
	return "";
});

function animateValue(start, end, duration, callback) {
	const startTime = performance.now();
	const endNum = parseFloat(end);

	function update(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easeOutCubic = 1 - Math.pow(1 - progress, 3);

		const currentValue = start + (endNum - start) * easeOutCubic;
		callback(currentValue.toFixed(1));

		if (progress < 1) {
			requestAnimationFrame(update);
		}
	}

	requestAnimationFrame(update);
}

onMounted(() => {
	animateValue(0, props.data.total, 800, (val) => (animatedTotal.value = val));
});
</script>

<style scoped>
.widget {
	display: flex;
	flex-direction: column;
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

.metric-content {
	flex: 1;
	justify-content: flex-end;
}

.metric-row {
	display: flex;
	align-items: baseline;
	gap: var(--dt-space-400, 12px);
}

.hero-metric {
	font: var(--dt-typography-headline-lg-soft-compact);
	color: var(--dt-color-foreground-primary);
	margin: 0;
	line-height: 1;
}

.satisfaction-label {
	font: var(--dt-typography-headline-xl-compact);
	color: var(--dt-color-foreground-primary);
	margin: 0;
}

.metric-subtitle {
	font: var(--dt-typography-label-sm-plain-compact);
	color: var(--dt-color-foreground-secondary);
	margin: 0;
}

.widget.ai-csat {
	grid-column: 7 / 10;
	grid-row: 2;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
