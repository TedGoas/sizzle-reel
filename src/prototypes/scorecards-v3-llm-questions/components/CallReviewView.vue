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
        <DtIcon name="search" :size="12" class="search-icon" />
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

      <ScorecardResults :resolved-count="resolvedCount" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CallSidebar from './CallSidebar.vue'
import PlaybackBar from './PlaybackBar.vue'
import Transcript from './Transcript.vue'
import ScorecardResults from './ScorecardResults.vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

defineProps({
  resolvedCount: { type: Number, default: 0 },
})

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
  padding: 9px var(--dt-space-500);
  background: var(--dt-color-surface-secondary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
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
  gap: var(--dt-space-350);
  font: var(--dt-typography-body-md);
  margin-right: auto;
  margin-left: var(--dt-space-500);
}

.crumb-muted { color: var(--dt-color-foreground-muted); }
.crumb-active { color: var(--dt-color-foreground-primary); font-weight: 500; }
.crumb-separator { color: var(--dt-color-foreground-muted); }

.call-review-search {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  padding: 6px var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-muted);
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
  padding: 0 var(--dt-space-550);
  border-left: 1px solid var(--dt-color-border-subtle);
  border-right: 1px solid var(--dt-color-border-subtle);
}
</style>
