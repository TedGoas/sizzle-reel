<template>
  <aside class="drawer" :class="{ 'is-open': entered, 'is-resizing': resizing }" :style="{ width: `${width}px` }">
    <button
      type="button"
      class="resize-handle"
      aria-label="Resize agent drawer"
      @pointerdown="startResize"
    />
    <div class="sheet">
      <header class="sheet-header">
        <div class="crumb">
          <span class="crumb-title crumb-title--agent">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <path d="M20 2v4" />
              <path d="M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </svg>
            AI Agent
          </span>
          <span class="crumb-actions">
            <button type="button" class="icon-close" aria-label="Close agent" @click="emit('close')">
              <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3 3 9" /></svg>
            </button>
          </span>
        </div>
      </header>

      <div class="sheet-body">
        <section class="field">
          <label class="field-label" for="agent-company">Company name</label>
          <p class="field-hint">The name of your company or brand.</p>
          <input id="agent-company" v-model="companyName" class="text-input text-input--tight" type="text" maxlength="50" />
        </section>

        <section class="field">
          <label class="field-label" for="agent-company-desc">Describe your company</label>
          <p class="field-hint">Briefly describe what your company does and the customers it serves.</p>
          <textarea id="agent-company-desc" v-model="companyDescription" class="text-area" rows="3" />
        </section>

        <section class="field">
          <label class="field-label" for="agent-name">Name your agent</label>
          <p class="field-hint">The name your agent uses to introduce itself. 1 to 20 characters.</p>
          <input id="agent-name" v-model="name" class="text-input text-input--tight" type="text" maxlength="20" />
        </section>

        <section class="field">
          <div class="field-label">Describe your agent's tasks</div>
          <p class="field-hint">Outline what this agent handles for customers. Type <kbd class="slash-hint">/</kbd> to add a workflow.</p>
          <div class="editor editor--mid">
            <EditorToolbar />
            <div class="editor-body" contenteditable="true" v-html="agentSettings.tasks" @keydown="onEditorKeydown"></div>
          </div>
        </section>

        <section class="field">
          <label class="field-label" for="agent-voice">Select tone and voice</label>
          <p class="field-hint">Choose how your agent sounds.</p>
          <div class="select-row">
            <select id="agent-voice" v-model="voice" class="custom-select field-select">
              <option v-for="option in voiceOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
            <button
              type="button"
              class="icon-btn"
              :class="{ 'is-playing': playing }"
              :aria-label="playing ? 'Stop voice sample' : 'Play voice sample'"
              :aria-pressed="playing"
              @click="togglePreview"
            >
              <Icon :name="playing ? 'pause' : 'play'" :size="16" />
            </button>
          </div>
        </section>

        <section class="field">
          <label class="field-label" for="agent-greeting">Write a greeting message</label>
          <p class="field-hint">The first thing customers hear when the conversation starts.</p>
          <textarea id="agent-greeting" v-model="greeting" class="text-area" rows="4" />
        </section>

        <section class="field">
          <label class="field-label" for="agent-knowledge">Add a knowledge base</label>
          <p class="field-hint">Pick the source your agent uses to answer questions.</p>
          <select id="agent-knowledge" v-model="knowledgeBase" class="custom-select field-select">
            <option v-for="option in knowledgeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </section>

        <section class="field">
          <div class="field-label">Transfer instructions</div>
          <p class="field-hint">Say when to transfer a conversation and where it goes. Type <kbd class="slash-hint">/</kbd> to add a transfer.</p>
          <div class="editor editor--mid">
            <EditorToolbar />
            <div class="editor-body" contenteditable="true" v-html="agentSettings.transfers" @keydown="onEditorKeydown"></div>
          </div>
        </section>

        <section class="field">
          <div class="field-label">Transfer fallback</div>
          <p class="field-hint">Where conversations go when no transfer rule matches.</p>
          <div class="fallback-groups">
            <fieldset class="fallback-group">
              <legend class="fallback-label">Digital</legend>
              <label v-for="option in fallbackOptions.digital" :key="option.value" class="radio">
                <input v-model="fallbackDigital" type="radio" name="fallback-digital" :value="option.value" />
                {{ option.label }}
              </label>
            </fieldset>
            <fieldset class="fallback-group">
              <legend class="fallback-label">Voice</legend>
              <label v-for="option in fallbackOptions.voice" :key="option.value" class="radio">
                <input v-model="fallbackVoice" type="radio" name="fallback-voice" :value="option.value" />
                {{ option.label }}
              </label>
            </fieldset>
          </div>
        </section>
      </div>

      <footer class="sheet-footer">
        <button type="button" class="btn btn--quiet" @click="emit('close')">Cancel</button>
        <button type="button" class="btn btn--primary" @click="emit('close')">Save</button>
      </footer>
    </div>
    <SlashMenu ref="slashMenu" />
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import EditorToolbar from './EditorToolbar.vue'
import SlashMenu from './SlashMenu.vue'
import Icon from './Icon.vue'
import {
  TIMING,
  agentSettings,
  company,
  fallbackOptions,
  knowledgeOptions,
  voiceOptions,
} from '../mock/agentData.js'

