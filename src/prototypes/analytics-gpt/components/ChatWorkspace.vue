<template>
  <div class="chat-workspace">
    <!-- Header -->
    <div class="chat-header">
      <button class="header-icon-btn" aria-label="Past conversations">
        <MessagesSquare :size="20" />
      </button>
      <template v-if="messages.length > 0">
        <span class="session-title">{{ sessionTitle }}</span>
        <button class="header-icon-btn" aria-label="Options">
          <ChevronDown :size="16" />
        </button>
      </template>
      <div v-if="messages.length > 0" class="header-spacer" />
      <button v-if="messages.length > 0" class="new-chat-btn" @click="resetChat">
        <Plus :size="16" />
        <span>New Chat</span>
      </button>
    </div>

    <!-- Welcome state -->
    <div v-if="phase === 'welcome'" class="chat-body">
      <div class="chat-center">
        <!-- Welcome hero -->
        <div class="welcome-hero">
          <div class="bot-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9979 4.98108C15.7124 5.58347 16.412 6.22639 17.0927 6.90576C23.0191 12.8339 25.7471 19.8478 22.7975 22.799C21.0661 24.5291 17.945 24.3333 14.3481 22.5761C13.92 22.3667 13.7417 21.8481 13.9511 21.4199C14.1604 20.9904 14.6791 20.8135 15.1072 21.0228C18.1149 22.4924 20.5081 22.6423 21.5751 21.5766C23.5753 19.5749 21.1956 13.4539 15.8703 8.12938C15.2247 7.48376 14.5602 6.87328 13.8836 6.30331C13.5189 5.99672 13.473 5.45107 13.7796 5.08639C14.0875 4.72036 14.6333 4.67448 14.9979 4.98108ZM18.9132 13.7968C19.2778 14.1061 19.3224 14.6517 19.0131 15.015C18.4256 15.7079 17.7841 16.4022 17.0926 17.0937C11.1648 23.0205 4.15129 25.7486 1.20173 22.7989C-0.528355 21.0687 -0.333873 17.9502 1.42187 14.3545C1.63121 13.9264 2.14849 13.7481 2.5766 13.9574C3.00608 14.1668 3.18435 14.6841 2.975 15.1136C1.50692 18.1188 1.35836 20.5107 2.42395 21.5764C4.42416 23.5767 10.5449 21.1968 15.8704 15.8712C16.5295 15.2121 17.1386 14.553 17.695 13.8966C18.0043 13.5332 18.5486 13.4888 18.9132 13.7968ZM9.64405 1.42071C10.0722 1.63006 10.2505 2.14872 10.0411 2.57689C9.83177 3.0064 9.31449 3.18468 8.885 2.97531C5.87997 1.50715 3.48962 1.35857 2.42368 2.42423C0.422116 4.42456 2.80321 10.5456 8.1285 15.8715C8.77139 16.5157 9.43449 17.1235 10.1098 17.6921C10.4745 18.0001 10.5204 18.5458 10.2138 18.9104C9.90587 19.2751 9.36022 19.3224 8.9956 19.0144C8.28249 18.4147 7.58426 17.7718 6.9049 17.0938C0.97845 11.1656 -1.74949 4.15171 1.20146 1.20197C2.93019 -0.528216 6.04898 -0.333788 9.64405 1.42071ZM12.0454 8.99924C12.2223 9.04516 12.3573 9.18293 12.4006 9.35987L12.7585 10.8537C12.8206 11.1117 13.0178 11.317 13.2744 11.3886L14.5926 11.7586C14.8343 11.8262 14.9748 12.076 14.9072 12.3178C14.8627 12.4758 14.7357 12.5987 14.5763 12.6366L13.3271 12.9364C13.0529 13.0026 12.8422 13.2187 12.7814 13.4942L12.41 15.1974C12.3547 15.4567 12.0981 15.6215 11.8388 15.5648C11.6551 15.5243 11.5119 15.3811 11.4728 15.1974L11.1014 13.4969C11.0419 13.22 10.8272 13.0039 10.553 12.9391L9.25918 12.6339C9.01337 12.5771 8.86212 12.3313 8.92018 12.0855C8.958 11.9234 9.0809 11.7951 9.24027 11.7505L10.5409 11.3859C10.7921 11.3156 10.9879 11.1171 11.0527 10.8645L11.4471 9.35044C11.5146 9.08841 11.7833 8.93036 12.0454 8.99924ZM22.7974 1.20184C24.5288 2.93337 24.3344 6.06298 22.5759 9.6638C22.3666 10.0933 21.8479 10.2702 21.4198 10.0609C20.9903 9.85153 20.812 9.33422 21.0227 8.90471C22.4935 5.89276 22.6434 3.49275 21.5751 2.42433C19.5736 0.422651 13.4529 2.80388 8.1287 8.12949C7.48043 8.77646 6.86728 9.44369 6.29597 10.1231C5.98804 10.4891 5.44377 10.535 5.07776 10.2284C4.7131 9.92046 4.66584 9.37616 4.97377 9.01013C5.57613 8.29294 6.22306 7.58923 6.90508 6.90582C12.8329 0.979021 19.8465 -1.74929 22.7974 1.20184Z" fill="white"/>
            </svg>
          </div>
          <h1 class="welcome-title">Hello, Sarah</h1>
          <p class="welcome-subtitle">How can I help you today?</p>
        </div>

        <!-- Composer -->
        <div class="composer">
          <textarea
            ref="textareaRef"
            class="composer-input"
            placeholder="Ask me any Analytics questions"
            rows="1"
            @input="autoResize"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <div class="composer-action-bar">
            <button class="composer-send-btn" :class="{ 'has-input': hasInput }" aria-label="Send" @click="sendMessage">
              <Send :size="20" />
            </button>
          </div>
        </div>

        <!-- Suggestion chips -->
        <div class="suggestions" :class="{ 'is-refreshing': isRefreshing }">
          <button
            v-for="chip in suggestionChips"
            :key="chip"
            class="suggestion-chip"
            @click="selectChip(chip)"
          >
            {{ chip }}
          </button>
        </div>

        <!-- Refresh suggestions -->
        <button class="refresh-btn" :disabled="isRefreshing" @click="refreshSuggestions">
          <RefreshCw :size="16" />
          <span>Refresh Suggestions</span>
        </button>
      </div>
    </div>

    <!-- Conversation state -->
    <div v-else class="chat-body chat-body--conversation">
      <div ref="conversationRef" class="conversation-scroll" :class="{ 'is-scrolling': isScrolling }" @scroll="onConversationScroll">
      <div class="conversation-area">
        <template v-for="(msg, i) in messages" :key="i">
          <!-- User message -->
          <div v-if="msg.role === 'user'" class="user-message">
            <div class="user-avatar">
              <User :size="16" />
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">You</span>
                <span class="message-time">{{ msg.time }}</span>
              </div>
              <p class="message-text">{{ msg.text }}</p>
            </div>
          </div>

          <!-- AI message -->
          <div v-else class="ai-message">
            <div class="ai-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9979 4.98108C15.7124 5.58347 16.412 6.22639 17.0927 6.90576C23.0191 12.8339 25.7471 19.8478 22.7975 22.799C21.0661 24.5291 17.945 24.3333 14.3481 22.5761C13.92 22.3667 13.7417 21.8481 13.9511 21.4199C14.1604 20.9904 14.6791 20.8135 15.1072 21.0228C18.1149 22.4924 20.5081 22.6423 21.5751 21.5766C23.5753 19.5749 21.1956 13.4539 15.8703 8.12938C15.2247 7.48376 14.5602 6.87328 13.8836 6.30331C13.5189 5.99672 13.473 5.45107 13.7796 5.08639C14.0875 4.72036 14.6333 4.67448 14.9979 4.98108ZM18.9132 13.7968C19.2778 14.1061 19.3224 14.6517 19.0131 15.015C18.4256 15.7079 17.7841 16.4022 17.0926 17.0937C11.1648 23.0205 4.15129 25.7486 1.20173 22.7989C-0.528355 21.0687 -0.333873 17.9502 1.42187 14.3545C1.63121 13.9264 2.14849 13.7481 2.5766 13.9574C3.00608 14.1668 3.18435 14.6841 2.975 15.1136C1.50692 18.1188 1.35836 20.5107 2.42395 21.5764C4.42416 23.5767 10.5449 21.1968 15.8704 15.8712C16.5295 15.2121 17.1386 14.553 17.695 13.8966C18.0043 13.5332 18.5486 13.4888 18.9132 13.7968ZM9.64405 1.42071C10.0722 1.63006 10.2505 2.14872 10.0411 2.57689C9.83177 3.0064 9.31449 3.18468 8.885 2.97531C5.87997 1.50715 3.48962 1.35857 2.42368 2.42423C0.422116 4.42456 2.80321 10.5456 8.1285 15.8715C8.77139 16.5157 9.43449 17.1235 10.1098 17.6921C10.4745 18.0001 10.5204 18.5458 10.2138 18.9104C9.90587 19.2751 9.36022 19.3224 8.9956 19.0144C8.28249 18.4147 7.58426 17.7718 6.9049 17.0938C0.97845 11.1656 -1.74949 4.15171 1.20146 1.20197C2.93019 -0.528216 6.04898 -0.333788 9.64405 1.42071ZM12.0454 8.99924C12.2223 9.04516 12.3573 9.18293 12.4006 9.35987L12.7585 10.8537C12.8206 11.1117 13.0178 11.317 13.2744 11.3886L14.5926 11.7586C14.8343 11.8262 14.9748 12.076 14.9072 12.3178C14.8627 12.4758 14.7357 12.5987 14.5763 12.6366L13.3271 12.9364C13.0529 13.0026 12.8422 13.2187 12.7814 13.4942L12.41 15.1974C12.3547 15.4567 12.0981 15.6215 11.8388 15.5648C11.6551 15.5243 11.5119 15.3811 11.4728 15.1974L11.1014 13.4969C11.0419 13.22 10.8272 13.0039 10.553 12.9391L9.25918 12.6339C9.01337 12.5771 8.86212 12.3313 8.92018 12.0855C8.958 11.9234 9.0809 11.7951 9.24027 11.7505L10.5409 11.3859C10.7921 11.3156 10.9879 11.1171 11.0527 10.8645L11.4471 9.35044C11.5146 9.08841 11.7833 8.93036 12.0454 8.99924ZM22.7974 1.20184C24.5288 2.93337 24.3344 6.06298 22.5759 9.6638C22.3666 10.0933 21.8479 10.2702 21.4198 10.0609C20.9903 9.85153 20.812 9.33422 21.0227 8.90471C22.4935 5.89276 22.6434 3.49275 21.5751 2.42433C19.5736 0.422651 13.4529 2.80388 8.1287 8.12949C7.48043 8.77646 6.86728 9.44369 6.29597 10.1231C5.98804 10.4891 5.44377 10.535 5.07776 10.2284C4.7131 9.92046 4.66584 9.37616 4.97377 9.01013C5.57613 8.29294 6.22306 7.58923 6.90508 6.90582C12.8329 0.979021 19.8465 -1.74929 22.7974 1.20184Z" fill="white"/>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">Analytics Ai</span>
                <span class="message-time">{{ msg.time }}</span>
              </div>
              <div class="ai-message-text" v-html="msg.answer" />

              <!-- Chart widget (only for messages with chart config) -->
              <div v-if="msg.chart" class="chart-widget-container">
                <!-- Loading state -->
                <div v-if="msg.chartLoading" class="chart-loading-state">
                  <p class="chart-widget-title">{{ msg.chart.title }}</p>
                  <div class="chart-loading-content">
                    <div class="chart-loading-spinner" />
                    <span class="chart-loading-label">Rendering visualization...</span>
                  </div>
                </div>
                <!-- Loaded chart -->
                <LineChartWidget
                  v-else
                  :title="msg.chart.title"
                  :value="msg.chart.value"
                  :chart-data="msg.chart.chartData"
                />
              </div>

              <!-- Chart processing bar (shown while chart is loading) -->
              <div v-if="msg.chart && msg.chartLoading" class="processing-module">
                <div class="processing-bar">
                  <div class="processing-spinner" />
                  <span class="processing-text">Getting tabular data...</span>
                </div>
              </div>

              <!-- Action buttons — only on the LAST AI message -->
              <div v-if="i === lastAiMessageIndex" class="message-actions">
                <div class="message-actions-left">
                  <button class="action-icon-btn" aria-label="Copy" data-tooltip="Copy"><Copy :size="16" /></button>
                  <button class="action-icon-btn" aria-label="Add to playlist" data-tooltip="Add to playlist"><List :size="16" /></button>
                </div>
                <div class="message-actions-right">
                  <button class="action-icon-btn" aria-label="Helpful" data-tooltip="Helpful"><ThumbsUp :size="16" /></button>
                  <button class="action-icon-btn" aria-label="Not helpful" data-tooltip="Not helpful"><ThumbsDown :size="16" /></button>
                </div>
              </div>

              <!-- Follow-up suggestions — only on the LAST AI message when not busy -->
              <div v-if="i === lastAiMessageIndex && phase === 'done'" class="followup-suggestions">
                <span class="followup-label">You might also be interested in...</span>
                <div class="followup-chips">
                  <button
                    v-for="chip in msg.suggestions"
                    :key="chip"
                    class="suggestion-chip"
                    @click="selectFollowup(chip)"
                  >{{ chip }}</button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Processing indicator (always at bottom during busy) -->
        <div v-if="phase === 'busy'" class="processing-module">
          <div class="processing-bar">
            <div class="processing-spinner" />
            <span class="processing-text">{{ busyText }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom fade gradient -->
      <div class="scroll-fade" :class="{ 'scroll-fade--hidden': isAtBottom }" />
      </div>

      <!-- Composer (bottom-pinned) -->
      <div class="composer">
        <textarea
          ref="textareaRef"
          class="composer-input"
          placeholder="Ask me any Analytics questions"
          rows="1"
          :disabled="phase === 'busy'"
          @input="autoResize"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <div class="composer-action-bar">
          <button v-if="phase === 'busy'" class="composer-send-btn" aria-label="Stop">
            <CircleStop :size="20" />
          </button>
          <button v-else class="composer-send-btn" :class="{ 'has-input': hasInput }" aria-label="Send" @click="sendMessage">
            <Send :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'
import { MessagesSquare, Send, RefreshCw, ChevronDown, Plus, User, CircleStop, Copy, List, ThumbsUp, ThumbsDown } from '@lucide/vue'
import LineChartWidget from '../../launchpad/components/LineChartWidget.vue'

const textareaRef = ref(null)
const conversationRef = ref(null)
const isRefreshing = ref(false)
const hasInput = ref(false)

const isScrolling = ref(false)
const isAtBottom = ref(true)
let scrollTimer = null
function onConversationScroll () {
  const el = conversationRef.value
  isScrolling.value = true
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => { isScrolling.value = false }, 1000)
  if (el) {
    isAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 2
  }
}

