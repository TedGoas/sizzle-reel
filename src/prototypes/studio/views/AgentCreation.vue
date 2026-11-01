<template>
  <div class="agent-creation-root">
    <!-- Canvas dotted background -->
    <div class="canvas-area creation-canvas">

      <!-- Ambient gradient glows -->
      <div class="ambient-glow" />
      <div class="ambient-glow-2" />

      <!-- Top-left: Back button + Agent name + Draft badge -->
      <div class="floating-control top-left control-visible">
        <dt-button importance="clear" kind="muted" size="sm" @click="state.currentPage = 'agent-list'">
          <template #icon><dt-icon name="arrow-left" size="300" /></template>
        </dt-button>
        <div class="floating-agent-info">
          <div v-if="isEditingAgentName" class="agent-name-edit">
            <dt-input
              ref="nameInputRef"
              v-model="editingAgentNameValue"
              size="sm"
              class="agent-name-input"
              @keydown.enter="confirmAgentName"
              @keydown.escape="cancelAgentName"
            />
            <button class="agent-name-action" title="Confirm" @click="confirmAgentName">
              <dt-icon name="check" size="200" />
            </button>
            <button class="agent-name-action" title="Cancel" @click="cancelAgentName">
              <dt-icon name="close" size="200" />
            </button>
          </div>
          <button v-else class="agent-name-trigger" title="Change name" @click="startEditingAgentName">
            <span class="floating-agent-name">{{ agentName }}</span>
          </button>
          <dt-badge type="default" text="Draft" size="sm" />
        </div>
      </div>

      <!-- Top-right: Action buttons -->
      <div class="floating-control top-right control-visible">
        <dt-button importance="clear" size="sm" aria-label="More options">
          <template #icon><dt-icon name="more-vertical" size="300" /></template>
        </dt-button>
        <dt-button importance="clear" size="sm" aria-label="Settings">
          <template #icon><dt-icon name="settings" size="300" /></template>
        </dt-button>
        <div class="control-divider"></div>
        <dt-button importance="clear" size="sm" disabled>
          <dt-icon name="play" size="200" style="margin-right: 4px;" />
          Test
        </dt-button>
        <dt-button importance="clear" size="sm" disabled>Save</dt-button>
        <dt-button importance="primary" size="sm" disabled>Publish</dt-button>
      </div>

      <!-- Centered creation panel -->
      <div
        class="creation-panel"
        :class="{ 'is-loading': isBuilding }"
      >
        <Transition name="heading-fade" mode="out-in">
          <h1 :key="dynamicHeading" class="creation-heading">{{ dynamicHeading }}</h1>
        </Transition>
        <Transition name="heading-fade" mode="out-in">
          <p :key="dynamicSubtext" class="creation-subtext">{{ dynamicSubtext }}</p>
        </Transition>

        <!-- Prompt box -->
        <div class="agent-creation-input" @keydown.enter.exact.prevent="handleSubmit">
          <div class="input-preview-wrapper" :class="{ 'is-previewing': hoverPreview && !promptText }">
            <dt-recipe-message-input
              v-model="promptText"
              input-aria-label="Agent description"
              placeholder="Describe your AI agent in a conversational manner..."
              :show-cancel="false"
              :show-emoji-picker="false"
              :show-image-picker="false"
              :rich-text="false"
              :disable-send="!promptText.trim()"
              @text-input="promptText = $event"
              @submit="handleSubmit"
            >
              <template #sendButton>
                <dt-button
                  circle
                  size="xs"
                  importance="clear"
                  :disabled="!isBuilding && !promptText.trim()"
                  @click="isBuilding ? handleStopCreation() : handleSubmit()"
                >
                  <template #icon>
                    <dt-icon v-if="!isBuilding" name="send" size="300" />
                    <span v-else class="loading-icon-wrap">
                      <span class="send-spinner" />
                      <span class="stop-icon"><dt-icon name="stop-filled" size="200" /></span>
                    </span>
                  </template>
                </dt-button>
              </template>
            </dt-recipe-message-input>
            <div
              v-if="hoverPreview && !promptText"
              class="chip-hover-preview"
              aria-hidden="true"
            >{{ hoverPreview }}</div>
          </div>
        </div>

        <!-- Suggestion chips -->
        <div class="chips-wrapper">
          <div class="chips-row">
            <button
              v-for="chip in currentChipSet.slice(0, 3)"
              :key="chip"
              class="suggestion-chip"
              @mouseenter="hoverPreview = chipPrompts[chip] || chip"
              @mouseleave="hoverPreview = ''"
              @click="selectChip(chip)"
            >
              {{ chip }}
            </button>
          </div>
          <div class="chips-row">
            <button
              v-for="chip in currentChipSet.slice(3, 6)"
              :key="chip"
              class="suggestion-chip"
              @mouseenter="hoverPreview = chipPrompts[chip] || chip"
              @mouseleave="hoverPreview = ''"
              @click="selectChip(chip)"
            >
              {{ chip }}
            </button>
          </div>
          <div class="chips-row chips-row-actions">
            <button class="suggestion-chip chip-see-more" @click="toggleChipSet">
              <dt-icon name="refresh" size="200" style="margin-right: 4px;" />
              See more examples
            </button>
          </div>
          <div class="chips-row chips-row-manual">
            <button class="create-manually-btn" @click="handleCreateManually">
              Create manually
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { DtIcon, DtButton, DtBadge, DtInput, DtRecipeMessageInput } from '../components/ui'
import { state } from '../state.js'
import { AEROLABS } from '../config/aerolabsData.js'
import { debugLogger } from '../lib/debugLogger.js'

