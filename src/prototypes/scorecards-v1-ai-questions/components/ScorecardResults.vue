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
        :data-autoplay="`q-group-${i}`"
      >
        <div class="scorecard-question-text">
          <span class="scorecard-question-label">{{ q.text }}</span>
          <span class="scorecard-question-points">{{ q.points }}pts</span>
        </div>

        <div class="scorecard-question-answers">
          <div
            v-for="option in q.options"
            :key="option"
            class="scorecard-answer"
            :class="{
              'scorecard-answer--on': selections[i] === option,
              'scorecard-answer--ai': isAiHighlighted(i, option),
            }"
          >
            <span
              class="dt-radio"
              :class="{ 'dt-radio--selected': selections[i] === option }"
              :data-autoplay="`q-${i}-${option}`"
            />
            <span class="scorecard-answer-label">{{ option }}</span>
            <button
              v-if="isAiHighlighted(i, option)"
              type="button"
              class="ai-suggest-badge"
              :data-autoplay="q.evidenceId ? 'ai-badge-0' : undefined"
              @click.stop="emitEvidence(q)"
            >
              Suggested by
              <DtIcon name="sparkle" :size="12" class="ai-suggest-sparkle" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { scorecardQuestions } from '../data/callData.js'
import DtIcon from '../../../components/icons/DtIcon.vue'

const props = defineProps({
  selections: { type: Object, default: () => ({}) },
  aiRevealCount: { type: Number, default: 0 },
})

const emit = defineEmits(['evidence'])

const aiQuestionIndexes = computed(() =>
  scorecardQuestions
    .map((q, i) => (q.aiSuggest ? i : null))
    .filter((i) => i != null)
)

function isAiHighlighted(questionIndex, option) {
  const q = scorecardQuestions[questionIndex]
  if (!q?.aiSuggest || q.aiSuggest !== option) return false
  const order = aiQuestionIndexes.value.indexOf(questionIndex)
  return order !== -1 && order < props.aiRevealCount
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
  gap: var(--dt-space-200);
}

.scorecard-answer {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  min-height: 24px;
  width: fit-content;
  max-width: 100%;
  padding: 2px var(--dt-space-300) 2px 2px;
  border: 1px solid transparent;
  border-radius: var(--dt-space-400);
  background: none;
  text-align: left;
  cursor: default;
  transition: transform 0.12s ease, filter 0.12s ease, background 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
}

.scorecard-answer--ai {
  background: var(--dt-color-surface-brand-subtle);
  border-color: var(--dt-color-border-brand);
}

.dt-radio {
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border: 2px solid var(--dt-color-border-default);
  border-radius: 50%;
  background: var(--dt-color-surface-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s ease, transform 0.12s ease, filter 0.12s ease;
}

.dt-radio--selected {
  border-color: var(--dt-color-link-primary);
}

.dt-radio--selected::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dt-color-link-primary);
}

.scorecard-answer-label {
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
}

.ai-suggest-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: 2px var(--dt-space-300);
  margin-left: var(--dt-space-200);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-sm-compact);
  font-family: inherit;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  animation: ai-badge-in 0.25s ease;
}

.ai-suggest-sparkle {
  color: var(--dt-color-link-primary);
  flex-shrink: 0;
}

@keyframes ai-badge-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
