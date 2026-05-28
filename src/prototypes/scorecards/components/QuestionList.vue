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
            <span class="question-item-text">{{ q.text }}</span>
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
      <button class="question-list-btn question-list-btn--create">
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

defineEmits(['select'])

const totalPoints = computed(() =>
  props.questions.reduce((sum, q) => sum + (q.responses[0]?.points || 10), 0)
)
</script>

<style scoped>
.question-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-list-header {
  padding-left: 12px;
}

.question-list-title {
  font-size: 19px;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
  line-height: 1.6;
}

.question-list-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-list-meta-text {
  font-size: 12px;
  color: #808080;
  line-height: 1.2;
}

.question-list-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #808080;
}

.question-list-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.question-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  background: white;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.question-item:hover {
  background: #fafafa;
}

.question-item--selected {
  border-color: rgba(0, 0, 0, 0.12);
  background: #faf8ff;
}

.question-item-content {
  display: flex;
  gap: 2px;
  flex: 1;
}

.question-item-number {
  font-size: 15px;
  color: #1c1c1c;
  line-height: 1.4;
  width: 24px;
  flex-shrink: 0;
}

.question-item-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.question-item-text {
  font-size: 15px;
  color: #1c1c1c;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #808080;
  line-height: 1.2;
}

.question-item-ai {
  color: #808080;
}

.question-list-footer {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

.question-list-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.2;
}

.question-list-btn-icon {
  flex-shrink: 0;
}

.question-list-btn--ai {
  background: #7C52FF;
  color: white;
  border: none;
}

.question-list-btn--ai:hover {
  background: #6a3fef;
}

.question-list-btn--create {
  background: white;
  color: #7C52FF;
  border: 1px solid #7C52FF;
}

.question-list-btn--create:hover {
  background: #faf8ff;
}
</style>
