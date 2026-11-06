<template>
  <div class="donut">
    <Doughnut ref="chartRef" :data="data" :options="options" />
    <div class="center" aria-hidden="true">
      <strong>{{ centerValue }}</strong>
      <span>{{ centerLabel }}</span>
    </div>
    <transition name="tooltip-fade">
      <div v-if="hover" class="tooltip" :style="{ left: hover.x + 'px', top: hover.y + 'px' }">
        <div class="tooltip-row">
          <span class="chip" :style="{ background: hover.color }" />
          <span class="label">{{ hover.label }}</span>
          <span class="metric">{{ hover.value.toLocaleString() }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, DoughnutController } from 'chart.js'

ChartJS.register(ArcElement, DoughnutController)

const props = defineProps({
  // [{ id, label, value, colorToken }]
  segments: { type: Array, required: true },
  centerValue: { type: String, required: true },
  centerLabel: { type: String, required: true },
})

const emit = defineEmits(['select'])

const chartRef = ref(null)
const hover = ref(null)

function dtColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const colors = computed(() => props.segments.map((segment) => dtColor(segment.colorToken)))

const data = computed(() => ({
  labels: props.segments.map((segment) => segment.label),
  datasets: [{
    data: props.segments.map((segment) => segment.value),
    backgroundColor: colors.value,
    borderColor: dtColor('--dt-color-surface-primary'),
    borderWidth: 2,
    hoverOffset: 4,
  }],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  layout: { padding: 4 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  onHover(event, elements) {
    const target = event.native?.target
    if (!elements.length) {
      hover.value = null
      if (target) target.style.cursor = 'default'
      return
    }
    const { index, element } = elements[0]
    const segment = props.segments[index]
    if (target) target.style.cursor = segment.id ? 'pointer' : 'default'
    const pos = element.tooltipPosition()
    hover.value = { x: pos.x, y: pos.y, label: segment.label, value: segment.value, color: colors.value[index] }
  },
  onClick(event, elements) {
    if (!elements.length) return
    const segment = props.segments[elements[0].index]
    if (segment.id) emit('select', segment.id)
  },
}))
</script>

<style scoped>
.donut {
  position: relative;
  flex: none;
  width: 176px;
  height: 176px;
}

.center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-100);
  padding: 0 var(--dt-space-600);
  text-align: center;
  pointer-events: none;
}

.center strong {
  font: var(--dt-typography-headline-xl);
  color: var(--dt-color-foreground-primary);
}

.center span {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  line-height: 1.3;
}

.tooltip {
  position: absolute;
  z-index: 10;
  transform: translate(-50%, calc(-100% - var(--dt-space-300)));
  padding: var(--dt-space-400) var(--dt-space-450);
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
  gap: var(--dt-space-400);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}

.chip {
  width: 12px;
  height: 12px;
  border-radius: var(--dt-space-200);
  flex: none;
}

.metric {
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active { transition: opacity 0.2s ease; }
.tooltip-fade-enter-from,
.tooltip-fade-leave-to { opacity: 0; }
</style>
