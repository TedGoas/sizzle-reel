<template>
  <div class="analytics">
    <header class="head">
      <div>
        <h2>Analytics</h2>
        <p>Track conversation volume, topics, quality, transfer paths, and skill performance.</p>
      </div>
    </header>

    <div class="filters">
      <button v-for="label in leadingFilters" :key="label" type="button" class="sd-btn sd-btn--outlined sd-btn--sm filter-chip">
        {{ label }}
        <Icon name="chevron-down" :size="12" />
      </button>
      <div class="range">
        <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="open = !open">
          {{ current.label }}
          <Icon name="chevron-down" :size="12" />
        </button>
        <div v-if="open" class="sd-menu" role="menu">
          <button
            v-for="range in analyticsRanges"
            :key="range.id"
            type="button"
            role="menuitem"
            :aria-current="range.id === rangeId ? 'true' : undefined"
            @click="pick(range.id)"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
      <button v-for="label in trailingFilters" :key="label" type="button" class="sd-btn sd-btn--outlined sd-btn--sm filter-chip">
        {{ label }}
        <Icon name="chevron-down" :size="12" />
      </button>
    </div>

    <article class="sd-card performance">
      <TileTitle title="Performance" :tip="tips.performance" />
      <div class="performance-chart">
        <PerformanceChart :points="data.days" :colors="strokeColors" :visible="visible" />
      </div>
      <div class="legend">
        <button
          v-for="series in seriesList"
          :key="series.key"
          type="button"
          class="sd-legend-item"
          :class="{ inactive: !visible[series.key] }"
          :aria-pressed="visible[series.key]"
          @click="visible[series.key] = !visible[series.key]"
        >
          <i class="swatch" :class="{ faint: series.key !== 'total' }" :style="{ background: series.color }" />
          {{ series.label }}
          <strong>{{ series.total }}</strong>
        </button>
      </div>
    </article>

    <div class="row row--3">
      <article v-for="card in data.quality" :key="card.id" class="sd-card kpi">
        <TileTitle :title="card.label" :tip="tips[card.id]" />
        <div v-if="card.columns" class="channels">
          <div v-for="column in card.columns" :key="column.id" class="channel">
            <span class="channel-label">{{ column.label }}</span>
            <p class="value">
              <span class="value-num">
                <span class="value-ghost" aria-hidden="true">{{ column.value }}</span>
                <span class="value-live">{{ displays[`${card.id}-${column.id}`] }}</span>
              </span>
            </p>
            <span class="kpi-trend" :class="trendTone(column.trend, true)">
              <Icon v-if="column.trend !== 0" name="arrow-up" :size="12" :class="{ flip: column.trend < 0 }" />
              <span v-else aria-hidden="true">—</span>
              {{ trendLabel(column.trend) }}
            </span>
          </div>
        </div>
        <template v-else>
          <div class="headline">
            <p class="value">
              <span class="value-num">
                <span class="value-ghost" aria-hidden="true">{{ card.value }}</span>
                <span class="value-live">{{ displays[card.id] }}</span>
              </span>
            </p>
            <span class="kpi-trend" :class="trendTone(card.trend, false)">
              <Icon v-if="card.trend !== 0" name="arrow-up" :size="12" :class="{ flip: card.trend < 0 }" />
              <span v-else aria-hidden="true">—</span>
              {{ trendLabel(card.trend) }}
            </span>
          </div>
          <ul v-if="card.rows" class="split-rows">
            <li v-for="row in card.rows" :key="row.label">
              <i :style="{ background: `var(${row.token})` }" />
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </li>
          </ul>
          <p v-if="card.evaluated != null" class="note">
            {{ card.evaluated.toLocaleString() }} evaluated · {{ card.pending.toLocaleString() }} pending
          </p>
        </template>
      </article>
    </div>

    <div class="row row--3">
      <article v-for="chart in breakdowns" :key="chart.id" class="sd-card chart-card">
        <TileTitle :title="chart.title" :tip="tips[chart.id]" />
        <BreakdownDonut :segments="chart.segments" :caption="chart.caption" />
      </article>
    </div>

    <article class="sd-card routing-card">
      <TileTitle title="Conversation routing" :tip="tips.routing" />
      <RoutingSankey :nodes="data.routing.nodes" :links="data.routing.links" />
    </article>

    <article class="sd-card table-card">
      <div class="tile-title table-title">
        <TileTitle title="Skills leaderboard" :tip="tips.skills" />
      </div>
      <div class="table-scroll" :class="{ 'is-scrolled': tableScrolled }" @scroll="onTableScroll">
        <table>
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="[column.align, { pin: column.pin }]"
                :aria-sort="ariaSort(column.key)"
              >
                <button type="button" @click="sortBy(column.key)">
                  {{ column.label }}
                  <svg class="sort-svg" :class="{ on: sortKey === column.key }" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <template v-if="sortKey !== column.key">
                      <path d="m7 15 5 5 5-5" />
                      <path d="m7 9 5-5 5 5" />
                    </template>
                    <path v-else-if="sortDir === 'asc'" d="m18 15-6-6-6 6" />
                    <path v-else d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in pageSkills" :key="skill.name">
              <td class="pin">{{ skill.name }}</td>
              <td class="num">{{ skill.conversations.toLocaleString() }}</td>
              <td class="num">
                <span :class="{ bad: skill.escalated >= 5 && skill.escalated >= skill.intended }">
                  {{ skill.escalated.toLocaleString() }}
                </span>
                <span v-if="skill.intended > 0" class="intended">+{{ skill.intended.toLocaleString() }} intended</span>
              </td>
              <td class="num">{{ skill.runs.toLocaleString() }}</td>
              <td class="num">{{ skill.incomplete.toLocaleString() }}</td>
              <td class="num">{{ skill.completed.toLocaleString() }}</td>
              <td class="rate">
                <span class="rate-copy">
                  <span>{{ skill.completion }}%</span>
                  <span class="trend" :class="trendClass(skill.trend)">
                    <Icon v-if="skill.trend !== 0" name="arrow-up" :size="12" :class="{ flip: skill.trend < 0 }" />
                    <span v-else aria-hidden="true">—</span>
                    {{ Math.abs(skill.trend) }}%
                  </span>
                </span>
                <svg class="spark" :class="trendClass(skill.trend)" viewBox="0 0 48 24" width="48" height="24" aria-hidden="true">
                  <polyline
                    :points="sparkPoints(skill.spark)"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer class="pager">
        <label class="page-size">
          Items per page
          <select class="custom-select custom-select--sm" :value="pageSize" @change="setPageSize">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="100">100</option>
          </select>
        </label>
        <div class="pager-nav">
          <span>{{ pageStart }}–{{ pageEnd }} of {{ sortedSkills.length }}</span>
          <button type="button" class="page-btn" :disabled="page === 1" aria-label="First page" @click="page = 1">
            <Icon name="chevron-right" :size="12" class="flip" />
            <Icon name="chevron-right" :size="12" class="flip" />
          </button>
          <button type="button" class="page-btn" :disabled="page === 1" aria-label="Previous page" @click="page -= 1">
            <Icon name="chevron-right" :size="12" class="flip" />
          </button>
          <button
            v-for="n in pageCount"
            :key="n"
            type="button"
            class="page-btn page-num"
            :aria-current="n === page ? 'page' : undefined"
            :aria-label="`Page ${n}`"
            @click="page = n"
          >
            {{ n }}
          </button>
          <button type="button" class="page-btn" :disabled="page === pageCount" aria-label="Next page" @click="page += 1">
            <Icon name="chevron-right" :size="12" />
          </button>
          <button type="button" class="page-btn" :disabled="page === pageCount" aria-label="Last page" @click="page = pageCount">
            <Icon name="chevron-right" :size="12" />
            <Icon name="chevron-right" :size="12" />
          </button>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Icon from '../Icon.vue'
