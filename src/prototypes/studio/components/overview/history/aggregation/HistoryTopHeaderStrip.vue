<template>
	<!-- Path 1: aggregation bar as a div inside .table-container, above <table> -->
	<div class="top-header-strip">
		<!-- Total conversations -->
		<div class="bar-item" @click="emit('sort-priority', 'conversations')">
			<span class="bar-value" :class="{ 'bar-value--active': activeTile === 'conversations' }">{{ conversations.length }}</span>
			<span class="bar-label">conversations</span>
		</div>

		<span class="bar-divider" />

		<!-- Deflected -->
		<div class="bar-item" @click="emit('sort-priority', 'deflected')">
			<span class="bar-value" :class="{ 'bar-value--active': activeTile === 'deflected' }">{{ deflectedCount }}</span>
			<span class="bar-label">deflected</span>
		</div>

		<span class="bar-divider" />

		<!-- Transferred -->
		<div class="bar-item" @click="emit('sort-priority', 'transferred')">
			<span class="bar-value" :class="{ 'bar-value--active': activeTile === 'transferred' }">{{ transferredCount }}</span>
			<span class="bar-label">transferred</span>
		</div>

		<span class="bar-divider" />

		<!-- Avg. AI CSAT -->
		<div class="bar-item" @click="emit('sort-priority', 'aiCsat')">
			<span class="bar-value" :class="{ 'bar-value--active': activeTile === 'aiCsat' }">{{ avgAiCsat }}</span>
			<span class="bar-label">avg. AI CSAT</span>
		</div>

		<!-- Top escalation reason (only if meaningful) -->
		<template v-if="topEscalationReason !== '—'">
			<span class="bar-divider" />
			<div class="bar-item" @click="emit('sort-priority', 'escalationReason:' + topEscalationReason)">
				<span class="bar-value bar-value--text" :class="{ 'bar-value--active': activeTile === 'escalationReason:' + topEscalationReason }">{{ topEscalationReason }}</span>
				<span class="bar-label">top escalation reason</span>
			</div>
		</template>

		<span class="bar-divider" />

		<!-- Guardian threats -->
		<div class="bar-item" @click="emit('sort-priority', 'guardianThreats')">
			<span class="bar-value" :class="{ 'bar-value--active': activeTile === 'guardianThreats' }">{{ totalGuardianThreats }}</span>
			<span class="bar-label">guardian threats</span>
		</div>

		<span class="bar-divider" />

		<!-- Failed skills -->
		<div class="bar-item" @click="emit('sort-priority', 'failedSkills')">
			<span class="bar-value" :class="{ 'bar-value--active': activeTile === 'failedSkills' }">{{ totalFailedSkills }}</span>
			<span class="bar-label">failed skills</span>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	conversations: { type: Array, required: true },
	activeTile: { type: String, default: null },
});

const emit = defineEmits(['sort-priority']);

const deflectedCount = computed(() => props.conversations.filter(c => c.outcome === 'Deflected').length);
const transferredCount = computed(() => props.conversations.filter(c => c.outcome === 'Transferred').length);

const avgAiCsat = computed(() => {
	const rated = props.conversations.filter(c => c.aiCsat !== null);
	return rated.length ? (rated.reduce((s, c) => s + c.aiCsat, 0) / rated.length).toFixed(1) : '—';
});

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
.top-header-strip {
	display: flex;
	padding: var(--dt-space-450);
	align-items: center;
	gap: var(--dt-space-350);
	background: var(--dt-color-surface-secondary);
	border-bottom: 1px solid var(--dt-color-border-subtle);
}

.bar-item {
	display: flex;
	align-items: center;
	gap: var(--dt-space-200);
	white-space: nowrap;
	cursor: pointer;
}

.bar-value--active {
	text-decoration: underline;
}

.bar-value {
	font: var(--dt-typography-headline-sm-compact);
	color: var(--dt-color-foreground-primary);
}

.bar-value--text {
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.bar-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.bar-divider {
	width: 1px;
	height: 16px;
	background: var(--dt-color-border-subtle);
	flex-shrink: 0;
}
</style>
