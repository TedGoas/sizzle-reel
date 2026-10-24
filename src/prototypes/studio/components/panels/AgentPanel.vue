<template>
	<div
		class="agent-panel"
		:class="{ 'is-open': isOpen }"
		:style="{ width: width + 'px', right: isOpen ? '16px' : `${-(width + 32)}px` }"
	>
		<div class="agent-panel-resize-handle" @mousedown.prevent="$emit('resize-start', $event)"></div>
		<div class="agent-panel-container">
			<!-- Header -->
			<div class="agent-panel-header">
				<div class="header-breadcrumb">
					<div class="breadcrumb-content">
						<dt-icon name="default-ai-agent-fab" size="400" />
						<span class="breadcrumb-label">AI Agent</span>
					</div>
					<div class="breadcrumb-actions">
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
			<div class="agent-panel-content">
				<div class="content-inner">

					<!-- 1. Company name -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Company name</div>
							<div class="label-description">The name of your company or brand.</div>
						</div>
						<dt-input
							v-model="companyName"
							placeholder="Enter company name"
							size="md"
							maxlength="50"
						/>
					</div>

					<!-- 2. Describe your company -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Describe your company</div>
							<div class="label-description">
								Briefly describe what your company does and the customers it serves.
							</div>
						</div>
						<textarea
							v-model="companyDescContent"
							class="agent-panel-textarea"
							rows="3"
							placeholder="Type here..."
						/>
					</div>

					<!-- 3. Name your agent -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Name your agent</div>
							<div class="label-description">The name your chatbot uses to introduce itself to customers (Example: "Aria", "Max"). 1–20 characters.</div>
						</div>
						<dt-input
							v-model="agentName"
							placeholder="Enter agent name"
							size="md"
							maxlength="20"
						/>
					</div>

					<!-- 4. Describe agent tasks -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Describe your agent's tasks</div>
							<div class="label-description">
								Outline the tasks and responsibilities this agent handles for customers. Type <kbd class="slash-hint">/</kbd> to add a workflow.
							</div>
						</div>
						<div
							class="editor-container editor-container--agent-tasks"
							@keydown.capture="handleTasksKeydown"
							@keyup.capture="handleTasksKeyup"
						>
							<editor-toolbar
								editor-type="agent-tasks"
								:has-content="agentTasksHasContent"
								@format="(name) => applyAgentTasksFormat(name)"
								@insert-link="insertAgentTasksLink"
								@insert-code="insertAgentTasksCode"
							/>
							<div
								ref="agentTasksEditor"
								class="editor-content editor-content--agent-tasks"
								contenteditable="true"
								@input="agentTasksHasContent = !!$event.target.textContent?.trim()"
								v-html="agentTasksContent"
							/>
						</div>
					</div>

					<!-- Workflow slash menu -->
					<WorkflowSlashMenu
						:show="showSlashMenu"
						:position="slashMenuPosition"
						v-model:search="workflowSearch"
						@select="selectWorkflow"
						@close="closeSlashMenu"
					/>

					<!-- 5. Tone and voice -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Select tone and voice</div>
							<div class="label-description">Choose the communication style for your agent.</div>
						</div>
						<dt-select-menu
							:model-value="toneVoice"
							:options="toneVoiceOptions"
							size="md"
							@change="toneVoice = $event"
						/>
					</div>

					<!-- 6. Greeting message -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Write a greeting message</div>
							<div class="label-description">
								This is the first message customers see when they start a conversation.
							</div>
						</div>
						<textarea
							v-model="greetingMessage"
							class="agent-panel-textarea"
							rows="4"
							placeholder="Hi! I'm here to help. How can I assist you today?"
						></textarea>
					</div>

					<!-- 7. Knowledge base -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Add a knowledge base</div>
							<div class="label-description">Select the primary language for your agent's knowledge base.</div>
						</div>
						<dt-select-menu
							:model-value="knowledgeBase"
							:options="knowledgeBaseOptions"
							size="md"
							@change="knowledgeBase = $event"
						/>
					</div>

					<!-- 8. Transfer instructions -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Transfer instructions</div>
							<div class="label-description">
								Define when the agent should transfer a conversation and where it should be routed. Type <kbd class="slash-hint">/</kbd> to add a transfer endpoint.
							</div>
						</div>
						<div
							class="editor-container editor-container--transfer-instructions transfer-instructions-editor"
							@keydown.capture="handleTransferKeydown"
							@keyup.capture="handleTransferKeyup"
						>
							<editor-toolbar
								editor-type="transfer-instructions"
								:has-content="transferHasContent"
								@format="(name) => applyTransferFormat(name)"
								@insert-link="insertTransferLink"
								@insert-code="insertTransferCode"
							/>
							<div
								ref="transferInstructionsEditor"
								class="editor-content editor-content--transfer-instructions"
								contenteditable="true"
								@input="transferHasContent = !!$event.target.textContent?.trim()"
								v-html="transferInstructionsContent"
							/>
						</div>
					</div>

					<!-- Transfer slash menu -->
					<Teleport to="body">
						<div
							v-if="showTransferSlashMenu"
							ref="transferSlashMenuEl"
							class="agent-panel-slash-submenu"
							:style="{ top: transferSlashMenuPosition.top + 'px', left: transferSlashMenuPosition.left + 'px' }"
							@mousedown.prevent
						>
							<template v-if="!transferSlashSearch">
								<div class="agent-panel-slash-section-label">Digital</div>
								<div
									v-for="item in transferSubmenu.digital"
									:key="item.id"
									class="agent-panel-slash-submenu-item"
									@mousedown.prevent="selectTransfer(item)"
								>{{ item.label }}</div>
								<div class="agent-panel-slash-divider" />
								<div class="agent-panel-slash-section-label agent-panel-slash-section-label--spaced">Voice</div>
								<div
									v-for="item in transferSubmenu.voice"
									:key="item.id"
									class="agent-panel-slash-submenu-item"
									@mousedown.prevent="selectTransfer(item)"
								>{{ item.label }}</div>
							</template>
							<template v-else>
								<div
									v-for="item in filteredTransferItems"
									:key="item.id"
									class="agent-panel-slash-submenu-item"
									@mousedown.prevent="selectTransfer(item)"
								>
									{{ item.label }}
									<span class="agent-panel-slash-category">{{ item.category }}</span>
								</div>
								<div v-if="filteredTransferItems.length === 0" class="agent-panel-slash-no-results">No transfers found</div>
							</template>
						</div>
						<div v-if="showTransferSlashMenu" class="agent-panel-slash-overlay" @click="closeTransferSlashMenu" />
					</Teleport>

					<!-- 9. Transfer fallback -->
					<div class="form-section">
						<div class="form-label">
							<div class="label-text">Transfer fallback</div>
							<div class="label-description">
								Set the fallback destination for conversations that don't match any of the transfer rules above.
							</div>
						</div>
						<div class="transfer-groups">
							<div class="transfer-group">
								<div class="transfer-group-label">Digital</div>
								<dt-radio-group
									v-model="transferDigital"
									name="transfer-digital"
									class="transfer-radio-row"
								>
									<dt-radio value="agents">Agents</dt-radio>
									<dt-radio value="contact-center">Contact Center</dt-radio>
									<dt-radio value="team-member">Team member</dt-radio>
								</dt-radio-group>
							</div>
							<div class="transfer-group">
								<div class="transfer-group-label">Voice</div>
								<dt-radio-group
									v-model="transferVoice"
									name="transfer-voice"
									class="transfer-radio-row"
								>
									<dt-radio value="operators">Operators</dt-radio>
									<dt-radio value="voicemail">Voicemail</dt-radio>
									<dt-radio value="groups">Groups</dt-radio>
									<dt-radio value="team-member">Team member</dt-radio>
									<dt-radio value="room-phone">Room phone</dt-radio>
								</dt-radio-group>
							</div>
						</div>
					</div>

				</div>
			</div>

			<!-- Footer -->
			<div class="agent-panel-footer">
				<div class="footer-actions">
					<dt-button importance="clear" kind="muted" size="md" @click="handleCancel">
						Cancel
					</dt-button>
					<dt-button importance="primary" size="md" @click="handleSave">
						Save
					</dt-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { DtIcon, DtButton, DtInput, DtSelectMenu, DtRadioGroup, DtRadio } from '../ui';
