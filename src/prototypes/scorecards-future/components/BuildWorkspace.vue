<template>
  <div
    class="workspace"
    :class="{ 'workspace--split': layout === 'split' }"
  >
    <div class="workspace-header">
      <button class="header-icon-btn" type="button" aria-label="Past conversations">
        <DtIcon name="past-conversations" :size="20" />
      </button>
      <template v-if="layout !== 'welcome'">
        <span class="session-title">{{ sessionTitle }}</span>
        <button class="header-icon-btn" type="button" aria-label="Options">
          <DtIcon name="chevron-down" :size="16" />
        </button>
        <div class="header-spacer" />
        <button class="new-chat-btn" type="button" @click="resetDemo">
          <DtIcon name="plus" :size="16" />
          <span>New Chat</span>
        </button>
      </template>
    </div>

    <div class="workspace-body">
      <div class="chat-column">
        <!-- Welcome -->
        <div v-if="layout === 'welcome'" class="chat-body">
          <div class="chat-center">
            <div class="welcome-hero">
              <div class="bot-avatar">
                <DtIcon name="sparkle" :size="24" />
              </div>
              <h1 class="welcome-title">Hello</h1>
              <p class="welcome-subtitle">Let’s build a scorecard</p>
            </div>

            <div class="composer">
              <textarea
                ref="textareaRef"
                v-model="draft"
                class="composer-input"
                data-autoplay="composer-input"
                placeholder="What do you want to build?"
                rows="2"
                @keydown.enter.exact.prevent="submitDraft"
              />
              <div class="composer-action-bar">
                <button
                  class="create-btn"
                  :class="{ 'create-btn--ready': hasInput }"
                  type="button"
                  data-autoplay="create"
                  @click="submitDraft"
                >
                  Create
                </button>
              </div>
            </div>

            <div class="suggestions">
              <button
                v-for="chip in suggestionChips"
                :key="chip"
                class="suggestion-chip"
                type="button"
              >
                {{ chip }}
              </button>
            </div>
          </div>
        </div>

        <!-- Conversation -->
        <div v-else class="chat-body chat-body--conversation">
          <div
            ref="conversationRef"
            class="conversation-scroll"
            :class="{ 'is-scrolling': isScrolling }"
            @scroll="onConversationScroll"
          >
            <div class="conversation-area">
              <template v-for="(msg, i) in messages" :key="i">
                <div v-if="msg.role === 'user'" class="user-message">
                  <div class="user-avatar">
                    <DtIcon name="user" :size="16" />
                  </div>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-author">You</span>
                      <span class="message-time">{{ msg.time }}</span>
                    </div>
                    <p class="message-text">{{ msg.text }}</p>
                  </div>
                </div>

                <div v-else class="ai-message">
                  <div class="ai-avatar">
                    <DtIcon name="sparkle" :size="16" />
                  </div>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-author">Scorecards Ai</span>
                      <span class="message-time">{{ msg.time }}</span>
                    </div>
                    <p class="message-text">{{ msg.text }}</p>
                  </div>
                </div>
              </template>

              <div v-if="busy" class="processing-module">
                <div class="processing-bar">
                  <div class="processing-spinner" />
                  <span class="processing-text">{{ busyText }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="composer composer--docked">
            <textarea
              ref="textareaRef"
              v-model="draft"
              class="composer-input"
              data-autoplay="composer-input"
              placeholder="Reply…"
              rows="1"
              :disabled="busy"
              @keydown.enter.exact.prevent="submitDraft"
            />
            <div class="composer-action-bar">
              <button
                class="composer-send-btn"
                :class="{ 'has-input': hasInput }"
                type="button"
                data-autoplay="send"
                :disabled="busy"
                aria-label="Send"
                @click="submitDraft"
              >
                <DtIcon name="send" :size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="preview-column"
        :class="{ 'preview-column--editing': selectedQuestion }"
      >
        <div class="preview-header">
          <h2 class="preview-title">Refunds</h2>
          <span class="preview-draft">Draft</span>
        </div>
        <div class="preview-body">
          <div class="preview-list">
            <QuestionList
              :questions="questions"
              :selected-id="selectedQuestionId"
              @select="selectQuestion"
            />
          </div>
          <div class="preview-detail">
            <QuestionDetail :question="selectedQuestion" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'
import QuestionList from './QuestionList.vue'
import QuestionDetail from './QuestionDetail.vue'
import { SUGGESTION_CHIPS, createRefundQuestions } from '../data/script.js'

const suggestionChips = SUGGESTION_CHIPS

const textareaRef = ref(null)
const conversationRef = ref(null)
const isScrolling = ref(false)
let scrollTimer = null

const layout = ref('welcome')
const busy = ref(false)
const busyText = ref('')
const draft = ref('')
const messages = ref([])
const questions = ref([])
const selectedQuestionId = ref(null)
const sessionTitle = ref('')

const hasInput = computed(() => draft.value.trim().length > 0)
const selectedQuestion = computed(() =>
  questions.value.find((q) => q.id === selectedQuestionId.value) || null
)

let minuteOffset = 0
function currentTime() {
  const base = 14 * 60 + 22
  const mins = base + minuteOffset
  minuteOffset += 1
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function onConversationScroll() {
  const el = conversationRef.value
  isScrolling.value = true
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    isScrolling.value = false
  }, 1000)
  if (el) {
    void el.scrollTop
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (conversationRef.value) {
      conversationRef.value.scrollTop = conversationRef.value.scrollHeight
    }
  })
}

