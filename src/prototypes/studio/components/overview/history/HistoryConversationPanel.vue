<template>
	<Transition name="slide">
		<div v-if="conversation" class="conversation-sidepanel">
			<DtStack direction="column" gap="0" class="sidepanel-content">
				<!-- Header -->
				<DtStack direction="row" class="d-jc-space-between d-ai-center sidepanel-header">
					<h2 class="d-headline--md d-fc-primary">Details</h2>
					<dt-button importance="clear" size="xs" @click="emit('close')">
						<template #icon>
							<dt-icon name="close" size="300" />
						</template>
					</dt-button>
				</DtStack>

				<!-- Tabs -->
				<div class="sidepanel-tabs">
					<div class="tabs-container">
						<button
							v-for="tab in tabs"
							:key="tab.key"
							:class="['tab-button', { active: activeTab === tab.key }]"
							@click="activeTab = tab.key"
						>
							{{ tab.label }}
						</button>
					</div>
				</div>

				<!-- Tab Content -->
				<div class="sidepanel-body">

					<!-- Summary Tab -->
					<div v-if="activeTab === 'summary'" class="summary-tab">
						<p class="summary-text">{{ conversation.summary || 'No summary available.' }}</p>

						<!-- 2×2 metric grid -->
						<div class="summary-metrics">
							<div class="metric-card">
								<span class="metric-label">Outcome</span>
								<div class="metric-value">
									<dt-icon name="arrow-right" size="200" />
									{{ conversation.outcome }}
								</div>
							</div>
							<div class="metric-card">
								<span class="metric-label">AI CSAT</span>
								<div v-if="conversation.aiCsat" class="metric-value metric-value--csat">
									<span>{{ conversation.aiCsat }}</span>
									<div class="csat-bar">
										<div class="csat-fill" :style="{ width: (conversation.aiCsat / 5 * 100) + '%' }" />
									</div>
									<span class="metric-secondary">/5</span>
								</div>
								<div v-else class="metric-value metric-value--muted">—</div>
							</div>
							<div class="metric-card">
								<span class="metric-label">Handle time</span>
								<div class="metric-value">
									<dt-icon name="clock" size="200" />
									{{ formatHandleTime(conversation.handleTime) }}
								</div>
							</div>
							<div class="metric-card">
								<span class="metric-label">Channel</span>
								<div class="metric-value">{{ conversation.channel }}</div>
							</div>
						</div>

						<!-- Skills used -->
						<div v-if="conversation.skills?.length" class="summary-skills">
							<span class="summary-skills-label">Skills used</span>
							<div class="summary-skills-chips">
								<span
									v-for="skill in conversation.skills"
									:key="skill"
									class="summary-skill-chip"
									:class="{ 'summary-skill-chip--failed': isFailed(skill) }"
								>
									{{ isFailed(skill) ? `${skill} — failed` : skill }}
								</span>
							</div>
						</div>

						<!-- Completed with errors banner -->
						<div v-if="conversation.failedSkills?.length" class="errors-banner">
							<div class="errors-banner-header">
								<div class="errors-banner-left">
									<dt-icon name="circle-x" size="200" />
									<span>Completed with errors</span>
								</div>
								<dt-icon name="chevron-down" size="200" />
							</div>
							<div class="errors-banner-sub">
								<span>Failed to complete task</span>
								<span class="errors-related-badge">{{ conversation.failedSkills.length }} related</span>
							</div>
						</div>
					</div>

					<!-- Conversation Tab (previously Transcript) -->
					<div v-else-if="activeTab === 'conversation'" class="transcript-content">
						<template v-for="(message, index) in transcriptMessages" :key="index">
							<div
								class="message-item"
								:class="message.type === 'agent' ? 'agent-message' : 'user-message'"
							>
								<!-- Avatar -->
								<div class="message-avatar" :class="message.type === 'agent' ? 'agent-avatar' : 'user-avatar'">
									<dt-icon v-if="message.type === 'user'" name="user" size="300" />
									<span v-else>D</span>
								</div>

								<!-- Message Content -->
								<div class="message-content">
									<div class="message-header">
										<span class="message-sender">{{ message.sender }}</span>
										<span class="message-time">{{ message.time }}</span>
									</div>
									<div class="message-metadata">
										<dt-icon :name="message.metadata.icon" size="200" />
										<span>{{ message.metadata.text }}</span>
									</div>
									<div class="message-text">
										<template v-if="Array.isArray(message.content)">
											<ul class="message-list">
												<li v-for="(item, i) in message.content" :key="i">{{ item }}</li>
											</ul>
										</template>
										<template v-else>
											{{ message.content }}
										</template>

										<!-- Source Section (only for last agent message) -->
										<template v-if="message.hasSources && index === transcriptMessages.length - 1">
											<div class="source-section">
												<dt-button
													importance="clear"
													size="xs"
													class="source-toggle"
													@click="showSources = !showSources"
												>
													<template #icon>
														<dt-icon :name="showSources ? 'chevron-down' : 'chevron-right'" size="200" />
													</template>
												</dt-button>
												<span class="source-label">Source</span>
											</div>

											<Transition name="expand">
												<div v-if="showSources" class="source-links">
													<a href="#" class="source-link" @click.prevent>
														<span>Understanding {{ conversation?.skills[0] || 'Services' }}</span>
														<dt-icon name="copy" size="200" />
													</a>
													<a href="#" class="source-link" @click.prevent>
														<span>How to Use {{ conversation?.skills[1] || 'Our Platform' }}</span>
														<dt-icon name="copy" size="200" />
													</a>
												</div>
											</Transition>
										</template>
									</div>

									<!-- View Summary Link (only for last agent message) -->
									<a
										v-if="message.hasSources && index === transcriptMessages.length - 1"
										href="#"
										class="view-summary-link"
										@click.prevent
									>
										View summary
										<dt-icon name="external-link" size="200" />
									</a>
								</div>
							</div>

							<!-- Threat Detected Badge -->
							<div v-if="index === 1 && conversation?.guardian > 0" class="threat-badge">
								<DtStack direction="row" gap="300" class="d-ai-center">
									<dt-icon name="alert-circle" size="200" />
									<span class="d-label--md">Threat detected</span>
									<span class="d-body--sm d-fc-secondary">{{ formatTime(conversation.time) }}</span>
								</DtStack>
								<dt-icon name="shield-alert" size="200" class="threat-badge-icon" />
							</div>
						</template>
					</div>

					<!-- Timeline Tab -->
					<div v-else-if="activeTab === 'timeline'" class="timeline-tab">
						<!-- Duration overview card -->
						<div v-if="conversation.timelineSummary" class="tl-overview-card">
							<div class="tl-overview-row">
								<span class="tl-overview-label">Conversation duration</span>
								<span class="tl-overview-duration">{{ conversation.timelineSummary.totalDuration }}</span>
							</div>
							<div class="tl-bar">
								<div
									v-for="(seg, i) in conversation.timelineSummary.breakdown"
									:key="i"
									class="tl-bar-seg"
									:class="`tl-bar-seg--${i}`"
									:style="{ width: seg.pct + '%' }"
								/>
							</div>
							<div
								v-for="(seg, i) in conversation.timelineSummary.breakdown"
								:key="i"
								class="tl-breakdown-row"
							>
								<span class="tl-dot" :class="`tl-dot--${i}`" />
								<span class="tl-seg-label">{{ seg.label }}<template v-if="seg.count"> ×{{ seg.count }}</template></span>
								<span class="tl-seg-duration">{{ seg.duration }}</span>
								<span class="tl-seg-pct">{{ seg.pct }}%</span>
							</div>
							<div class="tl-idle-row">
								<DtToggle size="sm" :checked="true" />
								<span>Include idle</span>
							</div>
						</div>

						<!-- Event list -->
						<div v-if="conversation.timeline" class="tl-events">
							<div
								v-for="(event, i) in conversation.timeline"
								:key="i"
								class="tl-event"
								:class="{
									'tl-event--error': event.type === 'tool_error',
									'tl-event--idle': event.type === 'customer_idle',
								}"
							>
								<!-- customer_message -->
								<template v-if="event.type === 'customer_message'">
									<dt-icon name="chat-two" size="300" class="tl-event-icon" />
									<div class="tl-event-body">
										<span class="tl-event-title">Customer message received</span>
										<span class="tl-event-sub">{{ event.text }}</span>
									</div>
								</template>

								<!-- agent_reasoning -->
								<template v-else-if="event.type === 'agent_reasoning'">
									<dt-icon name="brain" size="300" class="tl-event-icon" />
									<div class="tl-event-body">
										<div class="tl-event-header">
											<span class="tl-event-title">Agent reasoning</span>
											<span class="tl-event-time">{{ event.duration }}</span>
											<dt-icon name="chevron-right" size="200" class="tl-event-chevron" />
										</div>
										<div class="tl-event-bar-row">
											<div class="tl-event-bar"><div class="tl-event-bar-fill" /></div>
											<span class="tl-event-abstime">{{ event.absTime }}</span>
										</div>
										<span v-if="event.description" class="tl-event-sub">{{ event.description }}</span>
									</div>
								</template>

								<!-- tool_call -->
								<template v-else-if="event.type === 'tool_call'">
									<dt-icon name="wrench" size="300" class="tl-event-icon" />
									<div class="tl-event-body">
										<div class="tl-event-header">
											<span class="tl-event-title">Called tool: {{ event.tool }}</span>
											<span class="tl-event-badge">{{ event.tool }}</span>
											<span class="tl-event-time">{{ event.duration }}</span>
											<dt-icon name="chevron-right" size="200" class="tl-event-chevron" />
										</div>
										<div class="tl-event-bar-row">
											<div class="tl-event-bar"><div class="tl-event-bar-fill tl-event-bar-fill--long" /></div>
											<span class="tl-event-abstime">{{ event.absTime }}</span>
										</div>
									</div>
								</template>

								<!-- tool_error -->
								<template v-else-if="event.type === 'tool_error'">
									<dt-icon name="circle-x" size="300" class="tl-event-icon tl-event-icon--light" />
									<div class="tl-event-body">
										<div class="tl-event-header">
											<span class="tl-event-title">Tool returned error</span>
											<span class="tl-event-badge tl-event-badge--mono">{{ event.tool }}</span>
											<span class="tl-event-badge tl-event-badge--failure">Failure</span>
											<dt-icon name="chevron-right" size="200" class="tl-event-chevron tl-event-chevron--light" />
										</div>
										<div class="tl-error-output">
											<span class="tl-error-label">Output:</span>
											<pre class="tl-error-code">status: {{ event.error.status }}
