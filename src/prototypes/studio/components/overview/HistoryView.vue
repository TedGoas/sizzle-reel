<template>
	<div class="history-view-container">
		<div class="history-view" :class="{ 'sidepanel-open': selectedConversation }">
		<DtStack direction="column" gap="500">
			<!-- Header with title, description, and action buttons -->
			<DtStack direction="column" gap="300">
				<DtStack direction="row" class="d-jc-space-between d-ai-flex-start">
					<DtStack direction="column" gap="200">
						<h2 class="d-headline--lg d-fc-primary">History</h2>
						<p class="d-body--sm d-fc-secondary">View every conversation users have had with your AI Agent.</p>
					</DtStack>
					<DtStack direction="row" gap="300" class="d-ai-center">
						<dt-button importance="clear" size="sm" @click="handleRefresh">
							<template #icon>
								<dt-icon name="refresh" size="300" />
							</template>
							Refresh
						</dt-button>
						<dt-popover ref="exportPopover" placement="bottom-end">
							<template #anchor>
								<dt-button importance="outlined" size="sm" icon-position="right">
									<template #icon>
										<dt-icon name="chevron-down" size="200" />
									</template>
									Export .csv
								</dt-button>
							</template>
							<template #content>
								<div class="export-popover">
									<div class="export-text-group">
										<p class="d-label--md d-fc-primary">Report will be sent to:</p>
										<p class="d-body--md d-fc-primary">{{ exportEmail }}</p>
									</div>
									<div class="export-button-wrapper">
										<dt-button importance="primary" size="xs" @click="handleSendReport">
											Send report
										</dt-button>
									</div>
								</div>
							</template>
						</dt-popover>
					</DtStack>
				</DtStack>
				<p class="d-body--sm d-fc-secondary data-location">All data is in Asia/Kolkata</p>
			</DtStack>

			<!-- Export Success Notice -->
			<Transition name="fade">
				<DtNotice
					v-if="showExportSuccess"
					kind="success"
					:hide-close="false"
					class="export-success-notice"
					@close="showExportSuccess = false"
				>
					<template #default>
						<div>
							<div class="d-fw-bold">Report has been successfully sent</div>
							<div>You will receive an email shortly with a link to download your data.</div>
						</div>
					</template>
				</DtNotice>
			</Transition>

			<!-- Toolbar: Search and Filters -->
			<DtStack direction="row" gap="400" class="d-ai-center filters-toolbar" :class="{ 'sidepanel-open': selectedConversation }">
				<dt-input
					v-model="searchQuery"
					aria-label="Search"
					placeholder="Search"
					type="text"
					size="sm"
				>
					<template #leftIcon="{ iconSize }">
						<dt-icon name="search" :size="iconSize" />
					</template>
				</dt-input>

				<dt-popover placement="bottom-start">
					<template #anchor>
						<dt-button importance="outlined" kind="muted" size="sm" icon-position="right">
							<template #icon><dt-icon name="chevron-down" size="200" /></template>
							Past 30 days
						</dt-button>
					</template>
					<template #content>
						<div class="filter-menu">
							<button class="filter-option">Past 7 days</button>
							<button class="filter-option active">Past 30 days</button>
							<button class="filter-option">Past 90 days</button>
						</div>
					</template>
				</dt-popover>

				<dt-popover placement="bottom-start">
					<template #anchor>
						<dt-button importance="outlined" kind="muted" size="sm" icon-position="right">
							<template #icon><dt-icon name="chevron-down" size="200" /></template>
							Groups
						</dt-button>
					</template>
					<template #content>
						<div class="filter-menu">
							<button class="filter-option active">All groups</button>
							<button class="filter-option">Group 1</button>
							<button class="filter-option">Group 2</button>
						</div>
					</template>
				</dt-popover>

				<OutcomeFilter v-model="selectedOutcome" />
				<SkillsFilter v-model="selectedSkills" :available-skills="availableSkills" />

				<dt-popover placement="bottom-start">
					<template #anchor>
						<dt-button importance="outlined" kind="muted" size="sm" icon-position="right">
							<template #icon><dt-icon name="chevron-down" size="200" /></template>
							Handle time
						</dt-button>
					</template>
					<template #content>
						<div class="filter-menu">
							<button class="filter-option active">All</button>
							<button class="filter-option">Under 1 min</button>
							<button class="filter-option">1-5 min</button>
							<button class="filter-option">5-15 min</button>
							<button class="filter-option">Over 15 min</button>
						</div>
					</template>
				</dt-popover>

				<ChannelsFilter v-model="selectedChannel" />

				<dt-button importance="clear" size="sm" @click="handleMoreFilters">
					<template v-if="!showMoreFilters" #icon>
						<dt-icon name="add" size="300" />
					</template>
					{{ showMoreFilters ? 'Less filters' : 'More filters' }}
				</dt-button>

				<!-- Column Visibility Selector -->
				<HistoryColumnSelector
					v-model="columnVisibility"
					:visible-columns-count="visibleColumnsCount"
				/>
			</DtStack>

			<!-- More Filters Row (expandable) -->
			<DtStack v-show="showMoreFilters" direction="row" gap="400" class="d-ai-center d-fw-wrap">
				<InteractionsFilter v-model="selectedInteractions" />
				<ConversationTypeFilter v-model="selectedConversationType" />
				<GuardianFilter v-model="selectedGuardian" />
				<EscalationReasonFilter v-model="selectedEscalationReason" />
				<AiCsatFilter v-model="selectedAiCsat" />
				<HandleTimeFilter v-model="selectedHandleTime" />
				<DollarCostFilter v-model="selectedDollarCost" />
				<CustomerSentimentFilter v-model="selectedCustomerSentiment" />
			</DtStack>

			<!-- Path 1: Summary strip above the table -->
			<HistorySummaryStrip
				v-if="state.aggregationConcept === 'strip-above'"
				:conversations="filteredConversations"
				:column-visibility="columnVisibility"
				:active-tile="activeSortTile"
				@sort-priority="handleSortPriority"
			/>

			<div class="agentic-studio__table-container">
				<HistoryTopHeaderStrip
					v-if="state.aggregationConcept === 'top-header'"
					:conversations="filteredConversations"
					:active-tile="activeSortTile"
					@sort-priority="handleSortPriority"
				/>
				<table class="history-table d-table">
					<thead>
						<tr>
							<!-- Date — sticky pinned column -->
							<th class="sortable col-date sticky-col" @click="sortBy('date')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Date
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
									</div>
							</th>

							<!-- Conversation summary -->
							<th class="col-summary">
								<div class="th-inner">
									<span>Conversation summary</span>
								</div>
							</th>

							<!-- Outcome -->
							<th class="sortable hide-when-sidepanel-open col-outcome" :class="{ 'hidden': selectedConversation }" @click="sortBy('outcome')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Outcome
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- Escalation reason -->
							<th v-if="columnVisibility.escalationReason" class="hide-when-sidepanel-open col-esc-reason" :class="{ 'hidden': selectedConversation }">
								<div class="th-inner">
									<span>Escalation reason</span>
								</div>
							</th>

							<!-- Handle time -->
							<th class="sortable hide-when-sidepanel-open col-handle-time" :class="{ 'hidden': selectedConversation }" @click="sortBy('handleTime')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Handle time
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- Guardian -->
							<th class="sortable hide-when-sidepanel-open col-guardian" :class="{ 'hidden': selectedConversation }" @click="sortBy('guardian')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Guardian
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- Skills -->
							<th class="sortable hide-when-sidepanel-open col-skills" :class="{ 'hidden': selectedConversation }" @click="sortBy('skills')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Skills
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- AI CSAT -->
							<th v-if="columnVisibility.aiCsat" class="sortable hide-when-sidepanel-open col-ai-csat" :class="{ 'hidden': selectedConversation }" @click="sortBy('aiCsat')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										AI CSAT
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- Dollar amount -->
							<th v-if="columnVisibility.dollarAmount" class="sortable hide-when-sidepanel-open col-cost" :class="{ 'hidden': selectedConversation }" @click="sortBy('dollarAmount')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Cost
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- Customer sentiment -->
							<th v-if="columnVisibility.customerSentiment" class="hide-when-sidepanel-open col-sentiment" :class="{ 'hidden': selectedConversation }">
								<div class="th-inner">
									<span>Sentiment</span>
								</div>
							</th>

							<!-- Customer personality -->
							<th v-if="columnVisibility.customerPersonality" class="hide-when-sidepanel-open col-personality" :class="{ 'hidden': selectedConversation }">
								<div class="th-inner">
									<span>Personality</span>
								</div>
							</th>

							<!-- Interactions -->
							<th v-if="columnVisibility.interactions" class="sortable hide-when-sidepanel-open col-interactions" :class="{ 'hidden': selectedConversation }" @click="sortBy('interactions')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Interactions
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>

							<!-- Channels -->
							<th v-if="columnVisibility.channels" class="sortable hide-when-sidepanel-open col-channels" :class="{ 'hidden': selectedConversation }" @click="sortBy('channels')">
								<div class="th-inner">
									<div class="d-d-inline-flex d-ai-center d-g4">
										Channels
										<dt-icon name="chevrons-up-down" size="200" />
									</div>
								</div>
							</th>
						</tr>
					</thead>

					<!-- Path 2: Aggregation strip inside the table -->
					<HistoryTableStrip
						v-if="state.aggregationConcept === 'strip-inside'"
						:conversations="filteredConversations"
						:column-visibility="columnVisibility"
					/>

					<tbody>
						<tr
							v-for="conversation in paginatedConversations"
							:key="conversation.id"
							class="conversation-row"
							@click="openConversationDetails(conversation)"
						>
							<!-- Date — sticky -->
							<td class="sticky-col">
								<div class="date-cell">
									<div class="date-text">{{ formatDate(conversation.date) }}</div>
									<div class="time-text">{{ formatTime(conversation.time) }}</div>
								</div>
							</td>

							<!-- Conversation summary -->
							<td>
								<div class="title-cell">
									<div class="title-text">{{ conversation.title }}</div>
									<div class="skills-chips">
										<DtBadge v-if="conversation.isTest" type="info" text="Test" />
										<DtChip
											v-for="skill in conversation.skills.slice(0, 3)"
											:key="skill"
											size="xs"
											:hide-close="true"
										>
											{{ skill }}
										</DtChip>
									</div>
								</div>
							</td>

							<!-- Outcome -->
							<td class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								{{ conversation.outcome }}
							</td>

							<!-- Escalation reason -->
							<td v-if="columnVisibility.escalationReason" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								<DtBadge v-if="conversation.escalationReason" :text="conversation.escalationReason" />
								<span v-else class="d-fc-secondary">—</span>
							</td>

							<!-- Handle time -->
							<td class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								{{ formatHandleTime(conversation.handleTime) }}
							</td>

							<!-- Guardian -->
							<td class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								<template v-if="conversation.guardian > 0">
									<dt-tooltip placement="top">
										<template #anchor>
											<div class="guardian-cell">
												{{ conversation.guardian }}
												<dt-icon
													name="shield-alert"
													size="200"
													:class="conversation.guardianLevel === 'critical' ? 'guardian-icon-critical' : 'guardian-icon-warning'"
												/>
											</div>
										</template>
										{{ conversation.guardian }} {{ conversation.guardianLevel === 'critical' ? 'high risk threat' : 'threat' }}{{ conversation.guardian > 1 ? 's' : '' }} identified
									</dt-tooltip>
								</template>
								<template v-else>
									<div class="guardian-cell">-</div>
								</template>
							</td>

							<!-- Skills -->
							<td class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }" @click.stop>
								<template v-if="conversation.skills.length === 0">
									<div class="skills-summary">0</div>
								</template>
								<template v-else-if="conversation.skills.length === 1">
									<div
										class="skills-summary"
										:class="{ clickable: hasSkillWarning(conversation.skills[0], conversation) }"
										@click.stop="hasSkillWarning(conversation.skills[0], conversation) && openConversationDetails(conversation, 'timeline')"
									>
										{{ conversation.skills[0] }}
										<dt-tooltip v-if="hasSkillWarning(conversation.skills[0], conversation)" placement="top">
											<template #anchor>
												<dt-icon name="alert-triangle" size="200" class="skill-warning-icon-inline" />
											</template>
											1 skill needs attention
										</dt-tooltip>
									</div>
								</template>
								<template v-else>
									<dt-popover placement="bottom-start">
										<template #anchor>
											<div class="skills-summary clickable">
												{{ conversation.skills[0] }}
												<dt-tooltip v-if="hasSkillWarning(conversation.skills[0], conversation)" placement="top">
													<template #anchor>
														<dt-icon name="alert-triangle" size="200" class="skill-warning-icon-inline" />
													</template>
													1 skill needs attention
												</dt-tooltip>
												<span class="more-count">+{{ conversation.skills.length - 1 }} more</span>
											</div>
										</template>
										<template #content>
											<div class="skills-popover">
												<a
													v-for="skill in conversation.skills"
													:key="skill"
													class="skill-item"
													href="#"
													@click.stop.prevent="hasSkillWarning(skill, conversation) ? openConversationDetails(conversation, 'timeline') : openConversationDetails(conversation)"
												>
													<span class="skill-text">{{ skill }}</span>
													<dt-tooltip v-if="hasSkillWarning(skill, conversation)" placement="top">
														<template #anchor>
															<dt-icon name="alert-triangle" size="200" class="skill-warning-icon" />
														</template>
														1 skill needs attention
													</dt-tooltip>
												</a>
											</div>
										</template>
									</dt-popover>
								</template>
							</td>

							<!-- AI CSAT -->
							<td v-if="columnVisibility.aiCsat" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								<span v-if="conversation.aiCsat !== null" class="csat-value">
									{{ conversation.aiCsat.toFixed(1) }}
								</span>
								<span v-else class="d-fc-secondary">—</span>
							</td>

							<!-- Dollar amount -->
							<td v-if="columnVisibility.dollarAmount" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								<div class="cost-cell">
									<span class="cost-value">${{ conversation.dollarAmount != null ? conversation.dollarAmount.toFixed(2) : '—' }}</span>
								</div>
							</td>

							<!-- Customer sentiment -->
							<td v-if="columnVisibility.customerSentiment" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								<DtBadge
									v-if="conversation.customerSentiment"
									:type="sentimentBadgeType(conversation.customerSentiment)"
									:text="conversation.customerSentiment"
								/>
							</td>

							<!-- Customer personality -->
							<td v-if="columnVisibility.customerPersonality" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								<span class="personality-chip">{{ conversation.customerPersonality }}</span>
							</td>

							<!-- Interactions -->
							<td v-if="columnVisibility.interactions" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								{{ conversation.interactions || 0 }}
							</td>

							<!-- Channels -->
							<td v-if="columnVisibility.channels" class="hide-when-sidepanel-open" :class="{ 'hidden': selectedConversation }">
								{{ conversation.channel || '-' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<HistoryPagination
				:current-page="currentPage"
				:total-pages="totalPages"
				:total-items="filteredConversations.length"
				@update:current-page="goToPage"
			/>
		</DtStack>
		</div>

		<!-- Sidepanel -->
		<HistoryConversationPanel
			:conversation="selectedConversation"
			:initial-tab="selectedConversationTab"
			@close="selectedConversation = null"
		/>
	</div>
</template>

<script setup>
import { debugLogger } from '../../lib/debugLogger.js';
import { ref, computed, watch } from 'vue';
import { DtStack, DtChip, DtButton, DtIcon, DtPopover, DtInput, DtTooltip, DtNotice, DtBadge } from '../ui';
import { state } from '../../state.js';
import { useHistoryPagination } from '../../lib/useHistoryPagination.js';

import HistoryPagination from './history/HistoryPagination.vue';
import HistoryConversationPanel from './history/HistoryConversationPanel.vue';
import HistoryColumnSelector from './history/HistoryColumnSelector.vue';
import HistorySummaryStrip from './history/aggregation/HistorySummaryStrip.vue';
import HistoryTableStrip from './history/aggregation/HistoryTableStrip.vue';
import HistoryTopHeaderStrip from './history/aggregation/HistoryTopHeaderStrip.vue';

import OutcomeFilter from './history/filters/OutcomeFilter.vue';
import SkillsFilter from './history/filters/SkillsFilter.vue';
import ConversationTypeFilter from './history/filters/ConversationTypeFilter.vue';
import GuardianFilter from './history/filters/GuardianFilter.vue';
import InteractionsFilter from './history/filters/InteractionsFilter.vue';
import ChannelsFilter from './history/filters/ChannelsFilter.vue';
import EscalationReasonFilter from './history/filters/EscalationReasonFilter.vue';
import AiCsatFilter from './history/filters/AiCsatFilter.vue';
import HandleTimeFilter from './history/filters/HandleTimeFilter.vue';
import DollarCostFilter from './history/filters/DollarCostFilter.vue';
import CustomerSentimentFilter from './history/filters/CustomerSentimentFilter.vue';

const props = defineProps({
    conversations: { type: Array, required: true },
    initialOutcome: { type: String, default: null },
    initialSkill: { type: String, default: null },
    initialGuardian: { type: String, default: null },
    initialHandleTime: { type: String, default: null },
    initialAiCsat: { type: String, default: null },
    initialEscalated: { type: Boolean, default: null }
});

// General UI state
const searchQuery = ref('');
const showMoreFilters = ref(false);
const exportEmail = ref('nora.kim@daarty.aerolabs.com');
const exportPopover = ref(null);
const showExportSuccess = ref(false);
const selectedConversation = ref(null);
const selectedConversationTab = ref('summary');

// Column visibility
const columnVisibility = ref({
    date: true,
    conversationSummary: true,
    outcome: true,
    handleTime: true,
    guardian: true,
    skills: true,
    aiCsat: true,
    dollarAmount: false,
    escalationReason: true,
    customerSentiment: false,
    customerPersonality: false,
    interactions: false,
    channels: false
});

const visibleColumnsCount = computed(() => Object.values(columnVisibility.value).filter(Boolean).length);

// Filter state
const selectedOutcome = ref(props.initialOutcome);
const selectedSkills = ref(props.initialSkill ? [props.initialSkill] : []);
const selectedConversationType = ref(null);
const selectedGuardian = ref(props.initialGuardian);
const selectedHandleTime = ref(props.initialHandleTime);
const selectedInteractions = ref(null);
const selectedChannel = ref(null);
const selectedEscalationReason = ref(null);
const selectedAiCsat = ref(props.initialAiCsat);
const selectedEscalated = ref(props.initialEscalated);
const selectedDollarCost = ref(null);
const selectedCustomerSentiment = ref(null);

// Sort state
const sortColumn = ref(null);
const sortDirection = ref('asc');

// Tile priority sort
const activeSortTile = ref(null);

function handleSortPriority(tileKey) {
    activeSortTile.value = activeSortTile.value === tileKey ? null : tileKey;
}

function matchesTile(conv, key) {
    if (key === 'deflected') return conv.outcome === 'Deflected';
    if (key === 'transferred') return conv.outcome === 'Transferred';
    if (key === 'failedSkills') return (conv.failedSkills?.length ?? 0) > 0;
    if (key === 'guardianThreats') return (conv.guardian ?? 0) > 0;
    if (key.startsWith('escalationReason:')) return conv.escalationReason === key.slice('escalationReason:'.length);
    return false;
}

// Watch for prop changes
watch(() => props.initialOutcome, (v) => { if (v !== undefined) selectedOutcome.value = v; });
watch(() => props.initialSkill, (v) => { if (v !== undefined) selectedSkills.value = v ? [v] : []; });
watch(() => props.initialGuardian, (v) => { if (v !== undefined) selectedGuardian.value = v; });
watch(() => props.initialHandleTime, (v) => { if (v !== undefined) selectedHandleTime.value = v; });
watch(() => props.initialAiCsat, (v) => { if (v !== undefined) selectedAiCsat.value = v; });
watch(() => props.initialEscalated, (v) => { if (v !== undefined) selectedEscalated.value = v; });

// Auto-show columns when related filter is applied
watch(selectedInteractions, (v) => { if (v) columnVisibility.value.interactions = true; });
watch(selectedChannel, (v) => { if (v) columnVisibility.value.channels = true; });
watch(selectedCustomerSentiment, (v) => { if (v) columnVisibility.value.customerSentiment = true; });

function handleMoreFilters() {
    showMoreFilters.value = !showMoreFilters.value;
}

// Computed available skills for filters
const availableSkills = computed(() => {
    const s = new Set();
    props.conversations.forEach(c => c.skills.forEach(sk => s.add(sk)));
    return Array.from(s).sort();
});


// Sort
function sortBy(column) {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn.value = column;
        sortDirection.value = 'asc';
    }
}

// Formatters
function formatDate(dateStr) { return dateStr; }
function formatTime(timeStr) { return timeStr; }

function formatHandleTime(seconds) {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

// Action handlers
function handleRefresh() {
    debugLogger.log('Refresh clicked');
}

function handleSendReport() {
    if (exportPopover.value) exportPopover.value.close();
    showExportSuccess.value = true;
    setTimeout(() => { showExportSuccess.value = false; }, 5000);
    debugLogger.log('Report will be sent to:', exportEmail.value);
}

function hasSkillWarning(skill, conversation) {
    return conversation?.failedSkills?.includes(skill) ?? false;
}

function sentimentBadgeType(sentiment) {
    if (sentiment === 'Positive') return 'success';
    if (sentiment === 'Negative') return 'critical';
    return 'default';
}

function openConversationDetails(conversation, tab = 'summary') {
    selectedConversation.value = conversation;
    selectedConversationTab.value = tab;
}

// Filtered conversations
const avgHandleTime = computed(() => {
    const convs = props.conversations.filter(c => (c.handle_time ?? c.handleTime ?? 0) > 0);
    if (!convs.length) return 0;
    return convs.reduce((s, c) => s + (c.handle_time ?? c.handleTime ?? 0), 0) / convs.length;
});

const filteredConversations = computed(() => {
    return props.conversations.filter((c) => {
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase();
            const matchesTitle = c.title.toLowerCase().includes(q);
            const matchesSkills = c.skills.some(s => s.toLowerCase().includes(q));
            if (!matchesTitle && !matchesSkills) return false;
        }

        if (selectedOutcome.value && c.outcome !== selectedOutcome.value) return false;

        if (selectedSkills.value.length > 0) {
            if (!selectedSkills.value.some(s => c.skills.includes(s))) return false;
        }

        if (selectedConversationType.value) {
            if (selectedConversationType.value === 'Customer conversations' && c.isTest) return false;
            if (selectedConversationType.value === 'Test conversations' && !c.isTest) return false;
        }

        if (selectedGuardian.value) {
            if (selectedGuardian.value === 'Conversations with no threats' && c.guardian > 0) return false;
            if (selectedGuardian.value === 'Conversations with at least 1 threat' && c.guardian === 0) return false;
        }

        if (selectedInteractions.value) {
            const count = c.interactions || 0;
            if (selectedInteractions.value === 'Conversations with no interactions' && count > 0) return false;
            if (selectedInteractions.value === 'Conversations with at least 1 interaction' && count === 0) return false;
        }

        if (selectedChannel.value && c.channel !== selectedChannel.value) return false;

        if (selectedEscalationReason.value && c.escalationReason !== selectedEscalationReason.value) return false;

        if (selectedAiCsat.value) {
            if (selectedAiCsat.value === '4+' && !(c.aiCsat >= 4)) return false;
            if (selectedAiCsat.value === '3-4' && !(c.aiCsat >= 3 && c.aiCsat < 4)) return false;
            if (selectedAiCsat.value === 'below-3' && !(c.aiCsat !== null && c.aiCsat < 3)) return false;
        }

        if (selectedDollarCost.value) {
            if (selectedDollarCost.value === 'under-0.10' && !(c.dollarAmount < 0.10)) return false;
            if (selectedDollarCost.value === '0.10-0.25' && !(c.dollarAmount >= 0.10 && c.dollarAmount <= 0.25)) return false;
            if (selectedDollarCost.value === 'over-0.25' && !(c.dollarAmount > 0.25)) return false;
        }

        if (selectedCustomerSentiment.value && c.customerSentiment !== selectedCustomerSentiment.value) return false;

        if (selectedEscalated.value && !c.escalated) return false;

        if (selectedHandleTime.value) {
            const ht = c.handle_time ?? c.handleTime ?? 0;
            if (selectedHandleTime.value === 'under-2m' && !(ht < 120)) return false;
            if (selectedHandleTime.value === '2-5m' && !(ht >= 120 && ht <= 300)) return false;
            if (selectedHandleTime.value === '5-10m' && !(ht > 300 && ht <= 600)) return false;
            if (selectedHandleTime.value === 'over-10m' && !(ht > 600)) return false;
            if (selectedHandleTime.value === 'aht-50' && !(ht > avgHandleTime.value * 1.5)) return false;
        }

        return true;
    });
});

// Sorted conversations
const sortedConversations = computed(() => {
    const convs = [...filteredConversations.value];
    if (!sortColumn.value) return convs;

    return convs.sort((a, b) => {
        let aVal, bVal;
        switch (sortColumn.value) {
        case 'date':
            aVal = new Date(`${a.date} ${a.time}`).getTime();
            bVal = new Date(`${b.date} ${b.time}`).getTime();
            break;
        case 'outcome':   aVal = a.outcome; bVal = b.outcome; break;
        case 'handleTime': aVal = a.handleTime || 0; bVal = b.handleTime || 0; break;
        case 'guardian':  aVal = a.guardian || 0; bVal = b.guardian || 0; break;
        case 'skills':    aVal = a.skills.length; bVal = b.skills.length; break;
        case 'aiCsat':    aVal = a.aiCsat ?? -1; bVal = b.aiCsat ?? -1; break;
        case 'dollarAmount': aVal = a.dollarAmount || 0; bVal = b.dollarAmount || 0; break;
        case 'interactions': aVal = a.interactions || 0; bVal = b.interactions || 0; break;
        case 'channels':  aVal = a.channel || ''; bVal = b.channel || ''; break;
        default: return 0;
        }
        if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1;
        return 0;
    });
});

// Priority sort — floats matching rows to top when a tile is active
const prioritizedConversations = computed(() => {
    if (!activeSortTile.value) return sortedConversations.value;
    const key = activeSortTile.value;
    return [...sortedConversations.value].sort((a, b) => {
        const aMatch = matchesTile(a, key);
        const bMatch = matchesTile(b, key);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });
});

// Pagination
const {
    currentPage,
    totalPages,
    paginatedItems: paginatedConversations,
    goToPage
} = useHistoryPagination(prioritizedConversations);
</script>

<style scoped>
.history-view-container {
	display: flex;
	height: 100%;
	gap: 0;
	position: relative;
}

.history-view {
	flex: 1;
	min-width: 0;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	transition: margin-right 0.3s ease;
}

.history-view.sidepanel-open {
	margin-right: 450px;
}

.filters-toolbar.sidepanel-open {
	flex-wrap: wrap;
	align-items: flex-start;
	align-content: flex-start;
	align-self: stretch;
}

.hide-when-sidepanel-open.hidden {
	display: none;
}

.conversation-row {
	cursor: pointer;
}

.data-location {
	border-bottom: 1px dotted var(--dt-color-border-default);
	width: fit-content;
	padding-bottom: var(--dt-space-200);
}

/* Table container */
.agentic-studio__table-container {
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: var(--dt-size-radius-500);
	overflow-x: auto;
	overflow-y: hidden;
}

.history-table {
	border-collapse: collapse;
	table-layout: fixed;
}

/* Sticky Date column */
.sticky-col {
	position: sticky;
	left: 0;
	z-index: 2;
	background: var(--dt-color-surface-primary);
}

.history-table thead .sticky-col {
	z-index: 3;
	background: var(--dt-color-surface-primary);
}

/* Column widths — fixed widths on th drive table-layout: fixed */
.col-date          { width: 140px; }
.col-summary       { width: 280px; }
.col-outcome       { width: 110px; }
.col-handle-time   { width: 130px; }
.col-guardian      { width: 90px;  }
.col-skills        { width: 160px; }
.col-ai-csat       { width: 100px; }
.col-cost          { width: 100px; }
.col-esc-reason    { width: 160px; }
.col-sentiment     { width: 120px; }
.col-personality   { width: 130px; }
.col-interactions  { width: 110px; }
.col-channels      { width: 110px; }

.history-table thead {
	background: var(--dt-color-surface-primary);
	border-bottom: 1px solid var(--dt-color-border-subtle);
}

.history-table th {
	padding: var(--dt-space-400) var(--dt-space-500);
	text-align: left;
	font: var(--dt-typography-headline-sm);
	color: var(--dt-color-foreground-secondary);
	text-transform: none;
	white-space: nowrap;
}

.history-table th.sortable {
	cursor: pointer;
	user-select: none;
	transition: background-color 0.2s ease;
}

.history-table th.sortable:hover {
	background: var(--dt-color-surface-secondary-hover);
}

/* th-inner for header-inline aggregation */
.th-inner {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.th-meta {
	font: var(--dt-typography-body-sm);
	color: var(--dt-color-foreground-secondary);
	font-weight: 400;
	font-size: 11px;
}

.history-table td {
	padding: var(--dt-space-400) var(--dt-space-500);
	border-bottom: 1px solid var(--dt-color-border-subtle);
	font: var(--dt-typography-body-md-compact);
	color: var(--dt-color-foreground-primary);
	white-space: nowrap;
	overflow: hidden;
}

.history-table tbody tr:last-child td {
	border-bottom: none;
}

.history-table tbody tr:hover {
	background: var(--dt-color-surface-secondary-hover);
}

.history-table tbody tr:hover .sticky-col {
	background: var(--dt-color-surface-secondary-hover);
}

/* Date cell */
.date-cell {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-200);
}

.date-text {
	font: var(--dt-typography-body-md-compact);
	color: var(--dt-color-foreground-primary);
}

.time-text {
	font: var(--dt-typography-body-sm-compact);
	color: var(--dt-color-foreground-secondary);
}

/* Title cell */
.title-cell {
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-300);
}

