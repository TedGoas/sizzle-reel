<template>
  <div class="scorecard-results">
    <div class="scorecard-tabs">
      <div class="scorecard-tabs-row" role="tablist">
        <button type="button" class="scorecard-tab scorecard-tab--active" role="tab" aria-selected="true">
          Scorecard
        </button>
        <button type="button" class="scorecard-tab" role="tab" aria-selected="false">
          Comments (2)
        </button>
      </div>
    </div>

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
          <Transition name="answer-resolve" mode="out-in">
            <div v-if="i < resolvedCount" key="resolved" class="scorecard-answer scorecard-answer--selected">
              <DtIcon name="check" :size="12" class="scorecard-answer-check" />
              <span class="scorecard-answer-label">{{ q.answer }}</span>
              <button
                type="button"
                class="scorecard-ai-badge"
                :data-autoplay="q.evidenceId ? 'ai-badge-0' : undefined"
                @click="emitEvidence(q)"
              >
                <DtIcon name="sparkle" :size="12" class="scorecard-ai-badge-icon" />
                Graded by Ai
              </button>
            </div>
            <div v-else key="unresolved" class="scorecard-answer">
              <span class="scorecard-answer-radio"></span>
              <span class="scorecard-answer-label">{{ q.answer }}</span>
            </div>
          </Transition>
          <div
            v-for="option in otherOptions(q)"
            :key="option"
            class="scorecard-answer"
          >
            <span class="scorecard-answer-radio"></span>
            <span class="scorecard-answer-label scorecard-answer-label--muted">{{ option }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { scorecardQuestions } from '../data/callData.js'
import DtIcon from '../../../components/icons/DtIcon.vue'

const emit = defineEmits(['evidence'])

defineProps({
  resolvedCount: { type: Number, default: 0 },
})

function otherOptions(q) {
  return (q.options || []).filter((option) => option !== q.answer)
}

function emitEvidence(question) {
  if (question?.evidenceId) emit('evidence', question.evidenceId)
}
</script>

<style scoped>
.scorecard-results {
  width: 400px;
  flex-shrink: 0;
  border-left: 1px solid var(--dt-color-border-subtle);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.scorecard-tabs {
  padding: var(--dt-space-550) var(--dt-space-550) 0;
}

.scorecard-tabs-row {
  display: flex;
  gap: var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.scorecard-tab {
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-200);
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: none;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-tertiary);
  cursor: default;
}

.scorecard-tab--active {
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
  border-bottom-color: var(--dt-color-link-primary);
}

.scorecard-questions {
  padding: var(--dt-space-550);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
}

.scorecard-question {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  padding-bottom: var(--dt-space-500);
}

.scorecard-question-text {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-400);
}

.scorecard-question-label {
  font: var(--dt-typography-body-md);
  font-weight: 500;
  color: var(--dt-color-foreground-primary);
  flex: 1;
}

.scorecard-question-points {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-tertiary);
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
  gap: var(--dt-space-400);
  height: 24px;
}

.scorecard-answer--selected {
  background: linear-gradient(171deg, rgba(249, 0, 142, 0.1) 10%, rgba(124, 82, 255, 0.1) 90%);
  border-radius: var(--dt-space-400);
  padding: 0 var(--dt-space-200) 0 var(--dt-space-300);
  width: fit-content;
}

.scorecard-answer-check {
  color: var(--dt-color-foreground-primary);
  flex-shrink: 0;
  display: block;
}

.scorecard-answer-radio {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--dt-color-border-default);
  border-radius: 50%;
  margin: 0 3px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.scorecard-answer-label {
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
}

.scorecard-answer-label--muted {
  color: var(--dt-color-foreground-muted);
}

.scorecard-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  font: var(--dt-typography-body-sm-compact);
  font-family: inherit;
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  padding: 3px var(--dt-space-350) 3px var(--dt-space-300);
  border-radius: var(--dt-space-350);
  white-space: nowrap;
  cursor: pointer;
}

.scorecard-ai-badge-icon {
  color: var(--dt-color-link-primary);
  flex-shrink: 0;
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
