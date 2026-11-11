<template>
  <div class="routing" @mouseleave="tip = null">
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Conversation routing">
      <path
        v-for="link in layout.links"
        :key="`${link.from}-${link.to}`"
        :d="link.d"
        :fill="toneColor(link.tone)"
        fill-opacity="0.28"
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
          rx="2"
          @mouseenter="showTip($event, node.label, node.value)"
          @mousemove="moveTip"
        />
        <text
          :x="node.labelX"
          :y="node.labelY"
          :text-anchor="node.anchor"
          fill="var(--dt-color-foreground-secondary)"
          font-size="12"
        >{{ node.label }}</text>
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

const width = 720
const height = 240
const nodeWidth = 8
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

const layout = computed(() => {
  const columns = [0, 1, 2].map((column) => props.nodes.filter((node) => node.column === column))
  const gap = 18
  const top = 16
  const usable = height - top - 8
  const xFor = [132, 330, 560]
  const placed = {}
  columns.forEach((column, index) => {
    const total = column.reduce((sum, node) => sum + node.value, 0) || 1
    let y = top
    const free = usable - gap * Math.max(0, column.length - 1)
    column.forEach((node) => {
      const h = Math.max(12, (node.value / total) * free)
      const x = xFor[index]
      const anchor = index === 0 ? 'end' : 'start'
      const labelX = index === 0 ? x - 8 : x + nodeWidth + 8
      placed[node.id] = {
        ...node,
        x,
        y,
        w: nodeWidth,
        h,
        anchor,
        labelX,
        labelY: y + h / 2 + 4,
      }
      y += h + gap
    })
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
    const x0 = source.x + source.w + (source.column === 1 ? 108 : 0)
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
    return { ...link, d, label: `${from.label} to ${to.label}` }
  })

  return { nodes: Object.values(placed), links }
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