// State machine: 'welcome' | 'busy' | 'done'
const phase = ref('welcome')
const messages = ref([])
const sessionTitle = ref('')
const busyText = ref('')

// Fake timestamp generator
let minuteOffset = 0
function currentTime () {
  const base = 12 * 60 + 35 // 12:35
  const mins = base + minuteOffset
  minuteOffset += 2
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

const lastAiMessageIndex = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].role === 'ai') return i
  }
  return -1
})

function scrollToBottom () {
  nextTick(() => {
    if (conversationRef.value) {
      conversationRef.value.scrollTop = conversationRef.value.scrollHeight
    }
  })
}

const busyPhrases = [
  'Understanding your question...',
  'Searching analytics data...',
  'Analyzing results...',
  'Preparing response...',
]

let phraseInterval = null
let doneTimeout = null
let chartLoadTimeout = null

function sendMessage () {
  const text = textareaRef.value?.value?.trim()
  if (!text || phase.value === 'busy') return

  // Push user message
  messages.value.push({ role: 'user', text, time: currentTime() })
  if (!sessionTitle.value) sessionTitle.value = text

  const pendingQuestion = text
  textareaRef.value.value = ''
  textareaRef.value.style.height = 'auto'
  hasInput.value = false
  phase.value = 'busy'
  scrollToBottom()

  // Start cycling phrases
  let phraseIndex = 0
  busyText.value = busyPhrases[phraseIndex]

  phraseInterval = setInterval(() => {
    phraseIndex++
    if (phraseIndex < busyPhrases.length) {
      busyText.value = busyPhrases[phraseIndex]
    } else {
      clearInterval(phraseInterval)
      phraseInterval = null
    }
  }, 1500)

  // Transition to done after all phrases have shown
  doneTimeout = setTimeout(() => {
    clearInterval(phraseInterval)
    phraseInterval = null

    const matched = mockAnswers[pendingQuestion] || defaultAnswer
    const aiMessage = {
      role: 'ai',
      text: pendingQuestion,
      answer: matched.answer,
      suggestions: matched.suggestions,
      time: currentTime(),
      chart: matched.chart || null,
      chartLoading: !!matched.chart,
    }
    messages.value.push(aiMessage)
    phase.value = 'done'
    scrollToBottom()

    if (matched.chart) {
      const msgIndex = messages.value.length - 1
      chartLoadTimeout = setTimeout(() => {
        messages.value[msgIndex].chartLoading = false
        nextTick(() => scrollToBottom())
      }, 3000)
    }
  }, busyPhrases.length * 1500)
}

