<template>
  <div class="question-detail" v-if="question">
    <div class="question-detail-fields">
      <!-- Header -->
      <div class="question-detail-header">
        <span class="question-detail-label">{{ question.isAi ? 'Ai' : '' }} Question #{{ question.number }}</span>
      </div>

      <!-- Question text input with compose bar -->
      <div class="ai-question-input-wrapper">
        <input
          type="text"
          v-model="localText"
          class="ai-question-input"
          :class="{
            'ai-blur-out': acceptPhase === 'blur-out',
            'ai-blur-in': acceptPhase === 'blur-in',
          }"
          placeholder="Enter question text..."
        />

        <!-- Rewrite banner (busy or confirming) -->
        <div
          v-if="rewriteState === 'busy' || rewriteState === 'confirming'"
          ref="bannerRef"
          class="ai-rewrite-banner"
        >
          <Transition name="banner-fade" mode="out-in"
            @before-leave="onBeforeLeave"
            @enter="onEnter"
            @after-enter="onAfterEnter"
          >
            <!-- Busy content -->
            <div v-if="rewriteState === 'busy'" key="busy" class="banner-busy">
              <svg class="sparkle-icon" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 2a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1Zm-9 2a1 1 0 0 1 .91.586l2.033 4.471 4.47 2.033a1 1 0 0 1 0 1.82l-4.47 2.033-2.033 4.47a1 1 0 0 1-1.82 0l-2.033-4.47-4.47-2.033a1 1 0 0 1 0-1.82l4.47-2.033 2.033-4.47A1 1 0 0 1 10 4Zm0 3.417-1.277 2.81a1 1 0 0 1-.497.496L5.416 12l2.81 1.277a1 1 0 0 1 .497.497L10 16.584l1.277-2.81a1 1 0 0 1 .497-.497L14.584 12l-2.81-1.277a1 1 0 0 1-.497-.497L10 7.416ZM18 16a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" fill="url(#ai-gradient-busy)"/><defs><linearGradient id="ai-gradient-busy" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#471571"/><stop offset=".031" stop-color="#551B84"/><stop offset=".145" stop-color="#7C229E"/><stop offset=".237" stop-color="#9024A4"/><stop offset=".355" stop-color="#B02290"/><stop offset=".483" stop-color="#D32B86"/><stop offset=".603" stop-color="#E92F6F"/><stop offset=".701" stop-color="#F6484F"/><stop offset=".9" stop-color="#FB7328"/><stop offset=".973" stop-color="#F3960F"/><stop offset="1" stop-color="#F3960F"/></linearGradient></defs></svg>
              <span class="shimmer-text">Thinking to improve the wording on this question...</span>
            </div>
            <!-- Confirming content -->
            <div v-else key="confirming" class="banner-confirming">
              <button class="banner-close-btn" @click="handleCancel">
                <DtIcon name="close" :size="16" />
              </button>
              <div class="banner-header">
                <svg class="sparkle-icon" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 2a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1Zm-9 2a1 1 0 0 1 .91.586l2.033 4.471 4.47 2.033a1 1 0 0 1 0 1.82l-4.47 2.033-2.033 4.47a1 1 0 0 1-1.82 0l-2.033-4.47-4.47-2.033a1 1 0 0 1 0-1.82l4.47-2.033 2.033-4.47A1 1 0 0 1 10 4Zm0 3.417-1.277 2.81a1 1 0 0 1-.497.496L5.416 12l2.81 1.277a1 1 0 0 1 .497.497L10 16.584l1.277-2.81a1 1 0 0 1 .497-.497L14.584 12l-2.81-1.277a1 1 0 0 1-.497-.497L10 7.416ZM18 16a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" fill="url(#ai-gradient-banner)"/><defs><linearGradient id="ai-gradient-banner" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#471571"/><stop offset=".031" stop-color="#551B84"/><stop offset=".145" stop-color="#7C229E"/><stop offset=".237" stop-color="#9024A4"/><stop offset=".355" stop-color="#B02290"/><stop offset=".483" stop-color="#D32B86"/><stop offset=".603" stop-color="#E92F6F"/><stop offset=".701" stop-color="#F6484F"/><stop offset=".9" stop-color="#FB7328"/><stop offset=".973" stop-color="#F3960F"/><stop offset="1" stop-color="#F3960F"/></linearGradient></defs></svg>
                <span class="banner-title">AI suggestion</span>
              </div>
              <p class="banner-suggestion-text">{{ currentSuggestion }}</p>
              <div class="banner-actions">
                <button class="banner-btn banner-btn--secondary" @click="handleRewrite">Rewrite</button>
                <button class="banner-btn banner-btn--primary" @click="handleAccept">Accept</button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Action buttons (only when idle) -->
        <div v-if="rewriteState === 'idle'" class="ai-question-actions">
          <button class="compose-action-btn" @click="handleRewrite">
            <DtIcon name="ai-write" :size="16" />
            Rewrite
          </button>
          <button class="compose-action-btn">
            <DtIcon name="languages" :size="16" />
            Translate
          </button>
        </div>
      </div>

      <!-- Response type + Responses + Points row -->
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

      <!-- Trigger words -->
      <div class="question-detail-trigger">
        <label class="field-label" for="trigger-words">Trigger words/phrases (optional)</label>
        <div class="trigger-description">An improved LLM now powers Ai questions for better accuracy. Only use trigger words for exact transcript matches.</div>
        <input
          id="trigger-words"
          type="text"
          v-model="localTriggerWords"
          class="dt-input"
          placeholder='Example: "hello there"'
        />
      </div>

      <!-- Checkboxes -->
      <div class="question-detail-checkboxes">
        <label class="checkbox-item">
          <input type="checkbox" v-model="checkboxes.followUp" />
          <div class="checkbox-content">
            <span>Include follow-up question based on response</span>
            <span class="checkbox-desc">Follow-up questions cannot be automated. To use this feature, change setting to Assisted by Ai</span>
          </div>
        </label>
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
        <label class="checkbox-item">
          <input type="checkbox" v-model="checkboxes.saveTemplate" />
          <span>Save question as template</span>
        </label>
      </div>
    </div>

    <!-- Footer buttons -->
    <div class="question-detail-footer">
      <div class="question-detail-footer-actions">
        <button class="footer-btn footer-btn--delete">Delete</button>
        <button class="footer-btn footer-btn--save">Save</button>
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
const localTriggerWords = ref('')
const checkboxes = reactive({
  followUp: false,
  commentField: false,
  allowSkip: false,
  autoFail: false,
  saveTemplate: false,
})
const rewriteState = ref('idle') // 'idle' | 'busy' | 'confirming'
const acceptPhase = ref('none') // 'none' | 'blur-out' | 'blur-in'
const bannerRef = ref(null)
const currentSuggestion = ref('')
const suggestionIndex = ref(0)

watch(
  () => props.question,
  (q) => {
    if (q) {
      localText.value = q.text
      localResponseType.value = q.responseType
      localResponses.value = q.responses.map(r => ({ ...r }))
      localTriggerWords.value = q.triggerWords || ''
      rewriteState.value = 'idle'
      suggestionIndex.value = 0
    }
  },
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

function onBeforeLeave() {
  if (bannerRef.value) {
    bannerRef.value.style.height = bannerRef.value.offsetHeight + 'px'
  }
}

function onEnter(el) {
  if (bannerRef.value) {
    bannerRef.value.style.height = el.offsetHeight + 'px'
  }
}

function onAfterEnter() {
  if (bannerRef.value) {
    bannerRef.value.style.height = ''
  }
}

function handleRewrite() {
  rewriteState.value = 'busy'
  setTimeout(() => {
    const suggestions = props.question?.aiSuggestions || []
    currentSuggestion.value = suggestions[suggestionIndex.value % suggestions.length] || 'Improved question text.'
    suggestionIndex.value++
    rewriteState.value = 'confirming'
  }, 2500)
}

function handleAccept() {
  acceptPhase.value = 'blur-out'                   // blur + fade old text
  setTimeout(() => {
    localText.value = currentSuggestion.value      // swap while hidden
    acceptPhase.value = 'blur-in'                  // sharpen new text in
    rewriteState.value = 'idle'
    currentSuggestion.value = ''
  }, 200)
  setTimeout(() => {
    acceptPhase.value = 'none'                     // clean up
  }, 450)
}

function handleCancel() {
  rewriteState.value = 'idle'
  currentSuggestion.value = ''
}
</script>

<style scoped>
.question-detail {
  position: relative;
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-space-500);
  overflow: hidden;
  box-shadow: var(--dt-shadow-small);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.question-detail::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%, #F3960F 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.question-detail-fields {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-550);
}

.question-detail-header {
  padding-bottom: var(--dt-space-300);
}

.question-detail-label {
  font: var(--dt-typography-headline-md);
  color: var(--dt-color-foreground-secondary);
}

.ai-question-input-wrapper {
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  background: var(--dt-color-surface-primary);
  overflow: hidden;
  outline: none;
}

.ai-question-input-wrapper:focus-within {
  outline: none;
}

.ai-question-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px var(--dt-space-450);
  font: var(--dt-typography-body-md);
  font-family: inherit;
  color: var(--dt-color-foreground-primary);
  outline: none;
  box-sizing: border-box;
  transition: filter 0.2s ease, opacity 0.2s ease;
}

.ai-question-input:focus,
.ai-question-input:focus-visible {
  outline: none;
  box-shadow: none;
}

.ai-question-input.ai-blur-out {
  filter: blur(3px);
  opacity: 0;
}

.ai-question-input.ai-blur-in {
  filter: blur(3px);
  opacity: 0;
  transition: none;
}

.ai-question-input::placeholder {
  color: var(--dt-color-foreground-muted);
}

.ai-question-actions {
  display: flex;
  gap: 8px;
  padding: 0 8px;
  align-items: center;
  height: 46px;
}

.compose-action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-350) var(--dt-space-500);
  background: none;
  border: none;
  color: var(--dt-color-foreground-muted);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
  border-radius: var(--dt-space-400);
}

