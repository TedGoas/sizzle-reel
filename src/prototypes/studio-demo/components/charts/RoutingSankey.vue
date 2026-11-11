<template>
  <div class="routing" @mouseleave="tip = null">
    <svg :viewBox="`0 0 ${width} ${layout.height}`" role="img" aria-label="Conversation routing">
      <path
        v-for="link in layout.links"
        :key="`${link.from}-${link.to}`"
        :d="link.d"
        :fill="toneColor(link.tone)"
        :fill-opacity="link.tone === 'routing' ? 0.12 : 0.2"
        @mouseenter="showTip($event, link.label, link.value)"
        @mousemove="moveTip"
      />
      <g v-for="node in layout.nodes" :key="node.id">
        <rect
          :x="node.x"
          :y="node.y"
          :width="node.w"
          :height="node.h"
          :fill="toneColor(node.tone)"
          @mouseenter="showTip($event, node.via ? `${node.label} via ${node.via}` : node.label, node.value)"
          @mousemove="moveTip"
        />
        <text :x="node.labelX" :y="node.labelY" :text-anchor="node.anchor" fill="var(--dt-color-foreground-primary)" font-size="14">
          <tspan :x="node.labelX" :dy="node.via ? -14 : -8">{{ node.column < 2 ? '• ' : '' }}{{ node.label }}</tspan>
          <tspan
            v-if="node.via"
            :x="node.labelX"
            dy="15"
            fill="var(--dt-color-foreground-tertiary)"
            font-size="12"
          >via {{ node.via }}</tspan>
          <tspan :x="node.labelX" dy="16" font-weight="600">{{ node.valueLabel }} {{ node.shareLabel }}</tspan>
        </text>
      </g>
    </svg>
    <ul class="legend">
      <li v-for="item in legend" :key="item.tone">
        <i :style="{ background: toneColor(item.tone) }" />
        {{ item.label }}
      </li>
    </ul>
    <div v-if="tip" class="tip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
      {{ tip.label }} · {{ tip.value.toLocaleString() }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  nodes: { type: Array, required: true },
  links: { type: Array, required: true },
})

const width = 1000
const nodeWidth = 12
const tip = ref(null)

const legend = [
  { tone: 'routing', label: 'Routing' },
  { tone: 'resolved', label: 'Resolved' },
  { tone: 'unresolved', label: 'Not resolved' },
  { tone: 'unknown', label: 'Unknown' },
]

const toneToken = {
  routing: '--dt-color-chart-categorical-01',
  resolved: '--dt-color-chart-positive',
  unresolved: '--dt-color-chart-critical',
  unknown: '--dt-color-chart-neutral',
}

function toneColor(tone) {
  return `var(${toneToken[tone]})`
}