function resetChat () {
  clearInterval(phraseInterval)
  clearTimeout(doneTimeout)
  clearTimeout(chartLoadTimeout)
  phraseInterval = null
  doneTimeout = null
  chartLoadTimeout = null
  phase.value = 'welcome'
  messages.value = []
  sessionTitle.value = ''
  minuteOffset = 0
  busyText.value = ''
  isRefreshing.value = false
  currentSetIndex = 0
  suggestionChips.value = chipSets[currentSetIndex]
}

onUnmounted(() => {
  clearInterval(phraseInterval)
  clearTimeout(doneTimeout)
  clearTimeout(chartLoadTimeout)
  clearTimeout(scrollTimer)
})

const chipSets = [
  [
    'Show me handle times',
    'Top performers by CSAT',
    'Analyze call volume',
    'Count of missed calls',
    'Review high wait times',
  ],
  [
    'Review high hold times',
    'What is SLA?',
    'Top answered calls and sessions by contact centers',
    'Show me voice and digital SLA',
    'Review agent productivity percentage',
  ],
  [
    'Compare weekly call trends',
    'Busiest hours by queue',
    'Average speed of answer',
    'Agent utilization rates',
    'Abandoned call reasons',
  ],
]

let currentSetIndex = 0
const suggestionChips = ref(chipSets[currentSetIndex])