import PerformanceChart from '../charts/PerformanceChart.vue'
import BreakdownDonut from '../charts/BreakdownDonut.vue'
import RoutingSankey from '../charts/RoutingSankey.vue'
import TileTitle from './TileTitle.vue'
import { TIMING, analyticsRanges, periodTotal, topSlices } from '../../mock/analyticsData.js'

const tips = {
  performance: 'Conversation volume, how many the AI contained, and how many went to a person.',
  csat: 'Average satisfaction from 1 to 5, split by contained and transferred conversations.',
  aht: 'Voice is active talk time. Digital is open to resolved, including time between replies.',
  fcr: 'Share of conversations with no repeat contact about the same issue within 72 hours.',
  purposes: 'What customers contact about. The top five are listed, and the rest are Other.',
  reasons: 'Why a conversation was transferred. The top five reasons are listed, and the rest are Other.',
  destinations: 'Where transferred conversations went. The top five are listed, and the rest are Other.',
  routing: 'How conversations move from intake, to contained or transferred, then to an outcome.',
  skills: 'Skills ranked by how often they run, and how often they finish.',
}

const breakdowns = computed(() => [
  { id: 'purposes', title: 'Conversation purpose', caption: 'conversations', segments: topSlices(data.value.purposes) },
  { id: 'reasons', title: 'Transfer reasons', caption: 'transfers', segments: topSlices(data.value.reasons) },
  { id: 'destinations', title: 'Transfer destinations', caption: 'transferred', segments: topSlices(data.value.destinations) },
])

