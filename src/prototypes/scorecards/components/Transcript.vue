<template>
  <div class="transcript" ref="transcriptRef">
    <!-- Fog overlay at top -->
    <div class="transcript-fog"></div>

    <!-- Messages grouped by chapter -->
    <template v-for="(chapter, chapterIndex) in chapters" :key="chapter.id">
      <!-- Hidden messages divider (between "factory-reset" and "anything-else") -->
      <div
        v-if="chapter.id === 'anything-else'"
        class="transcript-hidden-divider"
      >
        <span class="transcript-hidden-line"></span>
        <DtIcon name="chevrons-down-up" :size="16" class="transcript-hidden-icon" />
        <span class="transcript-hidden-label">4 hidden messages</span>
        <span class="transcript-hidden-line"></span>
      </div>

      <div class="transcript-chapter-divider" :id="`chapter-${chapter.id}`">
        <span class="transcript-chapter-line"></span>
        <span class="transcript-chapter-label">{{ chapter.time ? `${chapter.time} - ` : '' }}{{ chapter.label }}</span>
        <span class="transcript-chapter-line"></span>
      </div>

      <div
        v-for="(msg, i) in getChapterMessages(chapter.id)"
        :key="`${chapter.id}-${i}`"
        class="transcript-message"
        :class="`transcript-message--${msg.speaker}`"
      >
        <div
          v-if="msg.speaker === 'customer'"
          class="transcript-message-avatar transcript-message-avatar--customer"
        >
          <img
            src="https://i.pravatar.cc/64?u=evan-conover"
            alt=""
            class="transcript-message-avatar-img"
          />
        </div>
        <div
          v-else
          class="transcript-message-avatar transcript-message-avatar--agent"
        >
          {{ getInitials(msg.name) }}
        </div>
        <div class="transcript-message-body">
          <div class="transcript-message-header">
            <span class="transcript-message-name">{{ msg.name }}</span>
            <span class="transcript-message-time">{{ msg.time }}</span>
          </div>
          <p class="transcript-message-text" v-html="highlightText(msg.text)"></p>
        </div>
      </div>
    </template>

    <!-- Search bar at bottom -->
    <div class="transcript-search">
      <div class="transcript-search-input">
        <DtIcon name="dialpad-sparkle" :size="20" class="transcript-search-icon" />
        <span class="transcript-search-placeholder">Explore this conversation</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'
import { transcript, chapters } from '../data/callData.js'

const transcriptRef = ref(null)

function getChapterMessages(chapterId) {
  return transcript.filter(m => m.chapter === chapterId)
}

const highlights = [
  { phrase: 'it stopped syncing with my phone', color: '#D5E5FF' },
  { phrase: 'this is really frustrating', color: '#FED5D7' },
  { phrase: 'Fitbit Charge 5', color: '#FCF0CC' },
  { phrase: 'Everything seems to be working now', color: '#CCEFDF' },
  { phrase: 'factory reset', color: '#D5E5FF' },
]

function highlightText(text) {
  let result = text
  for (const { phrase, color } of highlights) {
    const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')
    result = result.replace(regex, `<mark style="background:${color}; border-radius:4px; padding: 1px 2px">$1</mark>`)
  }
  return result
}

function getInitials(name) {
  // Map short first names to full names for initials
  const fullNames = {
    Don: 'Don Brodka',
    Evan: 'Evan Conover',
  }
  const full = fullNames[name] || name
  return full
    .split(' ')
    .map(w => w[0])
    .join('')
}

function scrollToChapter(chapterId) {
  const el = document.getElementById(`chapter-${chapterId}`)
  if (el && transcriptRef.value) {
    transcriptRef.value.scrollTo({
      top: el.offsetTop - transcriptRef.value.offsetTop - 20,
      behavior: 'smooth',
    })
  }
}

// Auto-scroll to bottom on mount
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (transcriptRef.value) {
        transcriptRef.value.scrollTo({
          top: transcriptRef.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 300)
  })
})

defineExpose({ scrollToChapter })
</script>

<style scoped>
.transcript {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: 0 0 16px;
}

.transcript-fog {
  position: sticky;
  top: 0;
  height: 45px;
  background: linear-gradient(to bottom, white, transparent);
  z-index: 2;
  pointer-events: none;
}

.transcript-chapter-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  margin: 8px 0;
}

.transcript-chapter-line {
  flex: 1;
  height: 1px;
  background: #e5e5e5;
}

.transcript-chapter-label {
  font-size: 12px;
  color: #525252;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: -0.12px;
}

/* Hidden messages divider */
.transcript-hidden-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  margin: 8px 0;
}

.transcript-hidden-line {
  flex: 1;
  height: 1px;
  background: #e5e5e5;
}

.transcript-hidden-icon {
  width: 14px;
  height: 14px;
  color: #525252;
  flex-shrink: 0;
}

.transcript-hidden-label {
  font-size: 12px;
  color: #525252;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: -0.12px;
}

.transcript-message {
  display: flex;
  gap: 10px;
  padding: 8px 16px;
}

.transcript-message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
}

.transcript-message-avatar--agent {
  background: #F6339A;
}

.transcript-message-avatar--customer {
  background: #52C926;
}

.transcript-message-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.transcript-message-body {
  flex: 1;
  min-width: 0;
}

.transcript-message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.transcript-message-name {
  font-size: 14px;
  font-weight: 700;
  color: #171717;
}

.transcript-message-time {
  font-size: 11px;
  color: #737373;
}

.transcript-message-text {
  font-size: 14px;
  color: #1c1c1c;
  line-height: 20px;
  letter-spacing: -0.14px;
  margin: 0;
}

.transcript-message-text :deep(mark) {
  color: inherit;
  border-radius: 4px;
  padding: 1px 2px;
}

.transcript-search {
  padding: 16px;
}

.transcript-search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: white;
}

.transcript-search-icon {
  width: 18px;
  height: 18px;
}

.transcript-search-placeholder {
  font-size: 14px;
  color: #808080;
}
</style>
