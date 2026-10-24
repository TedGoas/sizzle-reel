<template>
	<div class="skill-panel" :class="{ 'is-open': isOpen, 'is-advanced': isAdvancedMode }">
		<div ref="skillPanelContainerRef" class="skill-panel-container">
			<!-- Header -->
			<div class="skill-panel-header">
				<div class="header-breadcrumb">
					<div class="breadcrumb-content">
						<dt-icon name="dialpad-star-mark" size="400" />
						<span class="breadcrumb-label">Skill</span>
					</div>
					<div class="breadcrumb-actions">
						<dt-button
							v-if="isCompassScanning"
							importance="clear"
							kind="muted"
							size="sm"
							disabled
						>
							<template #icon>
								<dt-icon name="loader" size="200" class="compass-spin" />
							</template>
							Reviewing...
						</dt-button>
						<template v-else-if="isAdvancedMode">
							<dt-button
								v-if="compassIssueCount > 0"
								importance="clear"
								kind="muted"
								size="sm"
								@click.stop="toggleValidationPopover"
							>
								<template #icon>
									<dt-icon name="dialpad-sparkle" size="200" />
								</template>
								{{ compassIssueCount }} suggestions
							</dt-button>
							<dt-button
								v-else-if="!isManuallyEdited"
								importance="clear"
								kind="muted"
								size="sm"
								@click.stop="startCompassScan"
							>
								<template #icon>
									<dt-icon name="check" size="200" />
								</template>
								Reviewed
							</dt-button>
							<dt-button
								v-else
								importance="clear"
								kind="muted"
								size="sm"
								@click.stop="startCompassScan"
							>
								Review
							</dt-button>
						</template>
						<template v-else>
							<dt-button
								v-if="compassIssueCount > 0"
								importance="clear"
								kind="muted"
								size="sm"
								@click.stop="switchToAdvancedAndOpenCompass"
							>
								<template #icon>
									<dt-icon name="dialpad-sparkle" size="200" />
								</template>
								{{ compassIssueCount }} suggestions
							</dt-button>
							<dt-button
								v-else
								importance="clear"
								kind="muted"
								size="sm"
								@click.stop="startCompassScan"
							>
								Auto reviewed
							</dt-button>
						</template>
						<dt-button
							v-if="computedActionCount > 0"
							importance="clear"
							kind="muted"
							size="sm"
							@click.stop="toggleActionsPopover"
						>
							<template #icon>
								<dt-icon name="tools" size="200" />
							</template>
							{{ computedActionCount }}
						</dt-button>
						<div class="breadcrumb-divider" />
						<dt-button
							importance="clear"
							kind="muted"
							size="sm"
							circle
							@click="$emit('close')"
						>
							<template #icon>
								<dt-icon name="close" size="200" />
							</template>
						</dt-button>
					</div>
				</div>
			</div>

			<!-- Content (Scrollable) -->
			<div class="skill-panel-content">
				<div class="content-inner">
					<!-- Advanced Mode Fields -->
					<template v-if="isAdvancedMode">
						<!-- Skill Name -->
						<div class="form-section">
							<div class="form-label">
								<div class="label-text">Skill Name</div>
							</div>
							<dt-input
								v-model="skillName"
								placeholder="Enter skill name"
								size="md"
							/>
						</div>

						<!-- Description -->
						<div class="form-section">
							<div class="form-label">
								<div class="label-text">Description</div>
								<div class="label-description">
									Briefly describe what this skill does.
								</div>
							</div>
							<div class="editor-container editor-container-description">
								<div class="editor-toolbar">
									<div class="toolbar-group">
										<button
											v-for="format in textFormats"
											:key="format.name"
											class="toolbar-button"
											:title="format.name"
											@click="applyFormat(format.name, 'description')"
										>
											<dt-icon :name="format.icon" size="200" />
										</button>
									</div>
									<div class="toolbar-divider"></div>
									<div class="toolbar-group">
										<button
											class="toolbar-button"
											title="Align Left"
											@click="applyFormat('align-left', 'description')"
										>
											<dt-icon name="align-left" size="200" />
										</button>
									</div>
									<div class="toolbar-divider"></div>
									<div class="toolbar-group">
										<button
											v-for="list in listFormats"
											:key="list.name"
											class="toolbar-button"
											:title="list.name"
											@click="applyFormat(list.name, 'description')"
										>
											<dt-icon :name="list.icon" size="200" />
										</button>
									</div>
									<div class="toolbar-divider"></div>
									<div class="toolbar-group">
										<button
											class="toolbar-button"
											title="Insert Link"
											@click="insertLink('description')"
										>
											<dt-icon name="link-2" size="200" />
										</button>
										<button
											class="toolbar-button"
											title="Insert Code"
											@click="insertCode('description')"
										>
											<dt-icon name="code" size="200" />
										</button>
									</div>
								</div>
								<div
									ref="descriptionEditor"
									class="editor-content"
									contenteditable="true"
									@input="handleDescriptionInput"
									@keydown="handleKeydown"
									v-html="descriptionContent"
								></div>
							</div>
						</div>
					</template>

					<!-- Instructions Section: Simple mode -->
					<div v-if="!isAdvancedMode" class="form-section">
						<div class="form-label">
							<div class="label-text">Summary</div>
							<div class="label-description">
								A summary of your skill's steps. Switch to Advanced to edit in full.
							</div>
						</div>

						<!-- Building indicator -->
						<div v-if="isBuilding" class="skill-building-indicator">
							<dt-icon name="loading" size="200" class="skill-building-spinner" />
							<span>Generating skill content…</span>
						</div>

						<div class="editor-container editor-container-simple">
							<div
								ref="simpleEditor"
								class="editor-content editor-content--simple"
								contenteditable="true"
								v-html="simpleContent"
							></div>
							<Transition name="simple-info-banner">
								<dt-notice
									v-if="simpleIsDirty"
									kind="info"
									hide-icon
									hide-action
									@close="dismissSimpleBanner"
								>
									<template #default>
										<strong>Accept edits is on.</strong> Assistant will update the advanced prompt to align with your changes.
									</template>
								</dt-notice>
							</Transition>
						</div>
					</div>

					<!-- Instructions Section: Advanced mode -->
					<div v-else class="form-section">
						<div class="form-label">
							<div class="label-text">Instructions</div>
							<div class="label-description">
								Outline each step and action the agent should take to complete this task.
							</div>
						</div>

						<!-- Building indicator -->
						<div v-if="isBuilding" class="skill-building-indicator">
							<dt-icon name="loading" size="200" class="skill-building-spinner" />
							<span>Generating skill content…</span>
						</div>

						<!-- Rich Text Editor -->
						<div class="editor-container editor-container-advanced">
							<!-- Toolbar -->
							<div class="editor-toolbar">
								<div class="toolbar-group">
									<button
										v-for="format in textFormats"
										:key="format.name"
										class="toolbar-button"
										:title="format.name"
										@click="applyFormat(format.name, 'instructions')"
									>
										<dt-icon :name="format.icon" size="200" />
									</button>
								</div>

								<div class="toolbar-divider"></div>

								<div class="toolbar-group">
									<button
										class="toolbar-button"
										title="Align Left"
										@click="applyFormat('align-left', 'instructions')"
									>
										<dt-icon name="align-left" size="200" />
									</button>
								</div>

								<div class="toolbar-divider"></div>

								<div class="toolbar-group">
									<button
										v-for="list in listFormats"
										:key="list.name"
										class="toolbar-button"
										:title="list.name"
										@click="applyFormat(list.name, 'instructions')"
									>
										<dt-icon :name="list.icon" size="200" />
									</button>
								</div>

								<div class="toolbar-divider"></div>

								<div class="toolbar-group">
									<button
										class="toolbar-button"
										title="Insert Link"
										@click="insertLink('instructions')"
									>
										<dt-icon name="link-2" size="200" />
									</button>
									<button
										class="toolbar-button"
										title="Insert Code"
										@click="insertCode('instructions')"
									>
										<dt-icon name="code" size="200" />
									</button>
								</div>
							</div>

							<!-- Editor Content -->
							<div
								ref="instructionsEditor"
								class="editor-content"
								contenteditable="true"
								@input="handleInstructionsInput"
								@keydown="handleKeydown"
								v-html="instructionsContent"
							></div>
						</div>
					</div>

					<!-- Advanced Mode: Guardrails and Labels -->
					<template v-if="isAdvancedMode">
						<!-- Guardrails -->
						<div class="form-section">
							<div class="form-label">
								<div class="label-text">Guardrails</div>
								<div class="label-description">
									Add guidelines to ensure compliance and safety.
								</div>
							</div>
							<div class="editor-container editor-container-guardrails">
								<div class="editor-toolbar">
									<div class="toolbar-group">
										<button
											v-for="format in textFormats"
											:key="format.name"
											class="toolbar-button"
											:title="format.name"
											@click="applyFormat(format.name, 'guardrails')"
										>
											<dt-icon :name="format.icon" size="200" />
										</button>
									</div>
									<div class="toolbar-divider"></div>
									<div class="toolbar-group">
										<button
											class="toolbar-button"
											title="Align Left"
											@click="applyFormat('align-left', 'guardrails')"
										>
											<dt-icon name="align-left" size="200" />
										</button>
									</div>
									<div class="toolbar-divider"></div>
									<div class="toolbar-group">
										<button
											v-for="list in listFormats"
											:key="list.name"
											class="toolbar-button"
											:title="list.name"
											@click="applyFormat(list.name, 'guardrails')"
										>
											<dt-icon :name="list.icon" size="200" />
										</button>
									</div>
									<div class="toolbar-divider"></div>
									<div class="toolbar-group">
										<button
											class="toolbar-button"
											title="Insert Link"
											@click="insertLink('guardrails')"
										>
											<dt-icon name="link-2" size="200" />
										</button>
										<button
											class="toolbar-button"
											title="Insert Code"
											@click="insertCode('guardrails')"
										>
											<dt-icon name="code" size="200" />
										</button>
									</div>
								</div>
								<div
									ref="guardrailsEditor"
									class="editor-content"
									contenteditable="true"
									@input="handleGuardrailsInput"
									@keydown="handleKeydown"
									v-html="guardrailsContent"
								></div>
							</div>
						</div>

						<!-- Labels -->
						<div class="form-section">
							<div class="form-label">
								<div class="label-text">Labels <span class="label-optional">(Optional)</span></div>
							</div>
							<dt-input
								v-model="labels"
								placeholder="Select a label or start typing"
								size="md"
							/>
						</div>
					</template>
				</div>
			</div>

			<!-- Footer (Fixed with gradient) -->
			<div class="skill-panel-footer">
				<div class="footer-actions">
					<dt-button
						importance="clear"
						kind="muted"
						size="md"
						:disabled="isUpdatingFromSimple"
						@click="handleToggleMode"
					>
						{{ isAdvancedMode ? 'Simple' : 'Advanced' }}
					</dt-button>
					<div class="footer-actions-right">
						<!-- Unaccepted mined skill buttons -->
						<template v-if="isUnacceptedMinedSkill">
							<dt-button
								importance="clear"
								kind="muted"
								size="md"
								@click="handleDecline"
							>
								Decline suggestion
							</dt-button>
							<dt-button
								importance="primary"
								size="md"
								@click="handleAccept"
							>
								Accept
							</dt-button>
						</template>
						<!-- Normal buttons -->
						<template v-else>
							<dt-button
								importance="clear"
								kind="muted"
								size="md"
								@click="$emit('cancel')"
							>
								Cancel
							</dt-button>
							<dt-button
								importance="primary"
								size="md"
								:loading="isUpdatingFromSimple"
								@click="handleUpdate"
							>
								{{ liveSkill?.isNew ? 'Create' : 'Update' }}
							</dt-button>
						</template>
					</div>
				</div>
			</div>
		</div>

		<!-- Slash Command Menu — main popover -->
		<div
			v-if="showSlashMenu"
			class="slash-command-menu"
			:style="slashMenuPositionStyle"
			@mousedown.prevent
		>
			<div class="slash-section-label">Actions</div>
			<div class="slash-actions-scroll">
				<div
					v-for="(action, i) in filteredActions"
					:key="action.id"
					class="slash-action-item"
					:class="{ selected: i === selectedMenuIndex && !activeSubmenu }"
					@click="handleActionClick(action)"
					@mouseenter="selectedMenuIndex = i; activeSubmenu = null"
				>
					<slash-source-icon :source="action.source" />
					<span>{{ action.label }}</span>
				</div>
				<div v-if="!filteredActions.length" class="slash-no-results">No actions found</div>
			</div>
			<div class="slash-divider" />
			<div
				v-for="cmd in menuCommands"
				:key="cmd.id"
				class="slash-menu-row"
				:class="{ selected: activeSubmenu === cmd.id }"
				@mouseenter="openSubmenu(cmd, $event)"
				@click="openSubmenu(cmd, $event)"
			>
				<dt-icon :name="cmd.icon" size="200" class="slash-row-icon" />
				<span class="slash-row-label">{{ cmd.label }}</span>
				<dt-icon name="chevron-right" size="100" class="slash-chevron" />
			</div>
		</div>

		<!-- Transfer submenu -->
		<div
			v-if="activeSubmenu === 'transfer'"
			class="slash-submenu slash-transfer-submenu"
			:style="submenuPositionStyle"
			@mousedown.prevent
		>
			<div class="slash-section-label">Digital</div>
			<div
				v-for="item in transferSubmenu.digital"
				:key="item.id"
				class="slash-submenu-item"
				@click.stop="handleTransferItemClick(item, 'digital', $event)"
			>{{ item.label }}</div>
			<div class="slash-divider" />
			<div class="slash-section-label slash-section-label--spaced">Voice</div>
			<div
				v-for="item in transferSubmenu.voice"
				:key="item.id"
				class="slash-submenu-item"
				@click.stop="handleTransferItemClick(item, 'voice', $event)"
			>{{ item.label }}</div>
		</div>

		<!-- Workflow submenu (panel-style) -->
		<div
			v-if="activeSubmenu === 'workflow'"
			class="slash-submenu slash-workflow-submenu"
			:style="submenuPositionStyle"
			@mousedown.prevent
		>
			<div class="slash-workflow-search">
				<dt-input v-model="workflowSearch" placeholder="Search workflows" size="sm" />
			</div>
			<template v-if="!workflowSearch">
				<div class="slash-section-label slash-section-label--spaced">Digital</div>
				<div
					v-for="item in workflowSubmenu.digital"
					:key="item.id"
					class="slash-submenu-item"
					@click.stop="handleWorkflowItemClick(item, $event)"
					@mouseenter="activeTargetItem = null"
				>{{ item.label }}</div>
				<div class="slash-divider" />
				<div class="slash-section-label slash-section-label--spaced">Voice</div>
				<div
					v-for="item in workflowSubmenu.voice"
					:key="item.id"
					class="slash-submenu-item"
					:class="{ selected: activeTargetItem?.id === item.id }"
					@click.stop="handleWorkflowItemClick(item, $event)"
					@mouseenter="item.targets ? openTargetSubmenu(item, $event) : (activeTargetItem = null)"
				>
					<span class="slash-submenu-label">{{ item.label }}</span>
					<template v-if="item.targets">
						<span class="slash-target-count">{{ item.targets.length }}</span>
						<dt-icon name="chevron-right" size="100" class="slash-chevron" />
					</template>
				</div>
			</template>
			<template v-else>
				<div
					v-for="item in filteredWorkflowItems"
					:key="item.id"
					class="slash-submenu-item"
					@click.stop="handleWorkflowItemClick(item, $event)"
				>
					<span class="slash-submenu-label">{{ item.label }}</span>
					<template v-if="item.targets">
						<span class="slash-target-count">{{ item.targets.length }}</span>
						<dt-icon name="chevron-right" size="100" class="slash-chevron" />
					</template>
				</div>
				<div v-if="!filteredWorkflowItems.length" class="slash-no-results">No workflows found</div>
			</template>
		</div>

		<!-- Targets submenu (3rd level) -->
		<div
			v-if="activeTargetItem"
			class="slash-submenu slash-targets-submenu"
			:style="targetSubmenuPositionStyle"
			@mousedown.prevent
		>
			<div class="slash-section-label">Targets</div>
			<div
				v-for="(target, i) in activeTargetItem.targets"
				:key="i"
				class="slash-submenu-item"
				@click.stop="handleTargetClick(target)"
			>{{ target }}</div>
		</div>

		<!-- Transfer Action Panel -->
		<div v-if="showActionPanel && actionPanelItem" class="transfer-panel-scrim" @click="closeActionPanel">
			<div class="transfer-panel" @click.stop>
				<div class="transfer-panel-header">
					<div class="transfer-panel-meta">
						<span class="transfer-panel-eyebrow">{{ actionPanelItem.section }}</span>
						<span class="transfer-panel-title">{{ actionPanelItem.label }}</span>
					</div>
					<dt-button size="sm" importance="clear" kind="muted" @click="closeActionPanel" @mousedown.stop>
						<template #icon><dt-icon name="close" size="200" /></template>
					</dt-button>
				</div>
				<div class="transfer-combobox">
					<div class="transfer-combobox-field">
						<dt-input
							v-model="transferSearch"
							placeholder="Type or select..."
							size="xs"
							:show-messages="false"
							@focus="showTransferDropdown = true"
							@blur="showTransferDropdown = false"
						/>
						<dt-icon name="chevrons-up-down" size="200" class="transfer-combobox-chevron" />
					</div>
					<div v-if="showTransferDropdown" class="transfer-dropdown" @mousedown.prevent>
						<div
							v-for="opt in filteredTransferOptions"
							:key="opt.value"
							class="transfer-dropdown-row"
							:class="{ 'transfer-dropdown-row--selected': actionPanelValue === opt.value }"
							@mousedown.prevent="selectTransferOption(opt)"
						>
							<span class="transfer-dropdown-label">{{ opt.label }}</span>
							<span v-if="opt.role" class="transfer-dropdown-role">{{ opt.role }}</span>
						</div>
						<div v-if="!filteredTransferOptions.length" class="transfer-dropdown-empty">No results</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Overlay to close menus when clicking outside -->
		<div v-if="showSlashMenu" class="slash-menu-overlay" @click="closeAll"></div>
	</div>

	<!-- Skill Popovers (float left of skill panel) -->
	<Teleport to="body">
		<div
			v-if="showValidationPopover || showActionsPopover"
			class="skill-popovers-wrapper"
			:style="skillPopoversWrapperStyle"
		>
			<div class="popovers-group">
				<div class="popovers-resize-handle" @mousedown="startPopoverResize" />
				<compass-popover
					:visible="showValidationPopover"
					:errors="compassIssues"
					:is-scanning="isCompassScanning"
					:is-shimmering="isCompassShimmering"
					@close="showValidationPopover = false"
					@dismiss-error="dismissCompassIssue"
					@explain="handleExplainCompass"
					@fix-all="handleFixAll"
				/>
				<actions-popover
					:visible="showActionsPopover"
					:connector-groups="skillConnectorGroups"
					:model-value="selectedConnections"
					@close="showActionsPopover = false"
					@update:model-value="selectedConnections = $event"
				/>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { DtButton, DtIcon, DtInput, DtNotice } from '../ui';