import EditorToolbar from './EditorToolbar.vue';
import WorkflowSlashMenu from './WorkflowSlashMenu.vue';

const props = defineProps({
	isOpen: Boolean,
	agentData: Object,
	width: { type: Number, default: 468 },
});

const emit = defineEmits(['close', 'cancel', 'save', 'resize-start']);

// ─── Local state ──────────────────────────────────────────────────────────────
const companyName       = ref('');
const agentName         = ref('');
const greetingMessage   = ref('');
const companyDescContent = ref('');
const agentTasksContent  = ref('');
const agentTasksEditor   = ref(null);
const agentTasksHasContent = ref(false);
const toneVoice         = ref('Professional');
const knowledgeBase     = ref('english-us');
const transferDigital   = ref('agents');
const transferVoice     = ref('operators');

const transferInstructionsContent = ref('');
const transferInstructionsEditor  = ref(null);
const transferHasContent          = ref(false);

const showTransferSlashMenu      = ref(false);
const transferSlashMenuPosition  = ref({ top: 0, left: 0 });
const transferSlashMenuEl        = ref(null);
const transferSlashSearch        = ref('');
let transferSavedRange           = null;

function resetToAgentData(data = props.agentData) {
	if (!data) return;
	companyName.value                  = data.companyName        || '';
	agentName.value                    = data.agentName          || '';
	greetingMessage.value              = data.greetingMessage    || '';
	companyDescContent.value           = data.companyDesc        || '';
	agentTasksContent.value            = data.agentTasks         || '';
	agentTasksHasContent.value         = !!(data.agentTasks?.trim());
	toneVoice.value                    = data.toneVoice          || 'Professional';
	knowledgeBase.value                = data.knowledgeBase      || 'english-us';
	transferDigital.value              = data.transferDigital    || 'agents';
	transferVoice.value                = data.transferVoice      || 'operators';
	transferInstructionsContent.value  = data.transferInstructions || '';
	transferHasContent.value           = !!(data.transferInstructions?.trim());
}