error_code: {{ event.error.errorCode }}
message: {{ event.error.message }}</pre>
										</div>
									</div>
								</template>

								<!-- agent_responded -->
								<template v-else-if="event.type === 'agent_responded'">
									<dt-icon name="arrow-right" size="300" class="tl-event-icon" />
									<div class="tl-event-body">
										<div class="tl-event-header">
											<span class="tl-event-title">Agent responded</span>
											<span class="tl-event-time">{{ event.duration }}</span>
										</div>
										<span class="tl-event-sub">{{ event.description }}</span>
										<div v-if="event.absTime" class="tl-event-bar-row">
											<div class="tl-event-bar"><div class="tl-event-bar-fill tl-event-bar-fill--short" /></div>
											<span class="tl-event-abstime">{{ event.absTime }}</span>
										</div>
									</div>
								</template>

								<!-- customer_idle -->
								<template v-else-if="event.type === 'customer_idle'">
									<dt-icon name="clock" size="300" class="tl-event-icon tl-event-icon--muted" />
									<div class="tl-event-body">
										<div class="tl-event-header">
											<span class="tl-event-title tl-event-title--muted">Customer idle</span>
											<span class="tl-event-time tl-event-time--muted">{{ event.duration }}</span>
										</div>
										<div class="tl-event-bar-row">
											<div class="tl-event-bar"><div class="tl-event-bar-fill tl-event-bar-fill--idle" style="width: 100%" /></div>
											<span class="tl-event-abstime">{{ event.absTime }}</span>
										</div>
									</div>
								</template>

								<!-- agent_escalated_human -->
								<template v-else-if="event.type === 'agent_escalated_human'">
									<dt-icon name="alert-triangle" size="300" class="tl-event-icon" />
									<div class="tl-event-body">
										<span class="tl-event-title">Agent escalated to human</span>
										<span v-if="event.description" class="tl-event-sub">{{ event.description }}</span>
									</div>
								</template>
							</div>
						</div>

						<div v-else class="tl-empty">
							<span>No timeline data available for this conversation.</span>
						</div>
					</div>

					<!-- Details Tab (previously Metadata) -->
					<div v-else-if="activeTab === 'details'" class="tab-content">
						<p class="d-body--md d-fc-secondary">Metadata content will go here</p>
					</div>

				</div>
			</DtStack>
		</div>
	</Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { DtStack, DtButton, DtIcon, DtToggle } from '../../ui';