import { useTypewriter } from "../../composables/useTypewriter.js";
import { state } from "../../state.js";
import { useSimpleMode } from "../../composables/useSimpleMode.js";
import { debugLogger } from '../../lib/debugLogger.js';
import { generateCompassIssues as _generateCompassIssues } from "../../composables/useCompassGeneration.js";
import { getMockCompassIssues, getMockFixedSteps } from "../../compassMockData.js";
import ActionsPopover from "./ActionsPopover.vue";
import CompassPopover from "./CompassPopover.vue";

// ─── Inline source icon component ────────────────────────────────────────────
const SlashSourceIcon = {
	props: { source: String },
	components: { DtIcon },
	template: `
		<span class="slash-source-icon">
			<span v-if="source === 'google-calendar'">
				<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="12" height="12" rx="1" fill="white"/>
					<rect x="7.42" y="7.43" width="2.58" height="2.57" fill="#EA4335"/>
					<rect y="7.43" width="2.61" height="2.57" fill="#188038"/>
					<rect x="7.42" width="2.58" height="2.59" fill="#1967D2"/>
					<rect x="7.63" y="2.37" width="2.37" height="5.26" fill="#FBBC04"/>
					<rect x="2.37" y="7.63" width="5.26" height="2.37" fill="#34A853"/>
					<rect width="7.63" height="7.63" fill="#4285F4"/>
				</svg>
			</span>
			<span v-else-if="source === 'o365-calendar'">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="16" height="16" rx="2" fill="#0078D4"/>
					<rect x="4" y="3" width="8" height="1.5" rx="0.5" fill="white" opacity="0.9"/>
					<rect x="4" y="6" width="8" height="6" rx="1" fill="white" opacity="0.15"/>
					<line x1="4" y1="6" x2="12" y2="6" stroke="white" stroke-width="1" opacity="0.9"/>
					<rect x="5" y="7.5" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="9" y="7.5" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="5" y="10" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="9" y="10" width="2" height="1.5" rx="0.3" fill="white" opacity="0.8"/>
					<rect x="3" y="2" width="1.5" height="3" rx="0.5" fill="white" opacity="0.9"/>
					<rect x="11.5" y="2" width="1.5" height="3" rx="0.5" fill="white" opacity="0.9"/>
				</svg>
			</span>
			<span v-else-if="source === 'dialpad'">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="8" cy="8" r="7.5" fill="#7C3FFF" stroke="none"/>
					<path d="M8 4.5L9.5 7.2H12L10 8.8L10.8 11.5L8 9.8L5.2 11.5L6 8.8L4 7.2H6.5L8 4.5Z" fill="white"/>
				</svg>
			</span>
			<dt-icon v-else name="zap" size="200" />
		</span>
	`,
};

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false,
	},
	skillData: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(["close", "toggle-mode", "cancel", "update", "accept", "decline"]);

