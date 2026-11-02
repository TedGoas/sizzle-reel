<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button type="button" class="close" aria-label="Close settings" @click="emit('close')">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3 3 9" /></svg>
      </button>

      <h2 id="settings-title">AI Agent Settings</h2>

      <div class="content">
        <nav class="nav" aria-label="Settings sections">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="nav-item"
            :class="{ 'is-selected': item.id !== 'language' && section === item.id }"
            :aria-current="item.id !== 'language' && section === item.id ? 'page' : undefined"
            @click="item.id !== 'language' && (section = item.id)"
          >{{ item.label }}</button>
          <div class="nav-footer">
            <p class="version">Version 01.01.20a</p>
            <a href="#" class="feedback" @click.prevent>Send feedback</a>
          </div>
        </nav>

        <div class="body">
          <div v-show="section === 'general'" class="panel">
            <label class="field">
              <span class="label">Company name</span>
              <span class="hint">The name of the company or organization where your agent will work. Maximum 50 characters</span>
              <input v-model="companyName" class="text-input" type="text" maxlength="50" />
            </label>

            <div class="field">
              <span class="label">Company description</span>
              <span class="hint">A brief overview of the company your agent will work for, including its purpose, industry, and approach. Use the AI Rewrite tool to refine or enhance your description.</span>
              <div class="editor editor--desc">
                <EditorBar />
                <div ref="descriptionEl" class="editor-body" contenteditable="true"></div>
                <div class="editor-actions">
                  <button type="button" class="rewrite">
                    <svg viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M7 1.2 7.7 4l2.8.4-2.1 1.8.6 2.7L7 7.5 4 8.9l.6-2.7L2.5 4.4 5.3 4 7 1.2Z" />
                      <path d="M11.2 8.2 11.5 9.4l1.2.2-1 .7.3 1.2-1-.6-1 .6.3-1.2-1-.7 1.2-.2.5-1.2Z" />
                    </svg>
                    Rewrite
                  </button>
                </div>
              </div>
            </div>

            <div class="field">
              <span class="label">Tone and voice</span>
              <span class="hint">Select how your agent should communicate to your customers.</span>
              <div class="tone-row">
                <span class="select-wrap">
                  <select v-model="tone" class="text-input select">
                    <option>Amanda - Professional and friendly</option>
                    <option>Jordan - Warm and concise</option>
                    <option>Morgan - Calm and direct</option>
                  </select>
                  <Icon name="chevron-down" :size="14" />
                </span>
                <button type="button" class="play" aria-label="Preview voice">
                  <Icon name="play" :size="18" />
                </button>
              </div>
            </div>

            <div class="field">
              <span class="label">Select background noise</span>
              <span class="hint">Select the background noise customers will hear during quiet moments.</span>
              <span class="select-wrap">
                <select v-model="noise" class="text-input select">
                  <option>None</option>
                  <option>Office</option>
                  <option>Cafe</option>
                </select>
                <Icon name="chevron-down" :size="14" />
              </span>
              <div class="volume" aria-disabled="true">
                <span class="volume-label">Volume:</span>
                <span class="slider" aria-hidden="true">
                  <span class="rail" />
                  <span class="fill" />
                  <span class="knob" />
                </span>
                <span class="vol-value">50</span>
              </div>
            </div>
          </div>

          <div v-show="section === 'transfers'" class="panel">
            <div class="field">
              <span class="label">Default transfers</span>
              <span class="hint">Default transfer for one or both channels to be used by this AI agent when it needs human support.</span>
            </div>

            <fieldset class="channel">
              <legend>Digital</legend>
              <label v-for="option in digitalOptions" :key="option" class="radio">
                <input v-model="digital" type="radio" name="digital-transfer" :value="option" />
                <span class="radio-face" aria-hidden="true" />
                <span>{{ option }}</span>
              </label>
            </fieldset>

            <fieldset class="channel">
              <legend>Voice</legend>
              <label v-for="option in voiceOptions" :key="option" class="radio">
                <input v-model="voice" type="radio" name="voice-transfer" :value="option" />
                <span class="radio-face" aria-hidden="true" />
                <span>{{ option }}</span>
              </label>
            </fieldset>

            <div class="field">
              <span class="label">Transfer instructions</span>
              <span class="hint">Define when the agent should transfer a conversation and where it should be routed. Type / to add a transfer endpoint.</span>
              <div class="editor">
                <EditorBar slash />
                <div ref="instructionsEl" class="editor-body editor-body--muted" contenteditable="true"></div>
              </div>
            </div>
          </div>

          <div v-show="section === 'context'" class="panel">
            <div class="field">
              <span class="label">Handoff context ({{ items.length }})</span>
              <span class="hint">Choose and reorder the information shared during a handoff. The top three items appear in the incoming session card, while all available items are shown in the session details panel.</span>
            </div>

            <div class="context-tools">
              <div class="tool-group">
                <input v-model="query" class="text-input search" type="search" placeholder="Search variables" />
                <button type="button" class="filter">
                  All types
                  <Icon name="chevron-down" :size="14" />
                </button>
              </div>
              <button type="button" class="custom">
                <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2.5v9M2.5 7h9" /></svg>
                Custom context
              </button>
            </div>

            <div ref="listEl" class="handoff-list">
              <article
                v-for="(item, index) in items"
                :key="item.id"
                class="handoff-card"
                :class="{ 'is-dragging': draggingId === item.id }"
                :data-id="item.id"
                @pointerdown="startDrag($event, item.id)"
              >
                <div class="handoff-main">
                  <div class="handoff-title">
                    <span class="num">{{ index + 1 }}.</span>
                    <span>{{ item.name }}</span>
                    <span v-if="item.badge" class="badge">{{ item.badge }}</span>
                  </div>
                  <p v-if="item.chips" class="handoff-text">
                    Get the
                    <span class="chip"><span class="chip-mark">{x}</span> Ticket number</span>
                    and
                    <span class="chip"><span class="chip-mark">{x}</span> Ticket status</span>
                    .
                  </p>
                  <p v-else class="handoff-text">{{ item.text }}</p>
                </div>
                <button
                  type="button"
                  class="toggle"
                  :class="{ 'is-on': item.on }"
                  role="switch"
                  :aria-checked="item.on"
                  :aria-label="`${item.on ? 'Disable' : 'Enable'} ${item.name}`"
                  @pointerdown.stop
                  @click="item.on = !item.on"
                >
                  <svg v-if="item.on" class="check" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2 4.7 8.4 9.5 3.6" /></svg>
                  <span class="toggle-knob" />
                </button>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="line"
      class="drop-line"
      :style="{ top: `${line.top}px`, left: `${line.left}px`, width: `${line.width}px` }"
    />
    <div
      v-if="ghost"
      class="handoff-card handoff-ghost"
      :style="{ top: `${ghost.top}px`, left: `${ghost.left}px`, width: `${ghost.width}px` }"
      aria-hidden="true"
    >
      <div class="handoff-main">
        <div class="handoff-title">
          <span class="num">{{ ghost.index + 1 }}.</span>
          <span>{{ ghost.item.name }}</span>
          <span v-if="ghost.item.badge" class="badge">{{ ghost.item.badge }}</span>
        </div>
        <p v-if="ghost.item.chips" class="handoff-text">
          Get the
          <span class="chip"><span class="chip-mark">{x}</span> Ticket number</span>
          and
          <span class="chip"><span class="chip-mark">{x}</span> Ticket status</span>
          .
        </p>
        <p v-else class="handoff-text">{{ ghost.item.text }}</p>
      </div>
      <span class="toggle" :class="{ 'is-on': ghost.item.on }">
        <svg v-if="ghost.item.on" class="check" viewBox="0 0 12 12"><path d="M2.5 6.2 4.7 8.4 9.5 3.6" /></svg>
        <span class="toggle-knob" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Icon from './Icon.vue'
