<template>
  <div class="question-list">
    <div class="question-list-header">
      <h2 class="question-list-title">Questions</h2>
      <div class="question-list-meta">
        <span class="question-list-meta-text">{{ questions.length }} questions</span>
        <span class="question-list-meta-dot"></span>
        <span class="question-list-meta-text">{{ totalPoints }} points</span>
      </div>
    </div>

    <div class="question-list-items">
      <button
        v-for="q in questions"
        :key="q.id"
        class="question-item"
        :class="{ 'question-item--selected': selectedId === q.id }"
        @click="$emit('select', q.id)"
      >
        <div class="question-item-content">
          <span class="question-item-number">{{ q.number }}.</span>
          <div class="question-item-body">
            <div class="question-item-title">
              <DtIcon v-if="q.validationWarning" name="alert-triangle" :size="16" class="warning-icon" />
              <span class="question-item-text">{{ q.text || 'Untitled question' }}</span>
            </div>
            <div class="question-item-meta">
              <span>{{ q.responses[0]?.points || 10 }} points</span>
              <span>{{ q.responseType }}</span>
              <DtIcon v-if="q.isAi" name="sparkle" :size="12" class="question-item-ai" />
            </div>
          </div>
        </div>
      </button>
    </div>

    <div class="question-list-footer">
      <button class="question-list-btn question-list-btn--ai">
        <svg class="question-list-btn-icon" width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 2a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1Zm-9 2a1 1 0 0 1 .91.586l2.033 4.471 4.47 2.033a1 1 0 0 1 0 1.82l-4.47 2.033-2.033 4.47a1 1 0 0 1-1.82 0l-2.033-4.47-4.47-2.033a1 1 0 0 1 0-1.82l4.47-2.033 2.033-4.47A1 1 0 0 1 10 4Zm0 3.417-1.277 2.81a1 1 0 0 1-.497.496L5.416 12l2.81 1.277a1 1 0 0 1 .497.497L10 16.584l1.277-2.81a1 1 0 0 1 .497-.497L14.584 12l-2.81-1.277a1 1 0 0 1-.497-.497L10 7.416ZM18 16a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" fill="currentColor"/></svg>
        Add Ai Questions
      </button>
      <button
        class="question-list-btn question-list-btn--create"
        type="button"
        data-autoplay="create-question"
        @click="$emit('create')"
      >
        <DtIcon name="ai-write" :size="16" class="question-list-btn-icon" />
        Create Question
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

const props = defineProps({
  questions: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})

defineEmits(['select', 'create'])

const totalPoints = computed(() =>
  props.questions.reduce((sum, q) => sum + (q.responses[0]?.points || 10), 0)
)
</script>

<style scoped>
.question-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.question-list-header {
  padding-left: var(--dt-space-450);
}

.question-list-title {
  font: var(--dt-typography-headline-lg);
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

.question-list-meta {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.question-list-meta-text {
  font: var(--dt-typography-body-sm-compact);
  color: var(--dt-color-foreground-muted);
}

.question-list-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--dt-color-foreground-muted);
}

.question-list-items {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-100);
}

.question-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid transparent;
  border-radius: var(--dt-space-400);
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.question-item:hover {
  background: var(--dt-color-surface-secondary);
}

.question-item--selected {
  border-color: var(--dt-color-border-subtle);
  background: var(--dt-color-surface-brand-subtle);
}

.question-item-content {
  display: flex;
  gap: var(--dt-space-100);
  flex: 1;
}

.question-item-number {
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
  width: 24px;
  flex-shrink: 0;
}

.question-item-body {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-100);
  min-width: 0;
}

.question-item-title {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  min-width: 0;
}

.warning-icon {
  color: var(--dt-color-foreground-warning);
  flex-shrink: 0;
}

.question-item-text {
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.question-item-meta {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  font: var(--dt-typography-body-sm-compact);
  color: var(--dt-color-foreground-muted);
}

.question-item-ai {
  color: var(--dt-color-foreground-muted);
}

.question-list-footer {
  display: flex;
  gap: var(--dt-space-400);
  padding-top: var(--dt-space-400);
}

.question-list-btn {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-450);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
}

.question-list-btn-icon {
  flex-shrink: 0;
}

.question-list-btn--ai {
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
  border: none;
}

.question-list-btn--ai:hover {
  background: var(--dt-color-link-primary-hover);
}

.question-list-btn--create {
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-link-primary);
  border: 1px solid var(--dt-color-link-primary);
}

.question-list-btn--create:hover {
  background: var(--dt-color-surface-brand-subtle);
}
</style>