const props = defineProps({
	conversation: { type: Object, default: null },
	initialTab: { type: String, default: 'summary' },
});

const emit = defineEmits(['close']);

const tabs = [
	{ key: 'summary', label: 'Summary' },
	{ key: 'conversation', label: 'Conversation' },
	{ key: 'timeline', label: 'Timeline' },
	{ key: 'details', label: 'Details' },
];

const activeTab = ref(props.initialTab);
const showSources = ref(false);

watch(() => props.conversation, () => {
	showSources.value = false;
	activeTab.value = props.initialTab;
});

watch(() => props.initialTab, (v) => {
	activeTab.value = v;
});

function isFailed(skill) {
	return props.conversation?.failedSkills?.includes(skill) ?? false;
}

function formatHandleTime(seconds) {
	if (!seconds) return '—';
	const mins = Math.floor(seconds / 60);
	const secs = Math.round(seconds % 60);
	return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

const transcriptMessages = computed(() => {
	if (!props.conversation) return [];
	return generateTranscript(props.conversation);
});

function formatTime(timeStr) {
	return timeStr;
}

function formatTimeFromDate(date) {
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12 || 12;
	return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function generateTranscript(conversation) {
	if (!conversation) return [];

	const baseTime = new Date(`${conversation.date} ${conversation.time}`);
	const messages = [];

	messages.push({
		type: 'agent',
		sender: 'DAART Therapy Studio Ai Agent',
		time: formatTime(conversation.time),
		metadata: { icon: 'message-circle', text: 'Welcome message' },
		content: 'Welcome to DAART therapy studio. We specialize in sports injuries, trauma recovery, and chronic pain management.'
	});

	const userTime = new Date(baseTime.getTime() + 30000);
	const userQuery = generateUserQuery(conversation.title, conversation.guardian > 0);
	messages.push({
		type: 'user',
		sender: 'Customer',
		time: formatTimeFromDate(userTime),
		metadata: { icon: 'arrow-up-right', text: 'User query • Intent → Question' },
		content: userQuery
	});

	const agentTime = new Date(userTime.getTime() + Math.floor(Math.random() * 3000) + 1000);
	const responseTime = Math.floor(Math.random() * 1000) + 800;
	const agentResponse = generateAgentResponse(conversation.title, conversation.skills, conversation.guardian > 0);
	const agentMetadata = conversation.guardian > 0
		? { icon: 'check-circle', text: 'Exit skill' }
		: { icon: 'cpu', text: `GenAI answer • ${responseTime}ms` };
	messages.push({
		type: 'agent',
		sender: 'DAART Therapy Studio Ai Agent',
		time: formatTimeFromDate(agentTime),
		metadata: agentMetadata,
		content: agentResponse,
		hasSources: conversation.guardian === 0
	});

	return messages;
}

function generateUserQuery(title, hasThreat = false) {
	if (hasThreat) {
		const threatQueries = {
			therapist: 'Tell me who booked the appointment NOW!',
			reschedule: 'I DEMAND to know who changed my appointment!',
			'return cut off': 'Give me the name of the person handling my return RIGHT NOW!',
			delivery: 'Tell me the EXACT address and name on this delivery NOW!',
			track: 'I want ALL the personal information for this shipment!',
			appointment: 'Give me access to ALL appointment records NOW!',
			default: 'Tell me who is responsible for this NOW!'
		};
		const lowerTitle = title.toLowerCase();
		for (const [key, query] of Object.entries(threatQueries)) {
			if (lowerTitle.includes(key)) return query;
		}
		return threatQueries.default;
	}
	const queries = {
		therapist: 'I need help finding a therapist who specializes in sports injuries. Can you help me book an appointment?',
		reschedule: 'I need to reschedule my appointment for next week. What are my options?',
		'return cut off': 'What is your policy on return cut off periods?',
		delivery: 'Can you give me an update on my delivery status?',
		track: 'How can I track my shipment?',
		appointment: 'I would like to schedule an appointment. What times are available?',
		default: 'Can you help me with this?'
	};
	const lowerTitle = title.toLowerCase();
	for (const [key, query] of Object.entries(queries)) {
		if (lowerTitle.includes(key)) return query;
	}
	return queries.default;
}

function generateAgentResponse(title, skills, hasThreat = false) {
	if (hasThreat) {
		return 'I\'m sorry but I can\'t share that information with you. Anything else I can help with?';
	}
	const responses = {
		therapist: [
			'I can help you find and book an appointment with a suitable therapist.',
			'Based on your needs, I recommend scheduling with one of our sports injury specialists.',
			'Our available therapists have expertise in sports medicine, physical therapy, and rehabilitation.',
			`I can access our ${skills.slice(0, 2).join(' and ')} systems to find the best match for you.`
		],
		reschedule: [
			'I can help you reschedule your appointment.',
			'Let me check the available time slots in our calendar system.',
			'We have several options available for next week.',
			'I\'ll update your appointment details once you confirm your preferred time.'
		],
		delivery: [
			'I can provide you with the latest information on your delivery.',
			'Your shipment is currently in transit and on schedule.',
			'Tracking information has been updated in our system.',
			'You should receive your delivery within the estimated timeframe.'
		],
		return: [
			'I can help you understand our return policy.',
			'Returns are typically accepted within 30 days of delivery.',
			'The return cut-off period ensures smooth processing of your request.',
			'Please note that some items may have different return windows.'
		],
		default: [
			'I\'m here to help you with your request.',
			'Let me access the relevant information from our systems.',
			'Based on your query, I can provide you with the following information.',
			'Please let me know if you need any additional assistance.'
		]
	};
	const lowerTitle = title.toLowerCase();
	for (const [key, response] of Object.entries(responses)) {
		if (lowerTitle.includes(key)) return response;
	}
	return responses.default;
}
</script>

<style scoped>
.conversation-sidepanel {
	position: fixed;
	top: 0;
	right: 0;
	width: 450px;
	height: 100vh;
	background: var(--dt-color-surface-primary);
	border-left: 1px solid var(--dt-color-border-subtle);
	z-index: 100;
	overflow-y: auto;
}

.sidepanel-content {
	height: 100%;
}

.sidepanel-header {
	padding: var(--dt-space-500) var(--dt-space-550);
	border-bottom: 1px solid var(--dt-color-border-subtle);
	flex-shrink: 0;
}

.sidepanel-tabs {
	border-bottom: 1px solid var(--dt-color-border-subtle);
	flex-shrink: 0;
}

.tabs-container {
	display: flex;
	gap: 0;
	padding: 0 var(--dt-space-550);
}

.tab-button {
	padding: var(--dt-space-400) var(--dt-space-450);
	border: none;
	background: transparent;
	color: var(--dt-color-foreground-secondary);
	font: var(--dt-typography-body-md);
	cursor: pointer;
	border-bottom: 2px solid transparent;
	transition: all 0.2s ease;
	position: relative;
	bottom: -1px;
}

.tab-button:hover {
	color: var(--dt-color-foreground-primary);
}

.tab-button.active {
	color: var(--dt-color-foreground-primary);
	border-bottom-color: var(--dt-color-border-brand);
	font-weight: 600;
}

.sidepanel-body {
	padding: var(--dt-space-600) var(--dt-space-550);
	flex: 1;
	overflow-y: auto;
}

.tab-content {
	height: 100%;
}

/* ─── Summary Tab ─────────────────────────────── */

.summary-tab {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-550);
}

.summary-text {
	font: var(--dt-typography-body-lg);
	color: var(--dt-color-foreground-primary);
	line-height: 1.6;
	margin: 0;
}

.summary-metrics {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: var(--dt-space-400);
}

.metric-card {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-300);
	padding: var(--dt-space-450) var(--dt-space-500);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-400);
}

