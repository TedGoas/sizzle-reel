<template>
	<div class="agent-editor-tab">
		<!-- Header (hidden in fullscreen) -->
		<div v-show="!isFullScreenEditor" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
			<div>
				<h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">Agent Editor</h2>
				<p style="font-size: 14px; color: #666; margin: 0;">A preview of your agent's skill canvas. Expand to full screen to add, edit, and connect skills.</p>
			</div>
		</div>

		<div
			ref="canvasPreviewContainer"
			class="canvas-preview-container"
			:class="{
				'is-fullscreen': isFullScreenEditor && !isTransitioning,
				'transitioning-to-fullscreen': isTransitioning && isFullScreenEditor,
				'transitioning-to-preview': isTransitioning && !isFullScreenEditor,
			}"
			:style="canvasTransitionStyles"
		>
			<!-- Maximize/Minimize Button -->
			<button
				v-show="!isFullScreenEditor"
				@click="enterFullScreenEditor"
				class="maximize-button transition-button"
				:class="{
					transitioning: isTransitioning,
					'fade-out': isTransitioning && isFullScreenEditor,
				}"
				title="Maximize canvas"
			>
				<dt-icon name="maximize" size="300" />
			</button>

			<!-- Canvas with Grid Background -->
			<div
				ref="canvasContainer"
				class="canvas-area"
				@mousedown="startPan"
				@mousemove="handlePan"
				@mouseup="endPan"
				@mouseleave="endPan"
				@wheel="handleWheel"
				:style="{ cursor: isPanning ? 'grabbing' : 'grab' }"
			>
				<div
					class="canvas-content"
					:style="{
						transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
						transformOrigin: 'center center',
					}"
				>
					<!-- Connection Lines -->
					<svg class="connection-lines" width="2000" height="800">
						<!-- AI Agent to Skills -->
						<path
							v-for="skill in skillNodes"
							:key="`line-${skill.id}`"
							:class="{
								'connection-line-new': skill.isNew,
								'connection-line-smooth': !isDragging || draggedNodeId !== skill.id,
								'connection-line-deleting': deletingNodeId === skill.id
							}"
							:d="getConnectionPath(skill)"
							stroke="#D0D0D0"
							stroke-width="2"
							fill="none"
						/>
					</svg>

					<!-- AI Agent Node -->
					<div
						class="canvas-node canvas-node-agent"
						style="left: 80px; top: 50px"
						@click.stop="handleAgentNodeClick"
					>
						<div class="node-header">
							<div>
								<dt-icon name="default-ai-agent-fab" size="300" />
								<span class="node-type">AI Agent</span>
							</div>
							<button class="node-menu-button">
								<dt-icon name="more-vertical" size="200" />
							</button>
						</div>
						<div class="node-content">
							<div class="node-title">{{ state.selectedAgent?.name }}</div>
							<div class="node-description">
								{{ state.selectedAgent?.description }}
							</div>
						</div>
					</div>

					<!-- Skill Nodes -->
					<div
						v-for="skill in skillNodes"
						:key="skill.id"
						class="canvas-node canvas-node-skill editable-node"
						:class="{
							'node-shimmer': state.isCreatingSkill && skill.id === newSkillId,
							'node-fade-in': skill.isNew,
							'is-dragging': draggedNodeId === skill.id,
						}"
						:style="`left: ${skill.position.left}px; top: ${skill.position.top}px;`"
						@mousedown="startDrag($event, skill)"
						@click.stop="handleNodeClick(skill)"
					>
						<div class="node-header">
							<div>
								<dt-icon name="dialpad-star-mark" size="300" />
								<span class="node-type">Skill</span>
							</div>
							<div style="position: relative">
								<button
									class="node-menu-button"
									@click.stop="toggleNodeMenu($event, skill.id)"
								>
									<dt-icon name="more-vertical" size="200" />
								</button>
								<!-- Node Menu Dropdown -->
								<div
									v-if="openMenuNodeId === skill.id"
									class="node-menu-dropdown"
								>
									<button
										class="node-menu-item"
										@click.stop="setAsGreeting(skill)"
									>
										<span>Set as greeting</span>
									</button>
									<button
										class="node-menu-item"
										@click.stop="editNode(skill)"
									>
										<span>Edit</span>
									</button>
									<button
										class="node-menu-item"
										@click.stop="duplicateNode(skill)"
									>
										<span>Duplicate</span>
									</button>
									<button
										class="node-menu-item node-menu-item-delete"
										@click.stop="confirmDeleteNode(skill)"
									>
										<span>Delete</span>
									</button>
								</div>
							</div>
						</div>
						<div class="node-content">
							<div class="node-title">
								{{ skill.name }}
								<span v-if="skill.isGreeting" class="node-greeting-label">(Greeting)</span>
							</div>
							<div class="node-description">
								{{ skill.description }}
							</div>
							<div>
								<dt-icon name="workflow" size="100" />
								<dt-stack direction="row" gap="300">
									<dt-badge
										v-if="skill.fromMining"
										type="ai"
										text="Mined"
										size="sm"
									/>
									<dt-badge
										type="default"
										:text="`${skill.actionCount || countActionsFromInstructions(skill.instructions)} ${skill.actionCount === 1 ? 'Action' : 'Actions'}`"
										size="sm"
									/>
								</dt-stack>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Zoom Controls (Preview Mode Only) -->
			<div
				v-show="!isFullScreenEditor"
				class="zoom-controls"
				:class="{ 'fade-out': isTransitioning && isFullScreenEditor }"
			>
				<button @click="zoomOut" title="Zoom out" :disabled="zoomLevel <= 0.5">
					<dt-icon name="zoom-out" size="200" />
				</button>
				<button @click="zoomIn" title="Zoom in" :disabled="zoomLevel >= 2">
					<dt-icon name="zoom-in" size="200" />
				</button>
				<button @click="resetZoom" title="Help">
					<dt-icon name="help-circle" size="200" />
				</button>
			</div>

			<!-- Full Screen Floating Controls -->
			<template v-if="isFullScreenEditor">
				<!-- Top Left: Minimize & Agent Info -->
				<div
					class="floating-control top-left"
					:class="{ 'control-visible': !isTransitioning }"
				>
					<button
						@click="exitFullScreenEditor"
						class="floating-icon-button"
						title="Exit full screen"
					>
						<dt-icon name="minimize" size="300" />
					</button>
					<div class="floating-agent-info">
						<span class="floating-agent-name">{{
							state.selectedAgent?.name
						}}</span>
						<dt-badge type="default" text="Draft" size="sm" />
					</div>
				</div>

				<!-- Top Right: Action Buttons -->
				<div
					class="floating-control top-right"
					:class="{
						'control-visible': !isTransitioning,
						'panel-shifted': isSkillPanelAdvanced || state.showMiningDrawer || isAgentPanelOpen,
					}"
				>
					<button class="floating-icon-button" title="More options">
						<dt-icon name="more-vertical" size="300" />
					</button>
					<button class="floating-icon-button" title="Settings">
						<dt-icon name="settings" size="300" />
					</button>
					<div class="control-divider"></div>
					<dt-button importance="clear" size="sm" @click="navigateToTesting">
						<dt-icon name="play" size="200" style="margin-right: 4px" />
						Test
					</dt-button>
					<dt-button importance="clear" size="sm">Save</dt-button>
					<dt-button
						ref="publishButtonRef"
						importance="outlined"
						kind="muted"
						size="sm"
						:disabled="!state.hasUnsavedChanges"
						@click="handlePublishClick"
					>
						Publish
					</dt-button>
				</div>

				<!-- Bottom Left: Agent Assist Button -->
				<div
					class="floating-control bottom-left-assist"
					:class="{ 'control-visible': !isTransitioning }"
				>
					<button class="agent-assist-button" title="Agent assist" @click="state.showAssistantChat = !state.showAssistantChat">
						<dt-icon name="agent-assist" size="400" />
					</button>
				</div>

				<!-- Bottom Left: Zoom Controls -->
				<div
					class="floating-control bottom-left-zoom"
					:class="{ 'control-visible': !isTransitioning }"
				>
					<button
						@click="zoomOut"
						title="Zoom out"
						:disabled="zoomLevel <= 0.5"
					>
						<dt-icon name="zoom-out" size="300" />
					</button>
					<button @click="zoomIn" title="Zoom in" :disabled="zoomLevel >= 2">
						<dt-icon name="zoom-in" size="300" />
					</button>
					<button @click="resetZoom" title="Fit to view">
						<dt-icon name="scan" size="300" />
					</button>
					<button title="Fullscreen">
						<dt-icon name="maximize" size="300" />
					</button>
					<button title="Help">
						<dt-icon name="help-circle" size="300" />
					</button>
				</div>

				<!-- Bottom Right: Add Button -->
				<div
					class="floating-control bottom-right"
					:class="{
						'control-visible': !isTransitioning,
						'panel-shifted': isSkillPanelAdvanced || state.showMiningDrawer || isAgentPanelOpen,
					}"
				>
					<button
						ref="addButtonRef"
						class="floating-add-button"
						:class="{ 'mining-active': state.miningStatus === 'in-progress' }"
						title="Add skill"
						@click="handleAddButtonClick"
					>
						<dt-icon name="plus" size="300" />
					</button>
				</div>
			</template>
		</div>

		<!-- Skill Panel -->
		<skill-panel
			:is-open="isSkillPanelOpen"
			:skill-data="selectedSkill || {}"
			@close="closeSkillPanel"
			@cancel="closeSkillPanel"
			@update="handleSkillUpdate"
			@accept="handleSkillAccept"
			@decline="handleSkillDecline"
			@toggle-mode="handleToggleMode"
		/>

		<!-- Agent Panel -->
		<agent-panel
			:is-open="isAgentPanelOpen && isFullScreenEditor"
			:agent-data="agentData"
			:width="agentPanelWidth"
			@close="isAgentPanelOpen = false"
			@cancel="isAgentPanelOpen = false"
			@save="handleAgentSave"
			@resize-start="startAgentPanelResize"
		/>

		<!-- Close node menu overlay -->
		<div
			v-if="openMenuNodeId"
			class="node-menu-overlay"
			@click="closeNodeMenu"
		></div>

		<!-- Delete Confirmation Modal -->
		<div
			v-if="showDeleteConfirm"
			class="delete-modal-overlay"
			@click="cancelDelete"
		>
			<div class="delete-modal" @click.stop>
				<div class="delete-modal-header">
					<h3>Delete Skill?</h3>
				</div>
				<div class="delete-modal-body">
					<p>
						Are you sure you want to delete "{{ nodeToDelete?.name }}"? This
						action cannot be undone.
					</p>
				</div>
				<div class="delete-modal-footer">
					<dt-button
						importance="clear"
						kind="muted"
						size="md"
						@click="cancelDelete"
					>
						Cancel
					</dt-button>
					<dt-button
						importance="primary"
						kind="danger"
						size="md"
						@click="deleteNode"
					>
						Delete
					</dt-button>
				</div>
			</div>
		</div>

		<!-- Publish Popover -->
		<teleport to="body">
			<publish-popover
				:is-open="showPublishPopover"
				:agent-name="state.selectedAgent?.name"
				:trigger-element="publishButtonElement"
				@close="showPublishPopover = false"
				@publish="handlePublishFromPopover"
			/>
		</teleport>

		<!-- Deployment Modal -->
		<teleport to="body">
			<deployment-modal
				:is-open="showDeploymentModal"
				:agent-name="state.selectedAgent?.name"
				@close="showDeploymentModal = false"
				@published="handlePublished"
			/>
		</teleport>

		<!-- Add Skill Popover -->
		<add-skill-popover
			:is-open="showAddSkillPopover"
			:trigger-element="addButtonElement"
			@close="showAddSkillPopover = false"
			@select-mined-skill="handleSelectMinedSkill"
			@select-create-from-scratch="handleSelectCreateFromScratch"
		/>

		<!-- Agent Assistant Chat -->
		<agent-assistant-chat
			v-show="state.showAssistantChat && isFullScreenEditor"
			ref="assistantChatRef"
			:width="chatWidth"
			@close="state.showAssistantChat = false"
			@resize-start="startChatResize"
		/>
	</div>
