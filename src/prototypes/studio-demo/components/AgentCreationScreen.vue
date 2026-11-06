<template>
  <div class="creation">
    <LeftRail />
    <div
      class="canvas"
      :class="{ 'is-pannable': phase === 'canvas', 'is-panning': panning }"
      :style="canvasStyle"
      @pointerdown="startPan"
      @click.capture="keepClick"
    >
      <div class="ambient-glow" :class="{ 'is-faded': phase === 'canvas' }" />
      <div class="ambient-glow-2" :class="{ 'is-faded': phase === 'canvas' }" />

      <div class="float float--left">
        <button type="button" class="icon-btn" :aria-label="startOnCanvas ? 'Back to agent' : 'Back to AI Agents'" @click="emit('back')">
          <Icon name="arrow-left" :size="16" />
        </button>
        <span class="agent-name">{{ phase === 'canvas' ? agentName : 'New AI Agent' }}</span>
        <span class="draft">Draft</span>
      </div>

      <div class="float float--right">
        <span class="icon-btn"><Icon name="more-vertical" :size="16" /></span>
        <button type="button" class="icon-btn" aria-label="AI Agent Settings" @click="settingsOpen = true">
          <Icon name="settings" :size="16" />
        </button>
        <span class="divider" />
        <button
          v-if="startOnCanvas"
          type="button"
          class="text-btn"
          :disabled="phase !== 'canvas'"
          @click="emit('test')"
        >
          <Icon name="play" :size="12" />
          Test
        </button>
        <span v-else class="text-btn" :class="{ 'is-disabled': phase !== 'canvas' }">
          <Icon name="play" :size="12" />
          Test
        </span>
        <span class="text-btn" :class="{ 'is-disabled': phase !== 'canvas' }">Save</span>
        <span
          class="text-btn"
          :class="phase === 'canvas' ? 'text-btn--outline is-disabled' : 'text-btn--primary is-disabled'"
        >Publish</span>
      </div>

      <div class="panel" :class="{ 'is-building': phase === 'building', 'is-gone': phase === 'canvas' }">
        <Transition name="heading" mode="out-in">
          <h1 :key="heading">{{ heading }}</h1>
        </Transition>
        <Transition name="heading" mode="out-in">
          <p :key="subtext">{{ subtext }}</p>
        </Transition>
        <div class="prompt">
          <span class="prompt-placeholder" :class="{ 'is-value': inputText }">{{ inputText || previewText || 'Describe your AI agent in a conversational manner...' }}</span>
          <button type="button" class="send" :class="{ 'is-ready': inputText }" :aria-disabled="!inputText || phase !== 'edit'" @click="submit">
            <span v-if="phase === 'building'" class="spinner" />
            <Icon v-else name="send" :size="16" />
          </button>
        </div>
        <div class="chips" :class="{ 'is-hidden': phase === 'building' || phase === 'canvas' }">
          <div class="chip-row">
            <button
              v-for="(chip, i) in suggestionChips.slice(0, 3)"
              :key="chip"
              type="button"
              class="chip"
              @mouseenter="hoverChip(i)"
              @mouseleave="leaveChip(i)"
              @click="chooseChip(i)"
            >{{ chip }}</button>
          </div>
          <div class="chip-row">
            <button
              v-for="(chip, i) in suggestionChips.slice(3)"
              :key="chip"
              type="button"
              class="chip"
              @mouseenter="hoverChip(i + 3)"
              @mouseleave="leaveChip(i + 3)"
              @click="chooseChip(i + 3)"
            >{{ chip }}</button>
          </div>
          <div class="chip-row">
            <span class="chip chip--quiet">
              <Icon name="refresh" :size="12" />
              See more examples
            </span>
          </div>
          <button type="button" class="manual">Create manually</button>
        </div>
      </div>

      <AgentCanvas
        v-if="phase === 'canvas'"
        :count="showSkills ? revealedCount : 0"
        :shimmering="shimmering"
        :entering="entering"
        :added="addedSkills"
        :removed="removedSkills"
        :agent-name="agentName"
        :agent-description="agentDescription"
        :pan-x="pan.x"
        :pan-y="pan.y"
        :zoom="zoom"
        :agent-selected="agentDrawerOpen"
        @open-skill="openSkillFromNode"
        @open-agent="openAgentDrawer"
      />

      <AgentDrawer
        v-if="agentDrawerOpen"
        :agent-name="agentName"
        @close="agentDrawerOpen = false"
      />

      <SkillDrawer
        v-if="openSkill"
        :key="openSkill.name"
        :name="openSkill.name"
        :description="openSkill.description"
        :instructions="openSkill.instructions"
        :labels="openSkill.labels"
        :actions="openSkill.actions"
        :generating="guardrailsGenerating && openSkill.name === 'Reschedule Appointments'"
        :guardrails="openSkill.guardrails"
        :instant="skillDrawerInstant"
        @close="closeSkill"
      />

      <AddSkillPopover
        v-if="addPopoverOpen"
        @close="addPopoverOpen = false"
        @create="openCreateSheet"
      />

      <CreateSkillDrawer
        v-if="createSheetOpen"
        @cancel="createSheetOpen = false"
        @created="finishManualSkill"
      />

      <AssistantChat
        v-if="chatOpen"
        :user-text="inputText"
        :agent-name="agentName"
        :skills="liveSkillNames"
        :opening-skills="showSkills ? receptionistSkills : []"
        @close="chatOpen = false"
        @action="onChatAction"
      />

      <div v-if="phase === 'canvas'" class="dock">
        <button
          type="button"
          class="assist"
          :aria-pressed="chatOpen"
          :aria-label="chatOpen ? 'Close assistant' : 'Open assistant'"
          @click="chatOpen = !chatOpen"
        >
          <svg viewBox="0 0 24 24">
            <path d="M10 3H8" />
            <path d="m15.007 5.008 3.987 3.986" />
            <path d="M20 15v4" />
            <path d="M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="M22 17h-4" />
            <path d="M4 5v4" />
            <path d="M6 7H2" />
            <path d="M9 2v2" />
          </svg>
        </button>
        <span class="zoom">
          <button type="button" aria-label="Zoom out" :disabled="zoom <= minZoom" @click="zoomOut">
            <svg viewBox="0 0 16 16"><path d="M3 8h10" /></svg>
          </button>
          <button type="button" aria-label="Zoom in" :disabled="zoom >= maxZoom" @click="zoomIn">
            <svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" /></svg>
          </button>
          <button type="button" aria-label="Recenter canvas" @click="recenterCanvas">
            <svg viewBox="0 0 24 24">
              <path d="m14 10 7-7" />
              <path d="M20 10h-6V4" />
              <path d="m3 21 7-7" />
              <path d="M4 14h6v6" />
            </svg>
          </button>
        </span>
        <button type="button" class="add" aria-label="Add skill" @click="addPopoverOpen = !addPopoverOpen">
          <svg viewBox="0 0 16 16"><path d="M8 3.5v9M3.5 8h9" /></svg>
        </button>
      </div>
    </div>
    <SettingsModal v-if="settingsOpen" @close="settingsOpen = false" />
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import Icon from './Icon.vue'
import LeftRail from './LeftRail.vue'
import AgentCanvas from './AgentCanvas.vue'
import AssistantChat from './AssistantChat.vue'
import SkillDrawer from './SkillDrawer.vue'
import AgentDrawer from './AgentDrawer.vue'
import AddSkillPopover from './AddSkillPopover.vue'
import CreateSkillDrawer from './CreateSkillDrawer.vue'
import SettingsModal from './SettingsModal.vue'
import { canvasDescriptions, chipPrompts, receptionistSkills, skillEditors, suggestionChips } from '../agents.js'