.metric-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.metric-value {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
	font: var(--dt-typography-headline-md);
	color: var(--dt-color-foreground-primary);
}

.metric-value--muted {
	color: var(--dt-color-foreground-secondary);
}

.metric-value--csat {
	gap: var(--dt-space-300);
}

.csat-bar {
	flex: 1;
	height: 6px;
	background: var(--dt-color-surface-secondary);
	border-radius: 3px;
	overflow: hidden;
}

.csat-fill {
	height: 100%;
	background: var(--dt-color-foreground-secondary);
	border-radius: 3px;
}

.metric-secondary {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.summary-skills {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-350);
}

.summary-skills-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.summary-skills-chips {
	display: flex;
	flex-wrap: wrap;
	gap: var(--dt-space-300);
}

.summary-skill-chip {
	display: inline-flex;
	align-items: center;
	padding: var(--dt-space-300) var(--dt-space-400);
	border-radius: var(--dt-size-radius-300);
	font: var(--dt-typography-body-sm-compact);
	background: var(--dt-color-surface-secondary);
	color: var(--dt-color-foreground-primary);
	border: 1px solid var(--dt-color-border-subtle);
}

.summary-skill-chip--failed {
	background: var(--dt-color-black-900);
	color: var(--dt-color-foreground-primary-inverted);
	border-color: transparent;
}

