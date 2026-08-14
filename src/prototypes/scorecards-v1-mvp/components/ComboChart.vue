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
            <div class="combo-chart-tooltip-value">
              <span>{{ lineData[activeIndex] }}%</span>
              <span class="combo-chart-tooltip-muted">({{ callsGraded[activeIndex] }} grades)</span>
            </div>
            <div class="combo-chart-tooltip-date">{{ ordinalLabel(chartLabels[activeIndex]) }}</div>
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

const LINE_COLOR = '#52C926'

const chartRef = ref(null)
const activeIndex = ref(null)
const columnHits = ref([])

function ordinalLabel(label) {
  const [month, day] = label.split(' ')
  const n = Number(day)
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
  return `${month} ${n}${suffix}`
}

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

const chartDataConfig = computed(() => ({
  labels: chartLabels,
  datasets: [
    {
      type: 'bar',
      label: 'Calls graded',
      data: callsGraded,
      backgroundColor: '#E9E9E9',
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
      borderColor: LINE_COLOR,
      borderWidth: 3,
      pointRadius: lineData.map((_, i) => (i === activeIndex.value ? 5 : 0)),
      pointHoverRadius: 5,
      pointBackgroundColor: LINE_COLOR,
      pointHoverBackgroundColor: LINE_COLOR,
      tension: 0.3,
      fill: false,
      yAxisID: 'y1',
      order: 1,
    },
  ],
}))

const chartOptions = {
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
      ticks: { font: { size: 12 }, color: '#6B6B6B' },
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
        color: 'rgba(0,0,0,0.06)',
        drawBorder: false,
      },
      ticks: {
        font: { size: 12 },
        color: '#6B6B6B',
        callback: (v) => `${v}%`,
        stepSize: 25,
      },
    },
  },
}

const tooltipPos = computed(() => {
  if (activeIndex.value === null) return {}
  const chart = chartRef.value?.chart
  if (!chart) return {}

  const meta = chart.getDatasetMeta(1)
  const pt = meta.data[activeIndex.value]
  if (!pt) return {}

  const { x, y } = pt.getProps(['x', 'y'], true)
  let tipX = x + 14
  const tipY = Math.max(8, y - 12)

  if (tipX + 160 > chart.width) {
    tipX = x - 170
  }

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
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
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
  background: var(--dt-color-green-300);
}

.combo-chart-legend-box {
  width: 10px;
  height: 10px;
  border-radius: var(--dt-space-200);
  background: var(--dt-color-surface-moderate);
}

.combo-chart-canvas {
  position: relative;
  height: 185px;
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
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-small);
  padding: var(--dt-space-400) var(--dt-space-450);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  min-width: 120px;
  white-space: nowrap;
}

.combo-chart-tooltip-value {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-300);
  font: var(--dt-typography-label-md-compact);
  color: var(--dt-color-foreground-primary);
}

.combo-chart-tooltip-muted,
.combo-chart-tooltip-date {
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-tertiary);
}
</style>
