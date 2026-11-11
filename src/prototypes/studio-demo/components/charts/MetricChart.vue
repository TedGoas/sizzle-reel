<template>
  <div class="chart-wrap" @mouseleave="clearHover">
    <svg ref="svgRef" class="metric-chart" role="img" aria-label="Key metrics chart" />
    <div v-if="hover" class="tip" :style="{ left: `${hover.left}px`, top: `${hover.top}px` }">
      <div class="tip-body">
        <div class="tip-date">{{ hover.label }}</div>
        <div v-for="row in hover.rows" :key="row.key" class="tip-row">
          <span class="tip-label">
            <i class="tip-dot" :class="{ 'tip-dot--line': row.key === 'rate' }" :style="{ background: row.color }" />
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
  positiveColor: { type: String, default: '#CFDAF0' },
  negativeColor: { type: String, default: '#8AABDD' },
  lineColor: { type: String, default: '#1C4D70' },
  showPositive: { type: Boolean, default: true },
  showNegative: { type: Boolean, default: true },
  showRate: { type: Boolean, default: true },
  positiveLabel: { type: String, default: 'Positive' },
  negativeLabel: { type: String, default: 'Negative' },
})

const svgRef = ref(null)
const hover = ref(null)
let observer
let layout = null
let hoverIndex = null
let introPlayed = false
let ignoreResize = false

function rows() {
  return props.points.map((point) => ({
    ...point,
    total: point.positive + point.negative,
    rate: (point.positive / (point.positive + point.negative)) * 100,
  }))
}

