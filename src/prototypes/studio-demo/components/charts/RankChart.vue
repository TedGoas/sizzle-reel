<template>
  <div class="chart-wrap">
    <Bar :data="data" :options="options" />
    <div v-if="tip" class="tip" :style="{ left: `${tip.left}px`, top: `${tip.top}px` }">
      <div class="tip-body">
        <div class="tip-row">
          <span class="tip-label">
            <i class="tip-dot" :style="{ background: tip.color }" />
            {{ tip.label }}
          </span>
          <span>{{ tip.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  color: { type: String, default: '#7C52FF' },
  suffix: { type: String, default: '' },
})

const tip = ref(null)

function externalTooltip(context) {
  const { chart, tooltip } = context
  if (!tooltip || tooltip.opacity === 0) {
    tip.value = null
    return
  }
  const item = tooltip.dataPoints?.[0]
  if (!item) {
    tip.value = null
    return
  }
  const bar = item.element
  const wrap = chart.canvas.parentElement
  const rect = wrap.getBoundingClientRect()
  const width = 180
  const height = 32
  let left = rect.right + 8
  let top = rect.top + (bar?.y ?? tooltip.caretY) - height / 2
  if (left + width > window.innerWidth - 12) left = rect.left - width - 8
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8))
  tip.value = {
    label: item.label,
    value: `${item.raw}${props.suffix}`,
    color: props.color,
    left,
    top,
  }
}

const data = computed(() => ({
  labels: props.labels,
  datasets: [{
    data: props.values,
    backgroundColor: props.color,
    borderRadius: 4,
    barThickness: 14,
  }],
}))

const options = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false,
      external: externalTooltip,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.06)' },
      ticks: { color: '#6B6B6B', font: { size: 11 }, callback: (value) => `${value}${props.suffix}` },
    },
    y: { grid: { display: false }, ticks: { color: '#1A1A1A', font: { size: 12 } } },
  },
}))
</script>

<style scoped>
.chart-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
}

.tip {
  position: fixed;
  z-index: 5;
  pointer-events: none;
}

.tip-body {
  padding: var(--dt-space-300) var(--dt-space-400);
  border-radius: var(--dt-size-radius-300, 4px);
  background: var(--dt-color-surface-glass);
  box-shadow: var(--dt-shadow-small);
  backdrop-filter: blur(6px);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  white-space: nowrap;
}

.tip-row {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-500);
}

.tip-label {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.tip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
