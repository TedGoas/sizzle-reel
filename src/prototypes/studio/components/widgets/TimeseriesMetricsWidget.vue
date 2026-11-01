<template>
	<div class="widget timeseries-metrics">
		<DtStack direction="column" gap="100">
			<DtStack direction="row" gap="300" class="widget-header">
				<h3 class="widget-title">Key metrics</h3>
				<DtIcon name="info" size="200" />
			</DtStack>
			<div class="tab-container">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					:class="['tab-button', { active: selectedTab === tab.id }]"
					@click="selectTab(tab.id)"
				>
					<div class="tab-content">
						<DtStack direction="row" gap="400" align="center">
							<p class="tab-label">{{ tab.label }}</p>
							<DtIcon name="info" size="200" />
						</DtStack>
						<p class="tab-metric">{{ tab.rate }}</p>
					</div>
				</button>
			</div>
		</DtStack>
		<div class="agentic-studio__chart-container">
			<svg ref="timeseriesChart"></svg>
		</div>

		<!-- Teleport tooltip to body to prevent clipping -->
		<Teleport to="body">
			<div
				v-if="tooltipData.visible"
				ref="tooltip"
				class="chart-tooltip"
				:class="{ 'tooltip-pinned': tooltipData.pinned }"
				:style="{
					left: tooltipData.x + 'px',
					top: tooltipData.y + 'px',
					transform: tooltipData.offsetLeft
						? 'translateX(-100%)'
						: 'translateX(0)',
				}"
				@mouseenter="handleTooltipMouseEnter"
				@mouseleave="handleTooltipMouseLeave"
			>
				<div class="tooltip-date">{{ tooltipData.date }}</div>
				<div class="tooltip-rate">
					<span class="rate-indicator"></span>
					<span class="rate-label">{{ tooltipData.metricLabel }}</span>
					<span class="rate-value">{{ tooltipData.rate }}</span>
				</div>
				<div class="tooltip-divider"></div>
				<div class="tooltip-row">
					<span>Total conversations:</span>
					<span class="tooltip-value">{{ tooltipData.total }}</span>
				</div>
				<div class="tooltip-row">
					<span>{{ tooltipData.negativeLabel }}:</span>
					<span class="tooltip-value">{{ tooltipData.negative }}</span>
				</div>
				<div class="tooltip-row">
					<span>{{ tooltipData.positiveLabel }}:</span>
					<span class="tooltip-value">{{ tooltipData.positive }}</span>
				</div>
				<dt-button
					v-if="tooltipData.showButton"
					importance="outlined"
					kind="muted"
					@click="handleViewDetails"
				>
					View {{ tooltipData.negativeLabel.toLowerCase() }}</dt-button
				>
			</div>
		</Teleport>

		<!-- Legend -->
		<div class="legend-container">
			<button
				v-for="(series, key) in currentLegendItems"
				:key="key"
				:class="[
					'legend-button',
					{ inactive: !seriesVisibility[selectedTab][key] },
				]"
				@click="toggleSeries(key)"
			>
				<span
					class="legend-indicator"
					:style="{ backgroundColor: series.color }"
				></span>
				<span class="legend-label">{{ series.label }}</span>
			</button>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	onUnmounted,
	watch,
	computed,
	nextTick,
	Teleport,
} from "vue";
import { DtButton, DtStack, DtIcon } from '../ui';
import { useTimeseriesData } from "../../composables/useTimeseriesData.js";
import { useTimeseriesChart } from "../../composables/useTimeseriesChart.js";

const props = defineProps({
	dateRange: {
		type: String,
		default: "past7days",
	},
});

const emit = defineEmits(["navigate-to-history"]);

// State for selected tab and series visibility
const selectedTab = ref("containment");

// Series visibility state for each tab
const seriesVisibility = ref({
	containment: {
		contained: true,
		transferred: true,
		rate: true,
	},
	resolution: {
		resolved: true,
		unresolved: true,
		rate: true,
	},
	skillSuccess: {
		noErrors: true,
		withErrors: true,
		rate: true,
	},
});

// Use data composable to generate mock data and tabs
const { dataConfigs, tabs } = useTimeseriesData(props);

// Use chart composable to handle D3 rendering
const {
	timeseriesChart,
	tooltip,
	tooltipData,
	renderChart,
	setInitialRenderComplete,
	handleTooltipMouseEnter,
	handleTooltipMouseLeave,
	handleViewDetails,
} = useTimeseriesChart({
	dataConfigs,
	selectedTab,
	tabs,
	seriesVisibility,
	emit,
});

// Toggle series visibility
function toggleSeries(seriesKey) {
	seriesVisibility.value[selectedTab.value][seriesKey] =
		!seriesVisibility.value[selectedTab.value][seriesKey];
	renderChart();
}

// Computed property for current legend items
const currentLegendItems = computed(() => {
	const config = dataConfigs.value[selectedTab.value];
	const legendItems = {};

	config.series.forEach((seriesKey) => {
		legendItems[seriesKey] = {
			label: config.labels[seriesKey],
			color: config.colors[seriesKey],
		};
	});

	// Add the line color for the rate line
	legendItems.rate = {
		label: "Rate",
		color: config.lineColor,
	};

	return legendItems;
});

// Select a tab and trigger chart re-render
function selectTab(tabId) {
	selectedTab.value = tabId;
	setInitialRenderComplete();
	renderChart();
}

