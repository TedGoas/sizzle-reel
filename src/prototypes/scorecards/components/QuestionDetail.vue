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
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.03), 0px 2px 4px rgba(0,0,0,0.04), 0px 2px 16px rgba(0,0,0,0.08);
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
  gap: 16px;
  padding: 24px;
}

.question-detail-header {
  padding-bottom: 4px;
}

.question-detail-label {
  font-size: 15px;
  font-weight: 600;
  color: #3a3a3a;
  line-height: 1.4;
}

/* Unified input wrapper */
.ai-question-input-wrapper {
  border: 1px solid rgba(28, 28, 28, 0.17);
  border-radius: 8px;
  background: white;
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
  padding: 10px 12px;
  font-size: 15px;
  font-family: inherit;
  color: #1c1c1c;
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
  color: #808080;
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
  gap: 4px;
  padding: 6px 16px;
  background: none;
  border: none;
  color: #808080;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
}

.compose-action-btn:hover {
  background: rgba(0, 0, 0, 0.03);
  color: #3a3a3a;
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
  color: #808080;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 4px;
}

.banner-close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #3a3a3a;
}

.banner-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner-title {
  font-size: 12px;
  font-weight: 400;
  color: #3a3a3a;
  line-height: 1.4;
}

.banner-suggestion-text {
  font-size: 15px;
  color: #1c1c1c;
  line-height: 1.4;
  margin: 0;
}

.banner-actions {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
}

.banner-btn {
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: none;
  line-height: 1.2;
}

.banner-btn--secondary {
  color: #3a3a3a;
}

.banner-btn--secondary:hover {
  background: rgba(0, 0, 0, 0.03);
}

.banner-btn--primary {
  color: #7C52FF;
}

.banner-btn--primary:hover {
  background: rgba(124, 82, 255, 0.05);
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
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1c;
  line-height: 1.4;
  padding-bottom: 4px;
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
  padding: 8px 32px 8px 12px;
  background: white;
  border: 1.5px solid rgba(28, 28, 28, 0.17);
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  color: #3a3a3a;
  line-height: 1.2;
  cursor: pointer;
  outline: none;
}

.dt-select:focus {
  border-color: #7C52FF;
  box-shadow: 0 0 0 1px #7C52FF;
}

.dt-select-icon {
  position: absolute;
  right: 10px;
  color: #808080;
  pointer-events: none;
}

/* Dialtone-style text input */
.dt-input {
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: 1.5px solid rgba(28, 28, 28, 0.17);
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  color: #3a3a3a;
  line-height: 1.2;
  outline: none;
  box-sizing: border-box;
}

.dt-input::placeholder {
  color: #808080;
}

.dt-input:focus {
  border-color: #7C52FF;
  box-shadow: 0 0 0 1px #7C52FF;
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
  font-size: 14px;
  color: black;
  width: 24px;
}

.question-detail-trigger {
  display: flex;
  flex-direction: column;
}

.trigger-description {
  font-size: 12px;
  color: #808080;
  margin-bottom: 4px;
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
  gap: 8px;
  font-size: 15px;
  color: #1c1c1c;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: #7C52FF;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-content {
  display: flex;
  flex-direction: column;
}

.checkbox-desc {
  font-size: 12px;
  color: #808080;
  line-height: 1.4;
}

.question-detail-footer {
  border-top: 1px solid rgba(28, 28, 28, 0.11);
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.question-detail-footer-actions {
  display: flex;
  gap: 4px;
}

.footer-btn {
  height: var(--btn-height-md);
  padding: 0 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.footer-btn--delete {
  background: none;
  color: #D90A45;
}

.footer-btn--delete:hover {
  background: rgba(217, 10, 69, 0.05);
}

.footer-btn--save {
  background: #7C52FF;
  color: white;
}

.footer-btn--save:hover {
  background: #6a3fef;
}
</style>