function submitDraft() {
  const text = draft.value.trim()
  if (!text || busy.value) return
  messages.value.push({ role: 'user', text, time: currentTime() })
  draft.value = ''
  sessionTitle.value = 'Refunds scorecard'
  if (layout.value === 'welcome') layout.value = 'chat'
  scrollToBottom()
}

function pushAi(text) {
  messages.value.push({ role: 'ai', text, time: currentTime() })
  scrollToBottom()
}

function startBusy(text) {
  busy.value = true
  busyText.value = text || ''
  scrollToBottom()
}

function setBusyText(text) {
  busyText.value = text
}

function stopBusy() {
  busy.value = false
  busyText.value = ''
}

function showPreview() {
  questions.value = createRefundQuestions()
  selectedQuestionId.value = null
  layout.value = 'split'
  scrollToBottom()
}

function selectQuestion(id) {
  selectedQuestionId.value = id
}

function resetDemo() {
  layout.value = 'welcome'
  busy.value = false
  busyText.value = ''
  draft.value = ''
  messages.value = []
  questions.value = []
  selectedQuestionId.value = null
  sessionTitle.value = ''
  minuteOffset = 0
}

async function typePrompt(text, sleepFn) {
  if (!sleepFn) return
  draft.value = ''
  for (let i = 1; i <= text.length; i++) {
    draft.value = text.slice(0, i)
    await sleepFn(28)
  }
}

defineExpose({
  typePrompt,
  typeReply: typePrompt,
  submitCreate: submitDraft,
  submitReply: submitDraft,
  startBusy,
  setBusyText,
  stopBusy,
  pushAi,
  showPreview,
  selectQuestion,
  resetDemo,
})
</script>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--dt-color-surface-primary);
}

.workspace-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  height: 56px;
  padding: 0 var(--dt-space-500);
  flex-shrink: 0;
}

.header-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  border: none;
  background: none;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  border-radius: var(--dt-space-400);
  padding: 0;
}

.header-icon-btn:hover {
  background: var(--dt-color-surface-secondary);
}

.session-title {
  font: var(--dt-typography-headline-md);
  color: var(--dt-color-foreground-primary);
}

.header-spacer {
  flex: 1;
}

.new-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-350);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-450);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-secondary);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
}

.new-chat-btn:hover {
  background: var(--dt-color-surface-secondary);
}

.workspace-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.chat-column {
  flex: 1 1 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: flex 0.6s ease;
}

.workspace--split .chat-column {
  flex: 2 1 0;
}

.preview-column {
  flex: 0 0 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--dt-color-surface-secondary);
  border-left: 1px solid transparent;
  transition: flex 0.6s ease, opacity 0.5s ease, width 0.6s ease;
}

.workspace--split .preview-column {
  flex: 3 1 0;
  width: auto;
  opacity: 1;
  overflow: hidden;
  border-left-color: var(--dt-color-border-subtle);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  padding: var(--dt-space-500) var(--dt-space-550) var(--dt-space-400);
  flex-shrink: 0;
}

.preview-title {
  font: var(--dt-typography-headline-lg);
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

.preview-draft {
  font: var(--dt-typography-label-sm-compact);
  color: var(--dt-color-foreground-muted);
  background: var(--dt-color-surface-moderate);
  border-radius: var(--dt-space-400);
  padding: 2px var(--dt-space-350);
}

.preview-body {
  flex: 1;
  display: flex;
  gap: var(--dt-space-400);
  min-height: 0;
  padding: 0 var(--dt-space-500) var(--dt-space-500);
}

.preview-list {
  flex: 1 1 100%;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  transition: flex 0.5s ease;
}

.preview-column--editing .preview-list {
  flex: 0 0 38%;
}

.preview-detail {
  flex: 0 0 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  transition: flex 0.5s ease, opacity 0.4s ease 0.08s;
}

.preview-column--editing .preview-detail {
  flex: 1.4 1 0;
  width: auto;
  opacity: 1;
  overflow: hidden;
}

.chat-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 0 var(--dt-space-550) var(--dt-space-600);
}