const props = defineProps({
  startOnCanvas: { type: Boolean, default: false },
  initialName: { type: String, default: '' },
})

const emit = defineEmits(['back', 'test'])

const hoveredChip = ref(null)
const selectedChip = ref(null)
const phase = ref(props.startOnCanvas ? 'canvas' : 'edit')
const revealedCount = ref(props.startOnCanvas && props.initialName === 'AI Receptionist' ? 3 : 0)
const shimmering = ref([false, false, false])
const entering = ref([false, false, false])
const chatOpen = ref(false)
const settingsOpen = ref(false)
const addedSkills = ref([])
const removedSkills = ref([])
const nameOverride = ref(props.initialName)
const openSkillName = ref('')
const agentDrawerOpen = ref(false)
const addPopoverOpen = ref(false)
const createSheetOpen = ref(false)
const skillDrawerInstant = ref(false)
const manualSkillName = 'Handle Cancellations'
const pan = ref({ x: 0, y: 0 })
const zoom = ref(1)
const minZoom = 0.5
const maxZoom = 2
const panning = ref(false)
const guardrailsGenerating = ref(false)
const guardrailHtml = ref('')

const guardrailSteps = [
  '<p>Never share personal information with unauthorized parties.</p>',
  '<p>Always verify customer identity before modifying bookings.</p>',
  '<p>Comply with cancellation policy at all times.</p>',
]