const props = defineProps({
  agentName: { type: String, default: '' },
})

const emit = defineEmits(['close'])
const baseWidth = 468
const entered = ref(false)
const slashMenu = ref(null)
const width = ref(baseWidth)
const resizing = ref(false)
let resizeStart = null

// Presentation only: local copies so the fields can be edited.
const companyName = ref(company.name)
const companyDescription = ref(company.description)
const name = ref(props.agentName)
const voice = ref(agentSettings.voice)
const greeting = ref(agentSettings.greeting)
const knowledgeBase = ref(agentSettings.knowledgeBase)
const fallbackDigital = ref(agentSettings.fallbackDigital)
const fallbackVoice = ref(agentSettings.fallbackVoice)

const playing = ref(false)
let previewTimer = null

function togglePreview() {
  clearTimeout(previewTimer)
  playing.value = !playing.value
  if (playing.value) {
    previewTimer = setTimeout(() => { playing.value = false }, TIMING.voicePreview)
  }
}

function startResize(event) {
  if (event.button !== 0) return
  resizing.value = true
  resizeStart = { x: event.clientX, width: width.value }
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('pointermove', moveResize)
  document.addEventListener('pointerup', endResize)
  document.addEventListener('pointercancel', endResize)
  event.preventDefault()
}

function moveResize(event) {
  if (!resizeStart) return
  const next = resizeStart.width + (resizeStart.x - event.clientX)
  width.value = Math.min(baseWidth * 2, Math.max(baseWidth, next))
}

function endResize() {
  if (!resizeStart) return
  resizeStart = null
  resizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('pointermove', moveResize)
  document.removeEventListener('pointerup', endResize)
  document.removeEventListener('pointercancel', endResize)
}

function onEditorKeydown(event) {
  slashMenu.value?.onKeydown(event)
}

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { entered.value = true })
  })
})

onUnmounted(() => {
  clearTimeout(previewTimer)
  endResize()
})
</script>

<style scoped>
.drawer {
  position: absolute;
  z-index: 6;
  top: 16px;
  right: 16px;
  bottom: 16px;
  width: 468px;
  cursor: default;
  transform: translateX(calc(100% + 32px));
  transition: transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.drawer.is-open {
  transform: translateX(0);
}

.resize-handle {
  position: absolute;
  z-index: 2;
  top: 24px;
  bottom: 24px;
  left: -4px;
  width: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: col-resize;
  touch-action: none;
}

.resize-handle::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 4px;
  width: 2px;
  border-radius: 2px;
  background: transparent;
}

.resize-handle:hover::after,
.drawer.is-resizing .resize-handle::after {
  background: rgba(28, 28, 28, 0.2);
}

.sheet {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 24px;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.03);
}

.sheet-header {
  flex-shrink: 0;
  padding: 16px;
}

.crumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 8px 0 15px;
  background: #f9f9f9;
  border-radius: 12px;
}

.crumb-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 590;
  line-height: 24px;
}

.crumb-title svg {
  width: 16px;
  height: 16px;
  fill: #f5a623;
}

.crumb-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3a3a3a;
}

.count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  color: #3a3a3a;
  font-size: 13px;
  font-weight: 590;
}

.count svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.crumb-divider {
  width: 1px;
  height: 16px;
  background: rgba(28, 28, 28, 0.12);
}

.icon-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #666;
  cursor: pointer;
}

.icon-close svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