// Mode state
const isAdvancedMode = ref(true);

// Track if mined skill has been accepted
const isSkillAccepted = ref(false);

// Live skill data derived from state — updates reactively when builder writes to it.
// Falls back to props.skillData for skills not yet tracked in state (e.g. archived skills).
const liveSkill = computed(() =>
	state.skillNodes.find(s => s.id === props.skillData?.id) ?? props.skillData
);

// True while this skill's instructions are actively being generated by the builder
const isBuilding = computed(() =>
	state.activeSkillBuild !== null && state.activeSkillBuild === liveSkill.value?.id
);

// Computed: Check if this is an unaccepted mined skill (reads from liveSkill so it works
// even when only { id } is passed as skillData)
const isUnacceptedMinedSkill = computed(() => {
	return liveSkill.value?.fromMining && liveSkill.value?.isNew && !isSkillAccepted.value;
});

// Advanced mode fields
const skillName = ref("Bookings");
const labels = ref("");

const { typewriterEffect } = useTypewriter();

// Tracks which skill is currently displayed — used to distinguish "new skill opened"
// from "same skill updated by builder"
const currentSkillId = ref(null);

// Watch liveSkill so the panel reacts to both prop changes (new skill opened) and
// state mutations (builder writing instructions asynchronously).
watch(liveSkill, (newData) => {
	if (!newData || Object.keys(newData).length === 0) return;

	const isNewSkill = newData.id !== currentSkillId.value;

	if (isNewSkill) {
		// New skill opened — full reset and populate
		currentSkillId.value = newData.id ?? null;
		isSkillAccepted.value = false;

		// props.skillData.animateText is set by AgentEditorTab for the typewriter flow;
		// liveSkill itself never carries this ephemeral flag.
		if (props.skillData.animateText) {
			if (newData.name) {
				skillName.value = '';
				setTimeout(() => {
					typewriterEffect(newData.name, (text) => {
						skillName.value = text;
					}, 30);
				}, 300);
			}

			if (newData.description) {
				descriptionContent.value = '';
				setTimeout(() => {
					let currentText = '';
					typewriterEffect(newData.description, (text) => {
						currentText = text;
						descriptionContent.value = `<p>${currentText}</p>`;
					}, 15);
				}, 800);
			}

			if (newData.instructions) {
				instructionsContent.value = '';
				setTimeout(() => {
					const steps = newData.instructions.split('</p>').filter(s => s.trim());
					let currentStep = 0;
					let displayHtml = '';

					const showNextStep = () => {
						if (currentStep < steps.length) {
							displayHtml += steps[currentStep] + '</p>';
							instructionsContent.value = displayHtml;
							currentStep++;
							setTimeout(showNextStep, 400);
						}
					};

					showNextStep();
				}, 1500);
			}

			if (newData.fromMining) isAdvancedMode.value = true;
		} else {
			// Immediate population (no animation)
			skillName.value = newData.name || '';
			descriptionContent.value = newData.description ? `<p>${newData.description}</p>` : '';
			instructionsContent.value = newData.instructions || '';
			if (newData.fromMining) isAdvancedMode.value = true;
		}
	} else {
		// Same skill — only update instructions if the builder just wrote them in
		// (panel was open with empty instructions, builder populated state)
		if (newData.instructions && !instructionsContent.value) {
			instructionsContent.value = newData.instructions;
		}
	}
}, { immediate: true });

