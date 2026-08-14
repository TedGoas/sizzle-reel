<template>
  <div class="question-detail" v-if="question">
    <!-- AI Questions picker -->
    <template v-if="showPicker">
      <div class="picker-header">
        <button class="picker-back" type="button" aria-label="Back" @click="closeAiPicker">
          <DtIcon name="arrow-left" :size="20" />
        </button>
        <DtIcon name="sparkle" :size="18" class="picker-sparkle" />
        <h2 class="picker-title">AI Questions</h2>
      </div>

      <div class="picker-body">
        <p class="picker-intro">
          Score calls faster. Ai Questions listen for certain words and phrases to automatically answer yes or no questions.
        </p>

        <div class="picker-search">
          <DtIcon name="search" :size="16" class="picker-search-icon" />
          <span class="picker-search-placeholder">Search Ai Questions</span>
        </div>

        <div class="picker-list">
          <button
            v-for="(item, i) in catalog"
            :key="item.text"
            class="picker-item"
            type="button"
            :data-autoplay="i === 0 ? 'ai-question-0' : undefined"
            @click="applyAiQuestion(i)"
          >
            <span class="picker-item-text">{{ item.text }}</span>
            <div class="picker-item-meta">
              <span>10 points</span>
              <span>Yes or no</span>
              <DtIcon name="sparkle" :size="12" class="picker-item-ai" />
            </div>
          </button>
        </div>
      </div>

      <div class="question-detail-footer picker-footer">
        <div class="question-detail-footer-actions">
          <button class="footer-btn footer-btn--delete" type="button">Delete</button>
          <button class="footer-btn footer-btn--disabled" type="button" disabled>Add Ai Question</button>
        </div>
      </div>
    </template>

    <!-- Question editor -->
    <template v-else>
      <div class="question-detail-fields">
        <div class="question-first-row">
          <div class="question-text-field">
            <label class="field-label" for="question-text">Question</label>
            <input
              id="question-text"
              type="text"
              v-model="localText"
              class="dt-input"
              placeholder='Example: "Did the agent greet the customer?"'
            />
          </div>

          <div class="ai-assist">
            <div class="ai-assist-header">
              <div class="ai-assist-label">
                <DtIcon name="sparkle" :size="16" class="ai-assist-sparkle" />
                <span class="field-label field-label--inline">AI Questions</span>
                <DtIcon name="help-circle" :size="16" class="ai-assist-info" />
              </div>
              <button
                class="ai-toggle"
                type="button"
                role="switch"
                :aria-checked="aiEnabled"
                aria-label="AI Questions"
              >
                <span class="ai-toggle-track" :class="{ 'ai-toggle-track--on': aiEnabled }">
                  <span class="ai-toggle-thumb" />
                </span>
              </button>
            </div>
            <button
              class="select-ai-btn"
              type="button"
              data-autoplay="select-ai-questions"
              @click="openAiPicker"
            >
              <span>Select Ai Questions</span>
              <DtIcon name="arrow-right" :size="16" />
            </button>
          </div>
        </div>

        <div class="question-detail-row">
          <div class="question-detail-response-type">
            <label class="field-label" for="response-type">Response type</label>
            <div class="dt-select-wrapper">
              <select id="response-type" v-model="localResponseType" class="dt-select">
                <option>Yes or no</option>
                <option>Multiple choice</option>
                <option>Scale</option>
                <option>Free text</option>
              </select>
              <DtIcon name="chevron-down" :size="16" class="dt-select-icon" />
            </div>
          </div>

          <div class="question-detail-responses">
            <label class="field-label">Responses</label>
            <div
              v-for="(resp, i) in localResponses"
              :key="i"
              class="response-row"
            >
              <span class="response-number">{{ i + 1 }}.</span>
              <input
                type="text"
                v-model="localResponses[i].label"
                class="dt-input"
              />
            </div>
          </div>

          <div class="question-detail-points">
            <label class="field-label">Points</label>
            <div
              v-for="(resp, i) in localResponses"
              :key="i"
            >
              <input
                type="text"
                v-model="localResponses[i].points"
                class="dt-input dt-input--center"
              />
            </div>
          </div>
        </div>

        <div class="question-detail-trigger">
          <label class="field-label" for="trigger-words">Trigger words/phrases</label>
          <p class="trigger-description">Press Enter or add a comma after each word.</p>
          <input
            id="trigger-words"
            type="text"
            v-model="triggerDraft"
            class="dt-input"
            placeholder='Example: "Hello there"'
            @keydown="onTriggerKeydown"
          />
          <div v-if="triggerChips.length" class="trigger-chips">
            <button
              v-for="(chip, i) in triggerChips"
              :key="`${chip}-${i}`"
              class="trigger-chip"
              type="button"
              @click="removeChip(i)"
            >
              <span>{{ chip }}</span>
              <DtIcon name="close" :size="14" />
            </button>
          </div>
        </div>

        <div class="question-detail-checkboxes">
          <label class="checkbox-item">
            <input type="checkbox" v-model="checkboxes.commentField" />
            <span>Add a comment field</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="checkboxes.allowSkip" />
            <span>Allow question to be skipped</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="checkboxes.autoFail" />
            <div class="checkbox-content">
              <span>Automatically fail entire scorecard for certain responses</span>
              <span class="checkbox-desc">Specific responses can automatically assign a 0% grade to a call</span>
            </div>
          </label>
        </div>
      </div>

      <div class="question-detail-footer">
        <div class="question-detail-footer-actions">
          <button class="footer-btn footer-btn--delete" type="button">Delete</button>
          <button class="footer-btn footer-btn--save" type="button" data-autoplay="save-question">Save</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'