</template>

<script setup>
import { debugLogger } from '../../lib/debugLogger.js';
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { DtIcon, DtButton, DtBadge, DtStack } from '../../components/ui';
import { state } from "../../state.js";
import { useTypewriter } from "../../composables/useTypewriter.js";
import SkillPanel from "../../components/panels/SkillPanel.vue";
import AgentPanel from "../../components/panels/AgentPanel.vue";
import PublishPopover from "../../components/popovers/PublishPopover.vue";
import DeploymentModal from "../../components/modals/DeploymentModal.vue";
import AddSkillPopover from "../../components/popovers/AddSkillPopover.vue";
import AgentAssistantChat from "../../components/chat/AgentAssistantChat.vue";

// ─── Claude client (skill instructions generation) ───────────────────────────
const _apiKey = null /* mock-only */
const _claude = _apiKey && _apiKey !== 'your_api_key_here'
	? null
	: null

async function generateInstructionsFromDescribeText(skillName, describeText) {
	if (_claude) {
		try {
			const res = await _claude.messages.create({
				model: 'claude-haiku-4-5-20251001',
				max_tokens: 600,
				system: `Generate step-by-step instructions for a customer service AI skill. Return ONLY HTML paragraphs — no markdown, no preamble:
<p><strong>Step Title</strong> — One sentence detail mentioning any <span class="connection-badge">ToolName</span> integrations used.</p>
Rules: 4–6 steps. Include 1–2 connection-badge references per relevant step. Return ONLY the HTML.`,
				messages: [{ role: 'user', content: `Skill: "${skillName}"\n${describeText}` }],
			})
			return res.content[0]?.text?.trim() || ''
		} catch (err) {
			console.error('[AgentEditorTab] Skill instruction generation failed:', err)
		}
	}
	return [
		`<p><strong>Understand the request</strong> — Identify the customer's intent from their message about ${describeText.toLowerCase()}.</p>`,
		`<p><strong>Gather required information</strong> — Collect any missing details using <span class="connection-badge">Collect Information</span>.</p>`,
		`<p><strong>Process the request</strong> — Execute the required action via <span class="connection-badge">Process Request</span> based on collected data.</p>`,
		`<p><strong>Confirm and close</strong> — Summarize the outcome for the customer and confirm the action was completed successfully.</p>`,
	].join('\n')
}

