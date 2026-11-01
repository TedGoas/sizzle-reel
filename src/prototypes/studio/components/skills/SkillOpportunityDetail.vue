<template>
	<div v-if="opportunity" class="opportunity-detail">
		<!-- Description -->
		<section class="detail-section">
			<h3 class="section-title">Description</h3>
			<p class="section-text">{{ opportunity.description }}</p>
		</section>

		<!-- Automation Opportunity -->
		<section class="detail-section">
			<h3 class="section-title">{{ sectionTitle }}</h3>
			<div class="opportunity-metric">
				<span class="metric-value">{{ opportunity.percentage }}%</span>
				<dt-badge v-if="showHighImpact" type="critical" text="High impact">
					<template #leftIcon="{ iconSize }">
						<dt-icon name="flame" :size="iconSize" />
					</template>
				</dt-badge>
			</div>
			<p class="metric-description">
				This scenario was present in 341/1000 calls analyzed. Based on this
				analysis, this skill could automate up to {{ opportunity.percentage }}%
				of calls in a similar period.
			</p>
			<button class="view-details-link">
				<dt-icon name="chevron-right" size="200" />
				<span>View details</span>
			</button>
		</section>

		<!-- Steps -->
		<section v-if="opportunity.steps" class="detail-section">
			<h3 class="section-title">Steps</h3>
			<p class="section-subtitle">
				Most common path identified for this scenario.
			</p>
			<ul class="steps-list">
				<li v-for="(step, index) in opportunity.steps" :key="index">
					<span class="step-number">{{ index + 1 }}.</span>
					<span class="step-text">{{ step }}</span>
				</li>
			</ul>
		</section>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { DtIcon, DtBadge } from '../ui';

const props = defineProps({
	opportunity: {
		type: Object,
		default: () => null,
		validator: (value) => {
			// Allow null/undefined (for v-if guard in template)
			if (!value) return true;
			// Validate required fields exist
			return (
				typeof value.name === "string" &&
				(typeof value.percentage === "string" ||
					typeof value.percentage === "number") &&
				typeof value.description === "string" &&
				Array.isArray(value.steps)
			);
		},
	},
	sectionTitle: {
		type: String,
		default: "Calls this skill could handle",
	},
});

const showHighImpact = computed(() => {
	if (!props.opportunity || !props.opportunity.percentage) return false;
	const percentage = parseFloat(props.opportunity.percentage);
	return percentage >= 20;
});
</script>

<style scoped>
.opportunity-detail {
	display: flex;
	flex-direction: column;
}

.detail-section {
	margin-bottom: 32px;
}

.section-title {
	font-size: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
}

.section-subtitle {
	font-size: var(--dt-typography-body-md);
	color: var(--dt-color-foreground-secondary);
}

.section-text {
	font-size: 15px;
	color: #333;
	margin: 0;
	line-height: 1.5;
}

.opportunity-metric {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 12px;
}

.metric-value {
	font: var(--dt-typography-headline-lg-soft);
	color: var(--dt-color-foreground-primary);
}

.metric-description {
	font: var(--dt-typography-body-md);
	color: var(--dt-color-foreground-primary);
}

.view-details-link {
	display: flex;
	align-items: center;
	gap: 4px;
	background: none;
	border: none;
	color: #1976d2;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	padding: 4px 0;
}

.view-details-link:hover {
	text-decoration: underline;
}

.steps-list {
	list-style: none;
	padding-left: 0;
	margin: 0;
}

.steps-list li {
	display: flex;
	gap: 8px;
	font-size: 15px;
	color: #333;
	margin-bottom: 8px;
	line-height: 1.5;
}

.step-number {
	font-weight: 500;
	color: #333;
	flex-shrink: 0;
}

.step-text {
	flex: 1;
}
</style>
