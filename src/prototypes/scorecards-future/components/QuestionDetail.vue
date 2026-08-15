<template>
  <div class="question-detail" v-if="question">
    <div class="question-detail-fields">
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
        <button class="footer-btn footer-btn--save" type="button">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

const props = defineProps({
  question: { type: Object, default: null },
})

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
  localResponses.value = q.responses.map((r) => ({ ...r }))
  triggerChips.value = [...(q.triggerChips || [])]
  triggerDraft.value = ''
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
  min-height: 0;
  height: 100%;
}

.question-detail-fields {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-550);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.question-text-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font: var(--dt-typography-headline-md);
  color: var(--dt-color-foreground-primary);
  padding-bottom: var(--dt-space-300);
  display: block;
}

.question-detail-row {
  display: flex;
  gap: 6px;
}

.question-detail-response-type {
  display: flex;
  flex-direction: column;
  padding-right: var(--dt-space-500);
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
  flex-shrink: 0;
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
</style>