// Canvas state - using local refs for most, but isFullScreenEditor syncs with global state
const isFullScreenEditor = computed({
	get: () => state.isFullScreenEditor,
	set: (val) => {
		state.isFullScreenEditor = val;
	},
});
const isTransitioning = ref(false);
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const panStartX = ref(0);
const panStartY = ref(0);
const canvasContainer = ref(null);
const canvasPreviewContainer = ref(null);
const transitionStartRect = ref(null);
const transitionEndRect = ref(null);

// Drag state for skill nodes
const isDragging = ref(false);
const draggedNodeId = ref(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragStartNodeX = ref(0);
const dragStartNodeY = ref(0);

// Node menu state
const openMenuNodeId = ref(null);
const showDeleteConfirm = ref(false);
const nodeToDelete = ref(null);
const deletingNodeId = ref(null); // Track node being deleted for animation

// Publish state
const showPublishPopover = ref(false);
const showDeploymentModal = ref(false);
const publishButtonRef = ref(null);
const publishButtonElement = ref(null);

// Add Skill Popover state
const showAddSkillPopover = ref(false);
const addButtonRef = ref(null);
const addButtonElement = ref(null);

// Agent panel state
const isAgentPanelOpen = ref(false);
const agentPanelWidth = ref(468);

const agentData = computed(() => state.selectedAgent ? {
	companyName:          state.selectedAgent.companyName          || '',
	companyDesc:          state.selectedAgent.companyDesc          || '',
	agentName:            state.selectedAgent.agentName            || state.selectedAgent.name || '',
	agentTasks:           state.selectedAgent.agentTasks           || '',
	toneVoice:            state.selectedAgent.toneVoice            || 'Professional',
	greetingMessage:      state.selectedAgent.greetingMessage      || '',
	knowledgeBase:        state.selectedAgent.knowledgeBase        || 'english-us',
	transferInstructions: state.selectedAgent.transferInstructions || '',
	transferDigital:      state.selectedAgent.transferDigital      || 'agents',
	transferVoice:        state.selectedAgent.transferVoice        || 'operators',
} : {});

function startAgentPanelResize(e) {
	const startX = e.clientX;
	const startWidth = agentPanelWidth.value;
	function onMove(ev) { agentPanelWidth.value = Math.max(360, Math.min(600, startWidth + (startX - ev.clientX))); }
	function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
	document.addEventListener('mousemove', onMove);
	document.addEventListener('mouseup', onUp);
}

function handleAgentNodeClick() {
	if (!isFullScreenEditor.value) {
		enterFullScreenEditor();
		setTimeout(() => { isAgentPanelOpen.value = true; }, CANVAS_TRANSITION_DURATION + 100);
	} else {
		isAgentPanelOpen.value = true;
	}
}

function handleAgentSave(data) {
	if (state.selectedAgent) {
		Object.assign(state.selectedAgent, {
			companyName:          data.companyName,
			companyDesc:          data.companyDesc,
			agentName:            data.agentName,
			agentTasks:           data.agentTasks,
			toneVoice:            data.toneVoice,
			greetingMessage:      data.greetingMessage,
			knowledgeBase:        data.knowledgeBase,
			transferInstructions: data.transferInstructions,
			transferDigital:      data.transferDigital,
			transferVoice:        data.transferVoice,
		});
		state.hasUnsavedChanges = true;
	}
	isAgentPanelOpen.value = false;
}

// Assistant chat state
const chatWidth = ref(360)
const assistantChatRef = ref(null)

function startChatResize(e) {
	const startX = e.clientX
	const startWidth = chatWidth.value
	function onMove(ev) { chatWidth.value = Math.max(280, Math.min(560, startWidth + (startX - ev.clientX))) }
	function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
	document.addEventListener('mousemove', onMove)
	document.addEventListener('mouseup', onUp)
}

// Skill Panel state
const isSkillPanelOpen = ref(false);
const isSkillPanelAdvanced = ref(false);
const selectedSkill = ref(null);
const SKILL_PANEL_WIDTH = 492; // px (460px panel + 32px margins)
const SKILL_PANEL_WIDTH_ADVANCED = 500; // px (468px panel + 32px margins)

// Access skill nodes directly from global state so they persist across tab navigation
// (Don't use computed since we need to mutate the array)
const skillNodes = state.skillNodes;

const newSkillId = ref(null); // Track which skill is being created

// Canvas constants
const CANVAS_TRANSITION_DURATION = 500; // ms
const SKINNY_NAV_WIDTH = 50; // px

// Helper function to count actions from instruction HTML
// Counts connection-badge elements which represent API calls/integrations
function countActionsFromInstructions(instructionsHtml) {
	if (!instructionsHtml) return 0;
	const matches = instructionsHtml.match(/class="connection-badge"/g);
	return matches ? matches.length : 0;
}

// Calculate center of all nodes dynamically
function getNodesCenter() {
	if (skillNodes.length === 0) {
		return { x: 420, y: 100 };
	}

	// Calculate the center point of all skill nodes
	const avgX =
		skillNodes.reduce((sum, node) => sum + node.position.left, 0) /
		skillNodes.length;
	const avgY =
		skillNodes.reduce((sum, node) => sum + node.position.top, 0) /
		skillNodes.length;

	// Add half node width (140px) to center on the node
	return { x: avgX + 140, y: avgY + 70 };
}

// Center nodes in the canvas
function centerNodes() {
	setTimeout(() => {
		const container = canvasContainer.value;
		if (!container) {
			debugLogger.warn("Canvas container not found for centering");
			return;
		}

		try {
			const canvasWidth = container.offsetWidth;
			const canvasHeight = container.offsetHeight;

			if (canvasWidth === 0 || canvasHeight === 0) {
				debugLogger.warn("Canvas has zero dimensions, cannot center nodes");
				return;
			}

			const center = getNodesCenter();

			// Calculate pan to center the node group
			panX.value = canvasWidth / 2 - center.x;
			panY.value = canvasHeight / 2 - center.y;
		} catch (error) {
			console.error("Error centering nodes:", error);
		}
	}, 50); // Small delay to ensure canvas is rendered
}

// Canvas methods
function addSmoothTransition() {
	const content = document.querySelector(".canvas-content");
	if (content) {
		content.classList.add("smooth-transition");
		setTimeout(() => {
			content.classList.remove("smooth-transition");
		}, 300);
	}
}

function zoomIn() {
	if (zoomLevel.value < 2) {
		addSmoothTransition();
		zoomLevel.value = Math.min(2, zoomLevel.value + 0.1);
	}
}

function zoomOut() {
	if (zoomLevel.value > 0.5) {
		addSmoothTransition();
		zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1);
	}
}

