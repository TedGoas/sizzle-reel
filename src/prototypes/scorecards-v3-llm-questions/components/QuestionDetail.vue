<template>
  <div class="question-detail" v-if="question">
    <div class="question-detail-fields">
      <div class="question-detail-header">
        <span class="question-detail-label">{{ question.isAi ? 'Ai ' : '' }}Question #{{ question.number }}</span>
      </div>

      <div
        class="ai-question-input-wrapper"
        :class="{ 'has-warning': question.validationWarning }"
      >
        <input
          id="question-text"
          type="text"
          v-model="localText"
          class="ai-question-input"
          :class="{
            'ai-blur-out': acceptPhase === 'blur-out',
            'ai-blur-in': acceptPhase === 'blur-in',
          }"
          placeholder="Enter question text..."
        />

        <Transition name="compose-swap" mode="out-in">
          <div
            v-if="rewriteState === 'idle' && question.validationWarning"
            key="warning"
            class="ai-warning-banner"
          >
            <DtIcon name="alert-circle" :size="16" class="ai-warning-banner-icon" />
            <span>
              {{ warningSubject }} {{ warningVerb }} unclear. Clarifying {{ warningPronoun }} or
              <button
                type="button"
                class="warning-define-link"
                data-autoplay="define-term"
                @click="$emit('define')"
              >defining {{ warningPronoun }}</button>
              will help.
            </span>
          </div>
          <div v-else-if="rewriteState === 'idle'" key="idle" class="ai-question-actions">
            <button
              class="compose-action-btn compose-action-btn--rewrite"
              type="button"
              data-autoplay="rewrite"
              @click="handleRewrite"
            >
              <DtIcon name="ai-write" :size="16" />
              Rewrite
            </button>
            <button class="compose-action-btn" type="button">
              <DtIcon name="languages" :size="16" />
              Translate
            </button>
          </div>
          <div
            v-else
            key="banner"
            ref="bannerRef"
            class="ai-rewrite-banner"
            :class="{ 'ai-rewrite-banner--busy': rewriteState === 'busy' }"
          >
            <Transition
              name="banner-fade"
              mode="out-in"
              @before-leave="onBeforeLeave"
              @enter="onEnter"
              @after-enter="onAfterEnter"
            >
              <div v-if="rewriteState === 'busy'" key="busy" class="banner-busy">
                <DtIcon name="sparkle" :size="16" class="banner-sparkle" />
                <span class="thinking-label thinking-label--live">Thinking</span>
                <span class="thinking-copy">to improve the wording on this question...</span>
              </div>
              <div v-else key="confirming" class="banner-confirming">
                <button class="banner-close-btn" type="button" aria-label="Dismiss" @click="handleCancel">
                  <DtIcon name="close" :size="16" />
                </button>
                <div class="banner-header">
                  <DtIcon name="sparkle" :size="16" class="banner-sparkle" />
                  <span class="banner-title">Here’s a suggestion for better results when prompting a large language model:</span>
                </div>
                <p class="banner-suggestion-text">
                  {{ currentSuggestion }}<span v-if="streaming" class="stream-caret" aria-hidden="true" />
                </p>
                <div class="banner-actions">
                  <button class="banner-btn banner-btn--secondary" type="button" @click="handleRewrite">Rewrite</button>
                  <button
                    class="banner-btn banner-btn--primary"
                    type="button"
                    data-autoplay="accept"
                    :disabled="streaming"
                    @click="handleAccept"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
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
        <label class="field-label" for="trigger-words">Trigger words/phrases (optional)</label>
        <p class="trigger-description">
          An improved LLM now powers AI questions for better accuracy. Only use trigger words for exact transcript matches.
        </p>
        <input
          id="trigger-words"
          type="text"
          v-model="localTriggerWords"
          class="dt-input"
          placeholder='Example: "hello there"'
        />
      </div>

      <div class="question-detail-checkboxes">
        <label class="checkbox-item checkbox-item--muted">
          <input type="checkbox" disabled />
          <div class="checkbox-content">
            <span>Include follow-up question based on response</span>
            <span class="checkbox-desc">Follow-up questions cannot be automated. To use this feature, change setting to Assisted by Ai</span>
          </div>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="checkboxes.commentField" />
          <span>Add a comment field</span>
        </label>
        <div class="skip-item">
          <label class="checkbox-item">
            <input type="checkbox" v-model="checkboxes.allowSkip" />
            <span>Allow question to be skipped</span>
          </label>
          <div class="skip-description">
            <span
              v-if="skipSaved"
              class="skip-preview-text"
              :class="{ 'skip-preview-saved': skipPreviewFlash }"
            >{{ skipSaved }}</span>
            <button type="button" class="skip-link" @click="toggleSkipEditor">When to skip</button>
          </div>
          <Transition :css="false" @enter="onSkipEditorEnter" @leave="onSkipEditorLeave">
            <div v-if="skipEditorOpen" class="skip-inline-editor">
              <p class="skip-helper">Describe situations where it's ok to skip this question without affecting the total score.</p>
              <textarea
                v-model="skipDraft"
                class="skip-textarea"
                placeholder="Agents are required to confirm meeting dates and times when a meeting was discussed. If no meeting was discussed, this question can be skipped."
              />
              <div class="skip-inline-actions">
                <button type="button" class="skip-btn skip-btn--cancel" @click="cancelSkipEditor">Cancel</button>
                <button type="button" class="skip-btn skip-btn--save" @click="saveSkipEditor">Save</button>
              </div>
            </div>
          </Transition>
        </div>
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

    <div class="question-detail-footer">
      <div class="question-detail-footer-actions">
        <button class="footer-btn footer-btn--delete" type="button">Delete</button>
        <button
          class="footer-btn footer-btn--save"
          type="button"
          data-autoplay="save-question"
          @click="saveQuestion"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, computed } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