// Watch for panel close to reset mode
watch(() => props.isOpen, (newIsOpen) => {
	if (!newIsOpen) {
		// Reset to simple mode when panel closes
		isAdvancedMode.value = false;
	}
});

// Editor refs
const instructionsEditor = ref(null);
const descriptionEditor = ref(null);
const guardrailsEditor = ref(null);

// Editor content
const instructionsContent = ref(`<p><strong>Retrieve Calendars</strong> — Use <span class="connection-badge">List Events</span> to get all calendar IDs and the primary time zone.</p>
<p><strong>Collect Details</strong> — Gather necessary information (purpose, preferred date/time, contact info).</p>
<p><strong>Check Availability</strong> — Use <span class="connection-badge">List Event</span> to find open slots within business hours, excluding holidays and present up to three available options.</p>
<p><strong>Execute Action</strong> —</p>
<p>Schedule: use <span class="connection-badge">Create Events</span></p>
<p>Modify: use <span class="connection-badge">Update Events</span></p>
<p>Cancel: use <span class="connection-badge">Delete Events</span> and confirm using <span class="connection-badge connection-badge--workflow">Cancel Policy</span> workflow.</p>
<p><strong>Send Confirmation</strong> — Deliver confirmation via <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span> with relevant appointment info.</p>`);

const descriptionContent = ref(`<p>Helps customers with all booking-related requests.</p>`);

const guardrailsContent = ref(`<p>Never share personal information with unauthorized parties.</p>
<p>Always verify customer identity before modifying bookings.</p>
<p>Comply with cancellation policy at all times.</p>`);

// ─── Simple mode (derived view from instructions) ─────────────────────────────
const { simpleEditor, simpleIsDirty, isUpdatingFromSimple, simpleContent, generateAdvancedFromSimple, dismissSimpleBanner } = useSimpleMode(instructionsContent);

// ─── Slash command state ──────────────────────────────────────────────────────
const showSlashMenu = ref(false);
const slashMenuPosition = ref({ top: 0, left: 0 });
const submenuPosition = ref({ top: 0, left: 0 });
const activeSubmenu = ref(null); // 'transfer' | 'workflow' | null
const currentEditor = ref(null);
const selectedMenuIndex = ref(0);
const searchQuery = ref('');

// New state for 3-type system
const workflowSearch = ref('');
const activeTargetItem = ref(null);
const targetSubmenuPosition = ref({ top: 0, left: 0 });
const showActionPanel = ref(false);
const actionPanelItem = ref(null); // { label, section, id }
const actionPanelValue = ref('');
const transferSearch = ref('');
const showTransferDropdown = ref(false);
const savedRange = ref(null); // preserves cursor position while modal is open

// ─── Slash command data ───────────────────────────────────────────────────────
const actionItems = [
	{ id: 'gcal-create',   label: 'Create event',          source: 'google-calendar' },
	{ id: 'gcal-cancel',   label: 'Cancel event',          source: 'google-calendar' },
	{ id: 'gcal-delete',   label: 'Delete event',          source: 'google-calendar' },
	{ id: 'gcal-list',     label: 'List events',           source: 'google-calendar' },
	{ id: 'o365-cancel',   label: 'Cancel events',         source: 'o365-calendar'   },
	{ id: 'o365-create',   label: 'Create events',         source: 'o365-calendar'   },
	{ id: 'o365-list',     label: 'List events',           source: 'o365-calendar'   },
	{ id: 'dp-sms',        label: 'Send SMS',              source: 'dialpad'         },
	{ id: 'dp-email',      label: 'Send email',            source: 'dialpad'         },
	{ id: 'dp-calendar',   label: 'Create calendar event', source: 'dialpad'         },
	{ id: 'dp-video',      label: 'Join video call',       source: 'dialpad'         },
];

const transferSubmenu = {
	digital: [
		{ id: 'agents',         label: 'Agents',         needsPanel: false },
		{ id: 'contact-center', label: 'Contact Center', needsPanel: true  },
		{ id: 'team-member-d',  label: 'Team Member',    needsPanel: true  },
	],
	voice: [
		{ id: 'voicemail',     label: 'Voicemail',   needsPanel: false },
		{ id: 'operators',     label: 'Operators',   needsPanel: false },
		{ id: 'groups',        label: 'Groups',      needsPanel: false },
		{ id: 'team-member-v', label: 'Team Member', needsPanel: false },
		{ id: 'room-phone',    label: 'Room Phone',  needsPanel: false },
	],
};

const workflowSubmenu = {
	digital: [
		{ id: 'wf-account-cancel',  label: 'Account cancellations' },
		{ id: 'wf-change-prefs',    label: 'Change preferences'    },
		{ id: 'wf-update-settings', label: 'Update settings'       },
		{ id: 'wf-renewals',        label: 'Manage renewals'       },
	],
	voice: [
		{ id: 'wf-cancel-orders',  label: 'Cancel orders'       },
		{ id: 'wf-cancel-policy',  label: 'Cancel Policy',      targets: ['Standard Policy', 'Premium Policy'] },
		{ id: 'wf-event-cancel',   label: 'Event cancellations', targets: ['Event A', 'Event B', 'Event C'] },
		{ id: 'wf-cancel-appt',    label: 'Cancel appointment'  },
		{ id: 'wf-refund',         label: 'Request refund'      },
		{ id: 'wf-feedback',       label: 'Feedback submission', targets: ['Product Feedback', 'Support Feedback'] },
	],
};

const menuCommands = [
	{ id: 'transfer', label: 'Transfer', icon: 'arrow-left-right' },
	{ id: 'workflow', label: 'Workflow', icon: 'workflow'         },
];

// Transfer destination options per item
const transferOptionsMap = {
	'contact-center': [
		{ value: 'general',   label: 'General Support'    },
		{ value: 'technical', label: 'Technical Support'  },
		{ value: 'billing',   label: 'Billing & Payments' },
		{ value: 'sales',     label: 'Sales'              },
		{ value: 'success',   label: 'Customer Success'   },
		{ value: 'returns',   label: 'Returns & Exchanges'},
	],
	'team-member-d': [
		{ value: 'alex-lee',      label: 'Alex Lee',      role: 'User'  },
		{ value: 'alex-rogers',   label: 'Alex Rogers',   role: 'User'  },
		{ value: 'jordan-smith',  label: 'Jordan Smith',  role: 'Admin' },
		{ value: 'taylor-brown',  label: 'Taylor Brown',  role: 'User'  },
		{ value: 'morgan-white',  label: 'Morgan White',  role: 'Admin' },
		{ value: 'jamie-taylor',  label: 'Jamie Taylor',  role: 'User'  },
	],
};

// ─── Computed ─────────────────────────────────────────────────────────────────
const slashMenuPositionStyle = computed(() => ({
	top: slashMenuPosition.value.top + 'px',
	left: slashMenuPosition.value.left + 'px',
}));

const submenuPositionStyle = computed(() => ({
	top: submenuPosition.value.top + 'px',
	left: submenuPosition.value.left + 'px',
}));

const targetSubmenuPositionStyle = computed(() => ({
	top: targetSubmenuPosition.value.top + 'px',
	left: targetSubmenuPosition.value.left + 'px',
}));

const filteredActions = computed(() => {
	if (!searchQuery.value) return actionItems;
	const q = searchQuery.value.toLowerCase();
	return actionItems.filter(a => a.label.toLowerCase().includes(q));
});

const filteredWorkflowItems = computed(() => {
	if (!workflowSearch.value) return [];
	const q = workflowSearch.value.toLowerCase();
	return [
		...workflowSubmenu.digital.filter(i => i.label.toLowerCase().includes(q)),
		...workflowSubmenu.voice.filter(i => i.label.toLowerCase().includes(q)),
	];
});