function shareLabel(value, total) {
  const rounded = Math.round((value / total) * 1000) / 10
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}%`
}

function decorate(node, index, x, y, h, inbound) {
  const anchor = index === 1 ? 'end' : 'start'
  return {
    ...node,
    x,
    y,
    w: nodeWidth,
    h,
    anchor,
    labelX: index === 1 ? x - 14 : x + nodeWidth + 16,
    labelY: y + h / 2,
    valueLabel: node.value.toLocaleString(),
    shareLabel: shareLabel(node.value, inbound),
  }
}

const layout = computed(() => {
  const columns = [0, 1, 2].map((column) => props.nodes.filter((node) => node.column === column))
  const inbound = columns[0].reduce((sum, node) => sum + node.value, 0) || 1
  const gap = 12
  const groupGap = 22
  const top = 28
  const xFor = [8, 390, 690]
  const outcomes = columns[2]
  const outcomeTotal = outcomes.reduce((sum, node) => sum + node.value, 0) || 1
  const outcomeItems = outcomes.map((node) => ({
    ...node,
    h: Math.max(8, (node.value / outcomeTotal) * 250),
  }))
  outcomeItems.forEach((item, index) => {
    if (index === 0) {
      item.y = top
      return
    }
    const prev = outcomeItems[index - 1]
    const extra = item.via && item.via !== prev.via ? groupGap : 0
    const natural = prev.y + prev.h + gap + extra
    const pitched = prev.y + prev.h / 2 + 70 - item.h / 2
    item.y = Math.max(natural, pitched)
  })
  const bottom = outcomeItems[outcomeItems.length - 1].y + outcomeItems[outcomeItems.length - 1].h
  const span = bottom - top
  const middle = columns[1]
  const middleTotal = middle.reduce((sum, node) => sum + node.value, 0) || 1
  const middleFree = span - gap
  let middleY = top
  const middleItems = middle.map((node) => {
    const h = Math.max(8, (node.value / middleTotal) * middleFree)
    const item = { ...node, y: middleY, h }
    middleY += h + gap
    return item
  })
  const placed = {}
  columns[0].forEach((node) => {
    placed[node.id] = decorate(node, 0, xFor[0], top, span, inbound)
  })
  middleItems.forEach((node) => {
    placed[node.id] = decorate(node, 1, xFor[1], node.y, node.h, inbound)
  })
  outcomeItems.forEach((node) => {
    placed[node.id] = decorate(node, 2, xFor[2], node.y, node.h, inbound)
  })

  const sourceOffset = {}
  const targetOffset = {}
  const links = props.links.map((link) => {
    const source = placed[link.from]
    const target = placed[link.to]
    const sourceHeight = Math.max(2, (link.value / source.value) * source.h)
    const targetHeight = Math.max(2, (link.value / target.value) * target.h)
    const sy = source.y + (sourceOffset[link.from] || 0)
    const ty = target.y + (targetOffset[link.to] || 0)
    sourceOffset[link.from] = (sourceOffset[link.from] || 0) + sourceHeight
    targetOffset[link.to] = (targetOffset[link.to] || 0) + targetHeight
    const x0 = source.x + source.w
    const x1 = target.x
    const curve = (x1 - x0) / 2
    const d = [
      `M ${x0} ${sy}`,
      `C ${x0 + curve} ${sy}, ${x1 - curve} ${ty}, ${x1} ${ty}`,
      `L ${x1} ${ty + targetHeight}`,
      `C ${x1 - curve} ${ty + targetHeight}, ${x0 + curve} ${sy + sourceHeight}, ${x0} ${sy + sourceHeight}`,
      'Z',
    ].join(' ')
    const from = props.nodes.find((node) => node.id === link.from)
    const to = props.nodes.find((node) => node.id === link.to)
    const label = to.via ? `${to.label} via ${to.via}` : `${from.label} to ${to.label}`
    return { ...link, d, label }
  })

  return { nodes: Object.values(placed), links, height: bottom + 44 }
})

function showTip(event, label, value) {
  const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect()
  tip.value = {
    label,
    value,
    x: event.clientX - bounds.left + 12,
    y: event.clientY - bounds.top + 12,
  }
}

function moveTip(event) {
  if (!tip.value) return
  const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect()
  tip.value = {
    ...tip.value,
    x: event.clientX - bounds.left + 12,
    y: event.clientY - bounds.top + 12,
  }
}
</script>

<style scoped>
.routing {
  position: relative;
  margin-top: var(--dt-space-400);
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

text {
  font-family: inherit;
  pointer-events: none;
}

path,
rect { cursor: default; }

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-400);
  margin: var(--dt-space-400) 0 0;
  padding: 0;
  list-style: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.legend i {
  width: 12px;
  height: 8px;
  border-radius: 2px;
}

.tip {
  position: absolute;
  z-index: 5;
  padding: var(--dt-space-300) var(--dt-space-400);
  background: var(--dt-color-surface-glass);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-small);
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-100);
  white-space: nowrap;
  pointer-events: none;
}
</style>