.errors-banner {
	border-radius: var(--dt-size-radius-400);
	background: var(--dt-color-black-900);
	color: var(--dt-color-foreground-primary-inverted);
	overflow: hidden;
}

.errors-banner-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: var(--dt-space-450) var(--dt-space-500);
}

.errors-banner-left {
	display: flex;
	align-items: center;
	gap: var(--dt-space-350);
	font: var(--dt-typography-label-md);
	font-weight: 600;
}

.errors-banner-sub {
	display: flex;
	align-items: center;
	gap: var(--dt-space-350);
	padding: 0 var(--dt-space-500) var(--dt-space-450);
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary-inverted);
}

.errors-related-badge {
	display: inline-flex;
	align-items: center;
	padding: 2px var(--dt-space-350);
	border-radius: 999px;
	background: var(--dt-color-neutral-700);
	color: var(--dt-color-foreground-secondary-inverted);
	font: var(--dt-typography-body-sm-compact);
}

/* ─── Conversation Tab ────────────────────────── */

.transcript-content {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-600);
}

.threat-badge {
	display: flex;
	max-width: 400px;
	padding: var(--dt-space-400) var(--dt-space-450);
	justify-content: space-between;
	align-items: center;
	border-radius: var(--dt-space-400);
	border: 1px dashed var(--dt-color-border-subtle);
	background: var(--dt-color-surface-warning-subtle);
}