const leadingFilters = ['Groups']
const trailingFilters = ['Purpose', 'Containment', 'Transfer reason', 'Conversation type', 'AI Agent', 'Agentic Skills']

const columns = [
  { key: 'name', label: 'Skill', align: 'left', pin: true },
  { key: 'conversations', label: 'Conversations', align: 'num' },
  { key: 'escalated', label: 'Escalated', align: 'num' },
  { key: 'runs', label: 'Total runs', align: 'num' },
  { key: 'incomplete', label: 'Incomplete runs', align: 'num' },
  { key: 'completed', label: 'Completed runs', align: 'num' },
  { key: 'completion', label: 'Completion rate', align: 'left' },
]

function token(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

const strokeColors = {
  total: token('--dt-color-chart-categorical-01', 'oklch(0.5829 0.2426 287.41)'),
  contained: token('--dt-color-chart-categorical-02', 'oklch(0.7038 0.232 347.8)'),
  transferred: token('--dt-color-chart-categorical-03', 'oklch(0.6089 0.2128 259.28)'),
}

const seriesList = computed(() => [
  { key: 'total', label: 'Total conversations', color: 'var(--dt-color-chart-categorical-01)' },
  { key: 'contained', label: 'AI contained', color: 'var(--dt-color-chart-categorical-02)' },
  { key: 'transferred', label: 'Transferred', color: 'var(--dt-color-chart-categorical-03)' },
].map((series) => ({
  ...series,
  total: periodTotal(data.value.days, series.key).toLocaleString(),
})))

const visible = reactive({ total: true, contained: true, transferred: true })
const rangeId = ref('past30')
const open = ref(false)
const sortKey = ref('runs')
const sortDir = ref('desc')
const page = ref(1)
const pageSize = ref(10)
const tableScrolled = ref(false)

function onTableScroll(event) {
  tableScrolled.value = event.currentTarget.scrollLeft > 0
}
const current = computed(() => analyticsRanges.find((range) => range.id === rangeId.value))
const data = computed(() => current.value.data)
const sortedSkills = computed(() => {
  const direction = sortDir.value === 'asc' ? 1 : -1
  return [...data.value.skills].sort((a, b) => {
    const left = a[sortKey.value]
    const right = b[sortKey.value]
    if (typeof left === 'string') return left.localeCompare(right) * direction
    return (left - right) * direction
  })
})
const pageCount = computed(() => Math.max(1, Math.ceil(sortedSkills.value.length / pageSize.value)))
const pageSkills = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedSkills.value.slice(start, start + pageSize.value)
})
const pageStart = computed(() => (sortedSkills.value.length === 0 ? 0 : (page.value - 1) * pageSize.value + 1))
const pageEnd = computed(() => Math.min(page.value * pageSize.value, sortedSkills.value.length))