// ─── Badge HTML builder (mirrors SkillPanel.vue skillStepsToHtml) ────────────
function skillStepsToHtml(steps) {
  if (!steps?.length) return ''
  return steps.map(s => {
    let detail = s.detail
    if (s.actions?.length) {
      for (const act of s.actions) {
        const cls = act.type === 'workflow' ? 'connection-badge connection-badge--workflow'
          : act.type === 'transfer' ? 'connection-badge connection-badge--transfer'
          : 'connection-badge'
        const escaped = act.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        detail = detail.replace(new RegExp(escaped, 'g'), `<span class="${cls}">${act.name}</span>`)
      }
    }
    return `<p><strong>${s.title}</strong> — ${detail}</p>`
  }).join('\n')
}

// ─── Claude client ────────────────────────────────────────────────────────────
const _apiKey = null /* mock-only */
const claude = _apiKey && _apiKey !== 'your_api_key_here'
  ? null
  : null

async function callClaudeForAgent(prompt) {
  if (!claude) {
    debugLogger.warn('[AgentCreation] Claude client is null — check VITE_ANTHROPIC_API_KEY in .env.local and restart the dev server')
    return null
  }
  debugLogger.log('[AgentCreation] Calling Claude...')
  try {
    const response = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `${AEROLABS.systemContext}

You are an AI assistant helping design Dialpad AI customer service agents for Aerolabs. Given a description of what an agent should do, return ONLY valid JSON (no markdown, no code fences) in this exact shape:
{
  "agentName": "2-4 word internal name in Title Case (e.g. Scheduling Assistant)",
  "personaName": "1-2 word customer-facing name the chatbot uses to introduce itself (e.g. Aria, Max, Kai)",
  "agentDescription": "One sentence describing the agent",
  "agentTasks": "2-3 sentence summary of all the tasks and responsibilities this agent handles, written from the agent's perspective for the AgentPanel config field.",
  "greetingMessage": "A warm, friendly opening message the agent sends to start a conversation. Mention the personaName but keep it generic — do not list specific skills or capabilities. Keep it under 2 sentences.",
  "skills": [
    {
      "name": "Skill Name",
      "description": "One sentence describing what this skill does",
      "steps": [
        {
          "title": "Step Title",
          "detail": "Detail sentence that mentions the ExactToolName by its exact name.",
          "actions": [{ "name": "ExactToolName", "type": "api" }]
        }
      ],
      "guardrails": "",
      "labels": "voice, inbound"
    }
  ]
}
Guidelines:
- Include 2-4 skills that cover the agent's main responsibilities
- Each skill: 3-5 steps. Each step: a short imperative title + 1-sentence detail
- actions: real integrations/APIs/tools used in that step (0-3 per step). The action name must appear verbatim in the detail text
- type: "api" for REST APIs and data lookups (gray badge), "workflow" for automation flows (purple badge), "transfer" for call/chat transfers (blue badge)
- labels: comma-separated from: voice, inbound, outbound, sms, email, chat
- agentTasks: synthesize the agent's responsibilities across all skills into a cohesive 2-3 sentence description
- personaName: short 1–2 word branded name; avoid generic words like "Agent", "Assistant", or "Bot"
- greetingMessage: use personaName (not agentName) and keep it generic — do not mention specific skills, topics, or capabilities`,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = response.content[0]?.text || ''
    debugLogger.log('[AgentCreation] Claude raw response:', text)
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const data = JSON.parse(clean)
    debugLogger.log('[AgentCreation] Claude parsed successfully:', data.agentName, `(${data.skills?.length} skills)`)
    for (const skill of data.skills) {
      skill.instructions = skillStepsToHtml(skill.steps || [])
      skill.actionCount = (skill.steps || [])
        .flatMap(s => s.actions || [])
        .filter(a => a.type !== 'workflow' && a.type !== 'transfer').length
    }
    return data
  } catch (e) {
    console.error('[AgentCreation] Claude call failed:', e?.message || e)
    console.error('[AgentCreation] Full error:', e)
    return null
  }
}