watch(() => props.agentData, resetToAgentData, { immediate: true, deep: true });

// ─── Select options ───────────────────────────────────────────────────────────
const toneVoiceOptions = [
	{ value: 'Professional', label: 'Professional' },
	{ value: 'Friendly',     label: 'Friendly'     },
	{ value: 'Formal',       label: 'Formal'       },
	{ value: 'Casual',       label: 'Casual'       },
];

const knowledgeBaseOptions = [
	{ value: 'english-us', label: 'English (US)' },
	{ value: 'english-uk', label: 'English (UK)' },
	{ value: 'french',     label: 'French'       },
	{ value: 'spanish',    label: 'Spanish'      },
];

// ─── Workflow slash menu ──────────────────────────────────────────────────────
const showSlashMenu = ref(false);
const slashMenuPosition = ref({ top: 0, left: 0 });
const workflowSearch = ref('');
let tasksSavedRange = null;

function handleTasksKeydown(event) {
	if (event.key === '/' && !showSlashMenu.value) {
		workflowSearch.value = '';
		setTimeout(() => {
			const sel = window.getSelection();
			let top = 0;
			let left = 0;
			if (sel && sel.rangeCount > 0) {
				tasksSavedRange = sel.getRangeAt(0).cloneRange();
				const rect = tasksSavedRange.getBoundingClientRect();
				if (rect.top !== 0 || rect.left !== 0) {
					top = rect.bottom + 6;
					left = rect.left;
				}
			}
			if (top === 0 && left === 0) {
				const editorEl = agentTasksEditor.value;
				if (editorEl) {
					const r = editorEl.getBoundingClientRect();
					top = r.bottom + 6;
					left = r.left;
				}
			}
			const menuH = 320;
			const menuW = 240;
			if (top + menuH > window.innerHeight) top = top - menuH - 12;
			if (left + menuW > window.innerWidth) left = window.innerWidth - menuW - 8;
			slashMenuPosition.value = { top, left };
			showSlashMenu.value = true;
		}, 0);
	} else if (showSlashMenu.value && event.key === 'Escape') {
		closeSlashMenu();
	}
}