function refreshSuggestions () {
  isRefreshing.value = true
  setTimeout(() => {
    currentSetIndex = (currentSetIndex + 1) % chipSets.length
    suggestionChips.value = chipSets[currentSetIndex]
    isRefreshing.value = false
  }, 2000)
}

function selectChip (text) {
  textareaRef.value.value = text
  sendMessage()
}

function autoResize (event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
  hasInput.value = el.value.trim().length > 0
}

const mockAnswers = {
  'Show me handle times': {
    answer: '<p>Here\'s a summary of your handle times for the past 30 days:</p><p>The <strong>average handle time (AHT)</strong> across all queues is <strong>4 minutes 32 seconds</strong>, which is 8% lower than the previous period. Voice calls average 5m 12s, while digital channels average 3m 15s.</p><p>The Sales queue has the highest AHT at 6m 45s, driven by longer wrap-up times. Support queue is performing well at 3m 58s, under the 4-minute target.</p>',
    suggestions: ['Compare handle times by queue', 'Show wrap-up time breakdown', 'Handle time trend over 90 days'],
  },
  'Top performers by CSAT': {
    answer: '<p>Here are your <strong>top 10 agents by CSAT score</strong> for this month:</p><p>1. <strong>Maria Chen</strong> — 98.2% (142 surveys)<br>2. <strong>James Wilson</strong> — 97.8% (128 surveys)<br>3. <strong>Priya Patel</strong> — 96.5% (156 surveys)<br>4. <strong>Alex Rodriguez</strong> — 96.1% (134 surveys)<br>5. <strong>Sarah Kim</strong> — 95.8% (119 surveys)</p><p>The team average CSAT is 89.4%, up from 87.1% last month. Top performers share high first-contact resolution rates averaging 94%.</p>',
    suggestions: ['Show CSAT trends over time', 'Lowest CSAT agents', 'CSAT by contact channel'],
  },
  'Analyze call volume': {
    answer: '<p>Your <strong>call volume analysis</strong> for the current period shows:</p><p>Total inbound calls: <strong>12,847</strong> (up 5.3% from last period). Peak hours are <strong>10:00–11:30 AM</strong> and <strong>2:00–3:30 PM</strong> across all queues.</p><p>Monday and Tuesday consistently have the highest volume, averaging 2,800 calls per day. Weekends drop to around 950 calls per day. The Support queue handles 45% of all volume, followed by Sales at 30%.</p>',
    suggestions: ['Call volume by day of week', 'Peak hour staffing recommendations', 'Volume forecast for next month'],
  },
  'Count of missed calls': {
    answer: '<p>In the last 30 days, there were <strong>1,204 missed calls</strong> across all queues, representing a <strong>9.4% miss rate</strong>.</p><p>Breakdown by queue:<br>• Support: 512 missed (8.7% miss rate)<br>• Sales: 398 missed (10.2% miss rate)<br>• Billing: 294 missed (11.1% miss rate)</p><p>Most missed calls occur during peak hours (10–11 AM) when staffing is below recommended levels. After-hours missed calls account for 22% of the total.</p>',
    suggestions: ['Missed calls by time of day', 'Callback completion rate', 'Staffing vs missed call correlation'],
  },
  'Review high wait times': {
    answer: '<p>The <strong>average wait time</strong> across all queues is currently <strong>2 minutes 18 seconds</strong>, which is above the 90-second target.</p><p>Queues with the highest wait times:<br>• Billing: <strong>3m 42s</strong> avg (target: 1m 30s)<br>• Technical Support: <strong>3m 15s</strong> avg (target: 2m 00s)<br>• Sales: <strong>1m 48s</strong> avg (target: 1m 30s)</p><p>Wait times spike significantly between 10:00–11:30 AM, with the 95th percentile reaching 8m 20s during this window.</p>',
    suggestions: ['Wait time trends this quarter', 'Impact of wait time on abandonment', 'Queue staffing recommendations'],
  },
  'Review high hold times': {
    answer: '<p>Your <strong>hold time metrics</strong> show an average of <strong>1 minute 45 seconds</strong> per hold event, with an average of 1.3 holds per call.</p><p>Queues with highest hold times:<br>• Technical Support: <strong>2m 38s</strong> avg (often for escalation lookups)<br>• Billing: <strong>2m 12s</strong> avg (account verification related)<br>• Sales: <strong>1m 05s</strong> avg (pricing confirmations)</p><p>Calls with holds longer than 3 minutes have a 34% lower CSAT score compared to calls with no holds.</p>',
    suggestions: ['Hold frequency by agent', 'Hold time impact on CSAT', 'Common hold reasons'],
  },
  'What is SLA?': {
    answer: '<p><strong>SLA (Service Level Agreement)</strong> in contact centers measures the percentage of calls answered within a target time threshold.</p><p>Your current SLA targets are:<br>• Voice: 80% of calls answered within 20 seconds<br>• Chat: 90% of chats responded to within 30 seconds<br>• Email: 95% of emails responded to within 4 hours</p><p>Current performance: Voice SLA is at <strong>76.3%</strong> (below target), Chat is at <strong>92.1%</strong> (above target), and Email is at <strong>97.8%</strong> (above target).</p>',
    suggestions: ['SLA trends this quarter', 'Which queues miss SLA most', 'SLA improvement recommendations'],
  },
  'Top answered calls and sessions by contact centers': {
    answer: '<p>Here are the <strong>top-performing contact centers</strong> by answered calls and sessions:</p><p>1. <strong>Austin, TX</strong> — 4,230 answered calls | 1,850 chat sessions<br>2. <strong>Denver, CO</strong> — 3,890 answered calls | 1,620 chat sessions<br>3. <strong>Tampa, FL</strong> — 3,415 answered calls | 1,380 chat sessions<br>4. <strong>Portland, OR</strong> — 2,780 answered calls | 1,150 chat sessions</p><p>Austin leads in both volume and answer rate at 94.2%, while Denver has the highest CSAT at 91.8%.</p>',
    suggestions: ['Compare centers by efficiency', 'Center staffing levels', 'Center performance trends'],
  },
  'Show me voice and digital SLA': {
    answer: '<p>Here\'s your <strong>SLA performance</strong> across voice and digital channels:</p><p><strong>Key Findings</strong></p><ul><li><strong>Overall Q3 SLA Compliance:</strong> 82.4% (above target of 80%)</li><li><strong>Best Performing Channel:</strong> Email at 97.8%</li><li><strong>Improvement Opportunity:</strong> Voice at 76.3%</li><li><strong>Trend:</strong> +2.3% improvement from Q2 2024</li></ul>',
    suggestions: ['SLA by time of day', 'Voice SLA improvement plan', 'Digital channel volume trends'],
    chart: {
      title: 'Q3 2024 SLA Performance by Channel',
      value: '82.4%',
      chartData: {
        labels: ['Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 5', 'Aug 12', 'Aug 19', 'Aug 26', 'Sep 2', 'Sep 9', 'Sep 16'],
        datasets: [
          { label: 'Voice', data: [74, 73.5, 75, 76, 75.5, 76, 77, 76.5, 76, 76.3, 77, 76.3], borderColor: '#602DFF', borderWidth: 2, tension: 0.4, pointRadius: 0, borderDash: [] },
          { label: 'Chat', data: [89, 90, 91, 91.5, 92, 91.8, 92, 92.5, 92, 92.1, 93, 92.1], borderColor: '#FFBD6A', borderWidth: 2, tension: 0.4, pointRadius: 0, borderDash: [] },
          { label: 'SMS', data: [85, 86, 87, 87.5, 88, 88.3, 88, 89, 88.5, 88.7, 89, 88.7], borderColor: '#EA5F94', borderWidth: 2, tension: 0.4, pointRadius: 0, borderDash: [] },
          { label: 'Email', data: [96, 96.5, 97, 97, 97.5, 97.2, 97.5, 98, 97.8, 97.8, 97.5, 97.8], borderColor: '#A38FF9', borderWidth: 2, tension: 0.4, pointRadius: 0, borderDash: [5, 5] },
          { label: 'Target', data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80], borderColor: '#ccc', borderWidth: 1.5, tension: 0, pointRadius: 0, borderDash: [5, 5] },
        ],
      },
    },
  },
  'Review agent productivity percentage': {
    answer: '<p>The overall <strong>agent productivity rate</strong> is currently <strong>78.4%</strong>, measured as time spent on active interactions versus total logged-in time.</p><p>Breakdown by team:<br>• Sales: <strong>82.1%</strong> (target: 80%)<br>• Support: <strong>76.8%</strong> (target: 78%)<br>• Billing: <strong>74.2%</strong> (target: 75%)</p><p>Top factors reducing productivity: after-call work averaging 48 seconds over target, and idle time between calls averaging 35 seconds. Agents handling blended voice+chat have 6% higher productivity.</p>',
    suggestions: ['Productivity by shift time', 'Top productive agents', 'Idle time analysis'],
  },
  'Compare weekly call trends': {
    answer: '<p>Here\'s a <strong>weekly call volume comparison</strong> over the past 6 weeks:</p><p>• Week 1: 11,420 calls<br>• Week 2: 12,105 calls (+6.0%)<br>• Week 3: 11,890 calls (-1.8%)<br>• Week 4: 12,340 calls (+3.8%)<br>• Week 5: 12,847 calls (+4.1%)<br>• Week 6 (current): 9,230 calls (projected: 12,950)</p><p>There\'s a consistent upward trend of approximately 2.5% week-over-week growth. Monday volumes are increasing faster than other days, suggesting a shift in customer contact patterns.</p>',
    suggestions: ['Daily breakdown for this week', 'Forecast for next 4 weeks', 'Seasonal patterns analysis'],
  },
  'Busiest hours by queue': {
    answer: '<p>Here are the <strong>peak hours by queue</strong> based on the last 30 days:</p><p><strong>Support:</strong> 10:00–11:30 AM (avg 145 calls/hr)<br><strong>Sales:</strong> 2:00–3:30 PM (avg 98 calls/hr)<br><strong>Billing:</strong> 9:00–10:00 AM (avg 72 calls/hr)<br><strong>Technical:</strong> 1:00–2:30 PM (avg 65 calls/hr)</p><p>The overlap between Support and Technical peaks (around 1–2 PM) creates the highest total load period. Consider staggered breaks and cross-training to handle this window.</p>',
    suggestions: ['Staffing heat map', 'Queue overflow analysis', 'Break schedule optimization'],
  },
  'Average speed of answer': {
    answer: '<p>Your <strong>Average Speed of Answer (ASA)</strong> across all queues is <strong>28 seconds</strong>, which is within the industry benchmark of 20–40 seconds.</p><p>By queue:<br>• Sales: <strong>18s</strong> (excellent)<br>• Support: <strong>32s</strong> (acceptable)<br>• Billing: <strong>41s</strong> (needs attention)<br>• Technical: <strong>36s</strong> (acceptable)</p><p>ASA has improved 12% this month after adding 3 agents to the Billing queue. However, during peak hours ASA spikes to 55s on average.</p>',
    suggestions: ['ASA trend over time', 'ASA impact on abandonment', 'Staffing recommendations for ASA'],
  },
  'Agent utilization rates': {
    answer: '<p>Current <strong>agent utilization rates</strong> (active handle time / total available time):</p><p>• Overall: <strong>71.3%</strong> (target: 70–80%)<br>• Voice agents: <strong>74.8%</strong><br>• Digital agents: <strong>68.2%</strong><br>• Blended agents: <strong>79.1%</strong></p><p>Utilization is highest during 10 AM–12 PM at 86%, which is above the recommended 85% threshold and may indicate understaffing. Evening shifts average 52% utilization, suggesting potential for schedule optimization.</p>',
    suggestions: ['Utilization by shift', 'Overtime vs utilization correlation', 'Optimal utilization targets'],
  },
  'Abandoned call reasons': {
    answer: '<p>Analysis of <strong>abandoned calls</strong> shows 1,847 abandonments this month (14.4% abandon rate):</p><p><strong>Primary reasons:</strong><br>• Long wait time (>2 min): <strong>58%</strong> of abandonments<br>• IVR drop-off: <strong>19%</strong> (mostly at menu level 3)<br>• After-hours calls: <strong>14%</strong><br>• System disconnects: <strong>9%</strong></p><p>The average time-to-abandon is 1 minute 52 seconds. Callers who wait past 2 minutes have a 40% abandon rate. Adding a callback option at the 90-second mark could reduce abandonments by an estimated 25%.</p>',
    suggestions: ['Abandonment by time of day', 'IVR optimization suggestions', 'Callback feature impact analysis'],
  },
}