// Mouse wheel zoom
function handleWheel(e) {
	e.preventDefault();

	const container = canvasContainer.value;
	if (!container) return;

	// Get mouse position relative to container
	const rect = container.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;

	// Calculate zoom delta (normalize for different browsers/devices)
	const delta = -e.deltaY / 500;
	const oldZoom = zoomLevel.value;
	const newZoom = Math.max(0.5, Math.min(2, oldZoom + delta));

	if (newZoom === oldZoom) return;

	// Calculate zoom origin to zoom toward mouse position
	const zoomRatio = newZoom / oldZoom - 1;

	// Adjust pan to zoom toward mouse cursor
	panX.value = panX.value - (mouseX - panX.value) * zoomRatio;
	panY.value = panY.value - (mouseY - panY.value) * zoomRatio;

	zoomLevel.value = newZoom;
}

// Fit all nodes to view
function resetZoom() {
	addSmoothTransition();

	const container = canvasContainer.value;
	if (!container) return;

	const canvasWidth = container.offsetWidth;
	const canvasHeight = container.offsetHeight;

	if (skillNodes.length === 0) {
		// No skill nodes, just center on AI agent
		zoomLevel.value = 1;
		panX.value = canvasWidth / 2 - 360; // Center AI agent (at x: 80, width: 280)
		panY.value = canvasHeight / 2 - 120; // Center AI agent (at y: 50, height: ~140)
		return;
	}

	// Calculate bounding box of all nodes (including AI agent)
	let minX = 80; // AI agent position
	let minY = 50;
	let maxX = 80 + 280; // AI agent + width
	let maxY = 50 + 140; // AI agent + approx height

	skillNodes.forEach((node) => {
		minX = Math.min(minX, node.position.left);
		minY = Math.min(minY, node.position.top);
		maxX = Math.max(maxX, node.position.left + 280); // node width
		maxY = Math.max(maxY, node.position.top + 140); // node height
	});

	// Add padding
	const padding = 100;
	const contentWidth = maxX - minX + padding * 2;
	const contentHeight = maxY - minY + padding * 2;

	// Calculate zoom to fit
	const zoomX = canvasWidth / contentWidth;
	const zoomY = canvasHeight / contentHeight;
	const targetZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in beyond 1x

	zoomLevel.value = targetZoom;

	// Center the content
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;

	panX.value = canvasWidth / 2 - centerX * targetZoom;
	panY.value = canvasHeight / 2 - centerY * targetZoom;
}

// Skill Panel functions
function openSkillPanelForSkill(skill) {
	showAddSkillPopover.value = false;
	// Set selected skill with all its data from the node
	selectedSkill.value = {
		id: skill.id,
		name: skill.name,
		description: skill.description,
		instructions: skill.instructions || "",
		fromMining: false, // Not from mining, so no animation
		animateText: false, // Don't animate existing content
	};

	// If not in fullscreen, enter fullscreen first, then open panel
	if (!isFullScreenEditor.value) {
		enterFullScreenEditor();
		// Wait for fullscreen transition to complete before opening panel
		setTimeout(() => {
			isSkillPanelOpen.value = true;
			setTimeout(() => {
				centerSkillNode();
			}, 100);
		}, CANVAS_TRANSITION_DURATION + 100);
	} else {
		// Already in fullscreen, open panel immediately
		isSkillPanelOpen.value = true;
		setTimeout(() => {
			centerSkillNode();
		}, 100);
	}
}

const { typewriterEffect } = useTypewriter();