import EditorBar from './SettingsEditorBar.vue'

const emit = defineEmits(['close'])

const navItems = [
  { id: 'general', label: 'General' },
  { id: 'transfers', label: 'Default Transfers' },
  { id: 'context', label: 'Transfer Context' },
  { id: 'language', label: 'Language' },
]

const section = ref('general')
const companyName = ref('Aerolabs')
const tone = ref('Amanda - Professional and friendly')
const noise = ref('None')
const digital = ref('Agents')
const voice = ref('Operators')
const query = ref('')
const descriptionEl = ref(null)
const instructionsEl = ref(null)
const listEl = ref(null)
const draggingId = ref(null)
const ghost = ref(null)
const line = ref(null)
const dropIndex = ref(null)

const digitalOptions = ['Agents', 'Contact Center', 'Team member']
const voiceOptions = ['Operators', 'Voicemail', 'Groups', 'Team member', 'Room phone/External number']

const items = ref([
  { id: 'ticket', name: 'Ticket', badge: 'Custom', chips: true, on: true },
  { id: 'reason', name: 'Reason for contact', on: true, text: 'one or two-sentence summary that immediately answers the agent\'s first question: "Why is this customer reaching out?"' },
  { id: 'escalation', name: 'Escalation reason', on: true, text: 'Why the bot could not handle the request and had to transfer' },
  { id: 'account', name: 'Customer account ID', on: true, text: 'This could be an account number, member ID, policy number, or user ID. Optional if not provided by user.' },
  { id: 'skills', name: 'Skills triggered', on: true, text: 'List of the skills triggered during the conversation with the bot.' },
  { id: 'steps', name: 'Troubleshooting steps', on: true, text: 'To prevent customer frustration, the agent needs to know exactly what the bot and the customer have already tried to do.' },
  { id: 'sentiment', name: 'Customer sentiment', on: true, text: 'Detected emotional state of the customer. Values: frustrated · angry · confused · neutral · satisfied.' },
  { id: 'auth', name: 'Authentication status', on: true, text: 'Identity verification result. Values: passed · failed · skipped · pending' },
  { id: 'outcome', name: 'Desired Outcome', on: true, text: 'The customer\'s stated goal — what a successful resolution looks like to them.' },
  { id: 'product', name: 'Product service', on: true, text: 'The specific product or service the issue relates to.' },
  { id: 'contact', name: 'Additional Contact', on: true, text: 'Contact details voluntarily provided by the customer during the session. Fields: email, phone' },
])