function sortBy(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortKey.value = key
  sortDir.value = key === 'name' ? 'asc' : 'desc'
}

function ariaSort(key) {
  if (sortKey.value !== key) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

function setPageSize(event) {
  pageSize.value = Number(event.target.value)
  page.value = 1
}

function pick(id) {
  rangeId.value = id
  open.value = false
}

function trendClass(trend) {
  if (trend > 0) return 'up'
  if (trend < 0) return 'down'
  return 'flat'
}

function sparkPoints(values) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 48
    const y = 22 - ((value - min) / span) * 20
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

function trendLabel(value) {
  const amount = Math.abs(value)
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(1)
  return `${text}%`
}

function trendTone(value, lowerIsBetter) {
  if (value === 0) return 'flat'
  const good = lowerIsBetter ? value < 0 : value > 0
  return good ? 'up' : 'down'
}

function countTargets(cards) {
  const targets = {}
  for (const card of cards) {
    if (card.value) targets[card.id] = card.value
    for (const column of card.columns || []) targets[`${card.id}-${column.id}`] = column.value
  }
  return targets
}

const displays = ref({})
let countFrame = 0

function frameText(value, progress) {
  if (progress >= 1) return value
  return value.replace(/\d+(?:\.\d+)?/g, (raw) => {
    const [intPart, frac] = raw.split('.')
    const decimals = frac ? frac.length : 0
    const currentValue = Number(raw) * progress
    const shown = decimals ? currentValue.toFixed(decimals) : String(Math.round(currentValue))
    const [shownInt, shownFrac] = shown.split('.')
    const padded = shownInt.padStart(intPart.length, '\u2007')
    return shownFrac != null ? `${padded}.${shownFrac}` : padded
  })
}

function playCounts() {
  cancelAnimationFrame(countFrame)
  const targets = countTargets(data.value.quality)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    displays.value = { ...targets }
    return
  }
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / TIMING.qualityCount)
    const eased = 1 - (1 - t) ** 3
    const next = {}
    for (const [key, value] of Object.entries(targets)) next[key] = frameText(value, eased)
    displays.value = next
    if (t < 1) countFrame = requestAnimationFrame(step)
  }
  countFrame = requestAnimationFrame(step)
}

onMounted(playCounts)
watch(rangeId, () => {
  page.value = 1
  playCounts()
})
watch([sortKey, sortDir], () => {
  page.value = 1
})
onUnmounted(() => cancelAnimationFrame(countFrame))
displays.value = Object.fromEntries(
  Object.entries(countTargets(data.value.quality)).map(([key, value]) => [key, frameText(value, 0)]),
)
</script>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  min-width: 0;
  max-width: 100%;
}

.head {
  display: flex;
  gap: var(--dt-space-500);
  min-width: 0;
}

h2, h3 { margin: 0; font-weight: 600; }
h2 { font-size: var(--dt-font-size-300); }
h3 { font-size: var(--dt-font-size-200); }

p { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); }

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dt-space-400);
}

.filter-chip {
  color: var(--dt-color-foreground-secondary);
  border-color: var(--dt-color-border-subtle);
}

.range { position: relative; }
.range .sd-menu { left: 0; right: auto; }

.row {
  display: grid;
  gap: var(--dt-space-500);
  min-width: 0;
}

.row--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

.tile-title {
  display: flex;
  align-items: center;
  gap: var(--dt-space-200);
  color: var(--dt-color-foreground-tertiary);
}

