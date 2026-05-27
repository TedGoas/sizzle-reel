<template>
  <div class="combo-chart">
    <div class="combo-chart-header">
      <div class="combo-chart-stats">
        <span class="combo-chart-value">{{ summaryStats.averageGrade }}</span>
        <span class="combo-chart-trend">
          <ArrowUp :size="16" class="combo-chart-trend-arrow" />
          <span class="combo-chart-trend-value">{{ summaryStats.trend.replace('+', '') }}</span>
        </span>
        <span class="combo-chart-comparison">{{ summaryStats.comparison }}</span>
      </div>
      <div class="combo-chart-legend">
        <div class="combo-chart-legend-item">
          <span class="combo-chart-legend-line" style="background: #52C926;"></span>
          <span>Average grade</span>
        </div>
        <div class="combo-chart-legend-item">
          <span class="combo-chart-legend-box" style="background: #CFDAF0;"></span>
          <span>Ai graded</span>
        </div>
        <div class="combo-chart-legend-item">
          <span class="combo-chart-legend-box" style="background: #ECF0F9;"></span>
          <span>Human graded</span>
        </div>
      </div>
    </div>

    <div class="combo-chart-canvas" @mouseleave="clearHover">
      <Bar ref="chartRef" :data="chartDataConfig" :options="chartOptions" :plugins="[progressiveRevealPlugin, hoverPlugin]" />
      <transition name="tooltip-fade">
        <div v-if="activeIndex !== null" class="combo-chart-tooltip" :style="tooltipPos">
          <div class="combo-chart-tooltip-body">
            <div class="combo-chart-tooltip-header">{{ chartLabels[activeIndex] }}</div>
            <div class="combo-chart-tooltip-row">
              <span class="combo-chart-tooltip-line" style="background: #52C926;"></span>
              <span>Avg grade:</span>
              <span>{{ lineData[activeIndex] }}%</span>
            </div>
            <div class="combo-chart-tooltip-row">
              <span class="combo-chart-tooltip-box" style="background: #CFDAF0;"></span>
              <span>Ai graded:</span>
              <span>{{ barData.aiGraded[activeIndex] }}</span>
            </div>
            <div class="combo-chart-tooltip-row">
              <span class="combo-chart-tooltip-box" style="background: #ECF0F9;"></span>
              <span>Human:</span>
              <span>{{ barData.humanGraded[activeIndex] }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ArrowUp } from '@lucide/vue'
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
import { chartLabels, barData, lineData, summaryStats } from '../data/analyticsData.js'

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, LineController, BarController)

const chartRef = ref(null)
const activeIndex = ref(null)

function clearHover() {
  activeIndex.value = null
}

const chartDataConfig = computed(() => ({
  labels: chartLabels,
  datasets: [
    {
      type: 'bar',
      label: 'Ai graded',
      data: barData.aiGraded,
      backgroundColor: '#CFDAF0',
      borderRadius: 0,
      barPercentage: 0.85,
      categoryPercentage: 0.7,
      order: 2,
    },
    {
      type: 'bar',
      label: 'Human graded',
      data: barData.humanGraded,
      backgroundColor: '#ECF0F9',
      borderRadius: 0,
      barPercentage: 0.85,
      categoryPercentage: 0.7,
      order: 3,
    },
    {
      type: 'line',
      label: 'Average grade',
      data: lineData,
      borderColor: '#52C926',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#52C926',
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
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  onHover: (event, elements) => {
    if (!elements.length) {
      activeIndex.value = null
      return
    }
    activeIndex.value = elements[0].index
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12 }, color: 'rgba(0,0,0,0.5)' },
      stacked: true,
    },
    y: {
      position: 'left',
      stacked: true,
      grid: {
        color: 'rgba(0,0,0,0.06)',
        drawBorder: false,
      },
      ticks: {
        font: { size: 12 },
        color: 'rgba(0,0,0,0.5)',
      },
      display: false,
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
        color: 'rgba(0,0,0,0.5)',
        callback: (v) => `${v}%`,
        stepSize: 25,
      },
    },
  },
}

// Tooltip position
const tooltipPos = computed(() => {
  if (activeIndex.value === null) return {}
  const chart = chartRef.value?.chart
  if (!chart) return {}

  const meta = chart.getDatasetMeta(0)
  const bar = meta.data[activeIndex.value]
  if (!bar) return {}

  const { x } = bar.getProps(['x'], true)
  let tipX = x + 16
  const tipY = 40

  if (tipX + 180 > chart.width) {
    tipX = x - 196
  }
  tipX = Math.max(8, tipX)

  return { top: `${tipY}px`, left: `${tipX}px` }
})

// Progressive reveal
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

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
    const meta = chart.getDatasetMeta(0)
    const bar = meta.data[activeIndex.value]
    if (!bar) return

    const { x } = bar.getProps(['x'], true)
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

    chart._revealProgress = 0
    const startTime = performance.now()
    const duration = 700

    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1)
      chart._revealProgress = easeOutQuart(t)
      chart.draw()
      if (t < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
})
</script>

<style scoped>
.combo-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.combo-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.combo-chart-stats {
  display: flex;
  align-items: center;
  gap: 4px;
}

.combo-chart-value {
  font-size: 19px;
  font-weight: 700;
  color: black;
  line-height: 1.6;
}

.combo-chart-trend {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.combo-chart-trend-arrow {
  color: #1AA340;
  flex-shrink: 0;
}

.combo-chart-trend-value {
  font-size: 15px;
  color: #1AA340;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.combo-chart-comparison {
  font-size: 15px;
  color: #3a3a3a;
}

.combo-chart-legend {
  display: flex;
  align-items: center;
  gap: 18px;
}

.combo-chart-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #3a3a3a;
}

.combo-chart-legend-line {
  width: 20px;
  height: 4px;
  border-radius: 3px;
}

.combo-chart-legend-box {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.combo-chart-canvas {
  position: relative;
  height: 450px;
}

/* Tooltip */
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
  background: rgba(249, 249, 249, 0.92);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 4px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
  font-size: 12px;
  color: #3a3a3a;
  white-space: nowrap;
}

.combo-chart-tooltip-header {
  font-weight: 500;
}

.combo-chart-tooltip-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.combo-chart-tooltip-line {
  width: 14px;
  height: 3px;
  border-radius: 3px;
  flex-shrink: 0;
}

.combo-chart-tooltip-box {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}
</style>