let drag = null

function onKey(event) {
  if (event.key === 'Escape') emit('close')
}

function startDrag(event, id) {
  if (event.button !== 0) return
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const from = items.value.findIndex((item) => item.id === id)
  drag = {
    id,
    from,
    startY: event.clientY,
    active: false,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    width: rect.width,
  }
  window.addEventListener('pointermove', moveDrag)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
}

function insertionIndex(clientY) {
  const cards = [...listEl.value.querySelectorAll('.handoff-card:not(.handoff-ghost)')]
  let insertAt = cards.length
  for (let i = 0; i < cards.length; i += 1) {
    if (cards[i].dataset.id === drag.id) continue
    const rect = cards[i].getBoundingClientRect()
    if (clientY < rect.top + rect.height / 2) {
      insertAt = i
      break
    }
  }
  return insertAt
}

function placeLine(insertAt) {
  const cards = [...listEl.value.querySelectorAll('.handoff-card:not(.handoff-ghost)')]
  const listRect = listEl.value.getBoundingClientRect()
  let top
  if (insertAt <= 0) top = cards[0].getBoundingClientRect().top - 5
  else if (insertAt >= cards.length) top = cards[cards.length - 1].getBoundingClientRect().bottom + 3
  else {
    const above = cards[insertAt - 1].getBoundingClientRect()
    const below = cards[insertAt].getBoundingClientRect()
    top = (above.bottom + below.top) / 2 - 1
  }
  return { top, left: listRect.left, width: listRect.width }
}

