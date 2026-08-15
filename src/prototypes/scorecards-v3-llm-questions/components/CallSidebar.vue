<template>
  <aside class="call-sidebar">
    <!-- Nav -->
    <div class="call-sidebar-nav">
      <span class="call-sidebar-nav-link">Overview</span>
    </div>

    <!-- Details -->
    <div class="call-sidebar-section">
      <div class="call-sidebar-section-title">
        <DtIcon name="token" :size="12" class="call-sidebar-icon" />
        Details
      </div>
      <div class="call-sidebar-details">
        <p>{{ callDetails.date }}</p>
        <p>{{ callDetails.time }} ({{ callDetails.duration }})</p>
        <p class="call-sidebar-participants">{{ callDetails.participants }}</p>
      </div>
    </div>

    <!-- Chapters -->
    <div class="call-sidebar-section">
      <div class="call-sidebar-section-title">
        <DtIcon name="book" :size="12" class="call-sidebar-icon" />
        Chapters
      </div>
      <div class="call-sidebar-chapters">
        <button
          v-for="ch in chapters"
          :key="ch.id"
          class="call-sidebar-chapter"
          @click="$emit('scrollToChapter', ch.id)"
        >
          <span class="chapter-time" v-if="ch.time">{{ ch.time }}</span>
          <span v-else class="chapter-ai-icon"><DtIcon name="dialpad-sparkle" :size="16" /></span>
          <span class="chapter-label">{{ ch.label }}</span>
        </button>
      </div>
    </div>

    <!-- Moments -->
    <div class="call-sidebar-section">
      <div class="call-sidebar-section-title">
        <DtIcon name="lightbulb" :size="12" class="call-sidebar-icon" />
        Moments
      </div>
      <div class="call-sidebar-moments">
        <div v-for="m in moments" :key="m.label" class="call-sidebar-moment">
          <span class="moment-count">x{{ m.count }}</span>
          <span class="moment-label">{{ m.label }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="call-sidebar-actions">
      <button class="call-sidebar-action-btn"><DtIcon name="share-2" :size="16" /> Share</button>
      <button class="call-sidebar-action-btn"><DtIcon name="download" :size="16" /> Download</button>
    </div>
  </aside>
</template>

<script setup>
import { callDetails, chapters, moments } from '../data/callData.js'

import DtIcon from '../../../components/icons/DtIcon.vue'

defineEmits(['scrollToChapter'])
</script>

<style scoped>
.call-sidebar {
  width: 300px;
  flex-shrink: 0;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.call-sidebar-nav {
  padding-top: 12px;
}

.call-sidebar-nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  letter-spacing: 0.14px;
}

.call-sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.call-sidebar-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  letter-spacing: 0.14px;
}

.call-sidebar-icon {
  width: 16px;
  height: 16px;
  color: #a1a1a1;
}

.call-sidebar-details {
  padding-left: 24px;
}

.call-sidebar-details p {
  margin: 0;
  font-size: 14px;
  color: #525252;
  line-height: 20px;
  letter-spacing: -0.14px;
}

.call-sidebar-participants {
  margin-top: 8px !important;
}

.call-sidebar-chapters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 24px;
}

.call-sidebar-chapter {
  display: flex;
  align-items: center;
  gap: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.call-sidebar-chapter:hover .chapter-label {
  color: #7C52FF;
}

.chapter-time {
  width: 48px;
  font-size: 14px;
  font-family: 'Menlo', monospace;
  color: #a1a1a1;
  flex-shrink: 0;
  line-height: 20px;
  letter-spacing: -0.14px;
}

.chapter-ai-icon {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  box-sizing: border-box;
}

.chapter-label {
  font-size: 14px;
  color: #171717;
  line-height: 20px;
  letter-spacing: -0.14px;
}

.call-sidebar-moments {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 24px;
}

.call-sidebar-moment {
  display: flex;
  gap: 8px;
  align-items: center;
  line-height: 20px;
  letter-spacing: -0.14px;
}

.moment-count {
  width: 40px;
  font-size: 14px;
  color: #a1a1a1;
  text-align: right;
}

.moment-label {
  font-size: 14px;
  color: #171717;
}

.call-sidebar-actions {
  display: flex;
  gap: 24px;
  margin-top: auto;
  padding-top: 24px;
}

.call-sidebar-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8200db;
  letter-spacing: -0.12px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 16px;
}
</style>
