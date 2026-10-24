<template>
	<div class="widget guardian-alerts">
		<dt-stack direction="column" gap="300">
			<dt-stack direction="row" gap="300">
				<h3 class="widget-title">Guardian alerts</h3>
				<dt-icon name="info" size="200" />
			</dt-stack>
			<p class="hero-metric">{{ animatedTotal.toLocaleString() }}</p>
		</dt-stack>
		<dt-stack gap="400" direction="column">
			<div class="agentic-studio__chart-container">
				<svg ref="barChart"></svg>
			</div>
			<dt-stack direction="row" justify="space-between">
				<p class="metric-subtitle">
					Cautions: {{ animatedVoice.toLocaleString() }}
				</p>
				<p class="metric-subtitle">
					High risk: {{ animatedDigital.toLocaleString() }}
				</p>
			</dt-stack>
		</dt-stack>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as d3 from "d3";
import { DtStack, DtIcon } from '../ui';

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
});

const animatedTotal = ref(0);
const animatedVoice = ref(0);
const animatedDigital = ref(0);
const barChart = ref(null);

function animateValue(start, end, duration, callback) {
	const startTime = performance.now();

	function update(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easeOutCubic = 1 - Math.pow(1 - progress, 3);

		callback(Math.floor(start + (end - start) * easeOutCubic));

		if (progress < 1) {
			requestAnimationFrame(update);
		}
	}

	requestAnimationFrame(update);
}

function renderBarChart() {
	if (!barChart.value) return;

	try {
		// Get computed styles for colors
		const styles = getComputedStyle(document.documentElement);
		const voiceColor =
			styles.getPropertyValue("--dt-color-chart-sequential-06").trim() ||
			"#4385CB";
		const digitalColor =
			styles.getPropertyValue("--dt-color-chart-sequential-10").trim() ||
			"#D9524C";

		// Chart dimensions - use container width
		const container = barChart.value.parentElement;
		const width = container ? container.clientWidth : 200;
		const height = 20;
		const borderRadius = 4;
		const gap = 4;

		// Calculate percentages - account for gap
		const total = props.data.voice + props.data.digital;
		const availableWidth = width - gap;
		const voiceWidth = (props.data.voice / total) * availableWidth;
		const digitalWidth = (props.data.digital / total) * availableWidth;

		// Select or create SVG
		const svg = d3
			.select(barChart.value)
			.attr("width", width)
			.attr("height", height);

		// Clear existing content
		svg.selectAll("*").remove();

		// Create voice bar (left)
		svg
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 0)
			.attr("height", height)
			.attr("fill", voiceColor)
			.attr("rx", borderRadius)
			.attr("ry", borderRadius)
			.transition()
			.duration(800)
			.ease(d3.easeCubicOut)
			.attr("width", voiceWidth);

		// Create digital bar (right)
		svg
			.append("rect")
			.attr("x", voiceWidth + gap)
			.attr("y", 0)
			.attr("width", 0)
			.attr("height", height)
			.attr("fill", digitalColor)
			.attr("rx", borderRadius)
			.attr("ry", borderRadius)
			.transition()
			.duration(800)
			.ease(d3.easeCubicOut)
			.delay(200)
			.attr("width", digitalWidth);
	} catch (error) {
		console.error("Error rendering bar chart:", error);
	}
}

onMounted(() => {
	animateValue(0, props.data.total, 800, (val) => (animatedTotal.value = val));
	animateValue(0, props.data.voice, 800, (val) => (animatedVoice.value = val));
	animateValue(
		0,
		props.data.digital,
		800,
		(val) => (animatedDigital.value = val),
	);

	// Render chart after delay to ensure DOM is ready and layout is calculated
	setTimeout(() => {
		renderBarChart();
	}, 500);
});

// Re-render chart when data changes
watch(
	() => props.data,
	() => {
		renderBarChart();
	},
	{ deep: true },
);
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
}

.metric-content {
	flex: 1;
	justify-content: flex-end;
}

.agentic-studio__chart-container {
	width: 100%;
	min-height: 20px;
	display: flex;
	border: none;
	justify-content: flex-start;
}

.agentic-studio__chart-container svg {
	display: block;
	min-height: 20px;
}

.metric-subtitle {
	font: var(--dt-typography-label-sm-plain-compact);
	color: var(--dt-color-foreground-secondary);
	margin: 0;
}

.guardian-alerts {
	grid-column: 10 / 13;
	grid-row: 1;
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
