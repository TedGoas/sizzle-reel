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

        <Transition name="grade-fade" mode="out-in">
          <div v-if="mode === 'grading'" :key="'grading-' + i" class="scorecard-question-answers">
            <button
              v-for="option in OPTIONS"
              :key="option"
              type="button"
              class="scorecard-answer"
              :class="{ 'scorecard-answer--on': selections[i] === option }"
            >
              <span
                class="dt-radio"
                :class="{ 'dt-radio--selected': selections[i] === option }"
                :data-autoplay="`q-${i}-${option}`"
              />
              <span class="scorecard-answer-label">{{ option }}</span>
            </button>
          </div>
          <div v-else :key="'graded-' + i" class="scorecard-question-answers">
            <div
              v-for="option in OPTIONS"
              :key="option"
              class="scorecard-answer"
              :class="{
                'scorecard-answer--selected': selections[i] === option,
                'scorecard-answer--muted': selections[i] !== option,
              }"
            >
              <DtIcon
                v-if="selections[i] === option"
                name="check"
                :size="16"
                class="scorecard-answer-check"
              />
              <span
                v-else
                class="scorecard-answer-spacer"
              />
              <span
                class="scorecard-answer-label"
                :class="{ 'scorecard-answer-label--muted': selections[i] !== option }"
              >{{ option }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { scorecardQuestions } from '../data/callData.js'
import DtIcon from '../../../components/icons/DtIcon.vue'

const OPTIONS = ['Yes', 'No']

defineProps({
  mode: { type: String, default: 'grading' },
  selections: { type: Object, default: () => ({}) },
})
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
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: default;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.scorecard-answer--selected {
  width: fit-content;
}

.scorecard-answer-check {
  color: var(--dt-color-link-primary);
  flex-shrink: 0;
}

.scorecard-answer-spacer {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
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

.scorecard-answer-label--muted {
  color: var(--dt-color-foreground-tertiary);
}

.grade-fade-enter-active,
.grade-fade-leave-active {
  transition: opacity 1s ease;
}

.grade-fade-enter-from,
.grade-fade-leave-to {
  opacity: 0;
}
</style>
