<template>
  <div class="timeline">
    <div
      v-for="(result, index) in results"
      :key="result.id"
      class="timeline-item"
      :class="{ 'timeline-item--last': index === results.length - 1 }"
    >
      <!-- Timeline Dot -->
      <div class="timeline-dot"></div>

      <!-- Timeline Content -->
      <div class="timeline-content">
        <!-- Date and Agent Header -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 14px;">
            <span style="font-weight: 500; color: #333;">{{ result.date }}</span>
            <span style="color: #999;">—{{ result.agent }}</span>
          </span>
          <dt-badge v-if="result.isNew" text="New" type="info" />
        </div>

        <!-- Card -->
        <test-result-card :result="result" :delay="index * 150" @select="$emit('select', result)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { DtBadge } from '../ui'
import TestResultCard from './TestResultCard.vue'

defineProps({
  results: {
    type: Array,
    required: true
  }
})

defineEmits(['select'])
</script>