function moveDrag(event) {
  if (!drag || !listEl.value) return
  if (!drag.active) {
    if (Math.abs(event.clientY - drag.startY) < 4) return
    drag.active = true
    draggingId.value = drag.id
    ghost.value = {
      top: event.clientY - drag.offsetY,
      left: event.clientX - drag.offsetX,
      width: drag.width,
      index: drag.from,
      item: { ...items.value[drag.from] },
    }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }
  ghost.value.top = event.clientY - drag.offsetY
  ghost.value.left = event.clientX - drag.offsetX
  const insertAt = insertionIndex(event.clientY)
  const sameSlot = insertAt === drag.from || insertAt === drag.from + 1
  dropIndex.value = sameSlot ? null : insertAt
  line.value = sameSlot ? null : placeLine(insertAt)
}

function endDrag(event) {
  if (event?.type === 'pointerup' && drag?.active && dropIndex.value != null) {
    const from = items.value.findIndex((item) => item.id === drag.id)
    let to = dropIndex.value
    if (to > from) to -= 1
    if (from >= 0 && to !== from) {
      const [moved] = items.value.splice(from, 1)
      items.value.splice(to, 0, moved)
    }
  }
  drag = null
  draggingId.value = null
  ghost.value = null
  line.value = null
  dropIndex.value = null
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  window.removeEventListener('pointermove', moveDrag)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
}

onMounted(() => {
  if (descriptionEl.value) {
    descriptionEl.value.textContent = 'Aerolabs is a cutting-edge technology company specializing in innovative aerospace solutions. We design and develop advanced drone systems and AI-powered flight software to revolutionize air mobility and data collection worldwide.'
  }
  if (instructionsEl.value) {
    instructionsEl.value.innerHTML = '<p>Example:</p><ol><li>When a customer wants to speak with a live agent or requests immediate help, use /transfer-to-agent</li><li>For questions about billing, payments, or account charges, use /transfer-to-billing</li><li>If a customer reports a problem or needs technical assistance, use /transfer-to-support</li></ol>'
  }
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  endDrag()
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 30;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(28, 28, 28, 0.4);
}

.dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: min(1040px, 100%);
  height: min(820px, 100%);
  padding: 32px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
}

.close {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  color: #3a3a3a;
}

.close:hover {
  background: rgba(28, 28, 28, 0.06);
}

.close svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

h2 {
  margin: 0;
  color: #3a3a3a;
  font-size: 27px;
  font-weight: 560;
  line-height: 1.2;
}

.content {
  display: flex;
  flex: 1;
  gap: 24px;
  min-height: 0;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 200px;
  flex-shrink: 0;
}

.nav-item {
  padding: 8px 12px;
  border-radius: 8px;
  color: #3a3a3a;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
}

.nav-item.is-selected {
  background: rgba(28, 28, 28, 0.14);
  color: #1c1c1c;
}

.nav-item:hover:not(.is-selected) {
  background: rgba(28, 28, 28, 0.05);
}

.nav-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
}

.version {
  margin: 0;
  color: rgba(34, 34, 34, 0.5);
  font-size: 12px;
  line-height: 1.2;
}

.feedback {
  color: #7c52ff;
  font-size: 15px;
  line-height: 1.6;
  text-decoration: underline;
}

