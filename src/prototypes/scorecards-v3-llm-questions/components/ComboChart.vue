<template>
  <div class="combo-chart">
    <div class="combo-chart-header">
      <div class="combo-chart-stats">
        <span class="combo-chart-label">{{ summaryStats.label }}</span>
        <div class="combo-chart-title-row">
          <span class="combo-chart-value">{{ summaryStats.averageGrade }}</span>
          <span class="combo-chart-trend">
            <DtIcon name="arrow-up" :size="16" class="combo-chart-trend-arrow" />
            <span>{{ summaryStats.trend }} {{ summaryStats.comparison }}</span>
          </span>
        </div>
      </div>
      <div class="combo-chart-legend">
        <div class="combo-chart-legend-item">
          <span class="combo-chart-legend-line"></span>
          <span>Average grade</span>
        </div>
        <div class="combo-chart-legend-item">
          <span class="combo-chart-legend-box"></span>
          <span>Calls graded</span>
        </div>
      </div>
    </div>

    <div class="combo-chart-canvas">
      <Bar ref="chartRef" :data="chartDataConfig" :options="chartOptions" :plugins="[progressiveRevealPlugin, hoverPlugin]" />
      <div
        v-for="(col, i) in columnHits"
        :key="i"
        class="combo-chart-col"
        :data-autoplay="`chart-col-${i}`"
        :style="col"
      />
      <transition name="tooltip-fade">
        <div v-if="activeIndex !== null" class="combo-chart-tooltip" :style="tooltipPos">
          <div class="combo-chart-tooltip-body">
            <div class="combo-chart-tooltip-date">{{ chartLabels[activeIndex] }}</div>
            <div class="combo-chart-tooltip-row">
              <span class="combo-chart-tooltip-chip combo-chart-tooltip-chip--positive" aria-hidden="true" />
              <span class="combo-chart-tooltip-label">Average grade</span>
              <span class="combo-chart-tooltip-metric">{{ lineData[activeIndex] }}%</span>
            </div>
            <div class="combo-chart-tooltip-row">
              <span class="combo-chart-tooltip-chip combo-chart-tooltip-chip--neutral" aria-hidden="true" />
              <span class="combo-chart-tooltip-label">Calls graded</span>
              <span class="combo-chart-tooltip-metric">{{ callsGraded[activeIndex] }}</span>
            </div>
            <div class="combo-chart-tooltip-divider" />
            <div class="combo-chart-tooltip-row">
              <span class="combo-chart-tooltip-label">Average</span>
              <span class="combo-chart-tooltip-metric">{{ summaryStats.averageGrade }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
} from 'chart.js'
import {
  chartLabels,
  callsGraded,
  lineData,
  summaryStats,
  HOVER_INDEX,
} from '../data/analyticsData.js'

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, LineController, BarController)

function dtColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const chartRef = ref(null)
const activeIndex = ref(null)
const columnHits = ref([])

function updateColumnHits() {
  const chart = chartRef.value?.chart
  if (!chart) return
  const meta = chart.getDatasetMeta(0)
  const yScale = chart.scales.y1
  if (!meta?.data?.length || !yScale) return

  columnHits.value = meta.data.map((bar) => {
    const { x, width } = bar.getProps(['x', 'width'], true)
    const colWidth = Math.max(width, 12)
    return {
      left: `${x - colWidth / 2}px`,
      top: `${yScale.top}px`,
      width: `${colWidth}px`,
      height: `${yScale.bottom - yScale.top}px`,
    }
  })
}

function clearHover() {
  activeIndex.value = null
}

function showHover(index = HOVER_INDEX) {
  updateColumnHits()
  activeIndex.value = index
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

function playReveal() {
  const chart = chartRef.value?.chart
  if (!chart) return
  chart.resize()
  chart._revealProgress = 0
  const startTime = performance.now()
  const duration = 700

  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1)
    chart._revealProgress = easeOutQuart(t)
    chart.draw()
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      updateColumnHits()
    }
  }

  requestAnimationFrame(tick)
}

defineExpose({ showHover, clearHover, playReveal })

const chartDataConfig = computed(() => {
  const lineColor = dtColor('--dt-color-chart-positive')
  return {
    labels: chartLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Calls graded',
        data: callsGraded,
        backgroundColor: dtColor('--dt-color-chart-neutral'),
        borderRadius: 0,
        barPercentage: 0.92,
        categoryPercentage: 1,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'Average grade',
        data: lineData,
        borderColor: lineColor,
        borderWidth: 3,
        pointRadius: lineData.map((_, i) => (i === activeIndex.value ? 5 : 0)),
        pointHoverRadius: 5,
        pointBackgroundColor: lineColor,
        pointHoverBackgroundColor: lineColor,
        tension: 0.3,
        fill: false,
        yAxisID: 'y1',
        order: 1,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const tickColor = dtColor('--dt-color-foreground-tertiary')
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    events: [],
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: tickColor },
      },
      y: {
        position: 'left',
        display: false,
        min: 0,
        max: 80,
        grid: { display: false },
      },
      y1: {
        position: 'left',
        min: 0,
        max: 100,
        grid: {
          color: dtColor('--dt-color-border-subtle'),
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
          color: tickColor,
          callback: (v) => `${v}%`,
          stepSize: 25,
        },
      },
    },
  }
})

