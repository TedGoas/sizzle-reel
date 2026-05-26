<template>
  <div class="scorecard-results">
    <!-- Tabs -->
    <div class="scorecard-tabs">
      <div class="scorecard-tabs-row">
        <button class="scorecard-tab scorecard-tab--active">Scorecard</button>
        <button class="scorecard-tab">Comments (2)</button>
      </div>
    </div>

    <!-- Questions list -->
    <div class="scorecard-questions">
      <div
        v-for="(q, i) in scorecardQuestions"
        :key="i"
        class="scorecard-question"
      >
        <div class="scorecard-question-text">
          <span class="scorecard-question-label">{{ q.text }}</span>
          <span class="scorecard-question-points">{{ q.points }}pts</span>
        </div>
        <div class="scorecard-question-answers">
          <!-- Selected answer: animated swap -->
          <Transition name="answer-resolve" mode="out-in">
            <div v-if="i < resolvedCount" key="resolved" class="scorecard-answer scorecard-answer--selected">
              <DtIconCheck class="scorecard-answer-check" size="100" />
              <span class="scorecard-answer-label">{{ q.answer }}</span>
              <span v-if="q.gradedByAi" class="scorecard-ai-badge"><DtIconDialpadSparkle size="100" /> Graded by Ai</span>
            </div>
            <div v-else key="unresolved" class="scorecard-answer">
              <span class="scorecard-answer-radio"></span>
              <span class="scorecard-answer-label">{{ q.answer }}</span>
            </div>
          </Transition>
          <!-- Non-selected answer -->
          <div class="scorecard-answer">
            <span class="scorecard-answer-radio"></span>
            <span class="scorecard-answer-label scorecard-answer-label--muted">{{ q.answer === 'Yes' ? 'No' : 'Yes' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { scorecardQuestions } from '../data/callData.js'
import DtIconCheck from '@dialpad/dialtone-icons/vue3/check'
import DtIconDialpadSparkle from '@dialpad/dialtone-icons/vue3/dialpad-sparkle'

const resolvedCount = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    resolvedCount.value++
    if (resolvedCount.value >= scorecardQuestions.length) {
      clearInterval(interval)
    }
  }, 150)
})
</script>

<style scoped>
.scorecard-results {
  width: 400px;
  flex-shrink: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.scorecard-tabs {
  padding: 24px 24px 0;
}

.scorecard-tabs-row {
  display: flex;
}

.scorecard-tab {
  padding: 4px 12px;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 500;
  color: #525252;
  cursor: default;
  border-radius: 50px;
  letter-spacing: -0.12px;
  line-height: 16px;
}

.scorecard-tab--active {
  color: #8200db;
  background: #f3e8ff;
  font-weight: 500;
}

.scorecard-questions {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scorecard-question {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
}

.scorecard-question-text {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.scorecard-question-label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  line-height: 1.4;
  flex: 1;
}

.scorecard-question-points {
  font-size: 13px;
  color: #808080;
  flex-shrink: 0;
}

.scorecard-question-answers {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.scorecard-answer {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
}

.scorecard-answer--selected {
  gap: 8px;
  background: linear-gradient(171deg, rgba(249, 0, 142, 0.1) 10%, rgba(124, 82, 255, 0.1) 90%);
  border-radius: 8px;
  padding: 0 2px 0 4px;
  width: fit-content;
}

.scorecard-answer-check {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  margin: 0;
}

.scorecard-answer-radio {
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin: 0 3px;
  flex-shrink: 0;
}

.scorecard-answer-label {
  font-size: 14px;
  color: #1c1c1c;
}

.scorecard-answer-label--muted {
  color: #808080;
}

.scorecard-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #000000;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 3px 6px 3px 4px;
  border-radius: 6px;
  white-space: nowrap;
  line-height: 1.2;
}

.answer-resolve-enter-active {
  transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease;
}
.answer-resolve-leave-active {
  transition: opacity 0.12s ease;
}
.answer-resolve-enter-from {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.95);
}
.answer-resolve-leave-to {
  opacity: 0;
}
</style>