const props = defineProps({
  question: { type: Object, default: null },
})

const emit = defineEmits(['saved', 'define'])

const localText = ref('')
const localResponseType = ref('')
const localResponses = ref([])
const localTriggerWords = ref('')
const checkboxes = reactive({
  commentField: false,
  allowSkip: false,
  autoFail: false,
  saveTemplate: false,
})
const rewriteState = ref('idle')
const acceptPhase = ref('none')
const currentSuggestion = ref('')
const suggestionIndex = ref(0)
const streaming = ref(false)
const bannerRef = ref(null)
const skipEditorOpen = ref(false)
const skipDraft = ref('')
const skipSaved = ref('')
const skipPreviewFlash = ref(false)
let rewriteTimer = null
let rewriteGen = 0
let skipNextLeaveAnimation = false
let skipFlashTimer = null

const warningAcronyms = computed(() => props.question?.validationWarning?.acronyms || [])
const warningSubject = computed(() => formatAcronymList(warningAcronyms.value))
const warningVerb = computed(() => warningAcronyms.value.length === 1 ? 'is' : 'are')
const warningPronoun = computed(() => warningAcronyms.value.length === 1 ? 'it' : 'them')

watch(
  () => props.question,
  (q) => {
    if (!q) return
    localText.value = q.text
    localResponseType.value = q.responseType
    localResponses.value = q.responses.map((r) => ({ ...r }))
    localTriggerWords.value = q.triggerWords || ''
    rewriteState.value = 'idle'
    suggestionIndex.value = 0
    currentSuggestion.value = ''
    streaming.value = false
    acceptPhase.value = 'none'
    rewriteGen += 1
    resetSkipEditor(true)
  },
  { immediate: true }
)

watch(localText, (text) => {
  if (props.question) props.question.text = text
})

function nextSuggestion() {
  const suggestions = props.question?.aiSuggestions || []
  const text = suggestions[suggestionIndex.value % Math.max(suggestions.length, 1)]
    || 'Improved question text.'
  suggestionIndex.value += 1
  return text
}

async function streamSuggestion(text, sleepFn, gen) {
  streaming.value = true
  currentSuggestion.value = ''
  const parts = text.split(/(\s+)/)
  let out = ''
  for (const part of parts) {
    if (gen !== rewriteGen) return
    out += part
    currentSuggestion.value = out
    await sleepFn(part.trim() ? 38 : 12)
  }
  if (gen !== rewriteGen) return
  currentSuggestion.value = text
  streaming.value = false
}

function handleRewrite() {
  startRewrite()
}

function onBeforeLeave() {
  if (bannerRef.value) {
    bannerRef.value.style.height = `${bannerRef.value.offsetHeight}px`
  }
}