// Handle click outside to unpin tooltip
function handleClickOutside(event) {
	if (
		tooltipData.value.pinned &&
		tooltip.value &&
		!tooltip.value.contains(event.target) &&
		timeseriesChart.value &&
		!timeseriesChart.value.contains(event.target)
	) {
		tooltipData.value.pinned = false;
		tooltipData.value.visible = false;
	}
}

onMounted(() => {
	renderChart();
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});

// Watch for date range changes
watch(
	() => props.dateRange,
	async () => {
		await nextTick();
		renderChart();
	},
);
</script>

<style scoped>
/* Base widget styles */
.widget {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-550);
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-500);
	padding: var(--dt-space-500, 16px);
	overflow: visible;
}

/* Widget header */
.widget-header {
	margin-bottom: var(--dt-space-400, 12px);
}

/* Widget title styles */
.widget-title {
	font-family: var(--dt-font-family-sans);
	font-size: var(--dt-font-size-200, 12px);
	font-weight: var(--dt-font-weight-medium, 500);
	line-height: var(--dt-font-line-height-300, 1.33);
	margin: 0;
	color: var(--dt-color-foreground-secondary);
}

/* Tab container */
.tab-container {
	display: flex;
	gap: var(--dt-space-500, 16px);
}

/* Tab button */
.tab-button {
	flex: 1;
	padding: var(--dt-space-400, 12px);
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-400, 8px);
	cursor: pointer;
	transition: all 0.2s ease;
}

.tab-button:hover {
	border-color: var(--dt-color-border-moderate);
}

.tab-button.active {
	border-color: var(--dt-color-border-brand);
}

/* Tab content */
.tab-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	gap: var(--dt-space-400, 12px);
	height: 100%;
}

/* Tab metric (hero style) */
.tab-metric {
	font: var(--dt-typography-headline-xl-compact);
	color: var(--dt-color-foreground-primary);
	margin: 0;
}

/* Tab label */
.tab-label {
	font: var(--dt-typography-label-md-plain-compact);
	color: var(--dt-color-foreground-secondary);
	text-align: left;
	margin: 0;
}

/* Legend container */
.legend-container {
	display: flex;
	gap: var(--dt-space-400, 12px);
	flex-wrap: wrap;
}

/* Legend button */
.legend-button {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300, 8px);
	padding: var(--dt-space-300, 8px) var(--dt-space-400, 12px);
	background: var(--dt-action-color-background-muted-default);
	border: none;
	border-radius: var(--dt-size-radius-300, 4px);
	cursor: pointer;
	transition: all 0.2s ease;
	font: var(--dt-typography-body-sm-compact);
	color: var(--dt-color-foreground-primary);
}

.legend-button:hover {
	background: var(--dt-action-color-background-muted-hover);
}

.legend-button.inactive {
	opacity: 0.4;
	text-decoration: line-through;
}

.legend-button.inactive:hover {
	opacity: 0.6;
}

/* Legend indicator */
.legend-indicator {
	width: 16px;
	height: 4px;
	border-radius: 2px;
	display: block;
}

/* Legend label */
.legend-label {
	white-space: nowrap;
}

/* Chart container */
.agentic-studio__chart-container {
	flex: 1;
	position: relative;
	width: 100%;
	min-height: 0;
	overflow: visible;
	border: none;
	background: transparent;
	z-index: 1;
}

.agentic-studio__chart-container svg {
	display: block;
	width: 100%;
	height: 100%;
}

/* Timeseries metrics widget - 6 columns wide, 3 rows tall */
.timeseries-metrics {
	grid-column: 1 / 7;
	grid-row: 1 / 4;
	overflow: visible;
	z-index: 10;
}

/* Chart Tooltip */
.chart-tooltip {
	display: block;
	position: fixed;
	background: var(--dt-color-surface-secondary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-300);
	padding: var(--dt-size-400);
	box-shadow: var(--dt-shadow-card);
	max-width: 220px;
	pointer-events: auto;
	z-index: 10000;
	font-family: var(--dt-font-family-sans);
	transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.chart-tooltip.tooltip-pinned {
	box-shadow: var(--dt-shadow-strong);
	border-color: var(--dt-color-border-brand);
}

.tooltip-date {
	font: var(--dt-typography-label-md-compact);
	color: var(--dt-color-foreground-primary);
	padding-bottom: var(--dt-space-500, 16px);
}

.tooltip-rate {
	font: var(--dt-typography-label-md-plain-compact);
	display: flex;
	align-items: center;
	gap: var(--dt-space-400, 8px);
}

.rate-indicator {
	width: 32px;
	height: 4px;
	background: #1c4d70;
	border-radius: 2px;
}

.rate-label {
	flex: 1;
	font: var(--dt-typography-label-md-plain-compact);
	color: var(--dt-color-foreground-primary);
}

.rate-value {
	font: var(--dt-typography-label-md-plain-compact);
	color: var(--dt-color-foreground-primary);
}

.tooltip-divider {
	height: 1px;
	background: var(--dt-color-border-subtle);
	margin: var(--dt-space-500, 16px) 0;
}

.tooltip-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font: var(--dt-typography-label-md-plain-compact);
	color: var(--dt-color-foreground-primary);
	margin-bottom: var(--dt-space-400, 8px);
}

.tooltip-row:last-child {
	margin-bottom: 0;
}

.tooltip-value {
	font: var(--dt-typography-label-md-plain-compact);
}
</style>