// ─── Agent name (editable before first build) ────────────────────────────────
const nameInputRef = ref(null)
const agentName = ref('New AI Agent')
const isEditingAgentName = ref(false)
const editingAgentNameValue = ref('')

function startEditingAgentName() {
  editingAgentNameValue.value = agentName.value
  isEditingAgentName.value = true
  setTimeout(() => nameInputRef.value?.$el?.querySelector('input')?.focus(), 0)
}

function confirmAgentName() {
  const trimmed = editingAgentNameValue.value.trim()
  if (trimmed) agentName.value = trimmed
  isEditingAgentName.value = false
}

function cancelAgentName() {
  isEditingAgentName.value = false
}

const promptText = ref('')
const isBuilding = ref(false)
const isCanceled = ref(false)
const headingPhase = ref(0) // 0 = idle, 1 = "Building your agent", 2 = "Almost done"
let headingTimer1 = null
let headingTimer2 = null
const chipSetIndex = ref(0)
const hoverPreview = ref('')

const dynamicHeading = computed(() => {
  if (!isBuilding.value) return "Let's get started"
  if (headingPhase.value >= 2) return 'Almost done...'
  return 'Building your agent...'
})

const dynamicSubtext = computed(() => {
  if (!isBuilding.value) return 'Describe what you want this agent to do.'
  return "Great description! We'll take it from here. Hang tight."
})

function startHeadingCycle() {
  headingPhase.value = 1
  headingTimer1 = setTimeout(() => { headingPhase.value = 2 }, 3000)
}

function handleStopCreation() {
  isCanceled.value = true
  isBuilding.value = false
  headingPhase.value = 0
  clearTimeout(headingTimer1)
  clearTimeout(headingTimer2)
  // promptText is intentionally left intact so the user sees their original prompt
}

onUnmounted(() => {
  clearTimeout(headingTimer1)
  clearTimeout(headingTimer2)
})


const chipSets = [
  [
    'AI Receptionist',
    'Scheduling Assistant',
    'Recruiting Agent',
    'Account Manager',
    'CRM Buddy',
    'Sales Support Agent',
  ],
  [
    'Customer Support Bot',
    'FAQ Assistant',
    'Order Tracker',
    'Billing Helper',
    'IT Help Desk',
    'Appointment Reminder',
  ],
]

const chipPrompts = {
  'AI Receptionist':      'An AI receptionist that answers incoming calls, greets callers professionally, routes them to the right department, and takes messages when no agents are available.',
  'Scheduling Assistant': 'A scheduling assistant that books appointments, sends automated reminders to customers, and handles rescheduling or cancellation requests.',
  'Recruiting Agent':     'A recruiting agent that pre-screens job applicants with qualifying questions and schedules interviews with the hiring team.',
  'Account Manager':      'An account manager that handles customer inquiries, processes account changes, and escalates complex issues to the right team.',
  'CRM Buddy':            'A CRM assistant that logs every customer interaction automatically and keeps contact records and deal stages up to date.',
  'Sales Support Agent':  'A sales support agent that qualifies inbound leads, answers product questions, and hands off warm prospects to a human sales rep.',
  'Customer Support Bot': 'A customer support bot that resolves common issues using the knowledge base, creates tickets for unresolved cases, and transfers customers to a live agent when needed.',
  'FAQ Assistant':        'An FAQ assistant that quickly answers common customer questions by searching the knowledge base and pointing to relevant articles.',
  'Order Tracker':        'An order tracking agent that looks up order status in real time and sends customers proactive delivery updates.',
  'Billing Helper':       'A billing agent that explains charges, processes refunds within policy, and securely updates customer payment information.',
  'IT Help Desk':         'An IT help desk agent that guides users through troubleshooting, resets passwords, and escalates unresolved issues with full diagnostics.',
  'Appointment Reminder': 'An appointment reminder agent that proactively contacts customers before their scheduled appointments and handles confirmations or rescheduling.',
}