const defaultAnswer = {
  answer: '<p>I\'ve analyzed the available data related to your question. Here\'s what I found:</p><p>Based on the current analytics, your contact center is handling an average of <strong>12,500 interactions per week</strong> across all channels. Key metrics are trending positively, with CSAT at 89.4% and first-contact resolution at 78.2%.</p><p>For a more specific analysis, try asking about a particular metric like handle times, CSAT scores, call volume, or agent productivity.</p>',
  suggestions: ['Show me handle times', 'Top performers by CSAT', 'Analyze call volume'],
}

function selectFollowup (text) {
  textareaRef.value.value = text
  sendMessage()
}
</script>

<style scoped>
.chat-workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
  border-radius: 16px 16px 0 0;
}

.chat-header {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  flex-shrink: 0;
  gap: 4px;
}

.header-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: none;
  color: #535353;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.header-icon-btn:hover {
  background: rgba(28, 28, 28, 0.05);
}

.session-title {
  font-size: 15px;
  font-weight: 600;
  color: #3A3A3A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.header-spacer {
  flex: 1;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px 8px 8px;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 8px;
  background: none;
  color: #3A3A3A;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.new-chat-btn:hover {
  background: rgba(28, 28, 28, 0.05);
}

.chat-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 0 24px 48px;
}