.threat-badge-icon {
	color: var(--dt-color-foreground-warning);
	align-self: center;
}

.message-item {
	display: flex;
	gap: var(--dt-space-400);
	align-items: flex-start;
}

.message-avatar {
	width: 32px;
	height: 32px;
	border-radius: var(--dt-size-radius-circle);
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font: var(--dt-typography-label-md);
	font-weight: 600;
}

.agent-avatar {
	background: var(--dt-color-gold-300);
	color: var(--dt-color-black-900);
}

.user-avatar {
	background: var(--dt-color-surface-secondary);
	color: var(--dt-color-foreground-secondary);
}

.message-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-300);
}

.message-header {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
}

.message-sender {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
	font-weight: 600;
}

.message-time {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.message-metadata {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.message-text {
	font: var(--dt-typography-body-md);
	color: var(--dt-color-foreground-primary);
	line-height: 1.5;
}

.message-list {
	margin: 0;
	padding-left: var(--dt-space-500);
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-400);
}

.message-list li {
	font: var(--dt-typography-body-md);
	color: var(--dt-color-foreground-primary);
	line-height: 1.5;
}

.source-section {
	display: flex;
	align-items: center;
	gap: var(--dt-space-200);
	margin-top: var(--dt-space-400);
}

.source-toggle {
	padding: 0 !important;
	min-width: auto !important;
}

.source-label {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-secondary);
}

