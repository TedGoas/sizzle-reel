<template>
	<!-- Path 1: Summary strip above the table -->
	<div class="summary-strip">
		<!-- Title -->
		<div class="summary-title">Aggregation ({{ conversations.length }} filtered)</div>

		<!-- Tiles row -->
		<div class="summary-tiles">
			<!-- Deflected -->
			<div class="summary-tile summary-tile--clickable" @click="emit('sort-priority', 'deflected')">
				<span class="tile-value" :class="{ 'tile-value--active': activeTile === 'deflected' }">{{ resolvedCount }}</span>
				<span class="tile-label">Deflected</span>
			</div>

			<!-- Transferred -->
			<div class="summary-tile summary-tile--clickable" @click="emit('sort-priority', 'transferred')">
				<span class="tile-value" :class="{ 'tile-value--active': activeTile === 'transferred' }">{{ escalatedCount }}</span>
				<span class="tile-label">transferred</span>
			</div>

			<!-- AI CSAT -->
			<div class="summary-tile summary-tile--clickable" @click="emit('sort-priority', 'aiCsat')">
				<span class="tile-value" :class="{ 'tile-value--active': activeTile === 'aiCsat' }">{{ avgAiCsat }}</span>
				<span class="tile-label">avg. CSAT</span>
			</div>

			<!-- Total cost -->
			<div v-if="columnVisibility.dollarAmount" class="summary-tile summary-tile--clickable" @click="emit('sort-priority', 'dollarAmount')">
				<span class="tile-value" :class="{ 'tile-value--active': activeTile === 'dollarAmount' }">{{ totalCost }}</span>
				<span class="tile-label">total cost</span>
			</div>

			<!-- Top escalation reason (only if meaningful) -->
			<div v-if="topEscalationReason !== '—'" class="summary-tile summary-tile--clickable" @click="emit('filter', 'escalationReason', topEscalationReason); emit('sort-priority', 'escalationReason:' + topEscalationReason)">
				<span class="tile-value tile-value--text" :class="{ 'tile-value--active': activeTile === 'escalationReason:' + topEscalationReason }">{{ topEscalationReason }}</span>
				<span class="tile-label">top escalation reason</span>
			</div>

			<!-- Guardian threats -->
			<div class="summary-tile summary-tile--clickable" @click="emit('sort-priority', 'guardianThreats')">
				<span class="tile-value" :class="{ 'tile-value--active': activeTile === 'guardianThreats' }">{{ totalGuardianThreats }}</span>
				<span class="tile-label">guardian threats</span>
			</div>

			<!-- Failed skills -->
			<div class="summary-tile summary-tile--clickable" @click="emit('sort-priority', 'failedSkills')">
				<span class="tile-value" :class="{ 'tile-value--active': activeTile === 'failedSkills' }">{{ totalFailedSkills }}</span>
				<span class="tile-label">failed skills</span>
			</div>

		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	conversations: { type: Array, required: true },
	columnVisibility: { type: Object, default: () => ({}) },
	activeTile: { type: String, default: null },
});

const emit = defineEmits(['filter', 'sort-priority']);

const resolvedCount = computed(() => props.conversations.filter(c => c.outcome === 'Deflected').length);
const escalatedCount = computed(() => props.conversations.filter(c => c.outcome === 'Transferred').length);

const avgAiCsat = computed(() => {
	const rated = props.conversations.filter(c => c.aiCsat !== null);
	return rated.length ? (rated.reduce((s, c) => s + c.aiCsat, 0) / rated.length).toFixed(1) : '—';
});

const totalCost = computed(() => '$' + props.conversations.reduce((s, c) => s + (c.dollarAmount || 0), 0).toFixed(2));

const topEscalationReason = computed(() => {
	const counts = {};
	props.conversations.filter(c => c.escalationReason).forEach(c => {
		counts[c.escalationReason] = (counts[c.escalationReason] || 0) + 1;
	});
	return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
});

const totalGuardianThreats = computed(() =>
	props.conversations.reduce((s, c) => s + (c.guardian || 0), 0)
);

const totalFailedSkills = computed(() =>
	props.conversations.reduce((s, c) => s + (c.failedSkills?.length || 0), 0)
);

</script>

<style scoped>
/* Outer card container */
.summary-strip {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--dt-space-350);
	padding: var(--dt-space-450);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-400);
	background: var(--dt-color-surface-secondary);
	margin-bottom: var(--dt-space-400);
}

/* Title */
.summary-title {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

/* Tiles row */
.summary-tiles {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--dt-space-350);
}

/* Individual pill tile */
.summary-tile {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
	padding: var(--dt-space-350) var(--dt-space-450);
	min-height: 38px;
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-400);
	background: var(--dt-color-surface-primary);
	white-space: nowrap;
	transition: background-color 0.15s ease;
}

.summary-tile--clickable {
	cursor: pointer;
}

.summary-tile--clickable:hover {
	background: var(--dt-color-surface-secondary);
}

/* Tile value — bold part */
.tile-value {
	font: var(--dt-typography-headline-sm-compact);
	color: var(--dt-color-foreground-primary);
}

.tile-value--active {
	text-decoration: underline;
}

/* Text value tiles (top reason, top failed skill) */
.tile-value--text {
	font: var(--dt-typography-headline-sm-compact);
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tile-value--critical {
	color: var(--dt-color-foreground-critical);
}

/* Tile label — muted part */
.tile-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

</style>