// Generate curved connection path between AI Agent and Skill nodes
function getConnectionPath(skill) {
	// AI Agent node connection point (right edge, vertical center)
	const agentX = 360;
	const agentY = 120;

	// Skill node connection point (left edge, vertical center)
	const skillX = skill.position.left;
	const skillY = skill.position.top + 70;

	// Calculate the difference in Y position
	const deltaY = skillY - agentY;
	const curveRadius = 24;

	// If nodes are at same height, draw straight line
	if (Math.abs(deltaY) < 5) {
		return `M ${agentX} ${agentY} L ${skillX} ${skillY}`;
	}

	// Calculate midpoint X for the horizontal segments
	const midX = agentX + (skillX - agentX) / 2;

	if (deltaY > 0) {
		// Skill is below: curve down then across then down again
		return `
      M ${agentX} ${agentY}
      L ${midX - curveRadius} ${agentY}
      Q ${midX} ${agentY}, ${midX} ${agentY + curveRadius}
      L ${midX} ${skillY - curveRadius}
      Q ${midX} ${skillY}, ${midX + curveRadius} ${skillY}
      L ${skillX} ${skillY}
    `.trim();
	} else {
		// Skill is above: curve up then across then up again
		return `
      M ${agentX} ${agentY}
      L ${midX - curveRadius} ${agentY}
      Q ${midX} ${agentY}, ${midX} ${agentY - curveRadius}
      L ${midX} ${skillY + curveRadius}
      Q ${midX} ${skillY}, ${midX + curveRadius} ${skillY}
      L ${skillX} ${skillY}
    `.trim();
	}
}

// Generate detailed instructions for each opportunity type
function generateInstructions(opportunity) {
	const instructionTemplates = {
		"Generate returns label": [
			'<p><strong>Verify details</strong> — Confirm customer identity using <span class="connection-badge">Verify Customer</span> and retrieve order information from <span class="connection-badge">Get Order Details</span>.</p>',
			'<p><strong>Check address</strong> — Validate the return address is within Northern Ireland using <span class="connection-badge">Validate Address</span> workflow.</p>',
			'<p><strong>Confirm eligibility</strong> — Check return window and item condition against policy using <span class="connection-badge">Check Return Policy</span>.</p>',
			"<p><strong>Identify items</strong> — Collect item details, quantities, and reason codes from customer input.</p>",
			'<p><strong>Generate slip</strong> — Create return shipping label via <span class="connection-badge">Generate Return Label</span> API with validated address and item data.</p>',
			'<p><strong>Send slip</strong> — Deliver the return label to customer through <span class="connection-badge">Send Email</span> with tracking instructions.</p>',
			"<p><strong>Provide instructions</strong> — Share return packaging guidelines and drop-off locations specific to Northern Ireland.</p>",
			'<p><strong>Log interaction</strong> — Record return request details in CRM using <span class="connection-badge">Create Case</span> for tracking purposes.</p>',
		],
		"Resolve failed payment in checkout": [
			'<p><strong>Identify error</strong> — Retrieve failed transaction details via <span class="connection-badge">Get Transaction Status</span> and determine the specific payment error code.</p>',
			'<p><strong>Verify payment method</strong> — Confirm payment method is valid and supported using <span class="connection-badge">Validate Payment Method</span>.</p>',
			"<p><strong>Check card details</strong> — Prompt customer to verify card number, expiration date, CVV, and billing address match their records.</p>",
			'<p><strong>Retry payment</strong> — Process payment again using <span class="connection-badge">Process Payment</span> with corrected information or alternative payment method.</p>',
			'<p><strong>Confirm transaction</strong> — Verify successful payment via <span class="connection-badge">Get Transaction Status</span> and capture authorization.</p>',
			'<p><strong>Send receipt</strong> — Email order confirmation and receipt through <span class="connection-badge">Send Email</span> with order details.</p>',
			'<p><strong>Log issue</strong> — Document payment failure and resolution in <span class="connection-badge">Create Case</span> for fraud prevention analysis.</p>',
		],
		"Damaged items claim": [
			'<p><strong>Verify purchase</strong> — Authenticate customer and retrieve order information using <span class="connection-badge">Get Order Details</span>.</p>',
			"<p><strong>Document damage</strong> — Collect detailed description of damage, including affected parts and discovery timeline.</p>",
			'<p><strong>Review photos</strong> — Request and analyze damage photos through <span class="connection-badge">Upload Image</span> to assess claim validity.</p>',
			'<p><strong>Determine resolution</strong> — Apply damage policy logic via <span class="connection-badge">Evaluate Claim</span> to decide between refund, replacement, or repair.</p>',
			'<p><strong>Process refund</strong> — If approved, initiate refund through <span class="connection-badge">Process Refund</span> to original payment method.</p>',
			'<p><strong>Arrange pickup</strong> — Schedule damaged item collection using <span class="connection-badge">Schedule Pickup</span> if return required.</p>',
			'<p><strong>Confirm completion</strong> — Send claim resolution summary via <span class="connection-badge">Send Email</span> with reference number and next steps.</p>',
		],
		"Re-route delivery": [
			'<p><strong>Locate order</strong> — Retrieve shipment details using <span class="connection-badge">Track Shipment</span> with order or tracking number.</p>',
			'<p><strong>Verify new address</strong> — Validate updated delivery address through <span class="connection-badge">Validate Address</span> ensuring it\'s serviceable.</p>',
			'<p><strong>Check delivery status</strong> — Confirm package hasn\'t been delivered yet using <span class="connection-badge">Get Delivery Status</span>.</p>',
			'<p><strong>Contact carrier</strong> — Submit address change request via <span class="connection-badge">Update Shipment</span> API to carrier system.</p>',
			"<p><strong>Update routing</strong> — Process carrier confirmation and verify new route is accepted in their system.</p>",
			'<p><strong>Confirm changes</strong> — Ensure address update is reflected using <span class="connection-badge">Track Shipment</span> verification.</p>',
			'<p><strong>Notify customer</strong> — Send updated tracking information through <span class="connection-badge">Send SMS</span> with new estimated delivery date.</p>',
		],
		"Unlock accounts": [
			'<p><strong>Verify identity</strong> — Authenticate user through multi-factor verification using <span class="connection-badge">Verify Identity</span> workflow.</p>',
			'<p><strong>Review lock reason</strong> — Retrieve account status and lock cause via <span class="connection-badge">Get Account Status</span> API.</p>',
			'<p><strong>Reset credentials</strong> — If security lock, guide password reset through <span class="connection-badge">Reset Password</span> with secure token.</p>',
			'<p><strong>Unlock account</strong> — Remove account restriction using <span class="connection-badge">Unlock Account</span> after identity verification.</p>',
			'<p><strong>Send confirmation</strong> — Notify user of account restoration via <span class="connection-badge">Send Email</span> with security recommendations.</p>',
			"<p><strong>Provide guidance</strong> — Share account security best practices and how to prevent future lockouts.</p>",
		],
	};

	// Return the instructions for this opportunity type, or generic fallback
	return instructionTemplates[opportunity.name]
		? instructionTemplates[opportunity.name].join("\n")
		: opportunity.steps
				.map(
					(step) =>
						`<p><strong>${step}</strong> — Complete this step according to business requirements.</p>`,
				)
				.join("\n");
}