.chat-body--conversation {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
}

.conversation-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* Firefox: always thin, transparent thumb by default */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

/* Firefox: show thumb color when scrolling */
.conversation-scroll.is-scrolling {
  scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}

/* Webkit/Blink: always-present track, invisible thumb by default */
.conversation-scroll::-webkit-scrollbar {
  width: 6px;
}

.conversation-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.conversation-scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}

/* Webkit/Blink: reveal thumb when scrolling */
.conversation-scroll.is-scrolling::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
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
  margin-bottom: 32px;
}

.bot-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 27px;
  font-weight: 500;
  color: #1C1C1C;
  margin: 0 0 4px;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 19px;
  font-weight: 500;
  color: #535353;
  margin: 0;
  line-height: 1.3;
}

.composer {
  position: relative;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 16px;
  margin-bottom: 16px;
}

.composer:focus-within {
  border-color: rgba(28, 28, 28, 0.35);
}

.chat-body--conversation .composer {
  margin: 0 0 24px;
  max-width: 732px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.composer-input {
  width: 100%;
  padding: 8px 16px 0;
  border: none;
  border-radius: 16px 16px 0 0;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
  color: #1C1C1C;
  background: transparent;
  resize: none;
  outline: none;
  box-sizing: border-box;
}

.composer-action-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px 8px;
}