const tooltipPos = computed(() => {
  if (activeIndex.value === null) return {}
  const chart = chartRef.value?.chart
  if (!chart) return {}

  const meta = chart.getDatasetMeta(1)
  const pt = meta.data[activeIndex.value]
  if (!pt) return {}

  const { x, y } = pt.getProps(['x', 'y'], true)
  const tipW = 220
  const tipH = 148
  let tipX = x + 16
  let tipY = y - tipH - 12

  if (tipX + tipW > chart.width - 8) {
    tipX = x - tipW - 8
  }
  tipX = Math.max(8, tipX)
  tipY = Math.max(8, Math.min(tipY, chart.height - tipH - 8))

  return { top: `${tipY}px`, left: `${tipX}px` }
})

const progressiveRevealPlugin = {
  id: 'comboReveal',
  beforeDatasetsDraw(chart) {
    if (!chart._revealProgress || chart._revealProgress >= 1) return
    const { ctx, chartArea: { left, top, right, bottom } } = chart
    ctx.save()
    ctx.beginPath()
    ctx.rect(left, top - 10, (right - left) * chart._revealProgress, bottom - top + 20)
    ctx.clip()
  },
  afterDatasetsDraw(chart) {
    if (!chart._revealProgress || chart._revealProgress >= 1) return
    chart.ctx.restore()
  },
}

const hoverPlugin = {
  id: 'comboHover',
  afterDraw(chart) {
    if (activeIndex.value === null) return
    const ctx = chart.ctx
    const meta = chart.getDatasetMeta(1)
    const pt = meta.data[activeIndex.value]
    if (!pt) return

    const { x } = pt.getProps(['x'], true)
    const yAxis = chart.scales.y1

    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = dtColor('--dt-color-border-default')
    ctx.lineWidth = 1
    ctx.moveTo(x, yAxis.top)
    ctx.lineTo(x, yAxis.bottom)
    ctx.stroke()
    ctx.restore()
  },
}

onMounted(() => {
  nextTick(() => {
    const chart = chartRef.value?.chart
    if (!chart) return
    chart._revealProgress = 1
    updateColumnHits()
  })
})
</script>

<style scoped>
.combo-chart {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.combo-chart-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--dt-space-500);
}

.combo-chart-stats {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.combo-chart-label {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-tertiary);
}

.combo-chart-title-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.combo-chart-value {
  font: var(--dt-typography-headline-xl);
  color: var(--dt-color-foreground-primary);
  line-height: 1.2;
}

.combo-chart-trend {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-success);
}

.combo-chart-trend-arrow {
  color: var(--dt-color-foreground-success);
  flex-shrink: 0;
}

.combo-chart-legend {
  display: flex;
  align-items: center;
  gap: var(--dt-space-500);
}

.combo-chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
}

.combo-chart-legend-line {
  width: 20px;
  height: 4px;
  border-radius: 3px;
  background: var(--dt-color-chart-positive);
}

.combo-chart-legend-box {
  width: 10px;
  height: 10px;
  border-radius: var(--dt-space-200);
  background: var(--dt-color-chart-neutral);
}

.combo-chart-canvas {
  position: relative;
  height: 370px;
  overflow: visible;
  pointer-events: none;
}

.combo-chart-col {
  position: absolute;
  pointer-events: none;
}

.combo-chart-tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.25s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

.combo-chart-tooltip-body {
  min-width: 200px;
  padding: var(--dt-space-400) var(--dt-space-450);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  background: var(--dt-color-surface-glass);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-small);
  white-space: nowrap;
}

.combo-chart-tooltip-date {
  font: var(--dt-typography-label-sm-compact);
  color: var(--dt-color-foreground-primary);
}

.combo-chart-tooltip-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-secondary);
}

.combo-chart-tooltip-chip {
  width: 12px;
  height: 12px;
  border-radius: var(--dt-space-300);
  flex-shrink: 0;
}

.combo-chart-tooltip-chip--positive {
  background: var(--dt-color-chart-positive);
}

.combo-chart-tooltip-chip--neutral {
  background: var(--dt-color-chart-neutral);
}

.combo-chart-tooltip-label {
  flex: 1;
  min-width: 0;
}

.combo-chart-tooltip-metric {
  font: var(--dt-typography-label-sm-compact);
  color: var(--dt-color-foreground-primary);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.combo-chart-tooltip-divider {
  height: 1px;
  background: var(--dt-color-border-subtle);
}
</style>
