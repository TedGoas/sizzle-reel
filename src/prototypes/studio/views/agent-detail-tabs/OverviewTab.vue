<template>
	<div class="overview-tab">
		<!-- Time Range Selector -->
		<div class="time-range-selector">
			<dt-button importance="outlined" size="sm">
				Past 7 days
				<dt-icon name="chevron-down" size="200" class="chevron-icon" />
			</dt-button>
		</div>

		<!-- Dashboard Grid -->
		<div class="dashboard-grid">
			<!-- Timeseries Metrics Widget (Containment/Resolution/Skill Success) -->
			<timeseries-metrics-widget date-range="past7days" />

			<!-- Skill Usage Widget -->
			<skill-usage-chart :data="skillUsageData" />

			<!-- Total Conversations Widget -->
			<total-conversations-widget :data="totalConversationsData" />

			<!-- Guardian Alerts Widget -->
			<guardian-alerts-widget :data="guardianAlertsData" />

			<!-- Average Handle Time Widget -->
			<average-handle-time-widget :data="averageHandleTimeData" />

			<!-- AI CSAT Widget -->
			<ai-csat-widget :data="aiCsatData" />
		</div>

		<!-- Improve and Expand Section -->
		<div class="section-header">
			<h2 class="section-title">Improve and expand</h2>
		</div>

		<div class="improve-expand-section">
			<!-- Skill Mining Widget -->
			<skill-mining-widget @mining-cancelled="$emit('mining-cancelled')" />
		</div>
	</div>
</template>

<script setup>
import { DtButton, DtIcon } from '../../components/ui';
import TimeseriesMetricsWidget from "../../components/widgets/TimeseriesMetricsWidget.vue";
import SkillUsageChart from "../../components/charts/SkillUsageChart.vue";
import SkillMiningWidget from "../../components/widgets/SkillMiningWidget.vue";
import TotalConversationsWidget from "../../components/widgets/TotalConversationsWidget.vue";
import GuardianAlertsWidget from "../../components/widgets/GuardianAlertsWidget.vue";
import AverageHandleTimeWidget from "../../components/widgets/AverageHandleTimeWidget.vue";
import AiCsatWidget from "../../components/widgets/AiCsatWidget.vue";
import { skillUsageData } from "../../config/skillsData.js";
import {
	totalConversationsData,
	guardianAlertsData,
	averageHandleTimeData,
	aiCsatData,
} from "../../config/mockData.js";
</script>

<style scoped>

/* Dashboard grid - 12 column responsive grid with fixed row heights */
.dashboard-grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-auto-rows: 150px;
	gap: var(--dt-space-525, 20px);
	width: 100%;
}

/* Base widget styles */
.widget {
	display: flex;
	flex-direction: column;
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-500);
	overflow: hidden;
	height: 100%;
	min-height: 0;
}

/* Widget grid positions - matching new design (>1400px) */
.timeseries-metrics {
	grid-column: 1 / 7;
	grid-row: 1 / 4;
}

/* Responsive breakpoint for screens <1400px */
@media (max-width: 1400px) {
	/* Timeseries metrics: 12 cols wide, 3 rows high, cols 1-12, rows 1-3 */
	.dashboard-grid :deep(.timeseries-metrics) {
		grid-column: 1 / 13;
		grid-row: 1 / 4;
	}

	/* Total conversations: 6 cols wide, 1 row high, cols 1-6, row 4 */
	.dashboard-grid :deep(.total-conversations) {
		grid-column: 1 / 7;
		grid-row: 4;
	}

	/* Guardian alerts: 6 cols wide, 1 row high, cols 7-12, row 4 */
	.dashboard-grid :deep(.guardian-alerts) {
		grid-column: 7 / 13;
		grid-row: 4;
	}

	/* AI CSAT: 6 cols wide, 1 row high, cols 1-6, row 5 */
	.dashboard-grid :deep(.ai-csat) {
		grid-column: 1 / 7;
		grid-row: 5;
	}

	/* Average Handle Time: 6 cols wide, 1 row high, cols 1-6, row 6 */
	.dashboard-grid :deep(.average-handle-time) {
		grid-column: 1 / 7;
		grid-row: 6;
	}

	/* Skill usage: 6 cols wide, 2 rows high, cols 7-12, rows 5-6 */
	.dashboard-grid :deep(.skill-usage) {
		grid-column: 7 / 13;
		grid-row: 5 / 7;
	}
}

/* Section header styles */
.section-header {
	margin-top: var(--dt-space-600, 24px);
	margin-bottom: var(--dt-space-400, 16px);
}

.section-title {
	font: var(--dt-typography-headline-lg-soft);
	color: var(--dt-color-foreground-primary);
	margin: 0;
}

/* Improve and expand section - uses same grid structure with auto row heights */
.improve-expand-section {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-auto-rows: auto;
	gap: var(--dt-space-525, 20px);
	width: 100%;
}

/* Skill mining widget - partial width in new section */
.improve-expand-section .skill-mining {
	grid-column: 1 / 7;
	justify-content: center;
	align-items: center;
	height: auto;
	align-self: start;
	position: relative;
	overflow: hidden;
	padding-bottom: 16px;
}

.improve-expand-section .skill-mining.has-results {
	justify-content: flex-start;
	align-items: stretch;
}

.improve-expand-section .skill-mining.with-banner {
	padding-bottom: 76px;
}

/* Empty state text styles */
.promo-title {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
	text-align: center;
	max-width: 500px;
	margin: 0;
}

.promo-description {
	font: var(--dt-typography-label-md-plain);
	color: var(--dt-color-foreground-secondary);
	text-align: center;
	max-width: 500px;
	margin: 0;
}

/* Skill mining transition animations */
.skill-mining-transition-container {
	transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.mining-content-wrapper {
	width: 100%;
}

/* Fade transition for content swap */
.fade-content-enter-active,
.fade-content-leave-active {
	transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-content-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.fade-content-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.fade-content-enter-to,
.fade-content-leave-from {
	opacity: 1;
	transform: translateY(0);
}

/* Time range selector */
.time-range-selector {
	margin-bottom: 20px;
}

.chevron-icon {
	margin-left: 4px;
}
</style>