import { aiQuestionCatalog } from '../data/builderData.js'

const props = defineProps({
  question: { type: Object, default: null },
})

const catalog = aiQuestionCatalog
const showPicker = ref(false)
const aiEnabled = ref(true)
const localText = ref('')
const localResponseType = ref('')
const localResponses = ref([])
const triggerDraft = ref('')
const triggerChips = ref([])
const checkboxes = reactive({
  commentField: false,
  allowSkip: false,
  autoFail: false,
})

function syncFromQuestion(q) {
  if (!q) return
  localText.value = q.text
  localResponseType.value = q.responseType
  localResponses.value = q.responses.map(r => ({ ...r }))
  triggerChips.value = [...(q.triggerChips || [])]
  triggerDraft.value = ''
  showPicker.value = false
}

watch(
  () => props.question,
  (q) => syncFromQuestion(q),
  { immediate: true }
)

watch(
  () => props.question?.text,
  (text) => {
    if (text !== undefined && text !== localText.value) {
      localText.value = text
    }
  }
)

watch(localText, (text) => {
  if (props.question) props.question.text = text
})

function commitTrigger() {
  const phrase = triggerDraft.value.replace(/,$/, '').trim()
  if (!phrase) return
  triggerChips.value = [...triggerChips.value, phrase]
  triggerDraft.value = ''
  if (props.question) props.question.triggerChips = [...triggerChips.value]
}

function onTriggerKeydown(event) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    commitTrigger()
  }
}

function removeChip(index) {
  triggerChips.value = triggerChips.value.filter((_, i) => i !== index)
  if (props.question) props.question.triggerChips = [...triggerChips.value]
}

function openAiPicker() {
  showPicker.value = true
}

function closeAiPicker() {
  showPicker.value = false
}

function applyAiQuestion(index) {
  const item = catalog[index]
  if (!item || !props.question) return
  props.question.text = item.text
  props.question.isAi = true
  props.question.triggerChips = []
  localText.value = item.text
  triggerChips.value = []
  triggerDraft.value = ''
  showPicker.value = false
}

function resetEditor() {
  showPicker.value = false
  triggerDraft.value = ''
  triggerChips.value = []
  if (props.question) {
    props.question.triggerChips = []
  }
}

async function typeTriggerPhrase(text, sleepFn) {
  if (!sleepFn) return
  triggerDraft.value = ''
  for (let i = 1; i <= text.length; i++) {
    triggerDraft.value = text.slice(0, i)
    await sleepFn(38)
  }
  await sleepFn(180)
  commitTrigger()
}

defineExpose({
  openAiPicker,
  closeAiPicker,
  applyAiQuestion,
  typeTriggerPhrase,
  resetEditor,
})
</script>

<style scoped>
.question-detail {
  position: relative;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-500);
  overflow: hidden;
  box-shadow: var(--dt-shadow-small);
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 540px;
}

.question-detail-fields {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-550);
}

.question-first-row {
  display: flex;
  gap: var(--dt-space-400);
  align-items: stretch;
}

.question-text-field {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.question-text-field .field-label {
  display: flex;
  align-items: center;
  min-height: 21px;
}

.ai-assist {
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
}

.ai-assist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--dt-space-300);
  min-height: 21px;
}

.ai-assist-label {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.ai-assist-sparkle {
  color: var(--dt-color-link-primary);
  flex-shrink: 0;
}

.ai-assist-info {
  color: var(--dt-color-foreground-muted);
  flex-shrink: 0;
}

.field-label {
  font: var(--dt-typography-headline-md);
  color: var(--dt-color-foreground-primary);
  padding-bottom: var(--dt-space-300);
  display: block;
}

.field-label--inline {
  padding-bottom: 0;
}

.ai-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  display: flex;
  align-items: center;
}