.title-text {
	font: var(--dt-typography-body-md-compact);
	color: var(--dt-color-foreground-primary);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 280px;
}

.skills-chips {
	display: flex;
	gap: var(--dt-space-300);
	flex-wrap: wrap;
}

/* Guardian cell */
.guardian-cell {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	gap: var(--dt-space-300);
}

.guardian-icon-critical {
	color: var(--dt-color-foreground-critical) !important;
	display: flex;
	align-items: center;
}

.guardian-icon-warning {
	color: var(--dt-color-foreground-warning) !important;
	display: flex;
	align-items: center;
}

/* Skills summary */
.skills-summary {
	display: flex;
	align-items: center;
	gap: var(--dt-space-300);
	flex-wrap: wrap;
}

.skill-warning-icon-inline {
	color: var(--dt-color-foreground-warning);
	flex-shrink: 0;
}

.more-count {
	color: var(--dt-color-foreground-secondary);
	font: var(--dt-typography-body-sm-compact);
}

.skills-summary.clickable {
	cursor: pointer;
	transition: color 0.2s ease;
}

/* AI CSAT cell */
.csat-value {
	display: inline-flex;
	align-items: center;
	gap: var(--dt-space-200);
	font: var(--dt-typography-body-md-compact);
	font-weight: 600;
}

