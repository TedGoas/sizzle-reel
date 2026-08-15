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
        v-for="(q, i) in questions"
        :key="q.id"
        class="question-item"
        :class="{ 'question-item--selected': selectedId === q.id }"
        :data-autoplay="i === 0 ? 'question-0' : undefined"
        type="button"
        @click="$emit('select', q.id)"
      >
        <div class="question-item-content">
          <span class="question-item-number">{{ q.number }}.</span>
          <div class="question-item-body">
            <span class="question-item-text">{{ q.text || 'Untitled question' }}</span>
            <div class="question-item-meta">
              <span>{{ q.responses[0]?.points || 10 }} points</span>
              <span>{{ q.responseType }}</span>
              <DtIcon v-if="q.isAi" name="sparkle" :size="12" class="question-item-ai" />
            </div>
          </div>
        </div>
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

defineEmits(['select'])

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
  min-width: 0;
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

.question-item-text {
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