function onEnter(el) {
  if (bannerRef.value) {
    bannerRef.value.style.height = `${el.offsetHeight}px`
  }
}

function onAfterEnter() {
  if (bannerRef.value) {
    bannerRef.value.style.height = ''
  }
}

async function startRewrite(sleepFn) {
  const gen = ++rewriteGen
  clearTimeout(rewriteTimer)
  rewriteState.value = 'busy'
  currentSuggestion.value = ''
  streaming.value = false

  const wait = sleepFn || ((ms) => new Promise((resolve) => {
    rewriteTimer = setTimeout(resolve, ms)
  }))

  await wait(2000)
  if (gen !== rewriteGen) return
  const suggestion = nextSuggestion()
  rewriteState.value = 'confirming'
  await nextTick()
  await streamSuggestion(suggestion, wait, gen)
}

function handleAccept() {
  if (streaming.value) return
  acceptSuggestion()
}

function acceptSuggestion() {
  if (!currentSuggestion.value || streaming.value) return
  rewriteGen += 1
  acceptPhase.value = 'blur-out'
  setTimeout(() => {
    localText.value = currentSuggestion.value
    acceptPhase.value = 'blur-in'
    rewriteState.value = 'idle'
    currentSuggestion.value = ''
    streaming.value = false
  }, 200)
  setTimeout(() => {
    acceptPhase.value = 'none'
  }, 450)
}

function handleCancel() {
  rewriteGen += 1
  clearTimeout(rewriteTimer)
  rewriteState.value = 'idle'
  currentSuggestion.value = ''
  streaming.value = false
}

function formatAcronymList(acronyms) {
  const quoted = acronyms.map((m) => `"${m}"`)
  if (quoted.length <= 1) return quoted[0] || ''
  if (quoted.length === 2) return `${quoted[0]} and ${quoted[1]}`
  return `${quoted.slice(0, -1).join(', ')}, and ${quoted[quoted.length - 1]}`
}

function acronymWarning(text, defined = {}) {
  const matches = (text.match(/\b[A-Z]{2,}\b/g) || []).filter((m) => !defined[m])
  if (matches.length === 0) return null
  return { acronyms: matches }
}

function saveQuestion() {
  if (!props.question) return
  props.question.text = localText.value
  props.question.validationWarning = acronymWarning(localText.value, props.question.definedTerms)
  emit('saved')
}

function resetEditor() {
  rewriteGen += 1
  clearTimeout(rewriteTimer)
  rewriteState.value = 'idle'
  acceptPhase.value = 'none'
  currentSuggestion.value = ''
  streaming.value = false
  suggestionIndex.value = 0
  if (props.question) {
    localText.value = props.question.text
  }
  resetSkipEditor(true)
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function resetSkipEditor(instant = false) {
  if (instant) skipNextLeaveAnimation = true
  skipEditorOpen.value = false
  skipDraft.value = ''
  skipSaved.value = ''
  skipPreviewFlash.value = false
  if (skipFlashTimer) {
    clearTimeout(skipFlashTimer)
    skipFlashTimer = null
  }
}

function toggleSkipEditor() {
  if (skipEditorOpen.value) {
    skipEditorOpen.value = false
    return
  }
  skipDraft.value = skipSaved.value
  skipEditorOpen.value = true
}

function cancelSkipEditor() {
  skipDraft.value = skipSaved.value
  skipEditorOpen.value = false
}

function saveSkipEditor() {
  skipSaved.value = skipDraft.value.trim()
  skipNextLeaveAnimation = true
  skipEditorOpen.value = false
  if (!skipSaved.value) return
  nextTick(() => {
    skipPreviewFlash.value = true
    if (skipFlashTimer) clearTimeout(skipFlashTimer)
    skipFlashTimer = setTimeout(() => {
      skipPreviewFlash.value = false
      skipFlashTimer = null
    }, 1000)
  })
}

function onSkipEditorEnter(el, done) {
  const ms = prefersReducedMotion() ? 0 : 280
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    el.style.transition = `height ${ms}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)`
    el.style.height = `${el.scrollHeight}px`
    el.style.opacity = '1'
  })
  setTimeout(() => {
    el.style.height = ''
    el.style.overflow = ''
    el.style.transition = ''
    done()
  }, ms)
}