function render(mode) {
  const node = svgRef.value
  const container = node?.parentElement
  if (!node || !container) return

  const data = rows()
  const containerWidth = container.clientWidth || 560
  const containerHeight = Math.max(container.clientHeight || 0, 220)
  const margin = { top: 16, right: 12, bottom: 36, left: 40 }
  const width = containerWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom
  const labelColor = 'var(--dt-color-foreground-tertiary)'
  const gridColor = 'var(--dt-color-border-subtle)'

  const svgSelection = d3.select(node)
  svgSelection.attr('width', containerWidth).attr('height', containerHeight)
  if (mode === 'intro') svgSelection.selectAll('*').remove()

  let root = svgSelection.select('g.main')
  if (root.empty()) {
    root = svgSelection.append('g').attr('class', 'main').attr('transform', `translate(${margin.left},${margin.top})`)
  } else {
    root.attr('transform', `translate(${margin.left},${margin.top})`)
  }

  const x = d3.scaleBand().domain(data.map((d) => d.day)).range([0, width]).padding(0.3)
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0])
  const maxTotal = d3.max(data, (d) => d.total) || 1
  const barScale = d3.scaleLinear().domain([0, maxTotal]).range([0, height * 0.8])

  const gridLines = () => root.select('.chart-grid').selectAll('line')
  if (root.select('.chart-grid').empty()) {
    const grid = root.append('g').attr('class', 'chart-grid')
    grid.selectAll('line')
      .data([0, 50, 100])
      .join('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', gridColor)
    const yAxis = root.append('g').attr('class', 'y-axis').call(
      d3.axisLeft(y).tickValues([0, 50, 100]).tickSize(0).tickPadding(8).tickFormat((d) => `${d}%`),
    )
    yAxis.select('.domain').remove()
    yAxis.selectAll('line').attr('stroke', 'none')
    yAxis.selectAll('text').attr('fill', labelColor).attr('font-size', 12)
    const xAxis = root.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(
      d3.axisBottom(x).tickSize(0).tickPadding(10),
    )
    xAxis.select('.domain').attr('stroke', gridColor)
    xAxis.selectAll('line').attr('stroke', 'none')
    xAxis.selectAll('text').attr('fill', labelColor).attr('font-size', 12)
  } else {
    gridLines().attr('x2', width).attr('y1', (d) => y(d)).attr('y2', (d) => y(d)).attr('stroke', gridColor)
    root.select('.x-axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickSize(0).tickPadding(10))
    root.select('.x-axis .domain').attr('stroke', gridColor)
    root.select('.x-axis').selectAll('line').attr('stroke', 'none')
    root.select('.y-axis').selectAll('line').attr('stroke', 'none')
    root.selectAll('.x-axis text').attr('fill', labelColor).attr('font-size', 12)
  }

  const stack = d3.stack().keys(['positive', 'negative'])
  const stacked = stack(data)
  const colors = { positive: props.positiveColor, negative: props.negativeColor }
  const shown = { positive: props.showPositive, negative: props.showNegative }
  const gap = 1.5

  const groups = root.selectAll('.bar-group').data(stacked, (d) => d.key)
  groups.exit().remove()
  const entered = groups.enter().append('g').attr('class', 'bar-group')
  entered.merge(groups)
    .attr('fill', (d) => colors[d.key])
    .style('opacity', (d) => (shown[d.key] ? 1 : 0))

  const bars = root.selectAll('.bar-group').selectAll('rect').data((d) => d, (d) => d.data.day)
  bars.exit().remove()
  const barsEnter = bars.enter().append('rect')
    .attr('x', (d) => x(d.data.day))
    .attr('width', x.bandwidth())
    .attr('rx', 0)
    .attr('y', mode === 'intro' ? height : (d) => yFor(d))
    .attr('height', mode === 'intro' ? 0 : (d) => heightFor(d))

  const barsAll = barsEnter.merge(bars)
  if (mode === 'resize') {
    barsAll.interrupt()
      .attr('x', (d) => x(d.data.day))
      .attr('width', x.bandwidth())
      .attr('y', (d) => yFor(d))
      .attr('height', (d) => heightFor(d))
  } else {
    barsAll
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .delay((d, i) => (mode === 'intro' ? i * 30 : 0))
      .attr('x', (d) => x(d.data.day))
      .attr('width', x.bandwidth())
      .attr('y', (d) => yFor(d))
      .attr('height', (d) => heightFor(d))
  }

  function yFor(d) {
    const base = height - barScale(d[1])
    return d[0] > 0 ? base - gap : base
  }
  function heightFor(d) {
    return Math.max(0, barScale(d[1]) - barScale(d[0]))
  }

  const line = d3.line()
    .x((d) => x(d.day) + x.bandwidth() / 2)
    .y((d) => y(d.rate))
    .curve(d3.curveMonotoneX)

  let linePath = root.select('path.rate-line')
  const previous = linePath.empty() ? null : linePath.datum()
  if (linePath.empty()) {
    linePath = root.append('path')
      .attr('class', 'rate-line')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
  }
  linePath.attr('stroke', props.lineColor).style('opacity', props.showRate ? 1 : 0)
  linePath.raise()

  if (mode === 'intro' && props.showRate) {
    linePath.datum(data).attr('d', line)
    const length = linePath.node().getTotalLength()
    linePath
      .attr('stroke-dasharray', `${length} ${length}`)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr('stroke-dashoffset', 0)
  } else if (mode === 'morph' && previous && previous.length === data.length) {
    const from = previous.map((point) => point.rate)
    const live = data.map((point, index) => ({ ...point, rate: from[index] }))
    linePath
      .interrupt()
      .datum(live)
      .attr('stroke-dasharray', null)
      .attr('stroke-dashoffset', null)
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .attrTween('d', () => (t) => {
        live.forEach((point, index) => {
          point.rate = from[index] + (data[index].rate - from[index]) * t
        })
        return line(live)
      })
  } else {
    linePath
      .interrupt()
      .datum(data)
      .attr('stroke-dasharray', null)
      .attr('stroke-dashoffset', null)
      .attr('d', line)
  }

  const dotX = (d) => x(d.day) + x.bandwidth() / 2
  const dotY = (d) => y(d.rate)
  const dots = root.selectAll('.rate-dot').data(props.showRate ? data : [], (d) => d.day)
  dots.exit().remove()
  const dotsEnter = dots.enter().append('circle')
    .attr('class', 'rate-dot')
    .attr('r', 4)
    .attr('cx', dotX)
    .attr('cy', dotY)
    .attr('fill', props.lineColor)
    .style('opacity', 0)

  dotsEnter
    .transition()
    .duration(300)
    .delay((d, i) => (mode === 'intro' ? 400 + i * 50 : 0))
    .style('opacity', 1)

  if (mode === 'morph') {
    dots.interrupt()
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .attr('cx', dotX)
      .attr('cy', dotY)
      .attr('r', 4)
      .attr('fill', props.lineColor)
      .style('opacity', 1)
  } else if (mode === 'resize') {
    dots.interrupt()
      .attr('cx', dotX)
      .attr('cy', dotY)
      .attr('r', 4)
      .attr('fill', props.lineColor)
      .style('opacity', 1)
  }
  root.selectAll('.rate-dot').raise()

  layout = { margin, x, y, height, data, containerWidth, containerHeight, root }

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
        const distance = Math.abs(x(point.day) + x.bandwidth() / 2 - mx)
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
  const px = layout.x(point.day) + layout.x.bandwidth() / 2
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

  marks.selectAll('circle.hover-dot').data(props.showRate ? [point] : []).join('circle')
    .attr('class', 'hover-dot')
    .attr('r', 4)
    .attr('cx', px)
    .attr('cy', (d) => layout.y(d.rate))
    .attr('fill', props.lineColor)
    .attr('stroke', 'var(--dt-color-surface-primary)')
    .attr('stroke-width', 2)

  marks.raise()
  layout.root.select('rect.hover-overlay').raise()

  const rows = []
  if (props.showPositive) rows.push({ key: 'positive', label: props.positiveLabel, color: props.positiveColor, value: point.positive.toLocaleString() })
  if (props.showNegative) rows.push({ key: 'negative', label: props.negativeLabel, color: props.negativeColor, value: point.negative.toLocaleString() })
  if (props.showRate) rows.push({ key: 'rate', label: 'Rate', color: props.lineColor, value: `${point.rate.toFixed(1)}%` })

  const tipWidth = 200
  let left = layout.margin.left + px + 16
  if (left + tipWidth > layout.containerWidth - 8) left = layout.margin.left + px - tipWidth - 16
  left = Math.max(8, left)
  const top = Math.max(8, Math.min(layout.margin.top + layout.y(point.rate) - 36, layout.containerHeight - 120))
  hover.value = { label: point.day, left, top, rows }
}

function clearHover() {
  hoverIndex = null
  hover.value = null
  layout?.root.select('g.hover-marks').remove()
}

onMounted(async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(resolve))
  render('intro')
  introPlayed = true
  ignoreResize = true
  window.setTimeout(() => {
    ignoreResize = false
  }, 950)
  observer = new ResizeObserver(() => {
    if (introPlayed && !ignoreResize) render('resize')
  })
  observer.observe(svgRef.value.parentElement)
})

onUnmounted(() => observer?.disconnect())

watch(
  () => [props.points, props.showPositive, props.showNegative, props.showRate, props.positiveColor, props.negativeColor, props.lineColor],
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

.metric-chart {
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
  min-width: 180px;
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

.tip-dot--line {
  height: 2px;
  border-radius: 1px;
}
</style>
