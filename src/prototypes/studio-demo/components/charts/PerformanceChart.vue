<template>
  <div class="chart-wrap" @mouseleave="clearHover">
    <svg ref="svgRef" class="performance-chart" role="img" aria-label="Conversation volume over time" />
    <div v-if="hover" class="tip" :style="{ left: `${hover.left}px`, top: `${hover.top}px` }">
      <div class="tip-body">
        <div class="tip-date">{{ hover.label }}</div>
        <div v-for="row in hover.rows" :key="row.key" class="tip-row">
          <span class="tip-label">
            <i class="tip-dot" :style="{ background: row.color }" />
            {{ row.label }}
          </span>
          <span>{{ row.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  points: { type: Array, required: true },
  colors: { type: Object, required: true },
  visible: { type: Object, default: () => ({ total: true, contained: true, transferred: true }) },
})

const isShown = (key) => props.visible[key] !== false

const seriesOrder = ['transferred', 'contained', 'total']
const seriesLabels = {
  total: 'Total conversations',
  contained: 'AI contained',
  transferred: 'Transferred',
}
const partOpacity = 0.65
const svgRef = ref(null)
const hover = ref(null)
let observer
let introPlayed = false
let ignoreResize = false
let layout = null
let hoverIndex = null

function render(mode) {
  const node = svgRef.value
  const container = node?.parentElement
  if (!node || !container) return

  const data = props.points
  const containerWidth = container.clientWidth || 720
  const containerHeight = Math.max(container.clientHeight || 0, 260)
  const margin = { top: 16, right: 16, bottom: 32, left: 48 }
  const width = containerWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom
  const labelColor = '#6B6B6B'
  const gridColor = 'hsl(0 0% 11% / 0.1)'

  const svgSelection = d3.select(node)
  svgSelection.attr('width', containerWidth).attr('height', containerHeight)
  if (mode === 'intro') svgSelection.selectAll('*').remove()

  let root = svgSelection.select('g.main')
  if (root.empty()) {
    root = svgSelection.append('g').attr('class', 'main').attr('transform', `translate(${margin.left},${margin.top})`)
  } else {
    root.attr('transform', `translate(${margin.left},${margin.top})`)
  }

  const x = d3.scalePoint().domain(data.map((d) => d.label)).range([0, width]).padding(0.5)
  const maxValue = d3.max(data, (d) => d.total) || 1
  const y = d3.scaleLinear().domain([0, maxValue]).nice().range([height, 0])
  const tickEvery = data.length > 10 ? 5 : 1
  const tickLabels = data.filter((_, index) => index % tickEvery === 0 || index === data.length - 1).map((d) => d.label)

  if (root.select('.chart-grid').empty()) {
    root.append('g').attr('class', 'chart-grid')
    const yAxis = root.append('g').attr('class', 'y-axis')
    yAxis.append('g').attr('class', 'y-ticks')
    const xAxis = root.append('g').attr('class', 'x-axis')
    xAxis.append('path').attr('class', 'domain').attr('fill', 'none').attr('stroke', gridColor)
    xAxis.append('g').attr('class', 'x-ticks')
  }

  const yTicks = y.ticks(4)
  root.select('.chart-grid').selectAll('line')
    .data(yTicks)
    .join('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', (d) => y(d))
    .attr('y2', (d) => y(d))
    .attr('stroke', gridColor)

  const yAxis = root.select('.y-ticks')
  yAxis.selectAll('text')
    .data(yTicks)
    .join('text')
    .attr('x', -10)
    .attr('y', (d) => y(d))
    .attr('dy', '0.32em')
    .attr('text-anchor', 'end')
    .attr('fill', labelColor)
    .attr('font-size', 12)
    .text((d) => d3.format(',')(d))

  root.select('.x-axis').attr('transform', `translate(0,${height})`)
  root.select('.x-axis .domain').attr('d', `M0,0H${width}`)
  root.select('.x-ticks').selectAll('text')
    .data(tickLabels)
    .join('text')
    .attr('x', (d) => x(d))
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', labelColor)
    .attr('font-size', 12)
    .text((d) => d)

  const line = d3.line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveMonotoneX)

  seriesOrder.forEach((key, seriesIndex) => {
    const next = data.map((point) => ({ label: point.label, x: x(point.label), y: y(point[key]) }))
    let path = root.select(`path.series-${key}`)
    const previous = path.empty() ? null : path.datum()
    if (path.empty()) {
      path = root.append('path')
        .attr('class', `series-${key}`)
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
    }
    path.attr('stroke', props.colors[key]).attr('stroke-opacity', key === 'total' ? 1 : partOpacity)

    if (mode === 'intro') {
      path.datum(next).attr('d', line)
      const length = path.node().getTotalLength()
      path
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .delay(seriesIndex * 80)
        .attr('stroke-dashoffset', 0)
    } else if (mode === 'morph' && previous?.length) {
      path
        .interrupt()
        .attr('stroke-dasharray', null)
        .attr('stroke-dashoffset', null)
        .datum(next)
        .transition()
        .duration(600)
        .ease(d3.easeCubicInOut)
        .attrTween('d', () => (t) => line(samplesBetween(previous, next, t)))
    } else {
      path.interrupt().datum(next).attr('stroke-dasharray', null).attr('stroke-dashoffset', null).attr('d', line)
    }

  })

  seriesOrder.forEach((key) => {
    root.select(`path.series-${key}`).raise().style('opacity', isShown(key) ? 1 : 0)
  })

  layout = { margin, x, y, width, height, data, containerWidth, containerHeight, root }

  const overlay = root.selectAll('rect.hover-overlay').data([null]).join('rect')
    .attr('class', 'hover-overlay')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    .on('mousemove', (event) => {
      const [mx] = d3.pointer(event)
      let nearest = 0
      let best = Infinity
      data.forEach((point, index) => {
        const distance = Math.abs(x(point.label) - mx)
        if (distance < best) {
          best = distance
          nearest = index
        }
      })
      showHover(nearest)
    })
  overlay.raise()

  if (hoverIndex != null && hoverIndex < data.length) showHover(hoverIndex)
  else if (hoverIndex != null) clearHover()
}