function onSkipEditorLeave(el, done) {
  if (skipNextLeaveAnimation) {
    skipNextLeaveAnimation = false
    done()
    return
  }
  const ms = prefersReducedMotion() ? 0 : 160
  el.style.height = `${el.scrollHeight}px`
  el.style.overflow = 'hidden'
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = `height ${ms}ms ease-in, opacity ${ms}ms ease-in`
    el.style.height = '0px'
    el.style.opacity = '0'
  })
  setTimeout(done, ms)
}

async function typeQuestion(text, sleepFn) {
  if (!sleepFn) return
  localText.value = ''
  for (let i = 1; i <= text.length; i++) {
    localText.value = text.slice(0, i)
    await sleepFn(28)
  }
}

defineExpose({
  typeQuestion,
  startRewrite,
  acceptSuggestion,
  resetEditor,
  saveQuestion,
})
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
  min-height: 540px;
}

.question-detail::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--dt-space-500);
  padding: 1px;
  background: linear-gradient(
    135deg,
    #471571 0%,
    #551b84 3.08%,
    #7c229e 14.48%,
    #9024a4 23.67%,
    #b02290 35.5%,
    #d32b86 48.3%,
    #e92f6f 60.29%,
    #f6484f 70.08%,
    #fb7328 90.02%,
    #f3960f 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

.question-detail-fields {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-550);
}

.question-detail-header {
  padding-bottom: var(--dt-space-200);
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
}

.ai-question-input-wrapper:focus-within {
  border-color: var(--dt-color-link-primary);
  box-shadow: var(--dt-shadow-focus);
}

.ai-question-input-wrapper.has-warning,
.ai-question-input-wrapper.has-warning:focus-within {
  border-color: var(--dt-color-border-warning);
  box-shadow: none;
}

.ai-question-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: var(--dt-space-400) var(--dt-space-450);
  font: var(--dt-typography-body-md);
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
  gap: var(--dt-space-400);
  padding: 0 var(--dt-space-400);
  align-items: center;
  height: 46px;
}

.ai-warning-banner {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  min-height: 38px;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-warning-subtle);
  color: var(--dt-color-foreground-warning);
  font: var(--dt-typography-body-sm-compact);
}

.ai-warning-banner-icon {
  color: var(--dt-color-foreground-warning);
  flex-shrink: 0;
}

.warning-define-link {
  display: inline;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.warning-define-link:hover {
  text-decoration: none;
}

.compose-action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  height: var(--btn-height-sm);
  padding: 0 var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  color: var(--dt-color-foreground-secondary);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
  border-radius: var(--dt-space-400);
}

.compose-action-btn:hover {
  background: var(--dt-color-surface-secondary);
}

.compose-action-btn--rewrite {
  background: var(--dt-color-surface-brand-subtle);
  border-color: var(--dt-color-border-brand);
  color: var(--dt-color-link-primary);
}

.compose-action-btn--rewrite:hover {
  background: var(--dt-color-surface-brand-subtle);
  filter: brightness(0.97);
}