// ─── Toolbar formatting options ───────────────────────────────────────────────
const textFormats = [
	{ name: "Bold",      icon: "bold"      },
	{ name: "Italic",    icon: "italic"    },
	{ name: "Underline", icon: "underline" },
];

const listFormats = [
	{ name: "Bulleted List",  icon: "list-bullet"  },
	{ name: "Numbered List",  icon: "list-ordered" },
];

// Format handlers
const applyFormat = (formatName, editorType = 'instructions') => {
	// Placeholder
};

const insertLink = (editorType = 'instructions') => {
	// Placeholder
};

const insertCode = (editorType = 'instructions') => {
	// Placeholder
};

const handleInstructionsInput = () => {
	currentEditor.value = 'instructions';
	isManuallyEdited.value = true;
};

const handleDescriptionInput = () => {
	currentEditor.value = 'description';
};

const handleGuardrailsInput = () => {
	currentEditor.value = 'guardrails';
};

// ─── Keyboard handler ─────────────────────────────────────────────────────────
const handleKeydown = (event) => {
	// Detect "/" key to show slash command menu
	if (event.key === "/" && !showSlashMenu.value) {
		selectedMenuIndex.value = 0;
		searchQuery.value = '';
		activeSubmenu.value = null;
		activeTargetItem.value = null;

		// Measure the cursor position RIGHT NOW, before "/" is inserted.
		// getClientRects()[0] returns a proper rect (with correct top/bottom/left)
		// even for a collapsed zero-width cursor, unlike getBoundingClientRect().
		const sel = window.getSelection();
		let cursorBottom = 0;
		let cursorTop    = 0;
		let cursorLeft   = 0;

		if (sel && sel.rangeCount > 0) {
			const rects = sel.getRangeAt(0).getClientRects();
			if (rects.length > 0) {
				cursorBottom = rects[0].bottom;
				cursorTop    = rects[0].top;
				cursorLeft   = rects[0].left;
			} else {
				// Absolute fallback: anchor to the editor element
				const r = event.currentTarget.getBoundingClientRect();
				cursorBottom = r.top + 24;
				cursorTop    = r.top;
				cursorLeft   = r.left + 16;
			}
		}

		setTimeout(() => {
			// Realistic popover height: section label + scrollable actions list
			// (capped at 190px) + divider + 2 bottom rows + padding ≈ 305px
			const menuWidth  = 240;
			const menuHeight = 305;
			const padding    = 8;

			let top  = cursorBottom + 6;
			let left = cursorLeft;

			// Don't overflow right edge
			if (left + menuWidth + padding > window.innerWidth) {
				left = Math.max(padding, window.innerWidth - menuWidth - padding);
			}
			// Don't overflow bottom edge — flip the menu above the cursor line
			if (top + menuHeight + padding > window.innerHeight) {
				top = cursorTop - menuHeight - 4;
				if (top < padding) top = padding;
			}
			left = Math.max(padding, left);

			slashMenuPosition.value = { top, left };
			showSlashMenu.value = true;
		}, 10);
		return;
	}

	if (showSlashMenu.value) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedMenuIndex.value = Math.min(
				selectedMenuIndex.value + 1,
				filteredActions.value.length - 1
			);
			activeSubmenu.value = null;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedMenuIndex.value = Math.max(selectedMenuIndex.value - 1, 0);
			activeSubmenu.value = null;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const action = filteredActions.value[selectedMenuIndex.value];
			if (action) {
				handleActionClick(action);
			}
		} else if (event.key === 'Escape') {
			event.preventDefault();
			if (activeSubmenu.value) {
				activeSubmenu.value = null;
				activeTargetItem.value = null;
			} else {
				closeAll();
			}
		} else if (event.key === 'Backspace') {
			if (searchQuery.value === '') {
				closeAll();
			} else {
				event.preventDefault();
				searchQuery.value = searchQuery.value.slice(0, -1);
				selectedMenuIndex.value = 0;
			}
		} else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			searchQuery.value += event.key;
			selectedMenuIndex.value = 0;
			activeSubmenu.value = null;
		}
	}
};

// ─── Slash menu handlers ──────────────────────────────────────────────────────
const handleActionClick = (action) => {
	insertCommand(action.label, 'action');
	closeAll();
};

const openSubmenu = (cmd, event) => {
	activeSubmenu.value = cmd.id;
	activeTargetItem.value = null;
	workflowSearch.value = '';

	const rect = event.currentTarget.getBoundingClientRect();
	const padding = 8;
	// These must match the CSS min-width values so the flip lands flush against
	// the main popover with no gap (rendered width == min-width for these menus).
	const submenuWidth  = cmd.id === 'workflow' ? 240 : 180;
	// Actual workflow height: search + labels + 10 items + divider + padding ≈ 440px
	const submenuHeight = cmd.id === 'workflow' ? 440 : 270;

	// Prefer right; if it would overflow, anchor right edge flush to the popover's left edge
	let left = rect.right + 4;
	if (left + submenuWidth + padding > window.innerWidth) {
		left = slashMenuPosition.value.left - submenuWidth;
	}
	left = Math.max(padding, left);

	// Align top with the row then clamp so the submenu doesn't run off the bottom
	let top = rect.top - 4;
	if (top + submenuHeight + padding > window.innerHeight) {
		top = Math.max(padding, window.innerHeight - submenuHeight - padding);
	}
	top = Math.max(padding, top);

	submenuPosition.value = { top, left };
};

const handleTransferItemClick = (item, section) => {
	if (item.needsPanel) {
		// Save the cursor range before the modal opens and focus moves away
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0) {
			savedRange.value = sel.getRangeAt(0).cloneRange();
		}
		actionPanelItem.value = { ...item, section };
		actionPanelValue.value = '';
		showActionPanel.value = true;
		activeSubmenu.value = null;
		showSlashMenu.value = false;
	} else {
		insertCommand(`Transfer to ${item.label}`, 'transfer');
		closeAll();
	}
};


const closeActionPanel = () => {
	showActionPanel.value = false;
	actionPanelItem.value = null;
	transferSearch.value = '';
	showTransferDropdown.value = false;
	savedRange.value = null;
};

const handleWorkflowItemClick = (item, event) => {
	if (item.targets) {
		openTargetSubmenu(item, event);
	} else {
		insertCommand(item.label, 'workflow');
		closeAll();
	}
};

const openTargetSubmenu = (item, event) => {
	activeTargetItem.value = item;
	const rect = event.currentTarget.getBoundingClientRect();
	const padding = 8;
	const submenuWidth = 180;
	const submenuHeight = (item.targets?.length ?? 0) * 34 + 40;

	// Prefer right; flip left if it would overflow
	let left = rect.right + 4;
	if (left + submenuWidth + padding > window.innerWidth) {
		left = rect.left - submenuWidth - 4;
	}
	left = Math.max(padding, left);

	let top = rect.top - 4;
	if (top + submenuHeight + padding > window.innerHeight) {
		top = Math.max(padding, window.innerHeight - submenuHeight - padding);
	}
	top = Math.max(padding, top);

	targetSubmenuPosition.value = { top, left };
};

const handleTargetClick = (target) => {
	insertCommand(`${activeTargetItem.value.label}: ${target}`, 'workflow');
	closeAll();
};

const getTransferOptions = (item) => {
	if (!item) return [];
	return transferOptionsMap[item.id] || [];
};

const filteredTransferOptions = computed(() => {
	const opts = getTransferOptions(actionPanelItem.value);
	if (!transferSearch.value) return opts;
	const q = transferSearch.value.toLowerCase();
	return opts.filter(o => o.label.toLowerCase().includes(q));
});

const selectTransferOption = (opt) => {
	const label = `Transfer to ${actionPanelItem.value.label}: ${opt.label}`;
	insertCommand(label, 'transfer');
	closeAll();
	transferSearch.value = '';
	showTransferDropdown.value = false;
};

const closeAll = () => {
	showSlashMenu.value = false;
	activeSubmenu.value = null;
	activeTargetItem.value = null;
	showActionPanel.value = false;
	actionPanelItem.value = null;
	workflowSearch.value = '';
	transferSearch.value = '';
};