.ai-toggle-track {
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background: var(--dt-color-surface-moderate);
  position: relative;
  display: block;
}

.ai-toggle-track--on {
  background: var(--dt-color-link-primary);
}

.ai-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--dt-color-surface-primary);
  transition: left 0.15s ease;
}

.ai-toggle-track--on .ai-toggle-thumb {
  left: 16px;
}

.select-ai-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

.select-ai-btn:hover {
  border-color: var(--dt-color-link-primary);
}

.question-detail-row {
  display: flex;
  gap: 6px;
}

.question-detail-response-type {
  display: flex;
  flex-direction: column;
  padding-right: 32px;
  flex-shrink: 0;
}

.question-detail-responses {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.question-detail-points {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 65px;
  flex-shrink: 0;
}

.dt-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.dt-select {
  width: 100%;
  appearance: none;
  padding: var(--dt-space-400) var(--dt-space-600) var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  outline: none;
}

.dt-select:focus {
  border-color: var(--dt-color-link-primary);
  box-shadow: var(--dt-shadow-focus);
}

.dt-select-icon {
  position: absolute;
  right: 10px;
  color: var(--dt-color-foreground-muted);
  pointer-events: none;
}

.dt-input {
  width: 100%;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-secondary);
  outline: none;
  box-sizing: border-box;
}

.dt-input::placeholder {
  color: var(--dt-color-foreground-muted);
}

.dt-input:focus {
  border-color: var(--dt-color-link-primary);
  box-shadow: var(--dt-shadow-focus);
}

.dt-input--center {
  text-align: center;
}

.response-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.response-number {
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  width: 24px;
}

.question-detail-trigger {
  display: flex;
  flex-direction: column;
}

.trigger-description {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-primary);
  margin: 0 0 var(--dt-space-300);
}

.trigger-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-400);
  padding-top: var(--dt-space-400);
}

.trigger-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-350);
  padding: 5px var(--dt-space-350);
  background: var(--dt-color-surface-brand-subtle);
  border: none;
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
}

.trigger-chip:hover {
  filter: brightness(0.96);
}

.question-detail-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--dt-color-link-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-content {
  display: flex;
  flex-direction: column;
}

.checkbox-desc {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-muted);
}

.question-detail-footer {
  border-top: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-500);
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.question-detail-footer-actions {
  display: flex;
  gap: var(--dt-space-300);
}

.footer-btn {
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-500);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
  border: none;
  transition: transform 0.12s ease, filter 0.12s ease, background 0.15s ease;
}

.footer-btn--delete {
  background: none;
  color: var(--dt-color-foreground-critical);
}

.footer-btn--delete:hover {
  background: var(--dt-color-surface-moderate);
}

.footer-btn--save {
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
}

.footer-btn--save:hover {
  background: var(--dt-color-link-primary-hover);
}

.footer-btn--disabled {
  background: var(--dt-color-surface-moderate);
  color: var(--dt-color-foreground-muted);
  cursor: default;
}

.picker-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  height: 56px;
  padding: 0 var(--dt-space-450);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  flex-shrink: 0;
}

.picker-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
  border: none;
  background: none;
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  border-radius: var(--dt-space-400);
}

.picker-back:hover {
  background: var(--dt-color-surface-secondary);
}

.picker-sparkle {
  color: var(--dt-color-link-primary);
  flex-shrink: 0;
}

.picker-title {
  font: var(--dt-typography-headline-lg);
  color: var(--dt-color-foreground-primary);
}

.picker-body {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-500) var(--dt-space-550);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.picker-intro {
  margin: 0;
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-tertiary);
}

.picker-search {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-450);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  background: var(--dt-color-surface-primary);
}

.picker-search-icon {
  color: var(--dt-color-foreground-muted);
  flex-shrink: 0;
}

.picker-search-placeholder {
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-muted);
}

.picker-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
}

.picker-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--dt-space-100);
  width: 100%;
  padding: var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-500);
  cursor: pointer;
  text-align: left;
}

.picker-item:hover {
  border-color: var(--dt-color-link-primary);
  background: var(--dt-color-surface-brand-subtle);
}

.picker-item-text {
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
}

.picker-item-meta {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  font: var(--dt-typography-body-sm-compact);
  color: var(--dt-color-foreground-muted);
}

.picker-item-ai {
  color: var(--dt-color-link-primary);
}

.picker-footer {
  background: var(--dt-color-surface-secondary);
}
</style>