const currentChipSet = computed(() => chipSets[chipSetIndex.value])

function toggleChipSet() {
  chipSetIndex.value = chipSetIndex.value === 0 ? 1 : 0
}

function selectChip(chip) {
  promptText.value = chipPrompts[chip] || chip
}

async function handleSubmit() {
  if (!promptText.value.trim() || isBuilding.value) return
  isCanceled.value = false
  isBuilding.value = true
  startHeadingCycle()
  document.activeElement?.blur()

  const prompt = promptText.value.trim()

  // Run Claude call and panel exit animation in parallel — wait for both
  const [claudeData] = await Promise.all([
    callClaudeForAgent(prompt),
    new Promise(r => setTimeout(r, 400)),
  ])

  if (isCanceled.value) return
  const nameOverride = agentName.value !== 'New AI Agent' ? agentName.value : null
  state.createAgentFromPrompt(prompt, claudeData, nameOverride)
}

function handleCreateManually() {
  state.createBlankAgent()
}
</script>

<style scoped>
.agent-creation-root {
  position: fixed;
  top: 0;
  left: 50px;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

/* Reuse canvas dotted grid from canvas.css (scoped override) */
.creation-canvas {
  flex: 1;
  position: relative;
  background-color: white;
  background-image: radial-gradient(circle, #d0d0d0 1px, transparent 1px);
  background-size: 15px 15px;
  background-position: 0 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ambient glow */
.ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 660px;
  height: 460px;
  background: linear-gradient(
    135deg,
    #471571,
    #7C229E,
    #E92F6F,
    #FB7328,
    #F3960F,
    #E92F6F,
    #7C229E,
    #471571
  );
  background-size: 300% 300%;
  filter: blur(72px);
  opacity: 0.18;
  pointer-events: none;
  will-change: transform, background-position, border-radius;
  animation: glow-shape 12s ease-in-out infinite, glow-shift 9s ease-in-out infinite;
}

.ambient-glow-2 {
  position: absolute;
  top: 18%;
  left: 12%;
  width: 420px;
  height: 300px;
  background: linear-gradient(
    225deg,
    #2D0B5A,
    #7C229E,
    #C2185B,
    #E92F6F,
    #9C1058,
    #471571,
    #2D0B5A
  );
  background-size: 300% 300%;
  filter: blur(85px);
  opacity: 0.13;
  pointer-events: none;
  will-change: transform, background-position, border-radius;
  animation: glow-shape-2 16s ease-in-out infinite, glow-shift-2 11s ease-in-out infinite;
}

@keyframes glow-shape {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  25% {
    border-radius: 40% 60% 65% 35% / 40% 65% 35% 55%;
    transform: translate(-50%, -50%) scale(1.1) rotate(12deg);
  }
  50% {
    border-radius: 70% 30% 50% 50% / 30% 50% 50% 60%;
    transform: translate(-50%, -50%) scale(0.92) rotate(-8deg);
  }
  75% {
    border-radius: 30% 70% 40% 60% / 65% 35% 65% 35%;
    transform: translate(-50%, -50%) scale(1.08) rotate(5deg);
  }
}

@keyframes glow-shift {
  0%, 100% { background-position: 0% 50%; }
  33%       { background-position: 80% 20%; }
  66%       { background-position: 40% 90%; }
}

@keyframes glow-shape-2 {
  0%, 100% {
    border-radius: 40% 60% 70% 30% / 50% 40% 60% 50%;
    transform: scale(1) rotate(0deg);
  }
  33% {
    border-radius: 65% 35% 40% 60% / 30% 60% 40% 70%;
    transform: scale(1.14) rotate(-12deg);
  }
  66% {
    border-radius: 30% 70% 60% 40% / 70% 30% 50% 50%;
    transform: scale(0.88) rotate(9deg);
  }
}

@keyframes glow-shift-2 {
  0%, 100% { background-position: 100% 0%; }
  33%       { background-position: 20% 80%; }
  66%       { background-position: 60% 30%; }
}

/* Creation panel */
.creation-panel {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 620px;
  padding: 0 24px;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.creation-panel.is-loading .agent-creation-input {
  pointer-events: none;
}

/* Restore pointer events on the send button so hover/click work during loading */
.creation-panel.is-loading .agent-creation-input :deep(.d-btn--circle) {
  pointer-events: auto;
}

.creation-panel.is-loading .chips-wrapper {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 0.35s ease, max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading icon: spinner (default) fades to stop icon on hover — pure CSS, no DOM swap */
.loading-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  overflow: visible;
  pointer-events: auto;
  cursor: pointer;
}

.loading-icon-wrap .send-spinner {
  transition: opacity 0.15s ease;
}

.loading-icon-wrap .stop-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}


.loading-icon-wrap:hover .send-spinner {
  opacity: 0;
}

.loading-icon-wrap:hover .stop-icon {
  opacity: 1;
}

.send-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: send-spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes send-spin {
  to { transform: rotate(360deg); }
}

.heading-fade-enter-active,
.heading-fade-leave-active {
  transition: opacity 0.25s ease;
}

.heading-fade-enter-from,
.heading-fade-leave-to {
  opacity: 0;
}

.creation-heading {
  font-size: 27px;
  font-weight: 510;
  color: #1c1c1c;
  margin: 0 0 8px 0;
  text-align: center;
}

.creation-subtext {
  font-size: 15px;
  color: #535353;
  margin: 0 0 20px 0;
  text-align: center;
}

/* Message input wrapper */
.agent-creation-input {
  width: 572px;
  margin-bottom: 16px;
}

.input-preview-wrapper {
  position: relative;
}

.input-preview-wrapper.is-previewing :deep(.d-rich-text-editor > .ProseMirror p.is-editor-empty:first-child::before) {
  content: none;
}

.chip-hover-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--dt-space-450) var(--dt-space-500) 0;
  color: var(--dt-color-foreground-placeholder);
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.agent-creation-input :deep(.d-recipe-message-input) {
  background: var(--dt-color-surface-primary);
  border-radius: 24px;
}

.agent-creation-input :deep(.d-recipe-message-input__bottom-section) {
  background: var(--dt-color-surface-primary);
  border-radius: 0 0 24px 24px;
}

.agent-creation-input :deep(.d-btn--circle:not([disabled])) {
  background: var(--dt-color-surface-ai);
  background-size: 200% 200%;
  background-position: 70% 70%;
  color: var(--dt-color-neutral-white);
  overflow: hidden;
}

.agent-creation-input :deep(.d-btn--circle[disabled]) {
  background: none !important;
}

/* Chips */
.chips-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-height: 300px;
  overflow: hidden;
  transition: opacity 0.35s ease, max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.chips-row-actions {
  margin-top: 2px;
}

.chips-row-manual {
  margin-top: 4px;
}

.suggestion-chip {
  background: white;
  border: 0.5px solid rgba(28, 28, 28, 0.11);
  border-radius: 40px;
  padding: 8px 12px;
  font-size: 12px;
  color: #1c1c1c;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.15s ease, box-shadow 0.15s ease;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: #f9f9f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.chip-see-more {
  color: #535353;
}

.create-manually-btn {
  background: none;
  border: none;
  font-size: 15px;
  color: #808080;
  text-decoration: underline;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s ease;
}

.create-manually-btn:hover {
  color: #535353;
}

/* Floating controls (shared with canvas.css) */
.floating-control {
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--dt-color-surface-primary, white);
  border: 1px solid var(--dt-color-border-default, #e5e7eb);
  border-radius: var(--dt-size-radius-500, 8px);
  padding: 4px 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.floating-control.top-left {
  top: 16px;
  left: 16px;
}

.floating-control.top-right {
  top: 16px;
  right: 16px;
}

.control-divider {
  width: 1px;
  height: 20px;
  background: var(--dt-color-border-default, #e5e7eb);
  margin: 0 4px;
}

.floating-agent-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.floating-agent-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--dt-color-foreground-primary, #1c1c1c);
}

.agent-name-trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.agent-name-trigger:hover {
  background: var(--dt-color-surface-secondary, #f5f5f5);
}

.agent-name-edit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.agent-name-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--dt-color-foreground-secondary, #535353);
  display: flex;
  align-items: center;
  transition: background 0.15s;
}

.agent-name-action:hover {
  background: var(--dt-color-surface-secondary, #f5f5f5);
}
</style>
