<template>
  <button class="test-result-card" @click="$emit('select', result)">
    <div style="display: flex; gap: 20px; align-items: flex-start;">
      <!-- Progress Circle -->
      <concentric-circle-chart :percentage="result.percentage" :size="64" :delay="delay" :color="result.color" />

      <!-- Card Content -->
      <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span style="font-size: 18px; font-weight: 600;">{{ result.status }}</span>
            <span style="font-size: 14px; color: #666;"> • Task completion: {{ result.completion }}/{{ result.total }} ({{ result.percentage }}%)</span>
          </div>
          <div style="display: flex; gap: 12px;">
            <dt-icon
              v-for="channel in result.channels"
              :key="channel"
              :name="channel"
              size="200"
              class="d-fc-muted"
            />
          </div>
        </div>
        <p style="font-size: 13px; color: #666; margin: 0;">{{ result.description }}</p>
      </div>
    </div>
  </button>
</template>

<script setup>
import { DtIcon } from '../ui'
import ConcentricCircleChart from '../charts/ConcentricCircleChart.vue'

defineProps({
  result: {
    type: Object,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
})

defineEmits(['select'])
</script>
