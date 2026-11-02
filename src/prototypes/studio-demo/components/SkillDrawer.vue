<template>
  <aside class="drawer" :class="{ 'is-open': entered }">
    <div class="sheet">
      <header class="sheet-header">
        <div class="crumb">
          <span class="crumb-title">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1.4 9.4 5.2 13.4 5.6 10.4 8.2 11.4 12.2 8 10.1 4.6 12.2 5.6 8.2 2.6 5.6 6.6 5.2 8 1.4Z" />
            </svg>
            Skill
          </span>
          <span class="crumb-actions">
            <span v-if="actions" class="count">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="16" y="16" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <rect x="9" y="2" width="6" height="6" rx="1" />
                <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                <path d="M12 12V8" />
              </svg>
              {{ actions }}
            </span>
            <span class="crumb-divider" />
            <button type="button" class="icon-close" aria-label="Close skill" @click="emit('close')">
              <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3 3 9" /></svg>
            </button>
          </span>
        </div>
      </header>

      <div class="sheet-body">
        <section class="field">
          <label class="field-label" for="skill-name">Skill Name</label>
          <input id="skill-name" class="text-input" type="text" :value="name" />
        </section>

        <section class="field">
          <div class="field-label">Description</div>
          <p class="field-hint">Briefly describe what this skill does.</p>
          <div class="editor editor--short">
            <EditorToolbar />
            <div class="editor-body" contenteditable="true" v-html="description" @keydown="onEditorKeydown"></div>
          </div>
        </section>

        <section class="field">
          <div class="field-label">Instructions</div>
          <p class="field-hint">Outline each step and action the agent should take to complete this task.</p>
          <div class="editor editor--tall">
            <EditorToolbar />
            <div class="editor-body" contenteditable="true" v-html="instructions" @keydown="onEditorKeydown"></div>
          </div>
        </section>

        <section ref="guardrailsSection" class="field">
          <div class="field-label">Guardrails</div>
          <p class="field-hint">Add guidelines to ensure compliance and safety.</p>
          <div v-if="generating" class="building">
            <span class="spinner" aria-hidden="true" />
            Generating skill content…
          </div>
          <div class="editor editor--mid">
            <EditorToolbar />
            <div class="editor-body" contenteditable="true" v-html="guardrails" @keydown="onEditorKeydown"></div>
          </div>
        </section>

        <section class="field">
          <label class="field-label" for="skill-labels">Labels <span>(Optional)</span></label>
          <input id="skill-labels" class="text-input" type="text" :value="labels" />
        </section>
      </div>

      <footer class="sheet-footer">
        <button type="button" class="btn btn--quiet" @click="emit('close')">Cancel</button>
        <button type="button" class="btn btn--primary" @click="emit('close')">Update</button>
      </footer>
    </div>
    <SlashMenu ref="slashMenu" />
  </aside>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import EditorToolbar from './EditorToolbar.vue'
import SlashMenu from './SlashMenu.vue'

const props = defineProps({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  instructions: { type: String, default: '' },
  labels: { type: String, default: '' },
  actions: { type: Number, default: 0 },
  generating: { type: Boolean, default: false },
  guardrails: { type: String, default: '' },
  instant: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
const entered = ref(props.instant)
const guardrailsSection = ref(null)
const slashMenu = ref(null)

function onEditorKeydown(event) {
  slashMenu.value?.onKeydown(event)
}

watch(() => [props.generating, props.guardrails], () => {
  if (!props.generating && !props.guardrails) return
  nextTick(() => guardrailsSection.value?.scrollIntoView({ block: 'nearest' }))
})

onMounted(() => {
  if (props.instant) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { entered.value = true })
  })
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
</style>