.sheet-body {
  flex: 1;
  min-height: 0;
  padding: 0 16px 88px;
  overflow-x: hidden;
  overflow-y: auto;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field-label {
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 590;
  line-height: 21px;
}

.field-label span {
  color: #999;
  font-weight: 400;
}

.field-hint {
  margin: 0 0 8px;
  color: #808080;
  font-size: 12px;
  line-height: 1.4;
}

.text-input {
  height: 32px;
  margin-top: 8px;
  padding: 0 12px;
  border: 1px solid rgba(28, 28, 28, 0.16);
  border-radius: 8px;
  background: #fff;
  color: #1c1c1c;
  font: inherit;
  font-size: 15px;
}

.text-input:focus {
  outline: 2px solid rgba(124, 82, 255, 0.35);
  border-color: #7c52ff;
}

.editor {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(28, 28, 28, 0.16);
  border-radius: 12px;
}

.editor--short { height: 120px; }
.editor--tall { height: 365px; }
.editor--mid { height: 160px; }

.building {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 6px 10px;
  border: 1px solid rgba(28, 28, 28, 0.1);
  border-radius: 6px;
  background: #f9f9f9;
  color: #3a3a3a;
  font-size: 13px;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(28, 28, 28, 0.2);
  border-top-color: #3a3a3a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.editor-body {
  flex: 1;
  min-height: 0;
  padding: 8px 16px 12px;
  overflow-y: auto;
  color: #3a3a3a;
  font-size: 15px;
  line-height: 24px;
  outline: none;
  cursor: text;
}

.editor-body :deep(p) {
  margin: 0 0 8px;
}

.editor-body :deep(p:last-child) {
  margin-bottom: 0;
}

.editor-body :deep(strong) {
  font-weight: 700;
  color: #3a3a3a;
}

.editor-body :deep(.connection-badge) {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(28, 28, 28, 0.1);
  color: #1c1c1c;
  font-family: "SF Mono", "Courier New", monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  vertical-align: middle;
}

.editor-body :deep(.connection-badge--action) {
  background: rgba(28, 28, 28, 0.1);
  color: #1c1c1c;
}

.editor-body :deep(.connection-badge--workflow) {
  background: rgba(124, 82, 255, 0.1);
  color: #7c52ff;
}

.editor-body :deep(.connection-badge--transfer) {
  background: rgba(0, 109, 210, 0.1);
  color: #006dd2;
}

.sheet-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  min-height: 72px;
  padding: 24px 16px 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 46%, #fff 100%);
  border-radius: 0 0 24px 24px;
  pointer-events: none;
}

.btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 590;
  pointer-events: auto;
  cursor: pointer;
}

.btn--quiet {
  background: transparent;
  color: #3a3a3a;
}

.btn--quiet:hover {
  background: rgba(0, 0, 0, 0.05);
}

.btn--primary {
  background: #7c52ff;
  color: #fff;
}

.btn--primary:hover {
  filter: brightness(0.96);
}

/* Agent drawer additions */
.crumb-title--agent svg {
  fill: none;
  stroke: #7c52ff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.text-input--tight {
  margin-top: 0;
}

.text-area {
  padding: 8px 12px;
  border: 1px solid rgba(28, 28, 28, 0.16);
  border-radius: 8px;
  background: #fff;
  color: #1c1c1c;
  font: inherit;
  font-size: 15px;
  line-height: 22px;
  resize: vertical;
}

.text-area:focus {
  outline: 2px solid rgba(124, 82, 255, 0.35);
  border-color: #7c52ff;
}

.slash-hint {
  padding: 0 4px;
  border: 1px solid rgba(28, 28, 28, 0.16);
  border-radius: 4px;
  background: #f9f9f9;
  font-family: "SF Mono", "Courier New", monospace;
  font-size: 11px;
}

.select-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.field-select {
  width: 100%;
  height: var(--btn-height-md);
  border-radius: 8px;
  font-size: 15px;
}

.select-row .field-select {
  flex: 1;
  min-width: 0;
}

.icon-btn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
  border-radius: 8px;
  background: transparent;
  color: #3a3a3a;
  cursor: pointer;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.icon-btn:focus-visible {
  outline: 2px solid rgba(124, 82, 255, 0.35);
}

.icon-btn.is-playing {
  background: rgba(124, 82, 255, 0.1);
  color: #7c52ff;
}

.fallback-groups {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.fallback-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-300) var(--dt-space-500);
  margin: 0;
  padding: 0;
  border: 0;
}

.fallback-label {
  width: 100%;
  margin-bottom: var(--dt-space-300);
  padding: 0;
  color: #3a3a3a;
  font-size: 13px;
  font-weight: 590;
}

.radio {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  color: #3a3a3a;
  font-size: 15px;
  cursor: pointer;
}

.radio input {
  margin: 0;
  accent-color: #7c52ff;
}
</style>