/* Cost cell */
.cost-cell {
	display: flex;
	align-items: center;
	gap: var(--dt-space-200);
}

.cost-value {
	font: var(--dt-typography-body-md-compact);
	font-weight: 500;
}

/* Personality chip */
.personality-chip {
	display: inline-block;
	padding: 2px 8px;
	background: var(--dt-color-surface-secondary);
	color: var(--dt-color-foreground-secondary);
	border-radius: var(--dt-size-radius-pill);
	font: var(--dt-typography-body-sm-compact);
}

/* Skills Popover */
.skills-popover {
	margin: calc(var(--dt-space-500) * -1);
	display: flex;
	width: 180px;
	padding: 2px;
	flex-direction: column;
	align-items: flex-start;
	gap: 2px;
	border-radius: 8px;
	border: 1px solid var(--dt-color-border-default, rgba(0, 0, 0, 0.18));
	background: var(--dt-color-surface-secondary, #F9F9F9);
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

.skill-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--dt-space-300);
	width: 100%;
	padding: var(--dt-space-300);
	border-radius: 6px;
	transition: background-color 0.2s ease;
}

.skill-item:hover {
	background: var(--dt-color-surface-primary);
}

.skill-text {
	color: var(--dt-color-foreground-primary);
	font: var(--dt-typography-body-sm-compact);
	text-decoration: underline;
	flex: 1;
}

.skill-warning-icon {
	color: var(--dt-color-foreground-warning);
	flex-shrink: 0;
}

/* Filter menu (stub filters) */
.filter-menu {
	display: flex;
	flex-direction: column;
	padding: var(--dt-space-200);
	min-width: 160px;
}

.filter-option {
	padding: var(--dt-space-300);
	border: none;
	background: var(--dt-action-color-background-muted-default);
	color: var(--dt-color-foreground-primary);
	font: var(--dt-typography-body-md-compact);
	text-align: left;
	cursor: pointer;
	border-radius: var(--dt-size-radius-300);
	transition: background-color 0.2s ease;
	width: 100%;
}

.filter-option:hover {
	background: var(--dt-action-color-background-muted-hover);
}

.filter-option.active {
	background: var(--dt-action-color-background-muted-selected);
}

/* Export Popover */
.export-popover {
	margin: calc(var(--dt-space-500) * -1);
	min-width: 280px;
	padding: var(--dt-space-450);
}

.export-text-group {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.export-button-wrapper {
	display: flex;
	justify-content: flex-end;
	margin-top: var(--dt-space-450);
}

.export-success-notice {
	margin-bottom: var(--dt-space-400);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
