<template>
	<div class="widget skill-usage">
		<dt-stack direction="row" gap="300">
			<h3 class="widget-title">Most used skills</h3>
			<dt-icon name="info" size="200" />
		</dt-stack>
		<div class="agentic-studio__chart-container" style="margin-top: 16px">
			<svg ref="skillUsageChart"></svg>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as d3 from "d3";
import { DtIcon, DtStack } from '../ui';

const props = defineProps({
	data: {
		type: Array,
		required: true,
	},
});

// Chart ref
const skillUsageChart = ref(null);

function renderChart() {
	if (!skillUsageChart.value) {
		console.error("Chart ref not found!");
		return;
	}

	try {
		// Get computed styles to resolve CSS variables
		const styles = getComputedStyle(document.documentElement);
		const chartColor =
			styles.getPropertyValue("--dt-color-chart-sequential-04").trim() ||
			"#6366F1";
		const labelColor =
			styles.getPropertyValue("--dt-color-foreground-primary").trim() ||
			"#1C1C1C";

		// Transform data from old format to new format and sort by value (largest to smallest)
		const chartData = props.data
			.map((skill) => ({
				label: skill.name,
				value: skill.count,
			}))
			.sort((a, b) => b.value - a.value);

		// Set dimensions
		const barHeight = 16;
		const labelHeight = 16;
		const labelGap = 4;
		const itemGap = 12;
		const itemHeight = labelHeight + labelGap + barHeight + itemGap;
		const margin = { top: 0, right: 50, bottom: 0, left: 0 };
		const container = skillUsageChart.value.parentElement;
		const containerWidth = container.clientWidth || 600;
		const containerHeight = container.clientHeight || 300;

		// Calculate chart width from container
		const chartWidth = containerWidth - margin.left - margin.right;

		// Calculate total height needed for all bars (with labels above)
		const chartHeight = chartData.length * itemHeight - itemGap;
		const totalChartHeight = chartHeight + margin.top + margin.bottom;

		// Determine if we need scrolling
		const needsScroll = totalChartHeight > containerHeight;

		// Center the chart vertically when it fits
		const totalWidth = containerWidth;
		const offsetY = needsScroll
			? 0
			: Math.max(0, (containerHeight - totalChartHeight) / 2);

		// Clear any existing content
		d3.select(skillUsageChart.value).selectAll("*").remove();

		// Create SVG
		const svg = d3
			.select(skillUsageChart.value)
			.attr("width", totalWidth)
			.attr("height", totalChartHeight)
			.style("margin-top", `${offsetY}px`)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Create scales
		const x = d3
			.scaleLinear()
			.domain([0, d3.max(chartData, (d) => d.value)])
			.range([0, chartWidth]);

		// Add bars with animation
		svg
			.selectAll(".bar")
			.data(chartData)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("y", (d, i) => i * itemHeight + labelHeight + labelGap)
			.attr("width", 0)
			.attr("height", barHeight)
			.attr("fill", chartColor)
			.attr("rx", 4)
			.transition()
			.duration(600)
			.ease(d3.easeCubicOut)
			.delay((d, i) => i * 50)
			.attr("width", (d) => x(d.value));

		// Add labels (skill names) above bars with fade-in
		svg
			.selectAll(".label")
			.data(chartData)
			.enter()
			.append("text")
			.attr("class", "label")
			.attr("x", 0)
			.attr("y", (d, i) => i * itemHeight)
			.attr("text-anchor", "start")
			.attr("dominant-baseline", "hanging")
			.style("font-size", "15px")
			.style(
				"font-family",
				"'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			)
			.style("fill", labelColor)
			.style("opacity", 0)
			.text((d) => d.label)
			.transition()
			.duration(400)
			.ease(d3.easeCubicOut)
			.delay((d, i) => i * 50)
			.style("opacity", 1);

		// Add value labels at end of bars with animation
		svg
			.selectAll(".value")
			.data(chartData)
			.enter()
			.append("text")
			.attr("class", "value")
			.attr("x", 8)
			.attr(
				"y",
				(d, i) => i * itemHeight + labelHeight + labelGap + barHeight / 2,
			)
			.attr("text-anchor", "start")
			.attr("dominant-baseline", "middle")
			.style("font-size", "15px")
			.style("font-weight", "500")
			.style(
				"font-family",
				"'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			)
			.style("fill", labelColor)
			.style("opacity", 0)
			.text((d) => d.value)
			.transition()
			.duration(600)
			.ease(d3.easeCubicOut)
			.delay((d, i) => i * 50)
			.attr("x", (d) => x(d.value) + 8)
			.style("opacity", 1);
	} catch (error) {
		console.error("Error creating D3 chart:", error);
	}
}

// Initialize chart on mount
onMounted(() => {
	renderChart();
});

// Re-render chart when data changes
watch(
	() => props.data,
	() => {
		renderChart();
	},
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
}

.widget-title {
	font-family: var(--dt-font-family-sans);
	font-size: var(--dt-font-size-200, 12px);
	font-weight: var(--dt-font-weight-medium, 500);
	line-height: var(--dt-font-line-height-300, 1.33);
	margin: 0;
	color: var(--dt-color-foreground-secondary);
}

.agentic-studio__chart-container {
	position: relative;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	border: none;
	background: transparent;
}

.agentic-studio__chart-container svg {
	display: block;
}

/* Skill usage widget - right column, rows 2-3 */
.skill-usage {
	grid-column: 10 / 13;
	grid-row: 2 / 4;
	align-self: start;
}
</style>
