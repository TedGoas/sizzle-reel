<template>
  <div class="breakdown">
    <div class="donut" @mouseleave="clearHover">
      <Doughnut :data="chartData" :options="options" />
      <div class="center" aria-hidden="true">
        <strong>{{ total.toLocaleString() }}</strong>
        <span>{{ caption }}</span>
      </div>
      <transition name="tooltip-fade">
        <div v-if="hover" class="tooltip" :style="{ left: hover.x + 'px', top: hover.y + 'px' }">
          <div class="tooltip-row">
            <span class="chip" :style="{ background: hover.color }" />
            <span>{{ hover.label }}</span>
            <span class="metric">{{ hover.value.toLocaleString() }} ({{ hover.share }}%)</span>
          </div>
        </div>
      </transition>
    </div>
    <ul class="legend">
      <li
        v-for="(segment, index) in segments"
        :key="segment.label"
        @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = -1"
      >
        <i :style="{ background: colors[index] }" />
        <span class="legend-label">{{ segment.label }}</span>
        <span class="legend-value">{{ segment.value.toLocaleString() }} ({{ shareOf(segment.value) }}%)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, DoughnutController } from 'chart.js'

ChartJS.register(ArcElement, DoughnutController)

const props = defineProps({
  segments: { type: Array, required: true },
  caption: { type: String, required: true },
})

const hoverIndex = ref(-1)
const hover = ref(null)

function clearHover() {
  hoverIndex.value = -1
  hover.value = null
}

function dtColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const total = computed(() => props.segments.reduce((sum, segment) => sum + segment.value, 0))
const colors = computed(() => props.segments.map((segment) => dtColor(segment.colorToken)))

function shareOf(value) {
  if (!total.value) return '0'
  return String(Math.round((value / total.value) * 100))
}

const chartData = computed(() => ({
  labels: props.segments.map((segment) => segment.label),
  datasets: [{
    data: props.segments.map((segment) => segment.value),
    backgroundColor: colors.value,
    offset: props.segments.map((_, index) => (index === hoverIndex.value ? 8 : 0)),
    borderColor: dtColor('--dt-color-surface-primary'),
    borderWidth: 2,
    hoverOffset: 0,
  }],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  layout: { padding: 8 },
  animation: { duration: 600 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  onHover(event, elements) {
    if (!elements.length) {
      clearHover()
      return
    }
    const { index, element } = elements[0]
    const segment = props.segments[index]
    const pos = element.tooltipPosition()
    hoverIndex.value = index
    hover.value = {
      x: pos.x,
      y: pos.y,
      label: segment.label,
      value: segment.value,
      share: shareOf(segment.value),
      color: colors.value[index],
    }
  },
}))
</script>

<style scoped>
.breakdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dt-space-400);
  min-width: 0;
  margin-top: var(--dt-space-400);
}

.donut {
  position: relative;
  width: 168px;
  height: 168px;
}

.center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-100);
  text-align: center;
  pointer-events: none;
}

.center strong {
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-300);
  font-weight: 600;
  line-height: 1.1;
}

.center span {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.legend {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend li {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  min-width: 0;
  font-size: var(--dt-font-size-100);
}

.legend i {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex: none;
}

.legend-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--dt-color-foreground-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-value {
  flex: none;
  color: var(--dt-color-foreground-primary);
  font-variant-numeric: tabular-nums;
}

.tooltip {
  position: absolute;
  z-index: 5;
  transform: translate(-50%, calc(-100% - var(--dt-space-300)));
  padding: var(--dt-space-300) var(--dt-space-400);
  background: var(--dt-color-surface-glass);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-small);
  white-space: nowrap;
  pointer-events: none;
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}

.chip {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex: none;
}

.metric {
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active { transition: opacity 0.2s ease; }
.tooltip-fade-enter-from,
.tooltip-fade-leave-to { opacity: 0; }
</style>