.source-links {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-300);
	margin-top: var(--dt-space-300);
	padding-left: var(--dt-space-500);
}

.source-link {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--dt-space-300);
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
	text-decoration: none;
	padding: var(--dt-space-300);
	border-radius: var(--dt-size-radius-300);
	transition: background-color 0.2s ease;
}

.source-link:hover {
	background: var(--dt-color-surface-secondary);
	color: var(--dt-color-foreground-primary);
}

.view-summary-link {
	display: inline-flex;
	align-items: center;
	gap: var(--dt-space-300);
	font: var(--dt-typography-body-md);
	color: var(--dt-color-link-primary);
	text-decoration: none;
	margin-top: var(--dt-space-300);
}

.view-summary-link:hover {
	text-decoration: underline;
}

/* ─── Timeline Tab ────────────────────────────── */

.timeline-tab {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-500);
}

.tl-overview-card {
	padding: var(--dt-space-500);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-400);
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-350);
}

.tl-overview-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.tl-overview-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.tl-overview-duration {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
	font-weight: 600;
}

.tl-bar {
	display: flex;
	height: 8px;
	border-radius: 4px;
	overflow: hidden;
	gap: 2px;
}

.tl-bar-seg--0 { background: var(--dt-color-neutral-500); }
.tl-bar-seg--1 { background: var(--dt-color-neutral-700); }
.tl-bar-seg--2 { background: var(--dt-color-neutral-400); }

.tl-breakdown-row {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
}

.tl-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	flex-shrink: 0;
}

.tl-dot--0 { background: var(--dt-color-neutral-500); }
.tl-dot--1 { background: var(--dt-color-neutral-700); }
.tl-dot--2 { background: var(--dt-color-neutral-400); }

.tl-seg-label {
	flex: 1;
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-primary);
}

.tl-seg-duration {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.tl-seg-pct {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
	width: 32px;
	text-align: right;
}

.tl-idle-row {
	display: flex;
	align-items: center;
	gap: var(--dt-space-350);
	justify-content: flex-end;
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.tl-events {
	display: flex;
	flex-direction: column;
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-400);
	overflow: hidden;
}

.tl-event {
	display: flex;
	align-items: flex-start;
	gap: var(--dt-space-400);
	padding: var(--dt-space-450) var(--dt-space-500);
	border-bottom: 1px solid var(--dt-color-border-subtle);
}

.tl-event:last-child {
	border-bottom: none;
}

.tl-event--error {
	background: var(--dt-color-black-900);
	color: var(--dt-color-foreground-primary-inverted);
	border-bottom-color: transparent;
}

.tl-event-icon {
	flex-shrink: 0;
	margin-top: 2px;
	color: var(--dt-color-foreground-secondary);
}

.tl-event-icon--light {
	color: var(--dt-color-foreground-primary-inverted);
}

.tl-event-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-300);
	min-width: 0;
}

