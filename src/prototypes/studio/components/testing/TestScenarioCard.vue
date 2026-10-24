<template>
  <div
    style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;"
    :style="{ borderLeftColor: scenario.status === 'passed' ? '#4caf50' : '#e0e0e0', borderLeftWidth: '3px' }"
  >
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <h3 style="font-size: 18px; margin: 0;">{{ scenario.name }}</h3>
          <dt-badge
            :type="scenario.status === 'passed' ? 'success' : scenario.status === 'running' ? 'warning' : 'default'"
            :text="scenario.status === 'passed' ? 'Passed' : scenario.status === 'running' ? 'Running...' : 'Not Started'"
          />
        </div>
        <p style="margin: 0; color: #666;">{{ scenario.description }}</p>
      </div>
      <dt-button v-if="scenario.status !== 'running'" importance="outlined" size="sm" @click="$emit('run', scenario)">
        {{ scenario.status === 'not-started' ? 'Run Test' : 'Run Again' }}
      </dt-button>
      <div v-else style="color: #666;">Testing...</div>
    </div>

    <!-- Test Results -->
    <div v-if="scenario.status === 'passed'" style="background: #f9f9f9; padding: 16px; border-radius: 6px;">
      <div style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 12px;">Performance Metrics</div>
      <div style="display: flex; gap: 24px;">
        <div>
          <div style="font-size: 12px; color: #666;">Response Time</div>
          <div style="font-weight: 500;">1.2s</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #666;">Accuracy</div>
          <div style="font-weight: 500;">95%</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #666;">User Satisfaction</div>
          <div style="font-weight: 500;">4.5/5</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DtButton, DtBadge } from '../ui'

defineProps({
  scenario: {
    type: Object,
    required: true
  }
})

defineEmits(['run'])
</script>