// ─── Insert badge ─────────────────────────────────────────────────────────────
const insertCommand = (text, badgeType = 'action') => {
	let editorEl = null;
	if (currentEditor.value === 'instructions') {
		editorEl = instructionsEditor.value;
	} else if (currentEditor.value === 'description') {
		editorEl = descriptionEditor.value;
	} else if (currentEditor.value === 'guardrails') {
		editorEl = guardrailsEditor.value;
	}
	// Fallback: if currentEditor wasn't tracked yet, default to instructions
	if (!editorEl) editorEl = instructionsEditor.value;
	if (!editorEl) return;

	const selection = window.getSelection();

	// Prefer the saved range if we have one — the modal stole focus so the
	// live selection may be stale or pointing outside the editor entirely.
	if (savedRange.value) {
		selection.removeAllRanges();
		selection.addRange(savedRange.value);
	}
	savedRange.value = null;

	if (selection.rangeCount === 0) return;

	if (selection.rangeCount > 0) {
		const range = selection.getRangeAt(0);

		// Find and remove the "/" that triggered the menu
		const textNode = range.startContainer;
		if (textNode.nodeType === Node.TEXT_NODE) {
			const text = textNode.textContent;
			const cursorPos = range.startOffset;
			const lastSlashPos = text.lastIndexOf('/', cursorPos);
			if (lastSlashPos !== -1) {
				const newText = text.substring(0, lastSlashPos) + text.substring(cursorPos);
				textNode.textContent = newText;
				range.setStart(textNode, lastSlashPos);
				range.collapse(true);
			}
		}

		// Create badge with type class
		const badge = document.createElement('span');
		badge.className = `connection-badge connection-badge--${badgeType}`;
		badge.dataset.badgeType = badgeType;
		badge.textContent = text;
		badge.contentEditable = 'false';

		range.insertNode(badge);

		// Add space after badge
		const space = document.createTextNode('\u00A0');
		range.setStartAfter(badge);
		range.insertNode(space);

		range.setStartAfter(space);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	editorEl.focus();
};

// ─── Mode / lifecycle handlers ────────────────────────────────────────────────
const handleToggleMode = () => {
	isAdvancedMode.value = !isAdvancedMode.value;
	emit("toggle-mode", isAdvancedMode.value);
};

// ─── Anthropic client ────────────────────────────────────────────────────────
const _apiKey = null /* mock-only */
const _claude = _apiKey && _apiKey !== 'your_api_key_here'
	? null
	: null;

async function generateCompassIssues(name, instructions) {
	return _generateCompassIssues(_claude, name, instructions, getMockCompassIssues);
}

// ─── Actions/Compass popover state ───────────────────────────────────────────
const showActionsPopover = ref(false);
const showValidationPopover = ref(false);
const isCompassScanning = ref(false);
const isCompassShimmering = ref(false);
const hasCompassScanned = ref(false);
const isManuallyEdited = ref(false);
const compassIssues = ref([]);
const compassIssueCount = computed(() => compassIssues.value.length);
const skillPopoversWrapperStyle = ref({});
const skillPanelContainerRef = ref(null);

const POPOVER_GROUP_MIN = 240;
const POPOVER_GROUP_MAX = 480;
const popoverGroupWidth = ref(320);
const isResizingPopovers = ref(false);
const popoverResizeStartX = ref(0);
const popoverResizeStartWidth = ref(0);

const selectedConnections = ref({
	'google-calendar': '',
	'o365-calendar': '',
	dialpad: 'aerolabs',
});

// ─── Badge / action computeds ─────────────────────────────────────────────────
const parsedBadgeCounts = computed(() => {
	const html = instructionsContent.value || props.skillData?.instructions || '';
	const doc = new DOMParser().parseFromString(html, 'text/html');
	const badges = doc.querySelectorAll('.connection-badge:not(.connection-badge--workflow):not(.connection-badge--transfer)');
	const counts = {};
	badges.forEach((b) => {
		const text = b.textContent.trim();
		const key = text.toLowerCase();
		if (!counts[key]) counts[key] = { count: 0, displayText: text };
		counts[key].count++;
	});
	return counts;
});

const computedActionCount = computed(() => Object.keys(parsedBadgeCounts.value).length);

function normLabel(s) {
	const lower = s.toLowerCase().trim();
	return lower.length > 4 && lower.endsWith('s') ? lower.slice(0, -1) : lower;
}

const skillConnectorGroups = computed(() => {
	const badgeCounts = parsedBadgeCounts.value;
	const groups = {};
	Object.entries(badgeCounts).forEach(([key, { count, displayText }]) => {
		const match = actionItems.find((a) => {
			const aKey = a.label.toLowerCase();
			return aKey === key || normLabel(aKey) === normLabel(key);
		});
		const source = match ? match.source : 'dialpad';
		const id = match ? match.id : `badge-${key.replace(/\s+/g, '-')}`;
		if (!groups[source]) groups[source] = { source, actions: [] };
		groups[source].actions.push({ id, label: displayText, source, instances: count });
	});
	return Object.values(groups);
});

// ─── Popover positioning ──────────────────────────────────────────────────────
function updatePopoversPosition() {
	const container = skillPanelContainerRef.value;
	if (!container) return;
	const rect = container.getBoundingClientRect();
	const bothOpen = showValidationPopover.value && showActionsPopover.value;
	skillPopoversWrapperStyle.value = {
		position: 'fixed',
		right: `${window.innerWidth - rect.left + 4}px`,
		top: `${rect.top}px`,
		height: `${rect.height}px`,
		width: `${popoverGroupWidth.value}px`,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: bothOpen ? 'flex-start' : 'center',
		pointerEvents: 'none',
		zIndex: 2000,
	};
}

function toggleActionsPopover() {
	if (showActionsPopover.value) { showActionsPopover.value = false; return; }
	showActionsPopover.value = true;
	updatePopoversPosition();
}

function toggleValidationPopover() {
	if (showValidationPopover.value) { showValidationPopover.value = false; return; }
	showValidationPopover.value = true;
	updatePopoversPosition();
}

function switchToAdvancedAndOpenCompass() {
	isAdvancedMode.value = true;
	nextTick(() => {
		showValidationPopover.value = true;
		updatePopoversPosition();
	});
}

// ─── Popover group resize ─────────────────────────────────────────────────────
function startPopoverResize(e) {
	e.preventDefault();
	isResizingPopovers.value = true;
	popoverResizeStartX.value = e.clientX;
	popoverResizeStartWidth.value = popoverGroupWidth.value;
	document.body.style.cursor = 'col-resize';
	document.body.style.userSelect = 'none';
	window.addEventListener('mousemove', doPopoverResize);
	window.addEventListener('mouseup', stopPopoverResize);
}
function doPopoverResize(e) {
	if (!isResizingPopovers.value) return;
	const delta = popoverResizeStartX.value - e.clientX;
	popoverGroupWidth.value = Math.max(POPOVER_GROUP_MIN, Math.min(POPOVER_GROUP_MAX, popoverResizeStartWidth.value + delta));
}
function stopPopoverResize() {
	isResizingPopovers.value = false;
	document.body.style.cursor = '';
	document.body.style.userSelect = '';
	window.removeEventListener('mousemove', doPopoverResize);
	window.removeEventListener('mouseup', stopPopoverResize);
}
watch(popoverGroupWidth, updatePopoversPosition);

// ─── Compass scan ─────────────────────────────────────────────────────────────
async function startCompassScan() {
	isAdvancedMode.value = true;
	showValidationPopover.value = false;
	isCompassScanning.value = true;
	isCompassShimmering.value = true;
	setTimeout(() => { isCompassShimmering.value = false; }, 1500);

	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const name = skillName.value || props.skillData?.name || 'Untitled';
	const instructions = instructionsEditor.value?.innerHTML || instructionsContent.value || '';
	const [errors] = await Promise.all([generateCompassIssues(name, instructions), sleep(2000)]);

	isCompassShimmering.value = true;
	await sleep(600);
	isCompassShimmering.value = false;

	isCompassScanning.value = false;
	hasCompassScanned.value = true;
	compassIssues.value = errors.map((e) => ({ ...e, checked: true }));
	if (props.skillData?.id) {
		state.skillCompassData[props.skillData.id] = {
			errors: errors.map(({ id, label, details }) => ({ id, label, details })),
		};
	}
	showValidationPopover.value = true;
	updatePopoversPosition();
}

function dismissCompassIssue(id) {
	compassIssues.value = compassIssues.value.filter((e) => e.id !== id);
	if (props.skillData?.id && state.skillCompassData[props.skillData.id]) {
		state.skillCompassData[props.skillData.id].errors = compassIssues.value.map(
			({ id: eid, label, details }) => ({ id: eid, label, details }),
		);
	}
	if (compassIssues.value.length === 0) {
		hasCompassScanned.value = false;
		if (props.skillData?.id) delete state.skillCompassData[props.skillData.id];
		showValidationPopover.value = false;
	}
}

function handleExplainCompass() {
	const name = skillName.value || props.skillData?.name || 'this skill';
	const itemList = compassIssues.value
		.map((e, i) => {
			let entry = `${i + 1}. ${e.label}`;
			if (e.details?.reasoning) entry += `\n   ${e.details.reasoning}`;
			if (e.details?.suggestions?.length) entry += `\n   How to fix: ${e.details.suggestions.join(' ')}`;
			return entry;
		})
		.join('\n\n');
	state.explainSkillId = props.skillData?.id;
	state.pendingChatMessage = `Can you explain these issues found in the "${name}" skill and suggest how to fix them?\n\n${itemList}`;
	state.showAssistantChat = true;
}

function skillStepsToHtml(steps) {
	return steps.map((step) => {
		const actions = (step.actions || []).map((a) => {
			const cls = a.type === 'workflow' ? 'connection-badge connection-badge--workflow'
				: a.type === 'transfer' ? 'connection-badge connection-badge--transfer'
				: 'connection-badge';
			return `<span class="${cls}" contenteditable="false">${a.name}</span>`;
		});
		const detail = step.detail || '';
		const withBadges = actions.reduce((text, badge, i) => {
			const name = (step.actions[i] || {}).name || '';
			return text.replace(name, badge);
		}, detail);
		return `<p><strong>${step.title}</strong> — ${withBadges}</p>`;
	}).join('\n');
}

async function handleFixAll() {
	if (!compassIssues.value.length) return;
	isAdvancedMode.value = true;
	isCompassScanning.value = true;
	isCompassShimmering.value = true;

	const name = skillName.value || props.skillData?.name || 'Untitled';
	const currentInstructions = instructionsEditor.value?.innerHTML || instructionsContent.value || '';
	const issueList = compassIssues.value.map((e, i) => `${i + 1}. ${e.label}`).join('\n');
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

	let newHtml = '';
	if (_claude) {
		try {
			const response = await _claude.messages.create({
				model: 'claude-haiku-4-5-20251001',
				max_tokens: 1024,
				system: 'You are rewriting AI agent skill instructions to resolve specific issues. Return a JSON object with a "steps" array only — no markdown, no explanation. Each step: { "title": string (2–4 words, title case), "detail": string (one sentence including any action/API names), "actions": [{ "name": string, "type": "api" | "workflow" | "transfer" }] }.',
				messages: [{ role: 'user', content: `Skill: ${name}\n\nCurrent instructions:\n${currentInstructions}\n\nIssues to fix:\n${issueList}` }],
			});
			const raw = response.content.find((b) => b.type === 'text')?.text || '';
			const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
			const parsed = JSON.parse(cleaned);
			newHtml = skillStepsToHtml(parsed.steps);
		} catch (err) {
			debugLogger.error('[SkillPanel] handleFixAll failed:', err);
			newHtml = skillStepsToHtml(getMockFixedSteps());
		}
	} else {
		await sleep(1400);
		newHtml = skillStepsToHtml(getMockFixedSteps());
	}

	isCompassShimmering.value = false;
	isCompassScanning.value = false;

	if (newHtml) {
		instructionsContent.value = newHtml;
		if (instructionsEditor.value) instructionsEditor.value.innerHTML = newHtml;
	}

	compassIssues.value = [];
	if (props.skillData?.id) delete state.skillCompassData[props.skillData.id];
	showValidationPopover.value = false;
	hasCompassScanned.value = true;
	isManuallyEdited.value = false;
}

const handleAccept = () => {
	isSkillAccepted.value = true;
	emit("accept");
};

const handleDecline = () => {
	emit("decline");
};

const handleUpdate = async () => {
	if (!isAdvancedMode.value) {
		isUpdatingFromSimple.value = true;
		simpleIsDirty.value = false;
		await generateAdvancedFromSimple();
		isUpdatingFromSimple.value = false;
		emit("update", { instructions: instructionsContent.value });
		return;
	}
	const data = {
		instructions: instructionsEditor.value?.innerHTML || instructionsContent.value,
		skillName: skillName.value,
		description: descriptionEditor.value?.innerHTML || descriptionContent.value,
		guardrails: guardrailsEditor.value?.innerHTML || guardrailsContent.value,
		labels: labels.value,
	};
	emit("update", data);
};
</script>

<style scoped>
/* ─── Simple mode ────────────────────────────────────────────────────────────── */
.editor-container-simple {
	height: auto;
	overflow: visible;
}

.editor-content--simple {
	outline: none;
	padding: 12px 14px;
}

.editor-content--simple :deep(ol) {
	list-style-type: none;
	padding-left: 0;
	margin: 0;
}

.editor-content--simple :deep(li) {
	padding: 5px 0;
	line-height: 1.6;
}

.simple-info-banner-enter-active,
.simple-info-banner-leave-active {
	transition: opacity 0.2s ease;
}
.simple-info-banner-enter-from,
.simple-info-banner-leave-to {
	opacity: 0;
}

/* ─── Footer layout with toggle ──────────────────────────────────────────────── */
.footer-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	pointer-events: auto;
}