function openSkillPanelFromMining(opportunity) {
	// Close any existing panel first
	if (isSkillPanelOpen.value) {
		closeSkillPanel();
	}
	showAddSkillPopover.value = false;

	// Start creation state
	state.isCreatingSkill = true;

	// Calculate position for new skill node (stack them vertically)
	const baseLeft = 420;
	const baseTop = 50;
	const verticalSpacing = 180;
	const newPosition = {
		left: baseLeft,
		top: baseTop + skillNodes.length * verticalSpacing,
	};

	// Create new skill node with temporary empty values
	const skillId = `skill-${Date.now()}`;
	newSkillId.value = skillId;

	const instructions = generateInstructions(opportunity);
	const newSkill = {
		id: skillId,
		name: "",
		description: "",
		position: newPosition,
		isNew: true,
		fromMining: true,
		instructions: instructions,
		actionCount: countActionsFromInstructions(instructions),
	};

	// Add the new node to the canvas
	skillNodes.push(newSkill);
	state.hasUnsavedChanges = true;

	// Always enter fullscreen mode when coming from mining
	if (!isFullScreenEditor.value) {
		enterFullScreenEditor();
	}

	// Wait for fullscreen transition, then start the creation animation
	const delay = isFullScreenEditor.value
		? 200
		: CANVAS_TRANSITION_DURATION + 100;
	setTimeout(() => {
		// Find the new skill in the array and animate its properties
		const skillIndex = skillNodes.findIndex((s) => s.id === skillId);
		if (skillIndex === -1) return;

		// Start animating the skill node title
		typewriterEffect(
			opportunity.name,
			(text) => {
				skillNodes[skillIndex].name = text;
			},
			50,
		);

		// After title is done, animate description
		setTimeout(() => {
			typewriterEffect(
				opportunity.description,
				(text) => {
					skillNodes[skillIndex].description = text;
				},
				20,
			);
		}, opportunity.name.length * 50 + 200);

		// Open the panel after a slight delay
		setTimeout(() => {
			selectedSkill.value = {
				id: skillId,
				name: opportunity.name,
				description: opportunity.description,
				instructions: newSkill.instructions,
				fromMining: true,
				isNew: true, // Keep as new until accepted
				animateText: true, // Flag to trigger typewriter in panel
			};

			isSkillPanelOpen.value = true;
			isSkillPanelAdvanced.value = true;

			setTimeout(() => {
				centerSkillNodeAdvanced();
			}, 100);

			// End creation state after panel opens (but keep isNew flag for accept/decline flow)
			setTimeout(() => {
				state.isCreatingSkill = false;
			}, 2000);
		}, 800);
	}, delay);
}

function closeSkillPanel() {
	// If there's an unsaved new skill, remove it from canvas
	if (newSkillId.value) {
		const nodeIndex = skillNodes.findIndex((n) => n.id === newSkillId.value);
		if (nodeIndex !== -1) {
			const node = skillNodes[nodeIndex];
			// Only remove if it's still marked as new (not yet saved)
			if (node.isNew) {
				skillNodes.splice(nodeIndex, 1);
			}
		}
	}

	isSkillPanelOpen.value = false;
	isSkillPanelAdvanced.value = false;
	selectedSkill.value = null;
	state.isCreatingSkill = false;
	newSkillId.value = null;

	// Re-center nodes after panel closes
	setTimeout(() => {
		centerNodes();
	}, 300);
}

function handleSkillUpdate(data) {
	// Find the skill node and update its data
	if (selectedSkill.value && selectedSkill.value.id) {
		const skillIndex = skillNodes.findIndex(
			(s) => s.id === selectedSkill.value.id,
		);
		if (skillIndex !== -1) {
			// Update the skill node with new data
			if (data.skillName) {
				skillNodes[skillIndex].name = data.skillName;
			}
			if (data.description) {
				// Extract text from HTML
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = data.description;
				skillNodes[skillIndex].description =
					tempDiv.textContent || tempDiv.innerText || "";
			}
			if (data.instructions) {
				skillNodes[skillIndex].instructions = data.instructions;
				// Recalculate action count when instructions change
				skillNodes[skillIndex].actionCount = countActionsFromInstructions(data.instructions);
			}
			// Mark as no longer new since it's been saved
			skillNodes[skillIndex].isNew = false;
		}
		state.hasUnsavedChanges = true;
	}

	// Clear newSkillId before closing since it's been saved
	newSkillId.value = null;
	closeSkillPanel();
}

function handleSkillAccept() {
	// User accepted the mined skill suggestion
	// Mark the node as no longer new and clear newSkillId
	if (selectedSkill.value && selectedSkill.value.id) {
		const skillIndex = skillNodes.findIndex(
			(s) => s.id === selectedSkill.value.id,
		);
		if (skillIndex !== -1) {
			skillNodes[skillIndex].isNew = false;
		}
		// Also update the selected skill object
		selectedSkill.value.isNew = false;
	}

	// Clear newSkillId since it's been accepted
	newSkillId.value = null;
}

function handleSkillDecline() {
	// User declined the mined skill suggestion
	// Remove the node from canvas and close the panel
	if (selectedSkill.value && selectedSkill.value.id) {
		const skillIndex = skillNodes.findIndex(
			(s) => s.id === selectedSkill.value.id,
		);
		if (skillIndex !== -1) {
			skillNodes.splice(skillIndex, 1);
		}
	}

	// Clear newSkillId if this was a new skill
	if (newSkillId.value === selectedSkill.value?.id) {
		newSkillId.value = null;
	}

	closeSkillPanel();
}

function handleToggleMode(isAdvanced) {
	isSkillPanelAdvanced.value = isAdvanced;

	// Re-center nodes when mode changes
	setTimeout(() => {
		if (isAdvanced) {
			centerSkillNodeAdvanced();
		} else {
			centerSkillNode();
		}
	}, 100);
}