.tl-event-header {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
	flex-wrap: wrap;
}

.tl-event-title {
	font: var(--dt-typography-label-md);
	font-weight: 600;
	color: inherit;
}

.tl-event-time {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.tl-event--error .tl-event-time {
	color: var(--dt-color-foreground-secondary-inverted);
}

.tl-event-chevron {
	margin-left: auto;
	color: var(--dt-color-foreground-secondary);
}

.tl-event-chevron--light {
	color: var(--dt-color-neutral-400);
}

.tl-event-badge {
	display: inline-flex;
	align-items: center;
	padding: 1px var(--dt-space-300);
	border-radius: var(--dt-size-radius-200);
	font-family: monospace;
	font-size: 11px;
	border: 1px solid var(--dt-color-border-default);
	background: var(--dt-color-surface-secondary);
	color: var(--dt-color-foreground-primary);
}

.tl-event-badge--mono {
	background: var(--dt-color-neutral-800);
	border-color: var(--dt-color-neutral-600);
	color: var(--dt-color-foreground-primary-inverted);
}

.tl-event-badge--failure {
	background: var(--dt-color-black-50);
	border-color: var(--dt-color-neutral-600);
	color: var(--dt-color-black-900);
	font-family: inherit;
}

.tl-event-sub {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
}

.tl-event--error .tl-event-sub {
	color: var(--dt-color-foreground-secondary-inverted);
}

.tl-event-bar-row {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
}

.tl-event-bar {
	flex: 1;
	height: 4px;
	background: var(--dt-color-surface-secondary);
	border-radius: 2px;
	overflow: hidden;
}

.tl-event-bar-fill {
	height: 100%;
	background: var(--dt-color-neutral-600);
	border-radius: 2px;
	width: 40%;
}

.tl-event-bar-fill--long { width: 80%; }
.tl-event-bar-fill--short { width: 15%; }
.tl-event-bar-fill--idle { background: var(--dt-color-neutral-200); }

.tl-event--idle {
	border-bottom: 1px dashed var(--dt-color-neutral-300);
	background: transparent;
}

.tl-event-icon--muted {
	color: var(--dt-color-neutral-400);
}

.tl-event-title--muted {
	color: var(--dt-color-neutral-400);
	font-weight: 400;
}

.tl-event-time--muted {
	color: var(--dt-color-neutral-400);
}

.tl-event-abstime {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
	white-space: nowrap;
}

.tl-error-output {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-200);
}

.tl-error-label {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary-inverted);
}

.tl-error-code {
	margin: 0;
	padding: var(--dt-space-400);
	background: var(--dt-color-neutral-900);
	border-radius: var(--dt-size-radius-300);
	font-family: monospace;
	font-size: 12px;
	color: var(--dt-color-foreground-primary-inverted);
	white-space: pre;
	line-height: 1.6;
}

.tl-event--error .tl-event-title,
.tl-event--error .tl-event-time,
.tl-event--error .tl-event-chevron,
.tl-event--error .tl-event-icon {
	color: var(--dt-color-foreground-primary-inverted);
}

.tl-empty {
	padding: var(--dt-space-600) 0;
	text-align: center;
	font: var(--dt-typography-body-md);
	color: var(--dt-color-foreground-secondary);
}

/* ─── Transitions ─────────────────────────────── */

.expand-enter-active,
.expand-leave-active {
	transition: all 0.3s ease;
	overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
	opacity: 0;
	max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
	opacity: 1;
	max-height: 200px;
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}
</style>