.footer-actions-right {
	display: flex;
	align-items: center;
	gap: 8px;
}

/* Building indicator */
.skill-building-indicator {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	color: var(--dt-color-foreground-secondary);
	margin-bottom: 8px;
	padding: 6px 10px;
	background: var(--dt-color-surface-secondary);
	border-radius: 6px;
	border: 1px solid var(--dt-color-border-subtle);
}

.skill-building-spinner {
	animation: spin 1s linear infinite;
	flex-shrink: 0;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

/* Panel Container */
.skill-panel {
	position: fixed;
	top: calc(50vh - 310px);
	right: -492px;
	width: 460px;
	transition: all 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
	z-index: 1000;
}

.skill-panel.is-open {
	right: 16px;
}

.skill-panel.is-advanced {
	width: 468px;
	right: -500px;
	top: 16px;
}

.skill-panel.is-advanced.is-open {
	right: 16px;
}

.skill-panel-container {
	width: 100%;
	height: 620px;
	position: relative;
	background: white;
	box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04),
		0px 1px 2px rgba(0, 0, 0, 0.03);
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	transition: height 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.skill-panel.is-advanced .skill-panel-container {
	height: calc(100vh - 32px);
}

/* Header */
.skill-panel-header {
	padding: 16px;
	flex-shrink: 0;
}

.header-breadcrumb {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 40px;
	padding: 0 15px 0 15px;
	background: var(--dt-color-surface-secondary);
	border-radius: 12px;
}

.breadcrumb-content {
	display: flex;
	align-items: center;
	gap: 8px;
}

.breadcrumb-label {
	color: var(--dt-color-foreground-primary);
	font-size: 15px;
	font-weight: var(--dt-typography-label-md-font-weight);
	line-height: 24px;
}

.breadcrumb-actions {
	display: flex;
	align-items: center;
	gap: 2px;
}

.breadcrumb-divider {
	width: 1px;
	height: 16px;
	background: var(--dt-color-border-subtle);
}

/* Content Area */
.skill-panel-content {
	flex: 1;
	padding: 0 16px;
	overflow-y: auto;
	overflow-x: hidden;
}

.content-inner {
	padding-bottom: 72px;
}

/* Form Section */
.form-section {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 16px;
}

.form-section:last-child {
	margin-bottom: 0;
}

.form-label {
	display: flex;
	flex-direction: column;
	padding-bottom: 8px;
}

.label-text {
	color: var(--dt-color-foreground-primary);
	font-size: 15px;
	font-weight: var(--dt-typography-label-md-font-weight);
	line-height: 21px;
}

.label-optional {
	color: #999;
	font-weight: 400;
}

.label-description {
	color: var(--dt-color-foreground-tertiary);
	font-size: 12px;
	font-weight: 400;
	line-height: 16.8px;
}

/* Editor Container */
.editor-container {
	display: flex;
	flex-direction: column;
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: 12px;
	overflow: hidden;
	height: 400px;
}

.editor-container-advanced {
	height: 365px;
}

.editor-container-description {
	height: 120px;
}

.editor-container-guardrails {
	height: 140px;
}

/* Toolbar */
.editor-toolbar {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 7px;
	background: #f9f9f9;
	border-bottom: 1px solid rgba(28, 28, 28, 0.1);
}

.toolbar-group {
	display: flex;
	align-items: center;
	gap: 4px;
}

.toolbar-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 26px;
	height: 26px;
	padding: 4px;
	background: transparent;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	color: #555555;
	opacity: 0.5;
	transition: all 0.15s ease;
}