function centerSkillNode() {
	const container = canvasContainer.value;
	if (!container) return;

	const canvasWidth = container.offsetWidth;
	const canvasHeight = container.offsetHeight;

	// Calculate visible canvas width when panel is open
	const visibleCanvasWidth = canvasWidth - SKILL_PANEL_WIDTH;

	const center = getNodesCenter();

	// Center the node group in the visible canvas area
	panX.value = visibleCanvasWidth / 2 - center.x;
	panY.value = canvasHeight / 2 - center.y;
}

function centerSkillNodeAdvanced() {
	const container = canvasContainer.value;
	if (!container) return;

	const canvasWidth = container.offsetWidth;
	const canvasHeight = container.offsetHeight;

	// Calculate visible canvas width when advanced panel is open
	const visibleCanvasWidth = canvasWidth - SKILL_PANEL_WIDTH_ADVANCED;

	const center = getNodesCenter();

	// Center the node group in the visible canvas area
	panX.value = visibleCanvasWidth / 2 - center.x;
	panY.value = canvasHeight / 2 - center.y;
}

// Watch for panel open/close to adjust canvas
watch(isSkillPanelOpen, (isOpen) => {
	if (isOpen) {
		// Add class to canvas to shift it
		document.body.classList.add("skill-panel-open");
	} else {
		document.body.classList.remove("skill-panel-open");
	}
});

function startPan(e) {
	// Don't pan if we're dragging a node
	if (e.button !== 0 || isDragging.value) {
		return;
	}
	isPanning.value = true;
	panStartX.value = e.clientX - panX.value;
	panStartY.value = e.clientY - panY.value;
}

function handlePan(e) {
	if (!isPanning.value) return;
	panX.value = e.clientX - panStartX.value;
	panY.value = e.clientY - panStartY.value;
}

function endPan() {
	isPanning.value = false;
}

// Drag handlers for skill nodes
const wasDragging = ref(false);

function startDrag(e, skill) {
	e.stopPropagation(); // Prevent pan from starting
	if (e.button !== 0) return; // Only left mouse button

	isDragging.value = true;
	wasDragging.value = false;
	draggedNodeId.value = skill.id;
	dragStartX.value = e.clientX;
	dragStartY.value = e.clientY;
	dragStartNodeX.value = skill.position.left;
	dragStartNodeY.value = skill.position.top;

	// Add event listeners to document for smoother dragging
	document.addEventListener("mousemove", handleDrag);
	document.addEventListener("mouseup", endDrag);
}

function handleDrag(e) {
	if (!isDragging.value || !draggedNodeId.value) return;

	// Mark that we actually dragged (not just clicked)
	const dragDistance =
		Math.abs(e.clientX - dragStartX.value) +
		Math.abs(e.clientY - dragStartY.value);
	if (dragDistance > 5) {
		wasDragging.value = true;
	}

	// Calculate movement accounting for zoom level
	const deltaX = (e.clientX - dragStartX.value) / zoomLevel.value;
	const deltaY = (e.clientY - dragStartY.value) / zoomLevel.value;

	// Find the node and update its position
	const node = skillNodes.find((n) => n.id === draggedNodeId.value);
	if (node) {
		node.position.left = dragStartNodeX.value + deltaX;
		node.position.top = dragStartNodeY.value + deltaY;
	}
}

function endDrag() {
	isDragging.value = false;
	draggedNodeId.value = null;
	if (wasDragging.value) {
		state.hasUnsavedChanges = true;
	}

	// Remove event listeners
	document.removeEventListener("mousemove", handleDrag);
	document.removeEventListener("mouseup", endDrag);
}

// Handle node click - only open panel if we didn't just drag
function handleNodeClick(skill) {
	// If we just finished dragging, don't open the panel
	if (wasDragging.value) {
		wasDragging.value = false;
		return;
	}

	openSkillPanelForSkill(skill);
}

// Node menu handlers
function toggleNodeMenu(e, skillId) {
	e.stopPropagation();
	e.preventDefault();
	if (openMenuNodeId.value === skillId) {
		openMenuNodeId.value = null;
	} else {
		openMenuNodeId.value = skillId;
	}
}

function closeNodeMenu() {
	openMenuNodeId.value = null;
}

function setAsGreeting(skill) {
	// Remove greeting status from all other nodes
	skillNodes.forEach(node => {
		node.isGreeting = false;
	});

	// Set this node as greeting
	skill.isGreeting = true;

	closeNodeMenu();
}

function editNode(skill) {
	// Open the skill panel for editing (same as clicking the node)
	handleNodeClick(skill);
	closeNodeMenu();
}

function duplicateNode(skill) {
	// Create a copy of the skill node
	const newSkill = {
		...skill,
		id: `skill-${Date.now()}`,
		name: `${skill.name} (copy)`,
		position: {
			left: skill.position.left + 20,
			top: skill.position.top + 20
		},
		isNew: false,
		isGreeting: false // Duplicated nodes are never the greeting
	};
	skillNodes.push(newSkill);
	closeNodeMenu();
}

function confirmDeleteNode(skill) {
	nodeToDelete.value = skill;
	showDeleteConfirm.value = true;
	closeNodeMenu();
}

function deleteNode() {
	if (!nodeToDelete.value) return;

	const index = skillNodes.findIndex((n) => n.id === nodeToDelete.value.id);
	if (index !== -1) {
		skillNodes.splice(index, 1);
		state.hasUnsavedChanges = true;
	}

	// Close skill panel if this node was selected
	if (selectedSkill.value && selectedSkill.value.id === nodeToDelete.value.id) {
		closeSkillPanel();
	}

	showDeleteConfirm.value = false;
	nodeToDelete.value = null;
}

function cancelDelete() {
	showDeleteConfirm.value = false;
	nodeToDelete.value = null;
}

// Navigation handlers
function navigateToTesting() {
	state.setCurrentAgentTab('testing');
}

// Publish handlers
function handlePublishClick() {
	const btnEl = publishButtonRef.value?.$el || publishButtonRef.value;
	publishButtonElement.value = btnEl;
	showPublishPopover.value = true;
}

function handlePublishFromPopover() {
	showPublishPopover.value = false;
	showDeploymentModal.value = true;
}

function handlePublished(deploymentInfo) {
	// Reset unsaved changes flag after publish
	state.hasUnsavedChanges = false;
}