.composer-input:focus,
.composer-input:focus-visible {
  outline: none !important;
  box-shadow: none;
}

.composer-input::placeholder {
  color: #9A9A9A;
}

.composer-input:disabled {
  opacity: 0.5;
  cursor: default;
}

.composer-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: none;
  color: #9A9A9A;
  cursor: pointer;
  padding: 0;
}

.composer-send-btn:hover {
  background: rgba(28, 28, 28, 0.05);
  color: #535353;
}

.composer-send-btn.has-input {
  background: linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%);
  color: #FFFFFF;
  border-radius: 50%;
}

.composer-send-btn.has-input:hover {
  background: linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%);
  opacity: 0.9;
}

/* Conversation area */
.conversation-area {
  padding: 16px 24px 0;
  max-width: 732px;
  width: 100%;
  margin: 0 auto;
}

/* Bottom fade gradient */
.scroll-fade {
  position: sticky;
  bottom: 0;
  height: 48px;
  margin-top: -48px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #FFFFFF);
  pointer-events: none;
  transition: opacity 300ms ease;
}

.scroll-fade--hidden {
  opacity: 0;
}

.user-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  flex-shrink: 0;
}

.message-content {
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.message-author {
  font-size: 15px;
  font-weight: 700;
  color: #1C1C1C;
}

.message-time {
  font-size: 12px;
  color: #535353;
}

.message-text {
  font-size: 15px;
  color: #1C1C1C;
  margin: 0;
  line-height: 1.5;
}

/* Processing module */
.processing-module {
  padding: 4px 0;
}

.processing-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background-image: linear-gradient(170deg,
    rgba(71,21,113,0.1) 0%,
    rgba(85,27,132,0.1) 3.08%,
    rgba(124,34,158,0.1) 14.48%,
    rgba(144,36,164,0.1) 23.67%,
    rgba(176,34,144,0.1) 35.5%,
    rgba(211,43,134,0.1) 48.3%,
    rgba(233,47,111,0.1) 60.29%,
    rgba(246,72,79,0.1) 70.08%,
    rgba(251,115,40,0.1) 90.02%,
    rgba(243,150,15,0.1) 97.29%);
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
    #7C229E 120deg,
    #B02290 180deg,
    #E92F6F 240deg,
    #FB7328 300deg,
    transparent 360deg
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px));
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