.kpi, .chart-card, .performance, .routing-card {
  min-width: 0;
  padding: var(--dt-space-500);
}

.headline {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-300);
}

.channels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-400);
  margin-top: var(--dt-space-300);
}

.channel-label {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.kpi-trend {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  font-size: var(--dt-font-size-100);
  font-variant-numeric: tabular-nums;
}

.kpi-trend.up { color: var(--dt-color-foreground-success); }
.kpi-trend.down { color: var(--dt-color-foreground-critical); }
.kpi-trend.flat { color: var(--dt-color-foreground-tertiary); }

.split-rows {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  margin: var(--dt-space-400) 0 0;
  padding: 0;
  list-style: none;
}

.split-rows li {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}

.split-rows i {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex: none;
}

.split-rows strong {
  margin-left: auto;
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
}

.performance-chart { height: 280px; margin-top: var(--dt-space-400); }
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-400);
  margin-top: var(--dt-space-400);
}
.sd-legend-item strong { font-weight: 600; }
.swatch {
  width: 16px;
  height: 4px;
  border-radius: 2px;
}
.swatch.faint { opacity: 0.65; }
.value {
  position: relative;
  margin: var(--dt-space-300) 0 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-400);
  font-weight: 600;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.value-num {
  display: inline-grid;
  vertical-align: baseline;
}
.value-ghost,
.value-live {
  grid-area: 1 / 1;
}
.value-ghost { visibility: hidden; }
.unit { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); font-weight: 500; }
.note { font-size: var(--dt-font-size-100); }
.chart { height: 180px; min-width: 0; margin-top: var(--dt-space-400); }

.table-card { min-width: 0; }
.table-title {
  padding: var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}
.table-scroll { overflow-x: auto; }
table { width: 100%; min-width: 860px; border-collapse: separate; border-spacing: 0; }
th, td {
  padding: var(--dt-space-400) var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  text-align: left;
  font-size: var(--dt-font-size-200);
  white-space: nowrap;
}
th { font-weight: 600; }
th button {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-tertiary);
  font: inherit;
  font-size: var(--dt-font-size-100);
  font-weight: 600;
  cursor: pointer;
}
th.num,
td.num { text-align: right; }
td.num { font-variant-numeric: tabular-nums; }
th.num button { margin-left: auto; }
.pin {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--dt-color-surface-primary);
}
.table-scroll.is-scrolled .pin {
  box-shadow: 4px 0 5px -3px rgba(0, 0, 0, 0.08);
}
th.pin { z-index: 2; }
.bad { color: var(--dt-color-foreground-critical); }
.intended {
  display: block;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}
.sort-svg {
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: var(--dt-color-foreground-muted);
}
.sort-svg.on { color: var(--dt-color-foreground-primary); }
.flip { transform: rotate(180deg); }
.rate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
}
.rate-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-variant-numeric: tabular-nums;
}
.trend {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  font-size: var(--dt-font-size-100);
}
.trend.up, .spark.up { color: var(--dt-color-foreground-success); }
.trend.down, .spark.down { color: var(--dt-color-foreground-critical); }
.trend.flat, .spark.flat { color: var(--dt-color-foreground-tertiary); }
.spark { flex: none; }
tbody tr:last-child td { border-bottom: 0; }

.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
  padding: var(--dt-space-400) var(--dt-space-500);
  border-top: 1px solid var(--dt-color-border-subtle);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}
.page-size {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
}
.pager-nav {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
}
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--btn-height-sm);
  height: var(--btn-height-sm);
  padding: 0 var(--dt-space-200);
  border: 0;
  border-radius: var(--dt-size-radius-300, 4px);
  background: transparent;
  color: var(--dt-color-foreground-secondary);
  font: inherit;
  font-size: var(--dt-font-size-100);
  cursor: pointer;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.page-btn[aria-current="page"] {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
}

@media (max-width: 1100px) {
  .row--3 { grid-template-columns: 1fr; }
}
</style>