function showHover(index) {
  if (!layout) return
  hoverIndex = index
  const point = layout.data[index]
  const px = layout.x(point.label)
  let marks = layout.root.select('g.hover-marks')
  if (marks.empty()) marks = layout.root.append('g').attr('class', 'hover-marks')

  marks.selectAll('line.guide').data([px]).join('line')
    .attr('class', 'guide')
    .attr('x1', (d) => d)
    .attr('x2', (d) => d)
    .attr('y1', 0)
    .attr('y2', layout.height)
    .attr('stroke', 'rgba(0, 0, 0, 0.15)')
    .attr('stroke-dasharray', '4 4')

  marks.selectAll('circle.hover-dot').data(seriesOrder.filter(isShown)).join('circle')
    .attr('class', 'hover-dot')
    .attr('r', 4)
    .attr('cx', px)
    .attr('cy', (key) => layout.y(point[key]))
    .attr('fill', (key) => props.colors[key])
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  marks.raise()
  layout.root.select('rect.hover-overlay').raise()

  const tipWidth = 220
  let left = layout.margin.left + px + 16
  if (left + tipWidth > layout.containerWidth - 8) left = layout.margin.left + px - tipWidth - 16
  left = Math.max(8, left)
  const top = Math.max(8, Math.min(layout.margin.top + layout.y(point.total) - 36, layout.containerHeight - 132))
  hover.value = {
    label: point.label,
    left,
    top,
    rows: ['total', 'contained', 'transferred'].filter(isShown).map((key) => ({
      key,
      label: seriesLabels[key],
      color: props.colors[key],
      value: point[key].toLocaleString(),
    })),
  }
}

function clearHover() {
  hoverIndex = null
  hover.value = null
  layout?.root.select('g.hover-marks').remove()
}

function sampleAt(points, t) {
  const pos = t * (points.length - 1)
  const index = Math.floor(pos)
  const rest = pos - index
  const start = points[Math.min(index, points.length - 1)]
  const end = points[Math.min(index + 1, points.length - 1)]
  return { x: start.x + (end.x - start.x) * rest, y: start.y + (end.y - start.y) * rest }
}

function samplesBetween(from, to, t) {
  if (t === 1) return to
  const count = Math.max(from.length, to.length, 2)
  return d3.range(count).map((index) => {
    const amount = count === 1 ? 0 : index / (count - 1)
    const start = sampleAt(from, amount)
    const end = sampleAt(to, amount)
    return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t }
  })
}

onMounted(async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(resolve))
  render('intro')
  introPlayed = true
  ignoreResize = true
  window.setTimeout(() => {
    ignoreResize = false
  }, 1400)
  observer = new ResizeObserver(() => {
    if (introPlayed && !ignoreResize) render('resize')
  })
  observer.observe(svgRef.value.parentElement)
})

onUnmounted(() => observer?.disconnect())

watch(
  () => ({ ...props.visible }),
  () => {
    if (!layout) return
    seriesOrder.forEach((key) => {
      layout.root.select(`path.series-${key}`)
        .transition('visibility')
        .duration(200)
        .style('opacity', isShown(key) ? 1 : 0)
    })
    if (hoverIndex != null) showHover(hoverIndex)
  },
)

watch(
  () => props.points,
  () => {
    if (introPlayed) render('morph')
  },
)
</script>

<style scoped>
.chart-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.performance-chart {
  display: block;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", Roboto, sans-serif;
}

.tip {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}

.tip-body {
  min-width: 200px;
  padding: var(--dt-space-400) var(--dt-space-450);
  border-radius: var(--dt-size-radius-300, 4px);
  background: var(--dt-color-surface-glass);
  box-shadow: var(--dt-shadow-small);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  white-space: nowrap;
}

.tip-date { font-weight: 600; color: var(--dt-color-foreground-primary); }

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