.processing-text {
  font-size: 15px;
  font-weight: 600;
  color: #1C1C1C;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* AI message */
.ai-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #471571 0%, #551B84 3.08%, #7C229E 14.48%, #9024A4 23.67%, #B02290 35.5%, #D32B86 48.3%, #E92F6F 60.29%, #F6484F 70.08%, #FB7328 90.02%, #F3960F 97.29%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-message-text {
  font-size: 15px;
  color: #1C1C1C;
  line-height: 1.4;
}

.ai-message-text :deep(p) {
  margin: 0 0 8px;
}

.ai-message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-left: 4px;
}

.message-actions-left,
.message-actions-right {
  display: flex;
  gap: 4px;
}

.action-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: none;
  color: #535353;
  cursor: pointer;
  padding: 0;
}

.action-icon-btn:hover {
  background: rgba(28, 28, 28, 0.05);
}

.action-icon-btn[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background: #1C1C1C;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.action-icon-btn[data-tooltip]:hover::after {
  opacity: 1;
}

.followup-suggestions {
  padding-left: 4px;
  margin-top: 16px;
}

.followup-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #535353;
  margin-bottom: 8px;
}

.followup-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.suggestion-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 100px;
  border: 1px solid rgba(28, 28, 28, 0.11);
  background: #FFFFFF;
  font-family: inherit;
  font-size: 13px;
  color: #535353;
  white-space: nowrap;
  cursor: pointer;
}

.suggestion-chip:hover {
  background: rgba(28, 28, 28, 0.05);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: none;
  color: #535353;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(28, 28, 28, 0.05);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.suggestions.is-refreshing .suggestion-chip {
  opacity: 0.32;
  background-image: linear-gradient(170deg,
    rgba(71,21,113,0.1) 0%,
    rgba(85,27,132,0.1) 3.08%,
    rgba(124,34,158,0.1) 14.48%,
    rgba(144,36,164,0.1) 23.67%,
    rgba(176,34,144,0.1) 35.5%,
    rgba(211,43,134,0.1) 48.3%,
    rgba(233,47,111,0.1) 60.29%,
    rgba(246,72,79,0.1) 70.08%,
    rgba(251,115,40,0.1) 90.02%,
    rgba(243,150,15,0.1) 97.29%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Chart widget container */
.chart-widget-container {
  margin-top: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: #fff;
  padding: 16px;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

/* Chart loading state */
.chart-widget-title {
  font-size: 15px;
  font-weight: 400;
  color: #1C1C1C;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.chart-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 260px;
}

.chart-loading-spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(
    from 180deg,
    transparent 0deg,
    #471571 60deg,
    #7C229E 120deg,
    #B02290 180deg,
    #E92F6F 240deg,
    #FB7328 300deg,
    transparent 360deg
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
  animation: spin 1s linear infinite;
}

.chart-loading-label {
  font-size: 15px;
  font-weight: 600;
  color: #1C1C1C;
  line-height: 1.2;
}
</style>