const openSkill = computed(() => {
  const name = openSkillName.value
  if (!name) return null
  const known = skillEditors[name]
  const added = addedSkills.value.find((skill) => skill.name === name)
  const editor = known || {
    description: `<p>${added?.description || `Handles ${name.toLowerCase()} requests.`}</p>`,
    instructions: `<p><strong>Understand the request</strong> — Confirm what the customer wants from ${name}.</p><p><strong>Complete the task</strong> — Carry out the request and confirm the result with the customer.</p>`,
    guardrails: '',
    labels: '',
    actions: added?.actions || 0,
  }
  const guardrails = name === 'Reschedule Appointments' ? guardrailHtml.value : editor.guardrails
  return { name, ...editor, guardrails }
})
const timers = []

function later(fn, ms) {
  timers.push(setTimeout(fn, ms))
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
  stopPanListeners()
})

function chipSentence(index) {
  if (!Number.isInteger(index)) return ''
  return chipPrompts[suggestionChips[index]] || ''
}

const inputText = computed(() => chipSentence(selectedChip.value))
const previewText = computed(() => (selectedChip.value == null ? chipSentence(hoveredChip.value) : ''))
const chosenName = computed(() => (
  Number.isInteger(selectedChip.value) ? suggestionChips[selectedChip.value] : 'New AI Agent'
))
const agentName = computed(() => nameOverride.value || chosenName.value)
const agentDescription = computed(() => (
  canvasDescriptions[agentName.value] || canvasDescriptions[chosenName.value] || ''
))
const showSkills = computed(() => agentName.value === 'AI Receptionist')
const liveSkillNames = computed(() => {
  const gone = new Set(removedSkills.value)
  const base = showSkills.value
    ? receptionistSkills.slice(0, revealedCount.value).filter((name) => !gone.has(name))
    : []
  return [...base, ...addedSkills.value.map((skill) => skill.name)]
})
const canvasStyle = computed(() => {
  if (phase.value !== 'canvas') return {}
  const size = 15 * zoom.value
  return {
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${pan.value.x}px ${pan.value.y}px`,
  }
})

function zoomIn() {
  zoom.value = Math.min(maxZoom, Math.round(zoom.value * 1.15 * 100) / 100)
}

function zoomOut() {
  zoom.value = Math.max(minZoom, Math.round(zoom.value / 1.15 * 100) / 100)
}

function recenterCanvas() {
  pan.value = { x: 0, y: 0 }
  zoom.value = 1
}

let dragMoved = false
let panPointer = null
let captureEl = null

function stopPanListeners() {
  window.removeEventListener('pointermove', movePan)
  window.removeEventListener('pointerup', endPan)
  window.removeEventListener('pointercancel', endPan)
}

function startPan(event) {
  if (phase.value !== 'canvas' || event.button !== 0) return
  if (event.target.closest('button, a, input, textarea, .float, .assistant, .drawer, .node, .skill-popover, .zoom')) return
  dragMoved = false
  captureEl = event.currentTarget
  panPointer = {
    x: event.clientX,
    y: event.clientY,
    originX: event.clientX - pan.value.x,
    originY: event.clientY - pan.value.y,
    id: event.pointerId,
  }
  window.addEventListener('pointermove', movePan)
  window.addEventListener('pointerup', endPan)
  window.addEventListener('pointercancel', endPan)
}

function movePan(event) {
  if (!panPointer || event.pointerId !== panPointer.id) return
  const dx = event.clientX - panPointer.x
  const dy = event.clientY - panPointer.y
  if (!panning.value) {
    if (Math.hypot(dx, dy) < 4) return
    panning.value = true
    dragMoved = true
    try { captureEl?.setPointerCapture(event.pointerId) } catch { /* synthetic events have no pointer */ }
  }
  pan.value = {
    x: event.clientX - panPointer.originX,
    y: event.clientY - panPointer.originY,
  }
}

function endPan(event) {
  if (!panPointer || (event && event.pointerId !== panPointer.id)) return
  panPointer = null
  panning.value = false
  captureEl = null
  stopPanListeners()
}

function keepClick(event) {
  if (!dragMoved) return
  event.preventDefault()
  event.stopPropagation()
  dragMoved = false
}

const heading = computed(() => (phase.value === 'building' ? 'Building your agent...' : "Let's get started"))
const subtext = computed(() => (
  phase.value === 'building'
    ? "Great description! We'll take it from here. Hang tight."
    : 'Describe what you want this agent to do.'
))

function hoverChip(index) {
  if (phase.value !== 'edit') return
  hoveredChip.value = index
}

function leaveChip(index) {
  if (hoveredChip.value === index) hoveredChip.value = null
}

function chooseChip(index) {
  if (phase.value !== 'edit') return
  selectedChip.value = index
  hoveredChip.value = null
}

function submit() {
  if (!inputText.value || phase.value !== 'edit') return
  phase.value = 'building'
  later(revealCanvas, 1060)
}

function revealCanvas() {
  phase.value = 'canvas'
  if (!showSkills.value) {
    later(() => { chatOpen.value = true }, 800)
    return
  }
  chatOpen.value = true
  ;[0, 1, 2].forEach((i) => {
    const t0 = 350 + i * 700
    later(() => {
      revealedCount.value = i + 1
      shimmering.value = shimmering.value.map((on, idx) => idx === i || on)
      entering.value = entering.value.map((on, idx) => (idx === i ? true : on))
    }, t0)
    later(() => {
      entering.value = entering.value.map((on, idx) => (idx === i ? false : on))
    }, t0 + 900)
    later(() => {
      shimmering.value = shimmering.value.map((on, idx) => (idx === i ? false : on))
    }, t0 + 1200)
  })
}

function closeSkill() {
  openSkillName.value = ''
  skillDrawerInstant.value = false
}

function openAgentDrawer() {
  openSkillName.value = ''
  agentDrawerOpen.value = true
}

function openSkillFromNode(name) {
  agentDrawerOpen.value = false
  skillDrawerInstant.value = false
  openSkillName.value = name
}

function openCreateSheet() {
  addPopoverOpen.value = false
  createSheetOpen.value = true
}

function finishManualSkill() {
  createSheetOpen.value = false
  agentDrawerOpen.value = false
  addManualSkill()
  skillDrawerInstant.value = true
  openSkillName.value = manualSkillName
}

function addManualSkill() {
  if (liveSkillNames.value.includes(manualSkillName)) return
  const editor = skillEditors[manualSkillName]
  const id = `skill-${Date.now()}`
  const baseCount = showSkills.value ? receptionistSkills.length : liveSkillNames.value.length
  const top = 50 + (baseCount + addedSkills.value.length) * 160
  addedSkills.value = [...addedSkills.value, {
    id,
    name: manualSkillName,
    description: editor.description.replace(/<[^>]+>/g, ''),
    actions: editor.actions,
    left: 420,
    top,
    entering: true,
    shimmer: true,
  }]
  later(() => patchSkill(id, { entering: false }), 900)
  later(() => patchSkill(id, { shimmer: false }), 1200)
}

function patchSkill(id, fields) {
  addedSkills.value = addedSkills.value.map((skill) => (
    skill.id === id ? { ...skill, ...fields } : skill
  ))
}

function onChatAction(action) {
  if (action.type === 'add_skill') {
    if (liveSkillNames.value.includes(action.name)) return
    const id = `skill-${Date.now()}`
    const baseCount = showSkills.value ? receptionistSkills.length : liveSkillNames.value.length
    const top = 50 + (baseCount + addedSkills.value.length) * 160
    addedSkills.value = [...addedSkills.value, {
      id,
      name: action.name,
      description: action.description,
      actions: action.actions || 0,
      left: 420,
      top,
      entering: true,
      shimmer: true,
    }]
    later(() => patchSkill(id, { entering: false }), 900)
    later(() => patchSkill(id, { shimmer: false }), 1200)
  }
  if (action.type === 'remove_skill') {
    if (addedSkills.value.some((skill) => skill.name === action.name)) {
      addedSkills.value = addedSkills.value.filter((skill) => skill.name !== action.name)
    } else {
      removedSkills.value = [...removedSkills.value, action.name]
    }
  }
  if (action.type === 'rename_agent') nameOverride.value = action.name
  if (action.type === 'add_guardrails') {
    if (action.phase === 'start') {
      guardrailsGenerating.value = true
      return
    }
    if (guardrailHtml.value) return
    let html = ''
    guardrailSteps.forEach((step, i) => {
      later(() => {
        html += step
        guardrailHtml.value = html
        if (i === guardrailSteps.length - 1) guardrailsGenerating.value = false
      }, i * 400)
    })
  }
}
</script>

<style scoped>
.creation {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.canvas {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #fff;
  background-image: radial-gradient(circle, #d0d0d0 1px, transparent 1px);
  background-size: 15px 15px;
}

.canvas.is-pannable {
  cursor: grab;
}

.canvas.is-panning {
  cursor: grabbing;
  user-select: none;
}

.ambient-glow,
.ambient-glow-2 {
  position: absolute;
  pointer-events: none;
  background-size: 300% 300%;
  transition: opacity 0.6s ease;
}

.ambient-glow.is-faded,
.ambient-glow-2.is-faded {
  opacity: 0;
}

.ambient-glow {
  top: 50%;
  left: 50%;
  width: 660px;
  height: 460px;
  background-image: linear-gradient(135deg, #471571, #7c229e, #e92f6f, #fb7328, #f3960f, #e92f6f, #7c229e, #471571);
  filter: blur(72px);
  opacity: 0.18;
  animation: glow-shape 12s ease-in-out infinite, glow-shift 9s ease-in-out infinite;
}

.ambient-glow-2 {
  top: 18%;
  left: 12%;
  width: 420px;
  height: 300px;
  background-image: linear-gradient(225deg, #2d0b5a, #7c229e, #c2185b, #e92f6f, #9c1058, #471571, #2d0b5a);
  filter: blur(85px);
  opacity: 0.13;
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
  33% { background-position: 80% 20%; }
  66% { background-position: 40% 90%; }
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
  33% { background-position: 20% 80%; }
  66% { background-position: 60% 30%; }
}

.float {
  position: absolute;
  z-index: 2;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: default;
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.float--left { left: 16px; }
.float--right { right: 16px; }

.agent-name {
  padding: 2px 4px;
  font-size: 13px;
  font-weight: 500;
  color: #1c1c1c;
}

.draft {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f9f9f9;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.icon-btn,
.text-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  color: #3a3a3a;
  font-size: 12px;
  font-weight: 600;
  border: 0;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
}

button.text-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.icon-btn {
  width: 28px;
}

.text-btn {
  padding: 0 8px;
}

.text-btn--primary {
  background: #7c52ff;
  color: #fff;
  border-radius: 6px;
}

.text-btn--outline {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  color: #9a9a9a;
}

.is-disabled {
  opacity: 0.5;
}

.divider {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: #e5e7eb;
}

.panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 620px;
  padding: 0 24px;
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s ease;
}

.panel.is-gone {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  visibility: hidden;
}

.heading-enter-active,
.heading-leave-active {
  transition: opacity 0.25s ease;
}

.heading-enter-from,
.heading-leave-to {
  opacity: 0;
}

h1 {
  margin: 0 0 8px;
  font-size: 27px;
  font-weight: 510;
  line-height: 1.2;
  color: #1c1c1c;
  text-align: center;
}

p {
  margin: 0 0 20px;
  font-size: 15px;
  color: #535353;
  text-align: center;
}

.prompt {
  position: relative;
  width: 100%;
  max-width: 572px;
  min-height: 96px;
  margin-bottom: 16px;
  padding: 16px 56px 16px 20px;
  background: #fff;
  border: 1px solid rgba(28, 28, 28, 0.12);
  border-radius: 24px;
  box-sizing: border-box;
}

.prompt-placeholder {
  color: #9a9a9a;
  font-size: 15px;
  line-height: 1.4;
}

.prompt-placeholder.is-value {
  color: #1c1c1c;
}

.send {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #c4c4c4;
}

.send {
  cursor: default;
}

.send.is-ready {
  background: #7c52ff;
  color: #fff;
  cursor: pointer;
}

.send.is-ready[aria-disabled='true'] {
  cursor: default;
}

.send.is-ready:active:not([aria-disabled='true']) {
  transform: scale(0.92);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: send-spin 0.7s linear infinite;
}

@keyframes send-spin {
  to { transform: rotate(360deg); }
}

.chips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-height: 240px;
  overflow: hidden;
  transition: opacity 0.35s ease, max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.chips.is-hidden {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #fff;
  border: 0.5px solid rgba(28, 28, 28, 0.11);
  border-radius: 40px;
  color: #1c1c1c;
  font-size: 12px;
  white-space: nowrap;
}

.chip:hover {
  background: #f9f9f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.chip:active {
  background: #f3f3f3;
  transform: scale(0.98);
}

.chip--quiet {
  color: #535353;
}

.manual {
  margin-top: 4px;
  padding: 4px 0;
  background: none;
  border: none;
  color: #808080;
  font-size: 15px;
  text-decoration: underline;
  cursor: default;
}

.dock {
  position: absolute;
  z-index: 2;
  right: 0;
  bottom: 0;
  left: 0;
  height: 80px;
  pointer-events: none;
  animation: dock-in 0.45s ease;
}

@keyframes dock-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.assist,
.add,
.zoom {
  position: absolute;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assist {
  left: 16px;
  z-index: 5;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  color: #fff;
  pointer-events: auto;
  cursor: pointer;
}

.assist svg,
.add svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.add svg { stroke-width: 1.6; }
.assist svg { stroke-width: 2; }

.zoom {
  left: 80px;
  gap: 0;
  padding: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
  pointer-events: auto;
}

.zoom button {
  display: flex;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.zoom button:hover {
  background: rgba(28, 28, 28, 0.06);
}

.zoom button:disabled {
  opacity: 0.35;
  cursor: default;
}

.zoom svg {
  width: 32px;
  height: 32px;
  padding: 6px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  box-sizing: border-box;
}

.zoom button:last-child svg {
  stroke-width: 2;
}

.canvas :deep(.world) {
  transition: transform 0.2s ease;
}

.canvas.is-panning :deep(.world) {
  transition: none;
}

.add {
  right: 16px;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #9358ff;
  box-shadow: 0 4px 12px rgba(147, 88, 255, 0.3);
  color: #fff;
  pointer-events: auto;
  cursor: pointer;
}
</style>