.toolbar-button:hover {
	opacity: 1;
	background: rgba(0, 0, 0, 0.05);
}

.toolbar-button:active {
	opacity: 1;
	background: rgba(0, 0, 0, 0.1);
}

.toolbar-divider {
	width: 1px;
	height: 20px;
	background: rgba(0, 0, 0, 0.25);
}

/* Editor Content */
.editor-content {
	padding: 8px 16px 12px 16px;
	flex: 1;
	overflow-y: auto;
	color: #3a3a3a;
	font-size: 15px;
	font-weight: 400;
	line-height: 24px;
	outline: none;
	cursor: text;
}

.editor-content:empty:before {
	content: "Type instructions here...";
	color: #999;
	font-style: italic;
}

/* Content formatting */
.editor-content :deep(p) {
	margin: 0 0 8px 0;
}

.editor-content :deep(p:last-child) {
	margin-bottom: 0;
}

.editor-content :deep(strong) {
	font-weight: 700;
	color: #3a3a3a;
}

/* Connection badges in content — base style */
.editor-content :deep(.connection-badge) {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: rgba(28, 28, 28, 0.1);
	border-radius: 4px;
	color: #1c1c1c;
	font-size: 12px;
	font-family: "SF Mono", "Courier New", monospace;
	font-weight: 400;
	line-height: 14.4px;
	cursor: pointer;
	vertical-align: middle;
}

/* Action badge — neutral gray (default) */
.editor-content :deep(.connection-badge--action) {
	background: rgba(28, 28, 28, 0.1);
	color: #1c1c1c;
}

/* Workflow badge — purple tint */
.editor-content :deep(.connection-badge--workflow) {
	background: rgba(124, 82, 255, 0.1);
	color: #7c52ff;
}

/* Transfer badge — blue tint */
.editor-content :deep(.connection-badge--transfer) {
	background: rgba(0, 109, 210, 0.1);
	color: #006dd2;
}

/* Footer */
.skill-panel-footer {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 16px;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 50%, white 100%);
	pointer-events: none;
	min-height: 72px;
	border-radius: 0 0 24px 24px;
}

/* ─── Slash Command System ──────────────────────────────────────────────────── */

.slash-menu-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	background: transparent;
}

/* Main popover */
.slash-command-menu {
	position: fixed;
	z-index: 1000;
	width: 240px;
	background: #f9f9f9;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 12px;
	padding: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.slash-section-label {
	padding: 2px 8px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: #808080;
	line-height: 1.4;
}

.slash-section-label--spaced {
	padding-top: 4px;
}

.slash-actions-scroll {
	max-height: 190px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.slash-action-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 8px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #1c1c1c;
	line-height: 22px;
	transition: background 0.1s ease;
}

.slash-action-item:hover,
.slash-action-item.selected {
	background: rgba(28, 28, 28, 0.08);
}

.slash-source-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}

.slash-divider {
	height: 1px;
	background: rgba(28, 28, 28, 0.1);
	margin: 3px 0;
}

.slash-menu-row {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 5px 8px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #1c1c1c;
	line-height: 22px;
	transition: background 0.1s ease;
}

.slash-menu-row:hover,
.slash-menu-row.selected {
	background: rgba(28, 28, 28, 0.08);
}

.slash-row-icon {
	flex-shrink: 0;
	color: #555;
}

.slash-row-label {
	flex: 1;
}

.slash-chevron {
	flex-shrink: 0;
	color: #999;
}

.slash-no-results {
	padding: 8px;
	font-size: 13px;
	color: #999;
	text-align: center;
}

/* Submenus — shared base */
.slash-submenu {
	position: fixed;
	z-index: 1001;
	background: #f9f9f9;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 8px;
	padding: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	gap: 1px;
	min-width: 180px;
	max-height: calc(100vh - 32px);
	overflow-y: auto;
}

.slash-submenu-item {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 5px 8px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #1c1c1c;
	line-height: 22px;
	transition: background 0.1s ease;
}

.slash-submenu-item:hover,
.slash-submenu-item.selected {
	background: rgba(28, 28, 28, 0.08);
}

.slash-submenu-label {
	flex: 1;
}

.slash-target-count {
	font-size: 13px;
	color: #999;
	padding: 0 2px;
}

/* Workflow submenu — panel style, 16px radius, card shadow */
.slash-workflow-submenu {
	border-radius: 16px;
	min-width: 240px;
	padding: 8px;
	box-shadow:
		0 1px 2px rgba(0, 0, 0, 0.03),
		0 2px 4px rgba(0, 0, 0, 0.04),
		0 2px 16px rgba(0, 0, 0, 0.08);
}

.slash-workflow-search {
	padding: 4px 4px 8px;
}

/* Targets submenu — same as transfer, z-index one level up */
.slash-targets-submenu {
	min-width: 160px;
	z-index: 1002;
}

/* Transfer Action Panel */
.transfer-panel-scrim {
	position: fixed;
	inset: 0;
	z-index: 1100;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
}

.transfer-panel {
	background: #ffffff;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 16px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 320px;
	overflow: visible;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03),
	            0 2px 4px rgba(0, 0, 0, 0.04),
	            0 2px 16px rgba(0, 0, 0, 0.08);
}

.transfer-panel-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 8px;
}

.transfer-panel-meta {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.transfer-panel-eyebrow {
	font-size: 12px;
	text-transform: uppercase;
	color: #535353;
	line-height: 1.4;
}

.transfer-panel-title {
	font-size: 15px;
	font-weight: 590;
	color: #3a3a3a;
	line-height: 1.4;
}

.transfer-combobox {
	position: relative;
}

.transfer-combobox-field {
	position: relative;
}

.transfer-combobox-chevron {
	position: absolute;
	right: 8px;
	top: 50%;
	transform: translateY(-50%);
	color: #808080;
	pointer-events: none;
}

.transfer-dropdown {
	position: absolute;
	top: calc(100% + 4px);
	left: 0;
	right: 0;
	z-index: 10;
	background: #f9f9f9;
	border: 1px solid rgba(28, 28, 28, 0.11);
	border-radius: 8px;
	padding: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	gap: 2px;
	max-height: 220px;
	overflow-y: auto;
}

.transfer-dropdown-row {
	display: flex;
	align-items: center;
	padding: 4px 8px;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.1s ease;
}

.transfer-dropdown-row:hover,
.transfer-dropdown-row--selected {
	background: rgba(28, 28, 28, 0.1);
}

.transfer-dropdown-label {
	flex: 1;
	font-size: 15px;
	color: #1c1c1c;
	line-height: 1.6;
}

.transfer-dropdown-role {
	font-size: 12px;
	color: #808080;
	line-height: 1.4;
}

.transfer-dropdown-empty {
	font-size: 14px;
	color: #808080;
	padding: 8px;
	text-align: center;
}

/* Typewriter cursor effect */
.typing-cursor::after {
	content: '|';
	animation: blink 1s step-end infinite;
	margin-left: 2px;
}

@keyframes blink {
	0%, 50% { opacity: 1; }
	51%, 100% { opacity: 0; }
}

/* ─── Popover wrapper (teleported to body) ───────────────────────────────────── */
.popovers-group {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: var(--dt-space-450);
	width: 100%;
}

.popovers-resize-handle {
	position: absolute;
	top: 0;
	left: -4px;
	width: 8px;
	height: 100%;
	cursor: col-resize;
	z-index: 10;
	pointer-events: auto;
}

.popovers-resize-handle::after {
	content: '';
	position: absolute;
	top: 0;
	right: 3px;
	width: 2px;
	height: 100%;
	background: transparent;
	transition: background 0.15s;
}

.popovers-resize-handle:hover::after {
	background: rgba(147, 88, 255, 0.35);
}

@keyframes compass-spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.compass-spin {
	animation: compass-spin 1s linear infinite;
}
</style>