.chat-body--conversation {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0 var(--dt-space-550) var(--dt-space-500);
}

.chat-body--conversation .conversation-area {
  padding-left: 0;
  padding-right: 0;
}

.chat-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 764px;
}

.welcome-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--dt-space-600);
}

.bot-avatar,
.ai-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
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
    #f3960f 97.29%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--dt-space-500);
  color: var(--dt-color-surface-primary);
}

.ai-avatar {
  width: 32px;
  height: 32px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.welcome-title {
  font: var(--dt-typography-headline-xl);
  color: var(--dt-color-foreground-primary);
  margin: 0 0 var(--dt-space-200);
}

.welcome-subtitle {
  font: 500 var(--dt-font-size-300) / 1.3 var(--dt-font-family-body);
  color: var(--dt-color-foreground-secondary);
  margin: 0;
}

.composer {
  position: relative;
  width: 100%;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-500);
  margin-bottom: var(--dt-space-500);
}

.composer:focus-within {
  border-color: var(--dt-color-border-default);
}

.composer--docked {
  margin: 0;
  max-width: 732px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  flex-shrink: 0;
}

.composer-input {
  width: 100%;
  padding: var(--dt-space-400) var(--dt-space-500) 0;
  border: none;
  border-radius: var(--dt-space-500) var(--dt-space-500) 0 0;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  background: transparent;
  resize: none;
  outline: none;
  box-sizing: border-box;
}

.composer-input:focus,
.composer-input:focus-visible {
  outline: none !important;
  box-shadow: none;
}

.composer-input::placeholder {
  color: var(--dt-color-foreground-muted);
}

.composer-input:disabled {
  opacity: 0.5;
  cursor: default;
}

.composer-action-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--dt-space-400) var(--dt-space-400);
}

.create-btn {
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-500);
  border: none;
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  background: var(--dt-color-surface-moderate);
  color: var(--dt-color-foreground-muted);
  cursor: pointer;
}

.create-btn--ready {
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
}

.create-btn--ready:hover {
  background: var(--dt-color-link-primary-hover);
}

.composer-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  border: none;
  border-radius: var(--dt-space-400);
  background: none;
  color: var(--dt-color-foreground-muted);
  cursor: pointer;
  padding: 0;
}

.composer-send-btn:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

.composer-send-btn.has-input {
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
  border-radius: 50%;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--dt-space-400);
}

.suggestion-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px var(--dt-space-450);
  border-radius: 100px;
  border: 1px solid var(--dt-color-border-subtle);
  background: var(--dt-color-surface-primary);
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
  white-space: nowrap;
  cursor: default;
}

.conversation-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.conversation-scroll.is-scrolling {
  scrollbar-color: hsl(0 0% 0% / 0.25) transparent;
}

.conversation-area {
  padding: var(--dt-space-500) var(--dt-space-550) 0;
  max-width: 732px;
  width: 100%;
  margin: 0 auto;
}

.user-message,
.ai-message {
  display: flex;
  gap: var(--dt-space-450);
  margin-bottom: var(--dt-space-500);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--dt-color-surface-moderate);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dt-color-foreground-muted);
  flex-shrink: 0;
}

.message-content {
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-400);
  margin-bottom: var(--dt-space-200);
}

.message-author {
  font: var(--dt-typography-label-md-compact);
  color: var(--dt-color-foreground-primary);
}

.message-time {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
}

.message-text {
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

.processing-module {
  padding: var(--dt-space-200) 0 var(--dt-space-500);
}

.processing-bar {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  padding: 10px var(--dt-space-450);
  border-radius: var(--dt-space-400);
  background-image: linear-gradient(
    170deg,
    rgba(71, 21, 113, 0.1) 0%,
    rgba(85, 27, 132, 0.1) 3.08%,
    rgba(124, 34, 158, 0.1) 14.48%,
    rgba(144, 36, 164, 0.1) 23.67%,
    rgba(176, 34, 144, 0.1) 35.5%,
    rgba(211, 43, 134, 0.1) 48.3%,
    rgba(233, 47, 111, 0.1) 60.29%,
    rgba(246, 72, 79, 0.1) 70.08%,
    rgba(251, 115, 40, 0.1) 90.02%,
    rgba(243, 150, 15, 0.1) 97.29%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.processing-spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: conic-gradient(
    from 180deg,
    transparent 0deg,
    #471571 60deg,
    #7c229e 120deg,
    #b02290 180deg,
    #e92f6f 240deg,
    #fb7328 300deg,
    transparent 360deg
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px));
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

.processing-text {
  font: var(--dt-typography-label-md-compact);
  color: var(--dt-color-foreground-primary);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
