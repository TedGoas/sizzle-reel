<template>
  <div class="call-review">
    <!-- Top bar -->
    <div class="call-review-top-bar">
      <div class="call-review-top-left">
        <select v-model="selectedCompany" class="custom-select custom-select--sm">
          <option value="my-company">My Company</option>
        </select>
      </div>
      <div class="call-review-breadcrumbs">
        <span class="crumb-muted">Call History</span>
        <span class="crumb-separator">/</span>
        <span class="crumb-active">Call Review</span>
      </div>
      <div class="call-review-search">
        <Search :size="12" class="search-icon" />
        <span>Search</span>
      </div>
    </div>

    <!-- Three-column layout -->
    <div class="call-review-body">
      <CallSidebar @scrollToChapter="scrollToChapter" />

      <div class="call-review-center">
        <PlaybackBar />
        <Transcript ref="transcriptRef" />
      </div>

      <ScorecardResults />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CallSidebar from './CallSidebar.vue'
import PlaybackBar from './PlaybackBar.vue'
import Transcript from './Transcript.vue'
import ScorecardResults from './ScorecardResults.vue'
import { Search } from '@lucide/vue'

const selectedCompany = ref('my-company')
const transcriptRef = ref(null)

function scrollToChapter(chapterId) {
  transcriptRef.value?.scrollToChapter(chapterId)
}
</script>

<style scoped>
.call-review {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.call-review-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  background: #f9f9f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.call-review-top-left {
  flex-shrink: 0;
  width: 176px;
}

.call-review-breadcrumbs {
  display: flex;
  gap: 6px;
  font-size: 14px;
  margin-right: auto;
  margin-left: 16px;
}

.crumb-muted { color: #808080; }
.crumb-active { color: #1c1c1c; font-weight: 500; }
.crumb-separator { color: #808080; }

.call-review-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: #808080;
  width: 200px;
}

.search-icon {
  width: 12px;
  height: 12px;
}

.call-review-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.call-review-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0 24px;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