// Add Skill Popover handlers
function handleAddButtonClick() {
	const btnEl = addButtonRef.value?.$el || addButtonRef.value;
	addButtonElement.value = btnEl;
	if (isSkillPanelOpen.value) closeSkillPanel();
	showAddSkillPopover.value = true;
}

function handleSelectMinedSkill(opportunity) {
	// Use the existing openSkillPanelFromMining function
	openSkillPanelFromMining(opportunity);
}

function handleSelectCreateFromScratch() {
	// Calculate position for new skill node (stack them vertically)
	const baseLeft = 420;
	const baseTop = 50;
	const verticalSpacing = 180;
	const newPosition = {
		left: baseLeft,
		top: baseTop + skillNodes.length * verticalSpacing,
	};

	// Create blank skill node
	const skillId = `skill-${Date.now()}`;
	newSkillId.value = skillId;

	const newSkill = {
		id: skillId,
		name: "",
		description: "",
		position: newPosition,
		isNew: true,
		fromMining: false,
		instructions: "",
		actionCount: 0,
	};

	// Add the new node to the canvas
	skillNodes.push(newSkill);
	state.hasUnsavedChanges = true;

	// Enter fullscreen mode if not already
	if (!isFullScreenEditor.value) {
		enterFullScreenEditor();
	}

	// Wait for fullscreen transition, then open skill panel
	setTimeout(() => {
		selectedSkill.value = newSkill;
		isSkillPanelOpen.value = true;
		isSkillPanelAdvanced.value = false;
	}, 300);
}

function enterFullScreenEditor() {
	const container = canvasPreviewContainer.value;
	if (!container) {
		debugLogger.warn("Canvas preview container not found");
		return;
	}

	try {
		const rect = container.getBoundingClientRect();
		transitionStartRect.value = {
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height,
			borderRadius: "8px",
			border: "1px solid #e0e0e0",
		};

		transitionEndRect.value = {
			top: 0,
			left: SKINNY_NAV_WIDTH,
			width: window.innerWidth - SKINNY_NAV_WIDTH,
			height: window.innerHeight,
			borderRadius: "0px",
			border: "none",
		};

		isTransitioning.value = true;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				isFullScreenEditor.value = true;

				setTimeout(() => {
					isTransitioning.value = false;
					transitionStartRect.value = null;
					transitionEndRect.value = null;
					// Re-center nodes for fullscreen dimensions
					centerNodes();
				}, CANVAS_TRANSITION_DURATION);
			});
		});
	} catch (error) {
		console.error("Error entering fullscreen mode:", error);
		isTransitioning.value = false;
	}
}

function exitFullScreenEditor() {
	if (!isFullScreenEditor.value) return;

	try {
		const container = canvasPreviewContainer.value;
		if (!container) {
			debugLogger.warn("Canvas preview container not found");
			isFullScreenEditor.value = false;
			return;
		}

		isTransitioning.value = true;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				isFullScreenEditor.value = false;

				zoomLevel.value = 1;

				setTimeout(() => {
					isTransitioning.value = false;
					transitionStartRect.value = null;
					transitionEndRect.value = null;
					// Re-center nodes for preview dimensions
					centerNodes();
				}, CANVAS_TRANSITION_DURATION);
			});
		});
	} catch (error) {
		console.error("Error exiting fullscreen mode:", error);
		isTransitioning.value = false;
		isFullScreenEditor.value = false;
	}
}

// Computed property for canvas transition styles
const canvasTransitionStyles = computed(() => {
	if (!isTransitioning.value) {
		return {};
	}

	const rect = transitionEndRect.value || transitionStartRect.value;
	if (!rect) return {};

	return {
		position: "fixed",
		top: `${rect.top}px`,
		left: `${rect.left}px`,
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		borderRadius: rect.borderRadius || "0px",
		border: rect.border || "none",
		right: "auto",
		bottom: "auto",
		zIndex: 1000,
	};
});

// Focus chat input when assistant chat opens in fullscreen
watch(() => state.showAssistantChat && isFullScreenEditor.value, (val) => {
	if (val) nextTick(() => assistantChatRef.value?.focusInput())
})

// Open skill panel in describe mode when triggered by chat add_skill with describe_prompt
watch(() => state.pendingOpenSkillId, async (skillId) => {
	if (!skillId) return
	state.pendingOpenSkillId = null
	const skill = state.skillNodes.find(n => n.id === skillId)
	if (!skill) return

	if (skill.describeText) {
		const idx = state.skillNodes.findIndex(n => n.id === skillId)
		if (idx === -1) return
		state.skillNodes[idx].isGenerating = true
		const html = await generateInstructionsFromDescribeText(skill.name, skill.describeText)
		if (!state.skillNodes[idx]) return
		state.skillNodes[idx].instructions = html
		state.skillNodes[idx].actionCount = (html.match(/class="connection-badge"/g) || []).length
		state.skillNodes[idx].isGenerating = false
		state.skillNodes[idx].isNew = false
		selectedSkill.value = {
			id: skill.id,
			name: state.skillNodes[idx].name,
			description: state.skillNodes[idx].description,
			instructions: html,
			fromMining: false,
			animateText: true,
			isNew: false,
		}
	} else {
		selectedSkill.value = {
			id: skill.id,
			name: skill.name,
			description: skill.description,
			instructions: skill.instructions || '',
			fromMining: false,
			animateText: false,
		}
	}
	isSkillPanelOpen.value = true
	setTimeout(() => centerSkillNode(), 100)
})

// Watch for skill creation from mining
watch(
	() => state.createSkillFromMining,
	(opportunity) => {
		if (opportunity) {
			// Small delay to ensure component is fully mounted/visible
			setTimeout(() => {
				// Open skill panel with mining data
				openSkillPanelFromMining(opportunity);
				// Clear the trigger
				state.createSkillFromMining = null;
			}, 100);
		}
	},
	{ immediate: true },
);

// Center nodes on mount
onMounted(() => {
	centerNodes();
});
</script>

<style scoped>
/* Shift controls left when panel is open */
.floating-control.top-right.panel-shifted {
	right: calc(468px + 32px); /* panel width + 16px gap + 16px original margin */
	transition: right 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.floating-control.bottom-right.panel-shifted {
	right: calc(468px + 32px);
	transition: right 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

/* Default position with transition */
.floating-control.top-right,
.floating-control.bottom-right {
	transition: right 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
</style>