.compose-swap-enter-active,
.compose-swap-leave-active {
  transition: opacity 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.compose-swap-enter-from,
.compose-swap-leave-to {
  opacity: 0;
}

.ai-rewrite-banner {
  padding: 0 var(--dt-space-450);
  background: var(--dt-color-surface-brand-subtle);
  border-top: 1px solid var(--dt-color-border-brand);
  overflow: hidden;
  box-sizing: border-box;
  transition: height 0.15s cubic-bezier(0.22, 1, 0.36, 1);
}

.ai-rewrite-banner--busy {
  background-image: linear-gradient(
    170deg,
    rgba(71, 21, 113, 0.1) 0%,
    rgba(124, 34, 158, 0.1) 14%,
    rgba(233, 47, 111, 0.1) 60%,
    rgba(251, 115, 40, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: banner-shimmer 1.5s infinite linear;
}

.banner-busy {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  height: 46px;
  box-sizing: border-box;
}

.banner-confirming {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  position: relative;
  padding: var(--dt-space-450) 0;
}

.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}

.banner-sparkle {
  color: var(--dt-color-link-primary);
  flex-shrink: 0;
}

.thinking-label {
  font: var(--dt-typography-label-sm-compact);
  color: var(--dt-color-foreground-secondary);
}

.thinking-label--live {
  color: var(--dt-color-link-primary);
  animation: think-pulse 1.2s ease-in-out infinite;
}

.thinking-copy {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
}

.banner-close-btn {
  position: absolute;
  top: var(--dt-space-400);
  right: 0;
  background: none;
  border: none;
  color: var(--dt-color-foreground-muted);
  cursor: pointer;
  padding: var(--dt-space-200);
  line-height: 1;
  border-radius: var(--dt-space-300);
}

.banner-close-btn:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

.banner-header {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-350);
  padding-right: var(--dt-space-600);
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

.stream-caret {
  display: inline-block;
  width: 2px;
  height: 0.9em;
  margin-left: 1px;
  background: var(--dt-color-link-primary);
  vertical-align: text-bottom;
  animation: caret-blink 0.9s steps(1) infinite;
}

.banner-actions {
  display: flex;
  gap: var(--dt-space-200);
  justify-content: flex-end;
}

.banner-btn {
  height: var(--btn-height-sm);
  padding: 0 var(--dt-space-400);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
  border: none;
  background: none;
}

.banner-btn:disabled {
  opacity: 0.4;
  cursor: default;
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

.banner-btn--primary:hover:not(:disabled) {
  background: var(--dt-color-surface-brand-subtle);
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

.field-label {
  font: var(--dt-typography-headline-md);
  color: var(--dt-color-foreground-primary);
  padding-bottom: var(--dt-space-300);
  display: block;
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
  color: var(--dt-color-foreground-muted);
  margin: 0 0 var(--dt-space-300);
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

.checkbox-item--muted {
  color: var(--dt-color-foreground-muted);
  cursor: default;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--dt-color-link-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-item--muted input[type="checkbox"] {
  cursor: default;
}

.checkbox-content {
  display: flex;
  flex-direction: column;
}

.checkbox-desc {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-muted);
}

.skip-item {
  display: flex;
  flex-direction: column;
}

.skip-description,
.skip-inline-editor {
  padding-left: calc(16px + var(--dt-space-400));
}

.skip-description {
  display: block;
  margin-top: calc(-1 * var(--dt-space-200));
}

.skip-preview-text {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-tertiary);
  background-color: transparent;
  transition: background-color 3.6s linear;
}

.skip-preview-saved {
  background-color: var(--dt-color-gold-200);
  transition: none;
}

.skip-preview-text + .skip-link {
  margin-left: var(--dt-space-300);
}

.skip-link {
  padding: 0;
  border: none;
  background: none;
  color: var(--dt-color-foreground-muted);
  font: var(--dt-typography-body-sm);
  text-decoration: underline;
  cursor: pointer;
}

.skip-link:hover {
  color: var(--dt-color-foreground-secondary);
}

.skip-inline-editor {
  margin-top: var(--dt-space-400);
  padding-top: var(--dt-space-400);
  border-top: 1px solid var(--dt-color-border-subtle);
}

.skip-helper {
  margin: 0 0 var(--dt-space-400);
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
}

.skip-textarea {
  width: 100%;
  min-height: var(--dt-space-800);
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}

.skip-textarea::placeholder {
  color: var(--dt-color-foreground-muted);
}

.skip-textarea:focus {
  border-color: var(--dt-color-link-primary);
  box-shadow: var(--dt-shadow-focus);
}

.skip-inline-actions {
  display: flex;
  gap: var(--dt-space-300);
  justify-content: flex-end;
  margin-top: var(--dt-space-400);
}

.skip-btn {
  height: var(--btn-height-sm);
  padding: 0 var(--dt-space-400);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
}

.skip-btn--cancel {
  background: none;
  border: none;
  color: var(--dt-color-foreground-muted);
}

.skip-btn--cancel:hover {
  color: var(--dt-color-foreground-secondary);
}

.skip-btn--save {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  color: var(--dt-color-link-primary);
}

.skip-btn--save:hover {
  background: var(--dt-color-surface-brand-subtle);
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

@keyframes think-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.42; }
}

@keyframes banner-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes caret-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .thinking-label--live,
  .stream-caret,
  .ai-rewrite-banner--busy {
    animation: none;
  }

  .skip-preview-text,
  .skip-preview-saved {
    transition: none;
  }
}
</style>