.compose-action-btn:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

/* Rewrite banner (inside wrapper) */
.ai-rewrite-banner {
  padding: 0 12px;
  background: linear-gradient(140deg, rgba(233, 47, 111, 0.08), rgba(124, 82, 255, 0.08));
  border-top: 1px solid rgba(233, 47, 111, 0.2);
  overflow: hidden;
  box-sizing: border-box;
  transition: height 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-busy {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  box-sizing: border-box;
}

.banner-confirming {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  padding: 12px 0;
}

/* Crossfade transition */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}

.sparkle-icon {
  flex-shrink: 0;
}

.shimmer-text {
  font-size: 15px;
  animation: shimmer 2s infinite;
  background: linear-gradient(90deg, #1c1c1c 0%, #1c1c1c 40%, #E92F6F 50%, #1c1c1c 60%, #1c1c1c 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.banner-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: var(--dt-color-foreground-muted);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 4px;
}

.banner-close-btn:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

.banner-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner-title {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
}

.banner-suggestion-text {
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

.banner-actions {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
}

.banner-btn {
  padding: var(--dt-space-350) var(--dt-space-400);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
  border: none;
}

.banner-btn--secondary {
  color: var(--dt-color-foreground-secondary);
}

.banner-btn--secondary:hover {
  background: var(--dt-color-surface-secondary);
}

.banner-btn--primary {
  color: var(--dt-color-link-primary);
}

.banner-btn--primary:hover {
  background: var(--dt-color-surface-brand-subtle);
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

.field-label {
  font: var(--dt-typography-headline-md);
  color: var(--dt-color-foreground-primary);
  padding-bottom: var(--dt-space-300);
  display: block;
}

/* Dialtone-style select */
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

/* Dialtone-style text input */
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
  color: var(--dt-color-foreground-muted);
  margin-bottom: var(--dt-space-300);
}

/* Dialtone-style checkboxes */
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
  background: var(--dt-color-surface-secondary);
}

.footer-btn--save {
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
}

.footer-btn--save:hover {
  background: var(--dt-color-link-primary-hover);
}
</style>
