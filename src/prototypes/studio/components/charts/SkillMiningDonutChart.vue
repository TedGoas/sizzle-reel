<template>
	<div style="position: relative; width: 180px; height: 180px; flex-shrink: 0">
		<svg width="180" height="180" viewBox="0 0 180 180">
			<!-- Background circle -->
			<circle
				cx="90"
				cy="90"
				r="70"
				fill="none"
				stroke="var(--dt-color-surface-secondary)"
				stroke-width="28"
			/>

			<!-- Data-driven segments -->
			<!-- Circumference = 2πr = 2 * π * 70 = 439.8 ≈ 440 -->
			<circle
				v-for="(segment, index) in segments"
				:key="index"
				:class="`donut-segment donut-segment-${index + 1}`"
				cx="90"
				cy="90"
				r="70"
				fill="none"
				stroke-width="28"
				:stroke-dashoffset="segment.offset"
				transform="rotate(-90 90 90)"
				:style="{
					'--segment-length': segment.length,
					'--segment-gap': circumference - segment.length,
					'--segment-color': segment.color,
				}"
			/>
		</svg>

		<div
			style="
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				text-align: center;
				width: 90px;
			"
		>
			<div class="donut-metric">{{ totalPercentage }}%</div>
			<div class="donut-label">of calls could<br />be automated</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { miningOpportunities } from "../../config/skillsData.js";

const radius = 70;
const circumference = 2 * Math.PI * radius; // ~440
const gapSize = 2; // 2px gap between segments

// Calculate segments from mining opportunities
const segments = computed(() => {
	const result = [];
	let currentOffset = 0;

	// Add opportunity segments
	miningOpportunities.forEach((opportunity) => {
		const percentage = parseFloat(opportunity.percentage);
		const fullLength = (percentage / 100) * circumference;
		// Make segment slightly shorter to create gap
		const length = fullLength - gapSize;

		result.push({
			length,
			offset: -currentOffset,
			color: opportunity.colorToken,
		});

		// Move offset forward by full length (gap will show background)
		currentOffset += fullLength;
	});

	// Add remaining segment (grey fill)
	const totalUsed = miningOpportunities.reduce(
		(sum, opp) => sum + parseFloat(opp.percentage),
		0,
	);
	const remaining = 100 - totalUsed;

	if (remaining > 0) {
		const fullLength = (remaining / 100) * circumference;
		const length = fullLength - gapSize;
		result.push({
			length,
			offset: -currentOffset,
			color: "var(--dt-color-neutral-400)",
		});
	}

	return result;
});

// Calculate total automation percentage
const totalPercentage = computed(() => {
	const total = miningOpportunities.reduce(
		(sum, opp) => sum + parseFloat(opp.percentage),
		0,
	);
	return total.toFixed(1);
});
</script>

<style scoped>
/* Animate donut segments drawing in */
.donut-segment {
	animation: drawSegment 0.8s ease-out forwards;
	stroke: var(--segment-color);
	stroke-dasharray: 0 440;
}

.donut-segment-1 {
	animation-delay: 1s;
}

.donut-segment-2 {
	animation-delay: 1.8s;
}

.donut-segment-3 {
	animation-delay: 2.6s;
}

.donut-segment-4 {
	animation-delay: 3.4s;
}

.donut-segment-5 {
	animation-delay: 4.2s;
}

.donut-segment-6 {
	animation-delay: 5s;
}

.donut-label {
	font: var(--dt-typography-label-sm-plain-compact);
	color: var(--dt-color-foreground-tertiary);
	margin-top: var(--dt-size-300);
}

.donut-metric {
	font: var(--dt-typography-headline-xl-compact);
	color: var(--dt-color-foreground-primary);
}

@keyframes drawSegment {
	from {
		stroke-dasharray: 0 440;
	}
	to {
		stroke-dasharray: var(--segment-length) var(--segment-gap);
	}
}
</style>