.body {
  flex: 1;
  min-width: 0;
  overflow: auto;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field,
.channel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.label,
legend {
  color: #3a3a3a;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.hint {
  color: #535353;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

.text-input {
  width: 100%;
  margin-top: 4px;
  padding: 8px 12px;
  border: 1px solid rgba(28, 28, 28, 0.17);
  border-radius: 8px;
  background: rgba(28, 28, 28, 0.02);
  color: #3a3a3a;
  font-size: 15px;
  line-height: 1.2;
}

.select-wrap {
  position: relative;
  display: block;
}

.select-wrap .select {
  appearance: none;
  padding-right: 32px;
}

.select-wrap :deep(svg) {
  position: absolute;
  top: calc(50% + 2px);
  right: 10px;
  color: #3a3a3a;
  pointer-events: none;
  transform: translateY(-50%);
}

.tone-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tone-row .select-wrap {
  flex: 1;
}

.play {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #7c52ff;
}

.play:hover {
  background: rgba(124, 82, 255, 0.08);
}

.volume {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  opacity: 0.5;
  pointer-events: none;
}

.volume-label {
  color: #3a3a3a;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}

.slider {
  position: relative;
  flex: 1;
  height: 12px;
}

.rail,
.fill {
  position: absolute;
  top: 4px;
  height: 4px;
  border-radius: 100px;
}

.rail {
  right: 0;
  left: 0;
  background: #e9e9e9;
}

.fill {
  width: 50%;
  background: #7c52ff;
}

.knob {
  position: absolute;
  top: 0;
  left: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  border: 1.5px solid #f9f9f9;
  border-radius: 7px;
  background: #7c52ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.vol-value {
  width: 45px;
  padding: 8px 0;
  border: 1px solid rgba(28, 28, 28, 0.17);
  border-radius: 8px;
  background: rgba(28, 28, 28, 0.02);
  color: #808080;
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
}

.channel {
  gap: 8px;
}

.radio {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  cursor: pointer;
}

.radio input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.radio-face {
  position: relative;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 4px;
  border: 1px solid rgba(28, 28, 28, 0.3);
  border-radius: 50%;
  background: rgba(28, 28, 28, 0.02);
}

.radio input:checked + .radio-face {
  border-color: #7c52ff;
  background: #f9f9f9;
}

.radio input:checked + .radio-face::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  border: 2px solid #f9f9f9;
  border-radius: 50%;
  background: #7c52ff;
  box-sizing: border-box;
}

.radio input:focus-visible + .radio-face {
  outline: 2px solid #7c52ff;
  outline-offset: 2px;
}

.editor {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
  overflow: hidden;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 8px;
  background: #fff;
}

.editor--desc {
  max-height: 240px;
  overflow: auto;
}

.editor-body {
  flex: 1;
  min-height: 72px;
  padding: 8px 16px;
  color: #1c1c1c;
  font-size: 15px;
  line-height: 1.4;
  outline: none;
}

.editor-body--muted {
  min-height: 140px;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.6;
}

.editor-body--muted :deep(ol) {
  margin: 0;
  padding-left: 22px;
  list-style: decimal;
}

.editor-body--muted :deep(p) {
  margin: 0;
}

.editor-actions {
  display: flex;
  padding: 2px 8px 4px;
}

.rewrite {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  border-radius: 8px;
  color: #3a3a3a;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.rewrite:hover {
  background: rgba(28, 28, 28, 0.05);
}

.rewrite svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.context-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.search {
  width: 230px;
  margin-top: 0;
  color: #3a3a3a;
  font-size: 12px;
}

.search::placeholder {
  color: #808080;
}

.filter {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 8px 8px 12px;
  border: 1px solid rgba(28, 28, 28, 0.17);
  border-radius: 8px;
  color: #3a3a3a;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.custom {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  border-radius: 8px;
  color: #3a3a3a;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.custom:hover,
.filter:hover {
  background: rgba(28, 28, 28, 0.05);
}

.custom svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}

.handoff-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drop-line {
  position: fixed;
  z-index: 3;
  height: 2px;
  border-radius: 2px;
  background: rgba(28, 28, 28, 0.2);
  pointer-events: none;
}

.handoff-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 12px;
  background: #fff;
  cursor: grab;
  touch-action: none;
}

.handoff-card.is-dragging {
  opacity: 0.35;
}

.handoff-ghost {
  position: fixed;
  z-index: 2;
  opacity: 0.8;
  cursor: grabbing;
  pointer-events: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.handoff-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.handoff-title {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3a3a3a;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.num {
  width: 22px;
  flex-shrink: 0;
}

.badge {
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(28, 28, 28, 0.1);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.25px;
  line-height: 18px;
}

.handoff-text {
  margin: 0;
  color: #1c1c1c;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 2px;
  padding: 1px 6px 1px 2px;
  border-radius: 999px;
  background: rgba(28, 28, 28, 0.1);
  vertical-align: baseline;
}

.chip-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 14px;
  color: #3a3a3a;
  font-size: 9px;
  font-weight: 700;
}

.toggle {
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #d5d5d5;
  cursor: pointer;
}

.toggle.is-on {
  background: #7c52ff;
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}

.toggle.is-on .toggle-knob {
  transform: translateX(16px);
}

.check {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