function handleTasksKeyup(event) {
	if (!showSlashMenu.value) return;
	if (['Escape', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) { closeSlashMenu(); return; }
	tasksSavedRange = sel.getRangeAt(0).cloneRange();
	const textBefore = tasksSavedRange.cloneRange();
	textBefore.setStart(textBefore.startContainer, 0);
	const textStr = textBefore.toString();
	const slashIdx = textStr.lastIndexOf('/');
	if (slashIdx === -1) { closeSlashMenu(); return; }
	workflowSearch.value = textStr.slice(slashIdx + 1);
}

function selectWorkflow(item) {
	const sel = window.getSelection();
	if (tasksSavedRange && sel) {
		sel.removeAllRanges();
		sel.addRange(tasksSavedRange);
	}
	tasksSavedRange = null;
	if (sel && sel.rangeCount > 0) {
		const range = sel.getRangeAt(0);
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
		const badge = document.createElement('span');
		badge.className = 'connection-badge connection-badge--workflow';
		badge.dataset.badgeType = 'workflow';
		badge.textContent = item.label;
		badge.contentEditable = 'false';
		range.insertNode(badge);
		const space = document.createTextNode('\u00A0');
		range.setStartAfter(badge);
		range.insertNode(space);
		range.setStartAfter(space);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
	closeSlashMenu();
	if (agentTasksEditor.value) agentTasksEditor.value.focus();
}

function closeSlashMenu() {
	showSlashMenu.value = false;
	workflowSearch.value = '';
	tasksSavedRange = null;
}

// ─── Transfer slash menu ──────────────────────────────────────────────────────
const transferSubmenu = {
	digital: [
		{ id: 'agents',         label: 'Agents'         },
		{ id: 'contact-center', label: 'Contact Center' },
		{ id: 'team-member-d',  label: 'Team Member'    },
	],
	voice: [
		{ id: 'voicemail',     label: 'Voicemail'   },
		{ id: 'operators',     label: 'Operators'   },
		{ id: 'groups',        label: 'Groups'      },
		{ id: 'team-member-v', label: 'Team Member' },
		{ id: 'room-phone',    label: 'Room Phone'  },
	],
};

const filteredTransferItems = computed(() => {
	const q = transferSlashSearch.value.toLowerCase();
	if (!q) return [];
	return [
		...transferSubmenu.digital.map(t => ({ ...t, category: 'Digital' })),
		...transferSubmenu.voice.map(t => ({ ...t, category: 'Voice' })),
	].filter(t => t.label.toLowerCase().includes(q));
});

function handleTransferKeydown(event) {
	if (event.key === '/' && !showTransferSlashMenu.value) {
		transferSlashSearch.value = '';
		setTimeout(() => {
			const sel = window.getSelection();
			let top = 0;
			let left = 0;
			if (sel && sel.rangeCount > 0) {
				transferSavedRange = sel.getRangeAt(0).cloneRange();
				const rect = transferSavedRange.getBoundingClientRect();
				if (rect.top !== 0 || rect.left !== 0) {
					top = rect.bottom + 6;
					left = rect.left;
				}
			}
			if (top === 0 && left === 0) {
				const editorEl = document.querySelector('.transfer-instructions-editor');
				if (editorEl) {
					const r = editorEl.getBoundingClientRect();
					top = r.bottom + 6;
					left = r.left;
				}
			}
			const menuH = 320;
			const menuW = 280;
			if (top + menuH > window.innerHeight) top = top - menuH - 12;
			if (left + menuW > window.innerWidth) left = window.innerWidth - menuW - 8;
			transferSlashMenuPosition.value = { top, left };
			showTransferSlashMenu.value = true;
		}, 0);
	} else if (showTransferSlashMenu.value && event.key === 'Escape') {
		closeTransferSlashMenu();
	}
}

function handleTransferKeyup(event) {
	if (!showTransferSlashMenu.value) return;
	if (['Escape', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) { closeTransferSlashMenu(); return; }
	transferSavedRange = sel.getRangeAt(0).cloneRange();
	const textBefore = transferSavedRange.cloneRange();
	textBefore.setStart(textBefore.startContainer, 0);
	const textStr = textBefore.toString();
	const slashIdx = textStr.lastIndexOf('/');
	if (slashIdx === -1) { closeTransferSlashMenu(); return; }
	transferSlashSearch.value = textStr.slice(slashIdx + 1);
}

function selectTransfer(item) {
	const sel = window.getSelection();
	if (transferSavedRange && sel) {
		sel.removeAllRanges();
		sel.addRange(transferSavedRange);
	}
	transferSavedRange = null;
	if (sel && sel.rangeCount > 0) {
		const range = sel.getRangeAt(0);
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
		const badge = document.createElement('span');
		badge.className = 'connection-badge connection-badge--transfer';
		badge.dataset.badgeType = 'transfer';
		badge.textContent = item.label;
		badge.contentEditable = 'false';
		range.insertNode(badge);
		const space = document.createTextNode('\u00A0');
		range.setStartAfter(badge);
		range.insertNode(space);
		range.setStartAfter(space);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
	closeTransferSlashMenu();
	const editorEl = document.querySelector('.transfer-instructions-editor [contenteditable="true"]');
	if (editorEl) editorEl.focus();
}

function closeTransferSlashMenu() {
	showTransferSlashMenu.value = false;
	transferSlashSearch.value = '';
	transferSavedRange = null;
}

// ─── Agent tasks editor formatting ───────────────────────────────────────────
function wrapAgentTasksSelectionIn(tag) {
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;
	const range = sel.getRangeAt(0);
	const wrapper = document.createElement(tag);
	try {
		range.surroundContents(wrapper);
	} catch {
		wrapper.appendChild(range.extractContents());
		range.insertNode(wrapper);
	}
	range.setStartAfter(wrapper);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
}

function applyAgentTasksFormat(formatName) {
	const el = agentTasksEditor.value;
	if (!el) return;
	el.focus();
	const execMap = {
		'Bold':          'bold',
		'Italic':        'italic',
		'Strikethrough': 'strikeThrough',
		'Bulleted List': 'insertUnorderedList',
		'Numbered List': 'insertOrderedList',
	};
	if (execMap[formatName]) {
		document.execCommand(execMap[formatName], false, null);
	} else if (formatName === 'block-quote') {
		wrapAgentTasksSelectionIn('blockquote');
	}
}

function insertAgentTasksLink() {
	const el = agentTasksEditor.value;
	if (!el) return;
	const url = prompt('Enter URL:');
	if (!url) return;
	el.focus();
	document.execCommand('createLink', false, url);
}

function insertAgentTasksCode() {
	const el = agentTasksEditor.value;
	if (!el) return;
	el.focus();
	wrapAgentTasksSelectionIn('code');
}

// ─── Transfer editor formatting ───────────────────────────────────────────────
function wrapTransferSelectionIn(tag) {
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;
	const range = sel.getRangeAt(0);
	const wrapper = document.createElement(tag);
	try {
		range.surroundContents(wrapper);
	} catch {
		wrapper.appendChild(range.extractContents());
		range.insertNode(wrapper);
	}
	range.setStartAfter(wrapper);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
}

function applyTransferFormat(formatName) {
	const el = transferInstructionsEditor.value;
	if (!el) return;
	el.focus();
	const execMap = {
		'Bold':          'bold',
		'Italic':        'italic',
		'Strikethrough': 'strikeThrough',
		'Bulleted List': 'insertUnorderedList',
		'Numbered List': 'insertOrderedList',
	};
	if (execMap[formatName]) {
		document.execCommand(execMap[formatName], false, null);
	} else if (formatName === 'block-quote') {
		wrapTransferSelectionIn('blockquote');
	}
}

function insertTransferLink() {
	const el = transferInstructionsEditor.value;
	if (!el) return;
	const url = prompt('Enter URL:');
	if (!url) return;
	el.focus();
	document.execCommand('createLink', false, url);
}

function insertTransferCode() {
	const el = transferInstructionsEditor.value;
	if (!el) return;
	el.focus();
	wrapTransferSelectionIn('code');
}

// ─── Cancel / Save ────────────────────────────────────────────────────────────
function handleCancel() {
	resetToAgentData();
	emit('cancel');
}

function handleSave() {
	emit('save', {
		companyName:     companyName.value,
		companyDesc:     companyDescContent.value,
		agentName:       agentName.value,
		agentTasks:      agentTasksEditor.value?.innerHTML ?? agentTasksContent.value,
		toneVoice:       toneVoice.value,
		greetingMessage: greetingMessage.value,
		knowledgeBase:        knowledgeBase.value,
		transferInstructions: transferInstructionsEditor.value?.innerHTML ?? transferInstructionsContent.value,
		transferDigital:      transferDigital.value,
		transferVoice:        transferVoice.value,
	});
}
</script>

<style scoped>
/* ─── Panel positioning & slide-in ──────────────────────────────────────────── */
.agent-panel {
	position: fixed;
	top: 16px;
	bottom: 16px;
	transition: right 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
	z-index: 1000;
}

/* ─── Resize handle ─────────────────────────────────────────────────────────── */
.agent-panel-resize-handle {
	position: absolute;
	top: 0;
	left: -4px;
	width: 8px;
	height: 100%;
	cursor: col-resize;
	z-index: 10;
}

.agent-panel-resize-handle::after {
	content: '';
	position: absolute;
	top: 0;
	right: 3px;
	width: 2px;
	height: 100%;
	background: transparent;
	transition: background 0.15s;
}

.agent-panel-resize-handle:hover::after {
	background: rgba(71, 21, 113, 0.35);
}

/* ─── Container ─────────────────────────────────────────────────────────────── */
.agent-panel-container {
	width: 100%;
	height: 100%;
	position: relative;
	background: white;
	box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04),
		0px 1px 2px rgba(0, 0, 0, 0.03);
	border-radius: 24px;
	display: flex;
	flex-direction: column;
}

/* ─── Header ────────────────────────────────────────────────────────────────── */
.agent-panel-header {
	padding: 16px;
	flex-shrink: 0;
}

.header-breadcrumb {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 40px;
	padding: 0 4px 0 12px;
	background: linear-gradient(135deg,
		rgba(71, 21, 113, 0.1),
		rgba(124, 34, 158, 0.1),
		rgba(233, 47, 111, 0.1),
		rgba(251, 115, 40, 0.1),
		rgba(243, 150, 15, 0.1)
	);
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

/* ─── Content ───────────────────────────────────────────────────────────────── */
.agent-panel-content {
	flex: 1;
	padding: 0 16px;
	overflow-y: auto;
	overflow-x: hidden;
}

.content-inner {
	padding-bottom: 72px;
}

/* ─── Form sections ─────────────────────────────────────────────────────────── */
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

.label-description {
	color: var(--dt-color-foreground-tertiary);
	font-size: 12px;
	font-weight: 400;
	line-height: 16.8px;
}

/* ─── Agent tasks editor ─────────────────────────────────────────────────────── */
.editor-container--agent-tasks {
	display: flex;
	flex-direction: column;
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: 12px;
	overflow: hidden;
	min-height: 160px;
}

.editor-container--agent-tasks:focus-within {
	border-color: var(--dt-color-border-focus);
}

.editor-container--agent-tasks .editor-content {
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

.editor-container--agent-tasks .editor-content:focus {
	outline: none;
	box-shadow: none;
	border: none;
}

.editor-content--agent-tasks:empty:before {
	content: "Example: Handles booking and rescheduling appointments, answers product FAQs, processes returns and refunds, and escalates complex issues to a human agent.";
	color: #999;
	font-style: normal;
	pointer-events: none;
}

/* ─── Transfer instructions editor ───────────────────────────────────────────── */
.editor-container--transfer-instructions {
	display: flex;
	flex-direction: column;
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: 12px;
	overflow: hidden;
	height: 220px;
}

.editor-container--transfer-instructions:focus-within {
	border-color: var(--dt-color-border-focus);
}

.editor-container--transfer-instructions .editor-content {
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

.editor-container--transfer-instructions .editor-content:focus {
	outline: none;
	box-shadow: none;
	border: none;
}

.editor-content--transfer-instructions:empty:before {
	content: "Example: 1. When a customer wants to speak with a live agent, use /Transfer to agent.";
	color: #999;
	font-style: normal;
	pointer-events: none;
}

/* ─── Textarea ───────────────────────────────────────────────────────────────── */
.agent-panel-textarea {
	width: 100%;
	padding: 10px 12px;
	font-size: 15px;
	line-height: 1.5;
	color: var(--dt-color-foreground-primary);
	background: var(--dt-color-surface-primary);
	border: 1px solid var(--dt-color-border-default);
	border-radius: 8px;
	resize: none;
	outline: none;
	font-family: inherit;
	box-sizing: border-box;
}

.agent-panel-textarea:focus {
	border-color: var(--dt-color-border-focus);
}

.agent-panel-textarea::placeholder {
	color: var(--dt-color-foreground-placeholder);
}

/* ─── Slash hint kbd ────────────────────────────────────────────────────────── */
.slash-hint {
	display: inline-block;
	padding: 0 4px;
	background: var(--dt-color-surface-secondary, #f0f0f0);
	border: 1px solid var(--dt-color-border-default, #d0d0d0);
	border-radius: 4px;
	font-size: 11px;
	font-family: inherit;
	line-height: 16px;
	color: var(--dt-color-foreground-secondary);
}

/* ─── Connection badges ───────────────────────────────────────────────────── */
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
	user-select: none;
}

.editor-content :deep(.connection-badge--workflow) {
	background: rgba(124, 82, 255, 0.1);
	color: #7c52ff;
}

.editor-content :deep(.connection-badge--transfer) {
	background: rgba(0, 109, 210, 0.1);
	color: #006dd2;
}

/* ─── Transfer slash menu ──────────────────────────────────────────────────── */
:global(.agent-panel-slash-submenu) {
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

:global(.agent-panel-slash-overlay) {
	position: fixed;
	inset: 0;
	z-index: 1000;
}

:global(.agent-panel-slash-section-label) {
	padding: 2px 8px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: #808080;
	line-height: 1.4;
}

:global(.agent-panel-slash-section-label--spaced) {
	padding-top: 4px;
}

:global(.agent-panel-slash-divider) {
	height: 1px;
	background: rgba(28, 28, 28, 0.1);
	margin: 3px 0;
}

:global(.agent-panel-slash-submenu-item) {
	display: flex;
	align-items: center;
	padding: 5px 8px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #1c1c1c;
	line-height: 22px;
	transition: background 0.1s ease;
}

:global(.agent-panel-slash-submenu-item:hover) {
	background: rgba(28, 28, 28, 0.08);
}

:global(.agent-panel-slash-category) {
	margin-left: auto;
	font-size: 12px;
	color: #999;
}

:global(.agent-panel-slash-no-results) {
	padding: 8px;
	font-size: 13px;
	color: #999;
	text-align: center;
}

/* ─── Transfer radio groups ──────────────────────────────────────────────────── */
.transfer-groups {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.transfer-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.transfer-group-label {
	font-size: 13px;
	font-weight: 500;
	color: var(--dt-color-foreground-secondary);
}

.transfer-radio-row {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */
.agent-panel-footer {
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

.footer-actions {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;
	pointer-events: auto;
}
</style>
