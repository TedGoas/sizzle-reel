<template>
	<!-- Path 2: Aggregation strip as a dedicated <tbody> row inside the table -->
	<tbody class="aggregation-strip-body">
		<tr class="aggregation-row">
			<!-- Date cell — scope label -->
			<td class="agg-cell agg-cell--sticky agg-cell--label">
				<div class="agg-value">Σ {{ conversations.length }}</div>
				<div class="agg-label">conversations</div>
			</td>

			<!-- Conversation summary — blank -->
			<td class="agg-cell"></td>

			<!-- Outcome -->
			<td class="agg-cell">
				<div class="agg-outcome">
					<span class="agg-resolved">{{ resolvedCount }} deflected</span>
					<span class="agg-escalated">{{ escalatedCount }} transferred</span>
				</div>
			</td>

			<!-- Escalation reason — top value -->
			<td v-if="columnVisibility.escalationReason" class="agg-cell">
				<div class="agg-label">Top reason</div>
				<div class="agg-value agg-value--sm">{{ topEscalationReason }}</div>
			</td>

			<!-- Handle time -->
			<td class="agg-cell">
				<div class="agg-label">Avg</div>
				<div class="agg-value">{{ avgHandleTime }}</div>
			</td>

			<!-- Guardian -->
			<td class="agg-cell">
				<div class="agg-label">Total threats</div>
				<div class="agg-value">{{ totalThreats }}</div>
			</td>

			<!-- Skills — failed count -->
			<td class="agg-cell">
				<div class="agg-label">Failed</div>
				<div class="agg-value">{{ totalFailedSkills }}</div>
			</td>

			<!-- AI CSAT -->
			<td v-if="columnVisibility.aiCsat" class="agg-cell">
				<div class="agg-label">Avg</div>
				<div class="agg-value">{{ avgAiCsat }}</div>
			</td>

			<!-- Dollar amount -->
			<td v-if="columnVisibility.dollarAmount" class="agg-cell">
				<div class="agg-label">Total</div>
				<div class="agg-value">{{ totalCost }}</div>
			</td>

			<!-- Customer sentiment — distribution -->
			<td v-if="columnVisibility.customerSentiment" class="agg-cell">
				<div class="agg-label">Sentiment</div>
				<div class="agg-sentiment">
					<span class="sent-pos">{{ sentimentBreakdown.Positive }}P</span>
					<span class="sent-neu">{{ sentimentBreakdown.Neutral }}N</span>
					<span class="sent-neg">{{ sentimentBreakdown.Negative }}Neg</span>
				</div>
			</td>

			<!-- Customer personality — blank (semantic field) -->
			<td v-if="columnVisibility.customerPersonality" class="agg-cell"></td>

			<!-- Interactions -->
			<td v-if="columnVisibility.interactions" class="agg-cell">
				<div class="agg-label">Avg</div>
				<div class="agg-value">{{ avgInteractions }}</div>
			</td>

			<!-- Channels — blank (categorical) -->
			<td v-if="columnVisibility.channels" class="agg-cell"></td>
		</tr>
	</tbody>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	conversations: { type: Array, required: true },
	columnVisibility: { type: Object, required: true }
});

const resolvedCount = computed(() => props.conversations.filter(c => c.outcome === 'Deflected').length);
const escalatedCount = computed(() => props.conversations.filter(c => c.outcome === 'Transferred').length);

const avgHandleTime = computed(() => {
	if (!props.conversations.length) return '—';
	const avg = props.conversations.reduce((s, c) => s + (c.handleTime || 0), 0) / props.conversations.length;
	const mins = Math.floor(avg / 60);
	const secs = Math.round(avg % 60);
	return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
});

const totalThreats = computed(() => props.conversations.reduce((s, c) => s + (c.guardian || 0), 0));

const avgAiCsat = computed(() => {
	const rated = props.conversations.filter(c => c.aiCsat !== null);
	if (!rated.length) return '—';
	return (rated.reduce((s, c) => s + c.aiCsat, 0) / rated.length).toFixed(1);
});

const totalCost = computed(() => '$' + props.conversations.reduce((s, c) => s + (c.dollarAmount || 0), 0).toFixed(2));

const topEscalationReason = computed(() => {
	const counts = {};
	props.conversations.filter(c => c.escalationReason).forEach(c => {
		counts[c.escalationReason] = (counts[c.escalationReason] || 0) + 1;
	});
	return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
});

const sentimentBreakdown = computed(() => ({
	Positive: props.conversations.filter(c => c.customerSentiment === 'Positive').length,
	Neutral: props.conversations.filter(c => c.customerSentiment === 'Neutral').length,
	Negative: props.conversations.filter(c => c.customerSentiment === 'Negative').length,
}));

const totalFailedSkills = computed(() =>
	props.conversations.reduce((s, c) => s + (c.failedSkills?.length || 0), 0)
);

const avgInteractions = computed(() => {
	if (!props.conversations.length) return '—';
	const avg = props.conversations.reduce((s, c) => s + (c.interactions || 0), 0) / props.conversations.length;
	return avg.toFixed(1);
});
</script>

<style scoped>
.aggregation-strip-body {
	border-bottom: 2px solid var(--dt-color-border-subtle);
}

.aggregation-row {
	background: var(--dt-color-surface-secondary);
}

.aggregation-row td {
	padding: var(--dt-space-400) var(--dt-space-500);
	border-bottom: none;
}

.agg-cell {
	vertical-align: middle;
}

.agg-cell--sticky {
	position: sticky;
	left: 0;
	background: var(--dt-color-surface-secondary);
	z-index: 1;
}

.agg-cell--label {
	vertical-align: middle;
}

.agg-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
	line-height: 1.2;
}

.agg-value {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
	font-weight: 600;
}

.agg-value--sm {
	font: var(--dt-typography-body-sm-compact);
	font-weight: 600;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 120px;
}

.agg-value--critical {
	color: var(--dt-color-foreground-critical);
}

.agg-outcome {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.agg-resolved {
	font: var(--dt-typography-body-sm-compact);
	color: var(--dt-color-foreground-success);
}

.agg-escalated {
	font: var(--dt-typography-body-sm-compact);
	color: var(--dt-color-foreground-warning);
}

.agg-sentiment {
	display: flex;
	gap: var(--dt-space-200);
	flex-wrap: wrap;
}

.sent-pos { font: var(--dt-typography-body-sm-compact); color: var(--dt-color-foreground-success); }
.sent-neu { font: var(--dt-typography-body-sm-compact); color: var(--dt-color-foreground-secondary); }
.sent-neg { font: var(--dt-typography-body-sm-compact); color: var(--dt-color-foreground-critical); }
</style>
